/**
 * This class is the input of the pre-render controller endpoint used to pre-render a page.
 *
 * @export
 * @class PreRenderRequestDTO
 */
export class PreRenderRequestDTO {
    /**
     * - The url of the page to pre-render.
     *
     * @type {string}
     * @memberof PreRenderRequestDTO
     */
    readonly pageUrl: string;
    /**
     *  - When the browser pre-renders the page it will stop at the first moment all
     * resource are fetched and wont wait fo the javascript that will alter the DOM
     * and add dynamically more content to it.
     *  - If provided this will force the browser to wait until a specific element appears
     * in the DOM.
     *  - The browser is able to identify the element to wait for thanks to its class or it's
     * id thus these elements must have a prefix of ```#``` or ```.``` .
     *  - In case the element class or tag are not found the browser will raise a time-out-exception
     * after 30000 secs.
     *
     * @type {string}
     * @memberof PreRenderRequestDTO
     */
    readonly elementToWaitFor: string;
}