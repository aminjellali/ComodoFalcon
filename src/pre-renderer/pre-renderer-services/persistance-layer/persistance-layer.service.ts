import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PreRenderedPageModel } from '../../models/preRenderedPageModel';

import { ConfigService } from 'src/config/config-service/config-service.service';
import { LoggerService } from 'src/logger/logger.services/logger.service';
/**
 * - This service contains function that use mongoose preform CRUD
 * operations on the data base.
 * @export
 * @class PersistanceLayerService
 */
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
  /**
   * - This variable holds the ```QUERY_URL_ONLY```` variable in the .conf file
   * and that is used to project only the pageUrl attribute from the database.
   *
   * @private
   * @memberof PersistanceLayerService
   */
  private readonly queryUrlOnly;
  /**
   * - Write a page to the data base.
   *
   * @param {PreRenderedPageModel} page
   * @returns {Promise<PreRenderedPageModel>}
   * @memberof PersistanceLayerService
   */
  async writePage(page: PreRenderedPageModel): Promise<PreRenderedPageModel> {
    const newPage = new this.pageModel(page);
    return await newPage.save();
  }
  /**
   * - Update a page.
   *
   * @param {string} id - Used to identify the existing instance in the data base.
   * @param {PreRenderedPageModel} page - The new data to persist.
   * @returns {Promise<PreRenderedPageModel>}
   * @memberof PersistanceLayerService
   */
  async updatePage(
    id: string,
    page: PreRenderedPageModel,
  ): Promise<PreRenderedPageModel> {
    return await this.pageModel.findByIdAndUpdate(id, page);
  }
  /**
   * - Fetch all pre-rendered pages.
   *
   * @returns {Promise<PreRenderedPageModel[]>}
   * @memberof PersistanceLayerService
   */
  async getAllPreRenderedPages(): Promise<PreRenderedPageModel[]> {
    return await this.pageModel.find();
  }
  /**
   * - This function will fetch pre-rendered pages from the data base.
   *
   * @param {string} url - The URL of the data base you wish to redner.
   * @param {*} [fieldsToRender] - Optional if provided this will use mongo projection to retreive specific
   * attributes for performance and memory optimization. ***DO NOT UNDER ANY CIRCUMSTANCE PROVIDE THIS FEATURE TO EXPOSED CONTROLLERS***
   * @returns {Promise<PreRenderedPageModel>}
   * @memberof PersistanceLayerService
   */
  async getPageByUrlAndProject(
    url: string,
    fieldsToRender?: any,
  ): Promise<PreRenderedPageModel> {
    if (fieldsToRender) {
      return await this.pageModel.findOne({ pageUrl: url }, fieldsToRender);
    }
    return await this.pageModel.findOne({ pageUrl: url }, this.queryUrlOnly);
  }
  /**
   * - This function will delete a page thanks to the provided URL.
   * - In case no page was found with the provied url this function will
   * throw an error.
   *
   * @param {*} url
   * @returns
   * @memberof PersistanceLayerService
   */
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
