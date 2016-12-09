import invariant from 'invariant';

import { Repo, Icon, User, RepoVersion } from '../../model';
import { seq } from '../../model/tables/_db';
import { iconStatus } from '../../constants/utils';
import { logRecorder } from './log';

// 为了提高查询效率，我们设置默认版本为 0.0.0
function* getRepoByVersion({
  repoId,
  version = '0.0.0',
  limit,
  // pageMixin,
}) {
  let iconIds;
  if (limit) {
    const mixIn = { offset: 0, limit };

    const versionData = yield RepoVersion.findAll({
      attributes: ['iconId'],
      where: { repositoryId: repoId },
      order: 'iconId',
      ...mixIn,
    });
    iconIds = versionData.map(d => d.iconId);
  }

  const repo = yield Repo.findOne({
    where: { id: repoId },
    include: [User],
  });

  invariant(repo, `id 为 ${repoId} 的大库不存在`);
  const icons = yield repo.getIcons({
    attributes: ['id', 'name', 'code', 'path'],
    where: {
      status: iconStatus.RESOLVED,
      ...(iconIds ? { id: { $in: iconIds } } : null),
    },
    on: { version },
    required: false,
    order: 'id',
  });

  const result = repo.get({ plain: true });
  result.icons = icons;

  const count = yield Icon.count({
    where: { status: iconStatus.RESOLVED },
    include: [{
      model: Repo,
      where: { id: repoId },
      on: { version },
    }],
  });

  result.iconCount = count;
  return result;
}

export function* list(next) {
  const repoList = yield Repo.findAll({
    attributes: ['id'],
    order: ['id'],
  });
  const result = [];
  let i = 0;

  for (; i < repoList.length; i++) {
    const repo = yield getRepoByVersion({
      repoId: repoList[i].id, limit: 15,
    });
    result.push(repo);
  }

  this.state.respond = result;

  yield next;
}

export function* listWithoutIcons(next) {
  this.state.respond = yield Repo.findAll({
    attributes: ['id', 'name'],
    order: ['id'],
  });
  yield next;
}

export function* getOne(next) {
  const { repoId, version } = this.param;

  const repo = yield getRepoByVersion({
    repoId, version, pageMixin: this.state.pageMixin,
  });

  this.state.respond = repo;

  yield next;
}

export function* updateRepoNotice(next) {
  const { repoId, notice } = this.param;
  let repoResult = 0;
  if (notice !== undefined) repoResult = yield Repo.update({ notice }, { where: { id: repoId } });
  if (repoResult) {
    this.state.respond = '大库通知更新成功';
  } else {
    this.state.respond = '大库通知更新失败';
  }
  yield next;
}

export function* updateRepoOwner(next) {
  const { repoId, admin } = this.param;
  let repoResult = 0;
  if (admin !== undefined) repoResult = yield Repo.update({ admin }, { where: { id: repoId } });
  if (repoResult) {
    this.state.respond = '大库所有者更改成功';
  } else {
    this.state.respond = '大库所有者更改失败';
  }
  yield next;
}

export function* addRepo(next) {
  const { name, alias, admin } = this.param;
  if (!(name && alias)) throw new Error('name和alias参数不可缺少');
  if (!admin) throw new Error('域名称缺少、不完整或者错误');
  const repoInfo = yield Repo.findAll({ where: { $or: [{ name }, { alias }] } });
  if (repoInfo.length) throw new Error('大库name或alias已被其他库占用，请修改');
  const user = yield User.findOne({ where: { id: admin } });
  if (!user || isNaN(user.id)) throw new Error('没有指定的用户信息');

  let repo = null;
  const t = yield seq.transaction(transaction =>
      Repo.create({ name, alias, admin }, { transaction })
    .then((_repo) => {
      repo = _repo;
      return User.update({ actor: 1 }, { where: { id: user.id }, transaction });
    })
  );

  yield t;
  this.state.respond = repo;
  yield next;
}

export function* appointRepoOwner(next) {
  const { repoId, name } = this.param;
  const { userId } = this.state.user;
  if (isNaN(repoId)) throw new Error('缺少大库id');
  if (!name) throw new Error('大库管理员name缺少、不完整或错误');

  const adminId = yield Repo.findOne({ attributes: ['admin'], where: { id: repoId } });
  const adminInfo = yield adminId.getUser();
  const oldAdmin = adminInfo.get({ plain: true });
  const newAdmin = yield User.findOne({
    attributes: ['id', 'name', 'actor'],
    where: { name },
    raw: true,
  });

  if (oldAdmin === null || newAdmin === null) throw new Error('没有指定的用户信息');
  if (oldAdmin.id === newAdmin.id) throw new Error('指定的用户已是大库管理员');

  let actor = { actor: 1 };
  if (newAdmin.actor > 0) actor = { actor: newAdmin.actor };
  const t = yield seq.transaction(transaction =>
      Promise.all([
        Repo.update({ admin: newAdmin.id }, { where: { id: repoId }, transaction }),
        User.update(actor, { where: { id: newAdmin.id }, transaction }),
      ])
    .then(() => {
      delete oldAdmin.actor;
      delete newAdmin.actor;
      const log = {
        params: {
          userFrom: oldAdmin,
          userTo: newAdmin,
        },
        type: 'REPO_ADMIN',
        loggerId: repoId,
        subscribers: [oldAdmin, newAdmin],
      };
      return logRecorder(log, transaction, userId);
    })
  );

  yield t;
  yield next;
}

export function* getAdminRepos(next) {
  const { pageMixin } = this.state;

  const repo = yield Repo.findAndCountAll({
    attributes: ['id', 'name'],
    include: [{
      model: User,
    }],
    ...pageMixin,
  });
  this.state.respond = repo.rows.map(
    v => Object.assign({}, { id: v.id, name: v.name, ownerName: v.user.name })
  );
  this.state.page.totalCount = repo.count;
  yield next;
}

export function* searchRepos(next) {
  const { name } = this.param;
  const { pageMixin } = this.state;
  if (!name) throw new Error('请传入查询的大库名称name');

  const repo = yield Repo.findAndCountAll({
    attributes: ['id', 'name'],
    where: {
      name: { $like: `%${name}%` },
    },
    include: [{
      model: User,
    }],
    ...pageMixin,
  });
  this.state.respond = repo.rows.map(
    v => Object.assign({}, { id: v.id, name: v.name, ownerName: v.user.name })
  );
  this.state.page.totalCount = repo.count;
  yield next;
}
