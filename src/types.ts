import { PuppeteerLaunchOptions, ScreenshotOptions } from "puppeteer";

export interface BrowserHandlerOptions {
    concurrency: number,
    timeout: number,
    disableJavaScript: boolean,
    disableNetwork: boolean
}

export interface ExtendedScreenshotOptions extends ScreenshotOptions {
    selector?: string
}