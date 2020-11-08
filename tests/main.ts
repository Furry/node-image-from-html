/*
    Renders a single html string asynchronously and logs the base64 output
*/

import * as bh from "../src/index";
import * as fs from "fs";

const handler = new bh.BrowserHandler(1, { headless: false });

(async () => {
    await handler.start()

    const res = await handler.render(`
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');
    * { font-family: 'Roboto', sans-serif; font-size: 64; margin: 0; padding: 0; }
    div { width: 64px; height: 64px; text-align: center; }
    p { color: #D200FA }
    .m {
        position: relative;
    }

    .c {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
    }
    </style>
    <div class="m">
        <div id="entry" class="c">
        <p>H</p>
        </div>
    </div>
    `, "#entry")

    fs.writeFileSync("myImage.png", res, {encoding: "base64"})
})();
