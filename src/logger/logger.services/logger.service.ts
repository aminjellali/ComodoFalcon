import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService extends Logger {
  error(message: string, trace: string) {
    super.error(`[ERROR] ${message}`, trace);
  }
  warn(message: string) {
    super.warn(`[WARN] ${message}`);
  }
  info(message: string) {
    super.log(`[INFO] ${message}`);
  }
}
