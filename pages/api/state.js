import { gameStarted, startGame } from "../state";

export default function handler(req, res) {
    if (req.method === "GET") {
        res.status(200).json({ gameStarted });
    } else if (req.method === "POST") {
        startGame();
        res.status(200).json({ gameStarted });
    } else {
        res.status(404).json({ message: `Method [${req.method}] not found` });
    }
}
