import invariant from 'invariant';
import py from 'pinyin';

import { logRecorder } from './log';
import { seq, Repo, Icon, User, RepoVersion } from '../../model';
import { unique } from '../../helpers/utils';
import { iconStatus } from '../../constants/utils';

// 处理类名生成
function getBaseClassName(icons, transaction) {
  let oldMaxCode;
  let newMaxCode;
  let repoMap;
  // 在事务里锁住 icon 库的更新
  return Repo
    .findAll({
      attributes: ['id', 'alias'],
      raw: true,
      lock: {
        level: transaction.LOCK.UPDATE,
        of: Icon,
      },
    })
    .then(repo => {
      repoMap = repo.reduce((p, n) => {
        const prev = p;
        prev[n.id] = n.alias;
        return prev;
      }, {});
      // 处理一下 icon-code
      return Icon.max('code');
    })
    .then(oldCode => {
      oldMaxCode = oldCode;
      return Icon.max('code', {
        where: { code: { lt: 0xF000 } },
      });
    })
    .then(newCode => {
      newMaxCode = newCode || (0xE000 - 1);
      const maxCode = 0xF000 - newMaxCode >= icons.length
        ? newMaxCode : oldMaxCode;

      return icons.map((i, index) => {
        const pyName = py(i.name, { style: py.STYLE_NORMAL })
          .reduce((prev, next) => prev.concat(next), [])
          .join('')
          .replace(/[^\w]/g, '');
        const code = maxCode + index + 1;
        const hexCode = code.toString(16);
        const fontClass = `${repoMap[i.repoId]}-${pyName}${hexCode}${i.fontClass}`;

        return Icon.update(
          {
            code,
            fontClass,
            status: i.passed ? iconStatus.RESOLVED : iconStatus.REJECTED,
            applyTime: new Date,
          },
          { where: { id: i.id }, transaction }
        )
        // 如果审核未通过，需要移除 repoVersion 库中的关联
        .then(icon => {
          if (!i.passed) {
            return RepoVersion.destroy({
              where: { repositoryId: i.repoId, iconId: i.id },
              transaction,
            });
          }
          return icon;
        });
      });
    });
}

// 获取审核列表
export function* getAuditList(next) {
  const { repoList, model } = this.state.user;
  const whereMixin = {};

  if (model.actor === 1 && repoList && repoList.length) {
    whereMixin.where = { repositoryId: { $in: repoList } };
  } else {
    invariant(model.actor === 2, '您没有权限进行图标审核');
  }

  const auditData = yield Icon.findAll({
    where: { status: iconStatus.PENDING },
    include: [{
      model: Repo,
      through: {
        model: RepoVersion,
        ...whereMixin,
      },
    }, User],
  }).then(icons => {
    const data = icons.map(i => {
      const icon = i.get({ plain: true });
      if (icon.repositories && icon.repositories.length) {
        icon.repo = icon.repositories[0];
        delete icon.repo.repoVersion;
        delete icon.repositories;
        return icon;
      }
      return null;
    });
    return data.filter(v => v);
  });

  this.state.respond = auditData.reduce((p, n) => p.concat(n), []);
  yield next;
}

// 审核某图标入库
export function* auditIcons(next) {
  const { icons } = this.param;
  const { userId } = this.state.user;
  // 预处理，防止有不传 id 的情况
  icons.forEach(icon => {
    invariant(
      !isNaN(icon.id),
      `icons 数组期望传入合法 id，目前传入的是 ${icon.id}`
    );
    invariant(
      typeof icon.passed === 'boolean',
      `icon.passed 期望传入布尔值，目前传入的是 ${typeof icon.passed}`
    );
    invariant(
      !isNaN(icon.repoId),
      `icons 数组期望传入合法大库 id，目前传入的是 ${icon.repoId}`
    );
    invariant(
      !isNaN(icon.uploader),
      `icons 数组期望传入合法大库上传者，目前传入的是 ${icon.uploader}`
    );
  });

  /**
   * 图标审核入库流程
   * 1. 标记为 RESOLVED/REJECTED
   * 2. 生成不重复的 class-name
   * 3. 生成唯一 code
   */
  const t = yield seq.transaction(transaction =>
    getBaseClassName(icons, transaction)
      // 更新图标内容
      .then(iconInfo => Promise.all(iconInfo))
      // 更新大库 updatedAt 字段
      .then(() => {
        const repoIds = unique(icons.map(i => i.repoId));
        return Promise.all(repoIds.map(id =>
          Repo.update(
            { updatedAt: new Date },
            { where: { id }, transaction }
          )
        ));
      })
      .then(() => {
        const iconData = icons.reduce((p, n) => {
          const prev = p;
          if (Array.isArray(p[n.repoId])) {
            prev[n.repoId].push(n);
          } else {
            prev[n.repoId] = [n];
          }
          return p;
        }, {});
        const log = [];
        Object.keys(iconData).forEach(repoId => {
          const auditOk = iconData[repoId].filter(i => i.passed);
          const auditFailed = iconData[repoId].filter(i => !i.passed);
          if (auditOk.length) {
            log.push({
              params: {
                icon: auditOk.map(i => ({ id: i.id, name: i.name })),
              },
              type: 'AUDIT_OK',
              loggerId: repoId,
              subscribers: unique(auditOk.map(i => i.uploader)),
            });
          }
          if (auditFailed.length) {
            log.push({
              params: {
                icon: auditFailed.map(i => ({ id: i.id, name: i.name })),
              },
              type: 'AUDIT_FAILED',
              loggerId: repoId,
              subscribers: unique(auditFailed.map(i => i.uploader)),
            });
          }
        });
        return logRecorder(log, transaction, userId);
      })
  );

  yield t;
  yield next;
}
