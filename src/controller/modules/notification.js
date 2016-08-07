import { Icon, Repo, Project, Log, Notification } from '../../model';
import { analyzeLog } from '../../helpers/utils';
import { logTypes } from '../../constants/utils';

export function* getUnreadCount(next) {
  const { model } = this.state.user;
  this.state.respond = yield model.countLogs({
    through: {
      model: Notification,
      where: { unread: true },
    },
  });
  yield next;
}

export function* getAllNotices(next) {
  const { userId, model } = this.state.user;
  const { pageMixin } = this.state;
  const { type } = this.param;
  if (!type) throw new Error('缺少参数');

  let notice = null;
  const user = model;
  if (type === 'all') {
    notice = yield user.getLogs({
      include: [{
        model: Repo,
        as: 'repo',
      }, {
        model: Project,
        as: 'project',
      }],
      order: 'updatedAt DESC',
      ...pageMixin,
    });
    this.state.page.totalCount = yield user.countLogs();
  } else {
    notice = yield user.getLogs({
      include: [{
        model: Repo,
        as: 'repo',
      }, {
        model: Project,
        as: 'project',
      }],
      where: { scope: type === 'system' ? 'repo' : 'project' },
      order: 'updatedAt DESC',
      ...pageMixin,
    });
    this.state.page.totalCount = yield user.countLogs({ where: { scope: type } });
  }
  this.state.respond = notice;
  // 将日志设置为已读
  const noticeId = notice.map(v => v.id);
  yield Notification.update({ unread: 0 }, { where: { userId, logId: { $in: noticeId } } });
  yield next;
}

export function* getOneNotice(next) {
  const { nId } = this.param;
  const notice = yield Notification.findOne({ where: { id: nId } });
  const detail = yield Log.findOne({ where: { id: notice.logId }, raw: true });
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
