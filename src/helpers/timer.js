import format from 'dateformat';
import process from 'process';

const serverTime = process.browser ? new Date(window.SERVER_TIME) : new Date;

export default date => {
  const d = new Date(format(date));
  let template = 'yyyy-mm-dd HH:MM';
  // 啊，支持一个昨天前天今天和上午下午
  if (serverTime.getFullYear() === d.getFullYear() && serverTime.getMonth() === d.getMonth()) {
    const gapDay = serverTime.getDate() - d.getDate();
    if (gapDay <= 2) {
      const day = ['今天', '昨天', '前天'][gapDay];
      const pam = {
        AM: '上午',
        PM: '下午',
      }[format(d, 'TT')];
      template = `${day}${pam} hh:MM`;
    }
  }
  return format(d, template);
};

export { format as dateFormat };
