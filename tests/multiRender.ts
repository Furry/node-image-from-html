/*
    Runs two render tasks synchronously to validate the library's ability to disperse load across tabs.
*/

import * as bh from "../src/index";

const handler = new bh.BrowserHandler(3, { headless: false });

(async () => {
    await handler.start()

    const res1 = handler.render(`<div id="index" style="width: 100px; height: 100px; background-color: red;">`)
    const res2 = handler.render(`<div id="index" style="width: 100px; height: 100px; background-color: blue;">`)
    const res3 = handler.render(`<div id="index" style="width: 100px; height: 100px; background-color: green;">`)
})();
