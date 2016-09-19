import axios from 'axios';
import { User, Repo } from '../../model';
import config from '../../config';

import { simpleParse } from '../../helpers/utils';

const { ssoType, tokenUrl, serviceUrl, adminList } = config.login;

function* verifyToken(token) {
  let verifyTokenURL;
  if (ssoType === 'sso') {
    verifyTokenURL = simpleParse(tokenUrl, { token });
  } else if (ssoType === 'cas') {
    verifyTokenURL = simpleParse(tokenUrl, { service: serviceUrl, token });
  }
  return yield axios.get(verifyTokenURL).then(value => value.data);
}

function* insertToDB(data) {
  const { userId } = data;
  let isAdmin = false;
  if (adminList instanceof Array) {
    isAdmin = adminList.indexOf(userId) !== -1;
  }

  const info = yield User.findOrCreate({
    where: { name: userId },
    defaults: { name: userId, actor: isAdmin ? 2 : 0 },
  }).spread(user => user.get({ plain: true }));

  const repos = yield Repo.findAll({
    where: { admin: info.id },
    raw: true,
  });

  info.repoAdmin = repos ? repos.map(r => r.id) : [];
  return info;
}

function matchItem(xml, item) {
  const reg = new RegExp(`<cas:${item}>(.+)</cas:${item}>`, 'i');
  const matched = xml.match(reg);
  return matched && matched[1] ? matched[1] : null;
}

export function* getUserInfo(next) {
  let info;
  let name;
  if (ssoType === 'sso') {
    const { token } = this.param;
    const verifyResult = yield verifyToken(token);
    if (verifyResult.ret) {
      info = yield insertToDB(verifyResult.data);
      name = verifyResult.data.userInfo.name;
    } else {
      throw new Error(verifyResult.errmsg);
    }
  } else if (ssoType === 'cas') {
    const { ticket } = this.query;
    const verifyResult = yield verifyToken(ticket);
    name = matchItem(verifyResult, 'name');
    const user = matchItem(verifyResult, 'user');
    if (!name || !user) {
      throw new Error(`CAS 验证失败，无法找到 name 和 user 字段，返回的数据为：\n${verifyResult}`);
    }
    info = yield insertToDB({ userId: user });
  } else {
    const { userId, username } = this.param;
    name = username;
    info = yield insertToDB({ userId });
  }
  this.session.name = encodeURIComponent(name);
  this.session.userId = info.id;
  this.session.domain = info.name;
  this.session.actor = info.actor;
  this.session.repoAdmin = info.repoAdmin;
  this.redirect('/');
  yield next;
}
