import DesIcon from '../components/DesIcon';
import StatusIcon from '../components/StatusIcon/StatusIcon.jsx';
import React from 'react';

export const iconStatus = {
  DELETE: -1,    // 逻辑删除
  UPLOADED: 0,   // 已上传
  REJECTED: 5,   // 审核失败
  PENDING: 10,   // 待审核
  REPLACE: 13,   // 待审核替换（非库管超管的上传者进行替换上传需要审核）
  REPLACING: 14, // 待替换
  REPLACED: 15,  // 被替换
  DISABLED: 18, // 被禁用
  RESOLVED: 20,  // 线上生效图标
};

export const startCode = 0xe000;
export const endCode = 0xf8ff;

export const iconStateDescription = {
  10: {
    className: 'checking',
    text: '待审核',
  },
  5: {
    className: 'fault',
    text: '审核失败',
  },
  13: {
    className: 'checking',
    text: '待审核替换',
  },
  14: {
    className: 'checking',
    text: '等待替换',
  },
  15: {
    className: 'fault',
    text: '被替换',
  },
  18: {
    className: 'fault',
    text: '系统占用',
  },
  20: {
    className: 'passed',
    text: '审核通过',
  },
  '-1': {
    className: 'fault',
    text: '已删除',
  },
};

export const logTypes = {
  UPLOAD: '上传了图标 @icon',
  AUDIT_OK: '图标 @icon 通过了审核',
  AUDIT_FAILED: '图标 @icon 未通过审核',
  REPLACE: '图标 @iconFrom 被替换为 @iconTo',
  PROJECT_CREATE: '创建了项目',
  PROJECT_RENAME: '项目名称从 @nameFrom 修改为 @nameTo',
  PROJECT_DEL: '从项目中删除了图标 @icon',
  PROJECT_ADD: '项目新增了图标 @icon',
  PROJECT_MEMBER_ADD: '@user 加入了项目',
  PROJECT_MEMBER_DEL: '@user 被管理员从项目中移除',
  PROJECT_VERSION: '项目版本从 @versionFrom 升级到 @versionTo',
  REPO_ADMIN: '大库管理员从 @userFrom 变更为 @userTo',
  PROJECT_OWNER: '项目负责人从 @userFrom 变更为 @userTo',
  SOURCE_PUBLISH: '项目发布到 source @path，版本为 @version',
  DISABLED_CODE_ADD: '编码 @code 标示为系统占用',
  DISABLED_CODE_DEL: '编码 @code 解除系统占用标示',
  PROJECT_APPLICATION_PUBLIC: '申请公开项目',
  PROJECT_REFUSE_PUBLIC: '拒绝申请为公开项目',
  PROJECT_CANCEL_PUBLIC: '取消该项目为公开项目',
  PROJECT_AGREE_PUBLIC: '同意申请为公开项目',
  PROJECT_APPLICATION_ADMIN: '申请为项目管理员',
  PROJECT_AGREE_NEW_ADMIN: '同意更换项目管理员',
  PROJECT_REJECT_NEW_ADMIN: '拒绝更换项目管理员',

};

export const InfoTypeDetail = [
  'UPLOAD',
  'AUDIT_OK',
  'AUDIT_FAILED',
  'REPLACE',
  'PROJECT_DEL',
  'PROJECT_ADD',
];

const prohibitIcon = {
  path: ` M512,928 Q335,924 217.5,806.5 Q100,
  689 96,512 Q100,335 217.5,217.5 Q335,100 512,96 Q689,
  100 806.5,217.5 Q924,335 928,512 Q924,689 806.5,806.5 Q689,924 512,928 M745,
  228 L228,745 Q251,773 279,796 L796,279 Q773,251 745,228`,
  name: '禁止',
};

export const InfoTemplate = {
  PROJECT_ADD: (data) => (
    data.icons.icon.map((item, index) => (
      <DesIcon
        key={index}
        className="detail-icon new"
        name={item.name}
        showCode={false}
        iconPath={item.path}
      >
        <p className="tag" title="新">新</p>
      </DesIcon>
    ))
  ),
  PROJECT_DEL: (data) => (
    data.icons.icon.map((item, index) => (
      <DesIcon
        key={index}
        className="detail-icon"
        name={item.name}
        showCode={false}
        iconPath={item.path}
      >
        <p className="tag" title="删">删</p>
      </DesIcon>
    ))
  ),
  UPLOAD: (data) => (
    data.icons.icon.map((item, index) => {
      const classlist = ['state'];
      const staus = iconStateDescription[item.status] || {
        className: 'fault',
        text: '未知状态',
      };
      classlist.push(staus.className);
      return (
        <DesIcon
          key={index}
          className="detail-icon"
          name={item.name}
          showCode={false}
          iconPath={item.path}
        >
          <p className={classlist.join(' ')} title={staus.text}>{staus.text}</p>
        </DesIcon>
      );
    })
  ),
  AUDIT_OK: (data) => (
    data.icons.icon.map((item, index) => {
      const classlist = ['state'];
      const staus = iconStateDescription[item.status];
      classlist.push(staus.className);
      if (item.status === iconStatus.DISABLED || item.status === iconStatus.REPLACED) {
        return (
          <DesIcon
            key={index}
            className="detail-icon"
            name={item.name}
            showCode={false}
            iconPath={item.path}
          >
            <p className={classlist.join(' ')} title={staus.text}>{staus.text}</p>
          </DesIcon>
        );
      }
      return (
        <StatusIcon
          icon={item}
          key={index}
          statusDesc
        >
          <p className={classlist.join(' ')} title={staus.text}>{staus.text}</p>
        </StatusIcon>
      );
    })
  ),
  AUDIT_FAILED: (data) => (
    data.icons.icon.map((item, index) => {
      if (item.status === -1) {
        return (
          <DesIcon
            key={index}
            className="detail-icon"
            name={item.name}
            showCode={false}
            iconPath={prohibitIcon.path}
          >
            <p className="state fault" title="已删除">已删除</p>
          </DesIcon>
        );
      }
      const classlist = ['state'];
      const staus = iconStateDescription[item.status];
      classlist.push(staus.className);
      return (
        <DesIcon
          key={index}
          className="detail-icon"
          name={item.name}
          showCode={false}
          iconPath={item.path}
        >
          <p className={classlist.join(' ')} title={staus.text}>{staus.text}</p>
        </DesIcon>
      );
    })
  ),
  REPLACE: (data) => {
    const icons = data.icons;
    return (
      <div>
        <DesIcon
          key={1}
          className="detail-icon old"
          name={icons.iconFrom.name}
          showCode={false}
          iconPath={icons.iconFrom.path}
        >
          <p className="tag" title="旧">旧</p>
        </DesIcon>
        <DesIcon
          key={2}
          className="detail-icon new"
          name={icons.iconTo.name}
          showCode={false}
          iconPath={icons.iconTo.path}
        >
          <p className="tag" title="新">新</p>
        </DesIcon>
      </div>
    );
  },
};
