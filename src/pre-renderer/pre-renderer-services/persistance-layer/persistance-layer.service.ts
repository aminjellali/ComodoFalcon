import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PreRenderedPageModel } from '../../models/preRenderedPageModel';
@Injectable()
export class PersistanceLayerService {
  constructor(
    @InjectModel('PreRenderedPages')
    private readonly pageModel: Model<PreRenderedPageModel>,
  ) {}

  async writePage(page: PreRenderedPageModel): Promise<PreRenderedPageModel> {
    const newPage = new this.pageModel(page);
    return await newPage.save();
  }

  async getAllPreRenderedPages(): Promise<PreRenderedPageModel[]> {
    return await this.pageModel.find();
  }
  async getPageByUrl(
    url: string,
    fieldsToRender?: any,
  ): Promise<PreRenderedPageModel> {
    if (fieldsToRender) {
      return await this.pageModel.findOne({ pageUrl: url }, { fieldsToRender });
    }
    return await this.pageModel.findOne({ pageUrl: url });
  }
}
