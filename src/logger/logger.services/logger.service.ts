import { Injectable, Logger } from '@nestjs/common';
/**
 * - Nothing Itresting here LOL! just overriding the nest js logging class by
 * adding code levels the spring boot style.
 *
 * @export
 * @class LoggerService
 * @extends {Logger}
 */
@Injectable()
export class LoggerService extends Logger {
  /**
   * - Log an error an tell evil-people how they broke the app.
   *
   * @param {string} message
   * @param {string} trace
   * @memberof LoggerService
   */
  error(message: string, trace: string) {
    super.error(`[ERROR] ${message}`, trace);
  }
  /**
   * - Log a warning that needs some ones attention.
   *
   * @param {string} message
   * @memberof LoggerService
   */
  warn(message: string) {
    super.warn(`[WARN] ${message}`);
  }
  /**
   * - Provide info to the log reader.
   *
   * @param {string} message
   * @memberof LoggerService
   */
  info(message: string) {
    super.log(`[INFO] ${message}`);
  }
}
