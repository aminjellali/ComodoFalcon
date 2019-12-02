export interface PreRenderingReport {
    pageUrl: string;
    timePassedPreRendering: string;
    message?: string;
    operationType: PreRenderingOperationType;
}
export enum PreRenderingOperationType {
    UPDATE = 'UPDATE',
    CREATE = 'CREATE',
}