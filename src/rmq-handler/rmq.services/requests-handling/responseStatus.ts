import { PreRenderingReport } from 'src/pre-renderer/models/preRenderingReport';

export interface ResponseStatus {
    pageUrl: string;
    pagePreRenderingStatus: PreRendringStatus;
    message?: string;
    preRenderingReport?: PreRenderingReport;
}
export enum PreRendringStatus {
    SUCCESS = 'SUCCESS', ERROR = 'ERROR',
}
