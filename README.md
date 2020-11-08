# node-image-from-html
Convert HTML data into images, with a persistant headless browser!

## Features
* Speed - Unlike most other libraries, this insures the headless browser stays alive, and wastes no time re-launching.

* Concurrency - Allows for one browser to spawn multiple tabs, shifting the workload to them if one is active.

* ID or Full-Page selection options.

* Default Background Transparency.

* Raw Base64 Output

## Example

```js
const ImageFromHtml = require("node-image-from-html");
const fs = require("fs");

(async () => {

    const Handler = new ImageFromHtml.BrowserHandler(1, { headless: true })

    await Handler.start()

    // Regardless of the position or the padding around the element, the screenshot will always be of the div in question. In this case, "entry".
    let base64 = await Handler.render(`<div id="entry" style="width:100px;height:100px;padding:300px;background-color:blue"></div>`, "entry")

    fs.writeFileSync("myImage.png", base64, {encoding: "base64"})

})()
```

## Efficiency?

This library was designed with heavy load in mind, Tested with 10 concurrent tabs and a load of 1000 images,
6.32 seconds spent rendering.


## To-Do

* Add Event-Emitter based polling

* Add support for multiple browsers, not just tabs

* Add the ability to dynamically add tabs for larger loads, and remove some in lighter loads.

### Can I make a PR?

Please! Any and all improvements are welcome, I have no guidelines, just make sure to document everything decently via JSDocs, and don't use implied any statements.
[![Run on Repl.it](https://repl.it/badge/github/Furry/node-image-from-html)](https://repl.it/github/Furry/node-image-from-html)