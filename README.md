<h1 align="center">Node-Image-From-HTML🖼️</h1>
<p align="center">
    <a href="https://discord.gg/tamVs2Ujrf">
        <img src="https://discordapp.com/api/guilds/769020183540400128/widget.png?style=banner2" alt="Discord Banner 2"/>
    </a>
    <div align="center">
        <img src="https://img.shields.io/bundlephobia/min/node-image-from-html">
        <a href="https://badge.fury.io/js/node-image-from-html"><img src="https://badge.fury.io/js/node-image-from-html.svg" alt="npm version" height="18"></a>
        <img src="https://img.shields.io/npm/dw/node-image-from-html">
    </div>
</p>

# About

This single-dependency library provides a simple API to render HTML content using <a href="https://github.com/puppeteer/puppeteer">Puppeteer</a> (A headless chromium brower) into png and jpeg images, insuring security and efficiency in the process. Written in TypeScript, it comes with native typings, supporting both CommonJS & ES6 imports.

&nbsp;
> Question: Why use this over other libraries?

This library is actively maintained, and uses a persistant browser instance to render the content, allowing it to render images within a matter of milliseconds after starting. On top of this, Network Requests & Javascript can be disabled within the rendering process to avoid any potential security issues.

> Question: What processing power is needed?

Anything that's able to run an instance of chrome is able to render images, only one instance of chromium is open at a time, with each 'concurrent' instance just being an additional tab on the browser, so the overhead isn't too bad.

> Question: Can I use CSS?

Yes, all css is supported, and can be done inline or as a \<style>\</style> block.

> Question: Why can't the library do xyz?

If it can't do something, create an issue for it and i'll be happy to add any missing features! 

# Usage:
<p>
    <ul>
        <li>
            <a href = "/Simple Rendering">Simple Rendering</a>
        </li>
        <li>
            <a href = "">Multiple Renders / Selector</a>
        </li>
        <li>
            <a href = "">Rendering embedded images</a>
        </li>
    </ul>
</p>

# Configuration:

<h2 align="center">BrowserHandlerOptions</h2>
<p align="center">

| Name        | Description                                             | Type   |
|-------------|---------------------------------------------------------|--------|
| concurrency | The amount of tabs/render jobs that can process at once | number |
| timeout     | The max timeout a tab should wait before giving up.     | number |
| disableJavaScript | Disable JavaScript in the browser.                | boolean |
| disableNetwork | Disable network in the browser.                     | boolean |
</p>

<h2 align="center">ScreenshotOptions</h2>
<p align="center">

| Name        | Description                                                                                                                                                                                                             | Type    |
|-------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|
| transparent | An optional parameter to disable the white background behind the image when rendering a PNG.                                                                                                                            | boolean |
| selector    | An optional parameter to select which element to render an image of. If unspecified, the entire page will be rendered. View https://www.w3schools.com/cssref/css_selectors.asp for more information on CSS selectors.   | string  |
| fullPage    | A **deprecated** parameter to choose to screenshot the whole page or a portion of it.                                                                                                                                   | boolean |
| quality     | An optional number from 1 to 100 to determine the quality of a JEPG exported image.                                                                                                                                     | number  |
| type        | An optional parameter to choose the type of image to take. JPEG or PNG, (PNG being the default.)                                                                                                                        | string  |
</p>

# Examples

## Simple Rendering
```js
// In an Async Context,

const NodeImageFromHtml = require("node-image-from-html");
const fs = require("fs");

const engine = new NodeImageFromHtml.BrowserHandler();

await engine.start();
const rendered = await engine.render("<h1>Node-Image-From-HTML</h1>");

// Write the rendered buffer
fs.writeFileSync("renderedImage.png", rendered);
```
<hr>

## Multiple Renders
In the situation where there's more rendering jobs than there are available tabs, the engine will automatically queue the jobs, only processing a new one when the previous one is finished, while still making sure that all the tabs are rendering.

```js
const NodeImageFromHtml = require("..");
const fs = require("fs");

// 5 concurrent rendering jobs. 
const engine = new NodeImageFromHtml.BrowserHandler({ concurrency: 5 });

// Using an IIFE to provide an async context.
(async () => {
    await engine.start();

    const renders = 25;

    // Giving the element a unique id allows us to only screenshot the element using a CSS selector,
    // https://www.w3schools.com/cssref/css_selectors.asp
    const html = "<h1 id='title'>Node-Image-From-HTML</h1>";
    const promises = [];

    // Add the promises to queue
    for (let i = 0; i < renders; i++) {
        promises.push(engine.render(html, {
            omitBackground: true,
            fullPage: false,
            selector: "#title"
        }));
    }

    // Write the files once they finish.
    const startTime = Date.now();
    const results = await Promise.all(promises)
    console.log(`Finished in ${Date.now() - startTime}ms`);

    for (let i = 0; i < results.length; i++) {
        fs.writeFileSync(`renderedImage${i}.png`, results[i]);
    }
})()
```

## Embedding Images
The library exposes a 'utils' object, containing methods useful for the library. In this case, we can transform an image buffer into a data URI, letting us insert into the rendered image.
```js
const NodeImageFromHtml = require("..");

const fs = require("fs");

const engine = new NodeImageFromHtml.BrowserHandler();

(async () => {
    await engine.start();

    const buffer = fs.readFileSync("./myImage.png");
    const html = `
    <div id="ImageExample">
        <h1>An embedded image!</h1>
        <img src="${NodeImageFromHtml.utils.toDataUri(buffer)}" />
    </div>
    `;

    const rendered = await engine.render(html, { selector: "#ImageExample" });
    fs.writeFileSync("myImage.png", rendered);
    engine.dispose();
})()
```
# Commit Guidelines

The latest version of the code base will always be under the '**next**' branch!

- All pull requiests must provide a valid reason for the change or implementation
- All **CORE CHANGES** require an issue with reasoning made before a PR will even be addressed.
- All PR's must follow the general structure of the code base
- If you have questions, feel free to make an issue and i'll get to it right away!

<hr>
<div style="text-align: center">
<a href="https://www.buymeacoffee.com/ether" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>
</div>