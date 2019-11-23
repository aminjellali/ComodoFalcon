export class PreRenderRequestDTO {
    readonly pageUrl: string;
    readonly pageType: string;
    readonly elementToWaitFor: string;
    readonly elementToWaitForType: ElementToWaitForType;
}
export enum ElementToWaitForType {
    CSS_CLASS = 'CSS_CLASS',
    ID = 'ID',
}
