import db from "./data";

export default function handler(req, res) {
    if (req.method === "GET") {
        res.status(200).json({ connected: db.getConnected() });
    } else {
        res.status(404).json({ message: `Method [${req.method}] not found` });
    }
}
