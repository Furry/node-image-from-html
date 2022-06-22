import { Page } from "puppeteer";

export class ExtendedPage {
    public page: Page;
    public inUse: boolean = false;
    constructor(page: Page) {
        this.page = page;
    }
}