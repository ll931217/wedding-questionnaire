import fs from "fs";
import https from "https";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import axios from "axios";

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
    cert: fs.readFileSync(path.resolve(__dirname, "../ssl/qa.baoge.dev+3.pem")),
    key: fs.readFileSync(
        path.resolve(__dirname, "../ssl/qa.baoge.dev+3-key.pem"),
    ),
});

const fetch = axios.create({
    baseURL: "https://localhost:3000",
    httpsAgent,
});

export default fetch;
