import { PuppeteerLaunchOptions, ScreenshotOptions } from "puppeteer";

export interface BrowserHandlerOptions {
    concurrency: number,
    timeout: number
}

export interface ExtendedScreenshotOptions extends ScreenshotOptions {
    selector?: string
}