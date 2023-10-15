import db from "./data";

export default function handler(req, res) {
    if (req.method === "GET") {
        return res.json(db.getResult());
    } else {
        res.status(404).json({ message: `Method [${req.method}] not found` });
    }
}
