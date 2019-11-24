/**
 * - This class represents the data structure of a prerendered page in the data base.
 *
 * @export
 * @interface PreRenderedPageModel
 */
export interface PreRenderedPageModel {
    /**
     * - This field is marked as optional because it's specific to the data base.
     *
     * @type {string}
     * @memberof PreRenderedPageModel
     */
    id?: string;
    /**
     * - This is the buisness id which is the full URL of the page we want to pre-render
     * it will be used later by the prerendering engine to get the page data thus make sure
     * it's valid otherwise the API will raise an Exception.
     *
     * @type {string}
     * @memberof PreRenderedPageModel
     */
    pageUrl: string;
    /**
     * - After the page is page is fetched and then pre-renderd the underlying content will be contained in this varibale.
     * - It's alot faster to manage data stored in a data base than to process files, this is why this **large** variable
     * is stored in the data base so beware of it's size.
     *
     * @type {string}
     * @memberof PreRenderedPageModel
     */
    content: string;
    /**
     * - A timestamp that declares the date at which the page was pre-redered.
     *
     * @type {string}
     * @memberof PreRenderedPageModel
     */
    lastPreRenderingDate: number;
}
