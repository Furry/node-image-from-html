# node-image-from-html
Convert HTML data into images using Puppeteer.

## Features
* A Polling-Based queueing system for jobs. You can specify {x} number of pages to spawn, and if one is in the middle of processing html, it will select another, or if there are no others, it will wait for it to finish.
* An always-active Puppeteer instance, taking away the need to spawn an instance and close it after each job, as all the other libraries seem to do.
* Class/ID OR whole-page selection options, so you can just get an image of the piece you're after.
* Base64 output

## Example

```js
const ImageFromHtml = require("node-image-from-html");
const fs = require("fs");

(async () => { // For async operations

    const Handler = new ImageFromHtml.Browser(1)

    await Handler.start() // Create the webkit

    // Regardless of the position or the padding around the element, the screenshot will always be of the div in question. In this case, "#entry".
    let base64 = await Handler.render(`<div id="entry" style="width:100px;height:100px;padding:300px;background-color:blue"></div>`, "#entry")

    fs.writeFileSync("myImage.png", base64, {encoding: "base64"})

})()
```

## Why?

Because I'm sick of using canvas to create and modify images in nodejs, so I thought this would be a nice useful replacement.


### Can I make a PR?

Please do, I threw this together in an hour. So any ideas/changes would be lovely.
