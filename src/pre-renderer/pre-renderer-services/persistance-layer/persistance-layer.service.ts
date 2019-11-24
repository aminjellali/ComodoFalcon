import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PreRenderedPageModel } from '../../models/preRenderedPageModel';

import { ConfigService } from 'src/config/config-service/config-service.service';
import { LoggerService } from 'src/logger/logger.services/logger.service';
@Injectable()
export class PersistanceLayerService {
  constructor(
    @InjectModel('PreRenderedPages')
    private readonly pageModel: Model<PreRenderedPageModel>,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    this.queryUrlOnly = JSON.parse(configService.get('QUERY_URL_ONLY'));
  }

  private readonly queryUrlOnly;
  async writePage(page: PreRenderedPageModel): Promise<PreRenderedPageModel> {
    const newPage = new this.pageModel(page);
    return await newPage.save();
  }
  async updatePage(
    id: string,
    page: PreRenderedPageModel,
  ): Promise<PreRenderedPageModel> {
    return await this.pageModel.findByIdAndUpdate(id, page);
  }
  async getAllPreRenderedPages(): Promise<PreRenderedPageModel[]> {
    return await this.pageModel.find();
  }
  async getPageByUrlAndProject(
    url: string,
    fieldsToRender?: any,
  ): Promise<PreRenderedPageModel> {
    if (fieldsToRender) {
      return await this.pageModel.findOne({ pageUrl: url }, fieldsToRender);
    }
    return await this.pageModel.findOne({ pageUrl: url }, this.queryUrlOnly);
  }
  async deletePageByUrl(url) {
    const pageDataBaseId: PreRenderedPageModel = await this.pageModel.findOne(
      { pageUrl: url },
      this.queryUrlOnly,
    );
    if (pageDataBaseId && pageDataBaseId.id) {
      return await this.pageModel.findByIdAndRemove(pageDataBaseId.id);
    }
    throw new Error(`The page with url: <${url}> does not exists`);
  }
}
