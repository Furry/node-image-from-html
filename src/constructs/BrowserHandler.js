const puppeteer = require("puppeteer");

class BrowserHandler {
    constructor(count = 1, headless = true) {
        this.count = count;
        this.pages = [];
        this.browser;

        this.headless = headless
    }

    async start() {
        
        this.browser = await puppeteer.launch();
        
        for (let i = 0; i < this.count; i++) {
            let page = await this.browser.newPage({headless: this.headless});
            page.inUse = false; // To detect when a page is in the process of being rendered/saved, so we don't mess things up!
            this.pages.push(page)
        }
    
    }

    async fetchPage() {
        for (let page of this.pages) {
            console.log(page.inUse)
            if (!page.inUse) {
                page.inUse = true;
                return page
            }
        }
        await new Promise((resolve) => setTimeout(resolve, 20))
        return this.fetchPage()
    }

    async render(html, entry = null) {

        if (!html) throw "You must provide HTML to render."

        let uri = `data:text/html,${encodeURIComponent(html)}`
        let page = await this.fetchPage()
        await page.goto(uri)

        if (!entry) {
            let base64 = await page.screenshot({
                fullPage: true,
                omitBackground: true,
                encoding: "base64",
            })
            page.inUse = false
            return base64
        } else {
            const div = await page.$(entry)
            .catch((err) => { throw `Could not find id/class ${entry}` })

            const boundingbox = await div.boundingBox()

            let base64 = await div.screenshot({
                omitBackground: true,
                encoding: "base64",
                clip: {
                    x: boundingbox.x,
                    y: boundingbox.y,
                    width: Math.min(boundingbox.width, page.viewport().width),
                    height: Math.min(boundingbox.height, page.viewport().height)
                }
            })

            return base64
        }

    }

}

module.exports = BrowserHandler