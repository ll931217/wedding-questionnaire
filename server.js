const { createServer } = require("https");
const { parse } = require("url");
const { readFileSync } = require("fs");
const { join } = require("path");

const next = require("next");
// const { Server } = require("socket.io");

const port = 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer(
        {
            key: readFileSync(join(__dirname, "ssl", "qa.baoge.dev+3-key.pem")),
            cert: readFileSync(join(__dirname, "ssl", "qa.baoge.dev+3.pem")),
        },
        (req, res) => {
            const parsedUrl = parse(req.url, true);
            handle(req, res, parsedUrl);
        },
    );

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on https://localhost:${port}`);
    });
});
