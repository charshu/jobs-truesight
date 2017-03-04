/** this module use for
 * logger everything in only one file
 * make it easy to control where the log will
 * be displayed such as dump to Redis, Print on console
 * or disable it in production stage
*/

const chalk = require('chalk');
const Logdown = require('logdown');

module.exports = (optionsOrMsg) => {
  if (typeof optionsOrMsg === 'string') {
    const logger = new Logdown();
    logger.info(optionsOrMsg);
    return {};
  }
  const { prefix } = optionsOrMsg;
  const logger = new Logdown({ prefix });
  if (process.env.NO_LOG === 'TRUE') {
    // disable log
    // if NO_LOG=TRUE
    return {
      info() {},
      error() {},
      success() {},
      warn() {},
      log() {},
    };
  }
  return {
    info(msg) {
      logger.info(chalk.yellow(msg));
    },
    error(error) {
      logger.error(`${error} ${chalk.red('x')}`);
    },
    success(msg) {
      chalk.green(`${prefix}: ${msg} ${chalk.green('✓')}`);
    },
    warn(msg) {
      logger.warn(msg);
    },
    log(msg) {
      logger.log(msg);
    },
  };
};
