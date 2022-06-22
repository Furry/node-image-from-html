import Puppeteer, { Browser, Page, PuppeteerLaunchOptions, ScreenshotOptions } from "puppeteer";
import { BrowserHandlerOptions, ExtendedScreenshotOptions } from "../types.js";
import { ExtendedPage } from "./ExtendedPage.js";

/**
 * @class BrowserHandler
 * This class is used to handle the browser and pages, allocating pages for use and releasing them back to the handler when idle.
 * To start rendering, <BrowserHandler>.start() must first be called.
 */
export class BrowserHandler {
    private options: BrowserHandlerOptions

    private _browser: Browser | null = null;

    private pages: ExtendedPage[] = [];

    /**
     * Constructor for the BrowserHandler class.
     * @param options The options for the BrowserHandler.
     */
    constructor(options: BrowserHandlerOptions = {} as BrowserHandlerOptions) {
        this.options = options;
    }

    /**
     * Returns the underlying Puppeteer browser instance, throwing an exception if it's not started.
     */
    private get browser() {
        if (this._browser == null) {
            throw "Puppeteer Engine not started. Please await <BrowserHandler>.launch() before rendering.";
        }

        return this._browser as Browser;
    }

    /**
     * Starts the BrowserHandler engine & launches a new browser.
     * @param puppeteerOptions The options for the launched instance of Puppeteer.
     */
    async start(puppeteerOptions: PuppeteerLaunchOptions = {} as PuppeteerLaunchOptions) {
        if (this._browser != null) {
            throw "Puppeteer Engine already started!";
        }

        this._browser = await Puppeteer.launch(puppeteerOptions);

        let spawnTasks: any[] = [];
        for (let x = 0; x < (this.options.concurrency ? this.options.concurrency : 1); x++) {
            spawnTasks.push(this.browser.newPage());
        }

        this.pages = await Promise.all(spawnTasks)
            .then((pages: Page[]) => pages.map(p => new ExtendedPage(p)));
    }

    /**
     * Returns a page, waiting for one to be free if necessary.
     * @returns A promise that resolves to an ExtendedPage object.
     */
    private async waitForPage(): Promise<ExtendedPage> {
        let elapsed = 0;
        while (true) {
            for (const page of this.pages) {
                if (page.inUse == false) {
                    page.inUse = true;
                    return page;
                }
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            elapsed += 100;

            if (elapsed > (this.options.timeout ? this.options.timeout : 15000)) {
                throw "Timeout waiting for page to become available. Perhaps attempt a higher concurrency?";
            }
        }
    }

    /**
     * Closes the browser and cleans up any resources.
     */
    public async dispose() {
        await this.browser.close();
    }

    /**
     * Renders an HTML string to an image format using the first available page, waiting for one to be free if necessary.
     * @param html HTML to render
     * @param screenshotOptions The options for the screenshot.
     * @returns Your rendered HTML as a Buffer.
     */
    public async render(html: string, screenshotOptions: ExtendedScreenshotOptions): Promise<string | Buffer> {
        const epage = await this.waitForPage();

        // Uri format supports 2mb of text.
        const uri = `data:text/html,${encodeURIComponent(html)}`;
        await epage.page.goto(uri);

        let target: any;
        if (screenshotOptions.selector) {
            target = await epage.page.$(screenshotOptions.selector);
            if (!target) {
                throw "Could not find element with selector: " + screenshotOptions.selector;
            }
        } else {
            target = await epage.page.mainFrame();
        }

        const screenshot = await target.screenshot(screenshotOptions);
        epage.inUse = false;
        return screenshot;
    }
}