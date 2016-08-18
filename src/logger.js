import config from './config';
import log from 'log4js';

log.configure(config.log);

// 这里我们对不同 env 的 log 配置了不同的方式，尽管他们都叫 normal
export default log.getLogger('normal');
