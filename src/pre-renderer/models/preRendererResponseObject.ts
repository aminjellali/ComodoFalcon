import { PreRenderedPageModel } from './preRenderedPageModel';
import { PreRenderingReport } from './preRenderingReport';

export interface PreRendererResponseObject {
    pageModel: PreRenderedPageModel;
    preRenderingReport?: PreRenderingReport;
}