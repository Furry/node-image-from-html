import puppeteer from "puppeteer"
//import { EventEmitter } from "events"

interface ExtendedPage extends puppeteer.Page {
    inUse: boolean
}

/**
 * BrowserHandler
 * 
 * Handles asynchronous task loop for rendering html,
 * Controls all browsers & pages
 * 
 * @extends EventEmitter
 */
export class BrowserHandler /* extends EventEmitter */ {
    public count: number
    public opts: puppeteer.LaunchOptions 

    private pages: ExtendedPage[] = []
    private browser: puppeteer.Browser | null = null;

    /**
     * The constructor for the BrowserHandler class
     * @param count The amount of pages to allocate to the headless browser
     * @param opts The puppeteer browser options to be passed through
     */
    constructor(count: number = 1, opts: puppeteer.LaunchOptions = {}) {
        this.count = count
        this.opts = opts
    }

    /**
     * Launches our browser, and generates all rendering pages and casts them to 'ExtendedPage'
     * before pushing them into the private pages field.
     */
    public async start(): Promise<void> {
        // Start our browser
        this.browser = await puppeteer.launch(this.opts)

        // Create tabs - 1
        for (let i = 1; i < this.count; i++) {
            const page = await this.browser.newPage();
            (page as ExtendedPage).inUse = false
            this.pages.push(page as ExtendedPage)
        }

        const basePages = await this.browser.pages()
        const basePage = basePages[0];
        (basePage as ExtendedPage).inUse = false
        this.pages.push(basePage as ExtendedPage)

    }

    /**
     * Fetches a page from the BrowserHandler,
     * recurses if there is no page available until it can find one.
     * 
     * @todo Create Event Emitter based implimentation
     */
    private async fetchPage(): Promise<ExtendedPage> {
        for (const page of this.pages) {
            if (!page.inUse) {
                page.inUse = true
                return page
            }
        }
        await new Promise((resolve) => setTimeout(resolve, 20))
        return this.fetchPage()
    }

    /**
     * Renders given html into an image or buffer dependent on parameters.
     * 
     * @param html The HTML to be rendered.
     * @param entry The entry ID name of the element to be rendered. If falsy, will take an image of the whole page.
     * @example
     * render(`<div id="index" style="width: 100px; height: 100px; background-color: red;">`, "index")
     *  .then((res) => console.log(res))
     *  .catch((err) => console.log(err))
     */
    public async render(html: string, entry?: string): Promise<string> {

        // Cast our HTML to a URI encoded data string.
        const uri = `data:text/html,${encodeURIComponent(html)}`
        const page = await this.fetchPage()
        await page.goto(uri)

        if (!entry) {
            const base64 = await page.screenshot({
                fullPage: true,
                omitBackground: true,
                encoding: "base64"
            })
            page.inUse = false
            return base64
        } else {
            const div = await page.$(entry)
            if (!div) {
                console.log(document.getElementById("entry"))
                throw `Could not find selector ${entry}. Mind selectors must be prefixed by # for ids, and . for classes.`
            }

            const boundingbox = await div.boundingBox()
            if (!boundingbox) {
                throw `Error trying to determine the size of element ${entry}`
            }

            const base64 = await div.screenshot({
                omitBackground: true,
                encoding: "base64",
                clip: {
                    x: boundingbox.x,
                    y: boundingbox.y,
                    width: Math.min(boundingbox.width, page.viewport().width),
                    height: Math.min(boundingbox.height, page.viewport().height)
                }
            })
            page.inUse = false
            return base64
        }
    }
}