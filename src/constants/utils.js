import DesIcon from '../components/DesIcon';
import React from 'react';

export const iconStatus = {
  DELETE: -1,    // 逻辑删除
  UPLOADED: 0,   // 已上传
  REJECTED: 5,   // 审核失败
  PENDING: 10,   // 待审核
  REPLACING: 14, // 待替换
  REPLACED: 15,  // 被替换
  RESOLVED: 20,  // 线上生效图标
};
export const iconStateDescription = {
  10: {
    className: 'checking',
    text: '待审核',
  },
  5: {
    className: 'fault',
    text: '审核失败',
  },
  20: {
    className: 'passed',
    text: '审核通过',
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
};

export const InfoTypeDetail = [
  'UPLOAD',
  'AUDIT_OK',
  'AUDIT_FAILED',
  'REPLACE',
  'PROJECT_DEL',
  'PROJECT_ADD',
];

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
        <p className="tag">新</p>
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
        <p className="tag">删</p>
      </DesIcon>
    ))
  ),
  UPLOAD: (data) => (
    data.icons.icon.map((item, index) => {
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
          <p className={classlist.join(' ')}>{staus.text}</p>
        </DesIcon>
      );
    })
  ),
  AUDIT_OK: (data) => (
    data.icons.icon.map((item, index) => {
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
          <p className={classlist.join(' ')}>{staus.text}</p>
        </DesIcon>
      );
    })
  ),
  AUDIT_FAILED: (data) => (
    data.icons.icon.map((item, index) => {
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
          <p className={classlist.join(' ')}>{staus.text}</p>
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
          className="detail-icon new"
          name={icons.iconFrom.name}
          showCode={false}
          iconPath={icons.iconFrom.path}
        >
          <p className="tag">新</p>
        </DesIcon>
        <DesIcon
          key={2}
          className="detail-icon old"
          name={icons.iconTo.name}
          showCode={false}
          iconPath={icons.iconTo.path}
        >
          <p className="tag">旧</p>
        </DesIcon>
      </div>
    );
  },
};
