export const ICON_NAME = {
  reg: /[\w\u4E00-\u9FFF\[\]\- ]{1,20}/,
  message: '图标名称长度为 1-20，不能有非法字符',
};
export const ICON_TAG = {
  reg: /[a-z0-9\u4E00-\u9FFF,]{1,30}/i,
  message: '标签不能超过 30 个字符，以英文逗号分隔',
};

export const VERSION = {
  reg: /\d{1,3}\.\d{1,3}\.\d{1,3}/,
  message: '',
};
