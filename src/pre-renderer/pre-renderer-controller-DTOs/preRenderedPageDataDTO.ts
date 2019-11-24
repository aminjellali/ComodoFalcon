/**
 * - This class is a user friendly representation of the renerder page data.
 * @export
 * @interface PreRenderedPageDataDTO
 */
export interface PreRenderedPageDataDTO {
    /**
     * - This is the buisness id which is the full URL of the page we want to pre-render
     * it will be used later by the prerendering engine to get the page data thus make sure
     * it's valid otherwise the API will raise an Exception.
     *
     * @type {string}
     * @memberof PreRenderedPageDataDTO
     */
    pageUrl: string;
    /**
     * - After the page is page is fetched and then pre-renderd the underlying content will be contained in this varibale.
     * - It's alot faster to manage data stored in a data base than to process files, this is why this **large** variable
     * is stored in the data base so beware of it's size.
     *
     * @type {string}
     * @memberof PreRenderedPageDataDTO
     */
    content: string;
    /**
     * - A date format at which the page was pre-redered.
     *
     * @type {string}
     * @memberof PreRenderedPageDataDTO
     */
    lastPreRenderingDate: Date;
}
