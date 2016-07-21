import invariant from 'invariant';
import py from 'pinyin';

import { logRecorder } from './log';
import { seq, Repo, Icon, RepoVersion } from '../../model';
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
      newMaxCode = newCode || 0xE000;
      let maxCode = 0xF000 - newMaxCode >= icons.length
        ? newMaxCode : oldMaxCode;

      return icons.map(i => {
        const pyName = py(i.name, { style: py.STYLE_NORMAL })
          .reduce((prev, next) => prev.concat(next), [])
          .join('')
          .replace(/[^\w]/g, '');
        const code = maxCode++;
        const hexCode = maxCode.toString(16);
        const fontClass = `${repoMap[i.repoId]}-${pyName}${hexCode}-${i.fontClass}`;

        return Icon.update(
          {
            code,
            fontClass,
            status: i.passed ? iconStatus.RESOLVED : iconStatus.REJECTED,
          },
          { where: { id: i.id }, transaction }
        );
      });
    });
}

// 获取审核列表
export function* getAuditList(next) {
  const { repoList } = this.state.user;

  const auditData = yield Promise.all(repoList.map(id =>
    Icon.findAll({
      where: { status: iconStatus.PENDING },
      through: {
        model: RepoVersion,
        where: { repositoryId: id },
      },
    }).then(icons => icons.map(i => {
      const icon = i.dataValues;
      icon.repoId = id;
      return icon;
    }))
  ));

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
    // 后面是日志记录过程
    getBaseClassName(icons, transaction)
      .then(iconInfo => Promise.all(iconInfo))
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
