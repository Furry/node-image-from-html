// In an Async Context,
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
