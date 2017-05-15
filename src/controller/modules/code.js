import axios from 'axios';
import invariant from 'invariant';

import { logRecorder } from './log';
import { seq, Icon } from '../../model';
import { iconStatus } from '../../constants/utils';

// 表示系统占用的图标 path
const disabledCodePath = ' M889 169L768 290V848C768 856.8 760.8 864 752 864H272C263.2 ' +
  '864 256 856.8 256 848V802L169 889C159.6 898.4 144.4 898.4 135 889C125.6 879.6 125.6 ' +
  '864.4 135 855L256 734V176C256 167.2 263.2 160 272 160H752C760.8 160 768 167.2 768 ' +
  '176V222L855 135C859.6 130.4 865.8 128 872 128S884.2 130.4 889 135C898.4 144.4 898.4 ' +
  '159.6 889 169zM288 832H736V322L288 770V832zM736 192H288V702L736 254V192z';

export function *getDisabledCode(next) {
  const icon = yield Icon.findAll({
    attributes: ['id', 'code'],
    where: {
      status: {
        $eq: iconStatus.DISABLED,
      },
    },
    order: 'code ASC',
  });
  this.state.respond = icon;
  yield next;
}

export function *setDisabledCode(next) {
  const { codes } = this.param;
  const { userId } = this.state.user;
  invariant(codes instanceof Array, '传入的 codes 不合法，期望是数组');
  // codeList：查询条件（icons 表中已存在的编码）
  const codeList = codes.map(item => parseInt(+item.code, 10));
  const icons = yield Icon.findAll({
    attributes: ['id', 'code', 'status'],
    where: {
      code: {
        $in: codeList,
      },
      status: {
        $in: [iconStatus.RESOLVED, iconStatus.DISABLED],
      },
    },
  });

  // icons 表中已存在的，status 为 18/20 的编码
  const existingCodes = [];
  // icons 表中不存在的，尚未分配的编码
  const newCodes = [];
  const _icons = icons.map(item => item.code);
  // 过滤掉已经被标记为问题编码的数据
  const disabledIcons = [];
  icons.forEach(item => {
    if (item.status === iconStatus.DISABLED) {
      disabledIcons.push(item.code);
    }
  });
  const _codes = codes.filter(code => disabledIcons.indexOf(parseInt(+code.code, 10)) === -1);

  _codes.forEach(item => {
    if (_icons.indexOf(parseInt(+item.code, 10)) > -1) {
      existingCodes.push(item);
    } else {
      newCodes.push(item);
    }
  });

  const t = seq.transaction(transaction => {
    const existingIconInfo = existingCodes.map(code => Icon.update({
      status: iconStatus.DISABLED,
      description: code.description,
      applyTime: code.time || new Date(),
    }, {
      where: {
        code: parseInt(+code.code, 10),
        status: iconStatus.RESOLVED,
      },
      transaction,
    }));
    const newIconInfo = newCodes.map(code => Icon.create({
      name: '系统占用',
      code: parseInt(+code.code, 10),
      path: disabledCodePath,
      applyTime: code.time || new Date(),
      status: iconStatus.DISABLED,
      uploader: userId,
      description: code.description,
    }, {
      transaction,
    }));
    return Promise
      .all([...existingIconInfo, ...newIconInfo])
      .then(() => {
        const log = {
          params: {
            code: _codes.map(item => {
              const code = item.code;
              return { code };
            }),
          },
          type: 'DISABLED_CODE_ADD',
          loggerId: 0,
        };
        return _codes.length ? logRecorder(log, transaction, userId) : null;
      });
  });
  yield t;

  this.state.respond = yield Icon.findAll({
    where: { status: iconStatus.DISABLED },
    order: 'code ASC',
  });
  yield next;
}

export function *unSetDisabledCode(next) {
  const { iconId } = this.params;
  const icon = yield Icon.findOne({
    where: { id: iconId, status: iconStatus.DISABLED },
  });

  invariant(icon && icon.path, `没有找到 id 为 ${iconId} 的系统占用编码`);

  const { path } = icon;
  if (path === disabledCodePath) {
    // 系统占用图标对应的数据直接删除
    yield Icon.destroy({
      where: { id: iconId, status: iconStatus.DISABLED },
    });
  } else {
    // 对有效数据进行恢复
    yield Icon.update({
      applyTime: new Date(),
      status: iconStatus.RESOLVED,
      description: null,
    }, {
      where: { id: iconId, status: iconStatus.DISABLED },
    });
  }
  this.state.respond = yield Icon.findAll({
    where: { status: iconStatus.DISABLED },
    order: 'code ASC',
  });
  yield next;
}

// 从 GitHub 上拉取
export function *fetchDisabledCode(next) {
  const gitUrl = 'https://raw.githubusercontent.com/JasonFang93/demo/master/disabledCode.json';
  const data = yield axios.get(gitUrl).then(res => res.data);
  this.state.respond = data;
  yield next;
}

export function *updateCodeDescription(next) {
  const { iconId, description } = this.param;
  yield Icon.update({
    description,
  }, { where: { id: iconId } });
  this.state.respond = '编码信息更新成功';
  yield next;
}
