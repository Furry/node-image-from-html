/*
    Renders a single html string asynchronously and logs the base64 output
*/

import * as bh from "../src/index";

const handler = new bh.BrowserHandler(1, { headless: false });

(async () => {
    await handler.start()

    const res = await handler.render(`<div id="index" style="width: 100px; height: 100px; background-color: red;">`)

    console.log(res)
})();
