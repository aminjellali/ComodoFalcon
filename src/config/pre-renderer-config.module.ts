
import { Module } from '@nestjs/common';
import { ConfigService } from './config-service/config-service.service';
import { LoggerService } from 'src/logger/logger.services/logger.service';
/**
 *  - This module has to be imported in every module that it's children use it.
 *  - In order to set the ```process.env.NODE_ENV varible``` just run the app with the
 * following command ```NODE_ENV={environment name}``` node main.js and it will fetch for
 * the file named ```{environment name}.conf```, if not provided the system will use the default file name to
 * render which is ```development.conf```.
 *  - In case the specified file is not to be found in the root directory of the ```/src``` 
 * (in dev environment) or ```/dist``` (in production environment).
 * the app will fail to boostrap.
 * @export
 * @class PreRendererConfigModule
 */
@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(`${process.env.NODE_ENV || 'development'}.conf`, new LoggerService()),
    },
  ],
  exports: [ConfigService],
})
export class PreRendererConfigModule { }
