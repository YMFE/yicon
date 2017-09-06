import { Icon, Repo, Project, Log, Notification, User } from '../../model';
import { analyzeLog } from '../../helpers/utils';
import { logTypes } from '../../constants/utils';
import invariant from 'invariant';

export function* getUnreadCount(next) {
  const { model } = this.state.user;
  const { type } = this.param;
  let number = null;
  if (type === 'all') {
    number = yield model.countLogs({
      through: {
        model: Notification,
        where: { unread: true },
      },
    });
  } else {
    number = yield model.countLogs({
      through: {
        model: Notification,
        where: { unread: true },
      },
      where: { scope: type === 'system' ? 'repo' : 'project' },
    });
  }
  this.state.respond = { type, number };
  yield next;
}

export function* getAllNotices(next) {
  const { userId, model } = this.state.user;
  const { pageMixin } = this.state;
  const { type } = this.param;
  invariant(type, '缺少参数');

  let notice = null;
  const user = model;
  if (type === 'all') {
    notice = yield user.getLogs({
      include: [
        { model: Repo, as: 'repo' },
        { model: Project, as: 'project' },
        { model: User, as: 'logCreator' },
      ],
      order: 'updatedAt DESC',
      ...pageMixin,
    });
    this.state.page.totalCount = yield user.countLogs();
  } else if (type === 'unread') {
    notice = yield user.getLogs({
      through: {
        model: Notification,
        where: { unread: true },
      },
      order: 'updatedAt DESC',
      ...pageMixin,
    });
    this.state.page.totalCount = yield model.countLogs({
      through: {
        model: Notification,
        where: { unread: true },
      },
    });
  } else {
    notice = yield user.getLogs({
      include: [
        { model: Repo, as: 'repo' },
        { model: Project, as: 'project' },
        { model: User, as: 'logCreator' },
      ],
      where: { scope: type === 'system' ? 'repo' : 'project' },
      order: 'updatedAt DESC',
      ...pageMixin,
    });
    this.state.page.totalCount = yield user.countLogs({
      where: { scope: type === 'system' ? 'repo' : 'project' },
    });
  }
  this.state.respond = notice;
  // 将日志设置为已读
  const noticeId = notice.map(v => v.id);
  yield Notification.update({ unread: 0 }, { where: { userId, logId: { $in: noticeId } } });
  yield next;
}

export function* getOneNotice(next) {
  const { logId } = this.param;
  const detail = yield Log.findOne({ where: { id: logId }, raw: true });

  invariant(detail, `未找到 id 为 ${logId} 的日志`);

  const logData = analyzeLog(detail.type, detail.operation);
  const isIcon = /@icon/.test(logTypes[detail.type]);

  this.state.respond = { ...detail, logData };

  // 单独处理与图标相关的日志
  if (isIcon) {
    const icons = {};
    if (detail.type === 'REPLACE') {
      icons.iconFrom = yield Icon.findOne({ where: { id: logData.iconFrom.id } });
      icons.iconTo = yield Icon.findOne({ where: { id: logData.iconTo.id } });
    } else {
      const id = logData.icon.map(v => v.id);
      icons.icon = yield Icon.findAll({ where: { id: { $in: id } } });
    }
    this.state.respond.icons = icons;
  }

  yield next;
}

export function* setAllReaded(next) {
  const { userId } = this.state.user;
  yield Notification.update({ unread: 0 }, { where: { userId, unread: 1 } });
  this.state.respond = '全部消息置为已读';
  yield next;
}

/* 提交公共项目 */
export function* submitPublicProject(next) {
  let isWrite = ''; // 写入是否成功
  const { name, reason, publicName } = this.param;
  const date = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hours = d.getHours();
    const minutes = d.getMinutes();
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };
  const result = yield Project.findAll({
    where: {
      name,
    },
  });
  // 如果该项目已经是公开项目
  const isPublicName = yield Project.findAll({
    where: {
      name,
      // publick: 1 表示申请为公开项目
      public: 1,
    },
  });
  const isProjectPublick = yield Project.findAll({
    where: {
      name,
      // publick: 2 表示为公开项目
      public: 2,
    },
  });
  if (isPublicName.length || isProjectPublick.length) {
    this.state.respond = { error: 1 };
  } else if (result.length) {  // 如果项目存在 修改public = 1
    isWrite = yield Project.update({
      public: '1',
      description: reason,
      updateAt: date(),
      publicName,
    }, {
      where: {
        name,
      },
    });
    this.state.respond = isWrite;
  }
  this.state.log = {
    type: 'APPLICATION_PUBLIC_PROJECT',
    loggerId: result[0].dataValues.id,
    subscribers: [result[0].dataValues.owner],
  };

  yield next;
}

// 公开项目列表
export function* publicProjectList(next) {
  const { id } = this.param;
  const result = yield Project.findAll({
    where: {
      public: id,
    },
  });
  const name = yield User.findAll({
    where: {
      id: result[0].dataValues.owner,
    },
  });
  // 负责人
  result[0].dataValues.admin = name[0].dataValues.name;
  this.state.respond = result;
  yield next;
}

export function* agreePublicProject(next) {
  let isWrite = false;
  const { id, publicId } = this.param;
  const arr = ['CANCEL_PUBLIC_PROJECT', '', 'AGREE_PUBLIC_PROJECT'];
  const result = yield Project.findAll({
    where: {
      id,
    },
  });
  if (result.length) {
    // publick: 2 表示同意为公开项目
    isWrite = yield Project.update({
      public: publicId,
    }, {
      where: {
        id,
      },
    }).then(() => {
      this.state.log = {
        type: arr[publicId],
        loggerId: result[0].dataValues.id,
        subscribers: [result[0].dataValues.owner],
      };
    });
  }
  this.state.respond = isWrite;
  yield next;
}
