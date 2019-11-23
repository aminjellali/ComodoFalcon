export interface PreRenderedPageModel {
    id?: string;
    pageUrl: string;
    content: string;
    contentDescription?: string;
    lastPreRenderingDate: number;
}
