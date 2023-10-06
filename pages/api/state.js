import db from "../data";

export default function handler(req, res) {
    if (req.method === "GET") {
        res.status(200).json({ gameStarted: db.getGameState() });
    } else if (req.method === "POST") {
        if (
            req.body.userId &&
            ["test", db.getLoggedInUser()].includes(req.body.userId)
        ) {
            res.status(200).json({ gameStarted: db.startGame() });
        } else {
            res.status(401).json({ message: "Not logged in" });
        }
    } else {
        res.status(404).json({ message: `Method [${req.method}] not found` });
    }
}
