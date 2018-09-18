import { Icon, Repo, Project, Log, Notification, User } from '../../model';
import { analyzeLog, formatDateTime } from '../../helpers/utils';
import { logTypes } from '../../constants/utils';
import invariant from 'invariant';

function formatDate() {
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hours = d.getHours();
  const minutes = d.getMinutes();

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

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

// 获取超管列表
function* getAdminIdList() {
  // 超管列表
  let adminId = [];
  yield User.findAll({
    where: {
      actor: 2,
    },
  }).then(data => {
    adminId = data.map(v => v.dataValues.id);
  });
  return adminId;
}

/* 提交公共项目 */
export function* submitPublicProject(next) {
  let isWrite = ''; // 写入是否成功
  let subscribers = '';
  let isTrue = true;
  let ownerId = 0;
  const { name, reason, publicName } = this.param;
  const adminId = yield getAdminIdList();
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
    ownerId = result[0].dataValues.owner;
    adminId.forEach(v => {
      if (v === ownerId) {
        isTrue = false;
      }
    });
    if (!isTrue) {
      subscribers = adminId;
    } else {
      subscribers = [...adminId, ownerId];
    }
    this.state.log = {
      type: 'PROJECT_APPLICATION_PUBLIC',
      loggerId: result[0].dataValues.id,
      subscribers,
    };

    this.state.respond = isWrite;
  }

  yield next;
}

// 公开项目列表
export function* publicProjectList(next) {
  const { id } = this.param;
  const result = yield Project.findAll({
    where: {
      public: id,
    },
    include: [{
      model: User,
      as: 'projectOwner',
    }],
  });
  this.state.respond = result;
  yield next;
}

export function* agreePublicProject(next) {
  let isWrite = false;
  let isTrue = true;
  let ownerId = 0;
  let subscribers = '';
  const adminId = yield getAdminIdList();
  const { id, publicId, tabId } = this.param;
  const arr = ['PROJECT_CANCEL_PUBLIC', 'PROJECT_REFUSE_PUBLIC', 'PROJECT_AGREE_PUBLIC'];
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
      ownerId = result[0].dataValues.owner;
      adminId.forEach(v => {
        if (v === ownerId) {
          isTrue = false;
        }
      });
      if (!isTrue) {
        subscribers = adminId;
      } else {
        subscribers = [...adminId, ownerId];
      }
      this.state.log = {
        type: arr[tabId],
        loggerId: result[0].dataValues.id,
        subscribers,
      };
    });
  }
  this.state.respond = isWrite;
  yield next;
}

export function* applyProjectAdmin(next) {
  let subscribers = '';
  let isTrue = true;
  let ownerId = 0;
  const { projectId } = this.param;
  const adminId = yield getAdminIdList();

  const project = yield Project.findOne({
    where: {
      id: projectId,
    },
  });

  const isDoing = yield Log.findOne({
    where: {
      type: 'PROJECT_APPLICATION_ADMIN',
      operator: this.state.user.userId,
    },
  });

  if (!project || !!isDoing) {
    this.state.respond = { error: 1 };
  } else {
    ownerId = project.owner;
    adminId.forEach(v => {
      if (v === ownerId) {
        isTrue = false;
      }
    });
    if (!isTrue) {
      subscribers = adminId;
    } else {
      subscribers = [...adminId, ownerId];
    }

    this.state.log = {
      type: 'PROJECT_APPLICATION_ADMIN',
      loggerId: project.id,
      subscribers,
    };
    this.state.respond = project;
  }

  yield next;
}

export function* getApplyProjectAdminList(next) {
  const result = yield Log.findAll({
    where: {
      type: 'PROJECT_APPLICATION_ADMIN',
      scope: 'project',
    },
    include: [{
      model: User,
      as: 'logCreator',
    }, {
      model: Project,
      as: 'project',
    }],
  });

  const res = [];

  for (let i = 0; i < result.length; i++) {
    const d = result[i];

    if (!d.project) continue;

    const project = yield Project.findOne({
      where: {
        id: d.project.id,
      },
      include: [{
        model: User,
        as: 'projectOwner',
      }],
    });

    res.push({
      id: d.id,
      logCreator: d.logCreator,
      project,
      scope: d.scope,
      type: d.type,
      updatedAt: formatDateTime(d.updatedAt),
    });
  }

  this.state.respond = res;

  yield next;
}

export function* changeProjectNewAdmin(next) {
  const { projectId, action, logId } = this.param;
  let isWrite = false;
  let subscribers = '';
  let isTrue = true;
  const adminId = yield getAdminIdList();

  const project = yield Project.findOne({
    where: {
      id: projectId,
    },
  });

  const logRow = yield Log.findOne({
    where: {
      id: logId,
      type: 'PROJECT_APPLICATION_ADMIN',
      loggerId: projectId,
    },
  });

  if (!project || !logRow) {
    this.state.respond = { error: 1 };
  } else {
    if (action === 'agree') {
      // 同意 则更新项目owner
      yield Project.update({
        owner: logRow.operator,
        updatedAt: formatDate(),
      }, {
        where: {
          id: projectId,
        },
      });
    }

    // 更新log状态为申请完成
    isWrite = yield Log.update({
      type: 'PROJECT_APPLICATION_ADMIN_DONE',
      updatedAt: formatDate(),
    }, {
      where: {
        id: logId,
      },
    });

    const ownerId = project.owner;
    adminId.forEach(v => {
      if (v === ownerId) {
        isTrue = false;
      }
    });
    if (!isTrue) {
      subscribers = adminId;
    } else {
      subscribers = [...adminId, ownerId];
    }

    const logType = action === 'agree' ?
      'PROJECT_AGREE_NEW_ADMIN' :
      'PROJECT_REJECT_NEW_ADMIN';

    this.state.log = {
      type: logType,
      loggerId: projectId,
      subscribers,
    };

    this.state.respond = isWrite;
  }

  yield next;
}

