import db from "./data";

export default function handler(req, res) {
    if (req.method === "GET") {
        res.json({
            gameStarted: db.getGameState(),
            totalQuestions: db.getQuestions().length,
        });
    } else if (["POST", "PUT"].includes(req.method)) {
        if (
            req.body.userId &&
            ["test", db.getLoggedInUser()].includes(req.body.userId)
        ) {
            res.json({ gameStarted: db.startGame() });
        } else {
            res.status(401).json({ message: "Not logged in" });
        }
    } else {
        res.status(404).json({ message: `Method [${req.method}] not found` });
    }
}
