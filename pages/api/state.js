import db from "./data";

export default function handler(req, res) {
    if (req.method === "GET") {
        res.status(200).json({
            gameStarted: db.getGameState(),
            totalQuestions: db.getQuestions().length,
            currentQuestion: db.getCurrentIndex(),
        });
    } else if (["POST", "PUT"].includes(req.method)) {
        if (
            req.body.userId &&
            ["test", db.getLoggedInUser()].includes(req.body.userId)
        ) {
            if (req.method === "POST") {
                res.status(200).json({ gameStarted: db.startGame() });
            } else if (req.method === "PUT") {
                res.status(200).json(db.nextQuestion(req.query.lang));
            }
        } else {
            res.status(401).json({ message: "Not logged in" });
        }
    } else {
        res.status(404).json({ message: `Method [${req.method}] not found` });
    }
}
