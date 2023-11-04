import db from "./data";

export default function handler(req, res) {
    if (!req.query.lang) {
        res.status(400).send({ message: "Did not set lang query" });
    } else if (req.method === "GET") {
        if (req.query.index) {
            res.json({
                question: db.getQuestion(parseInt(req.query.index), req.query.lang),
            });
        } else {
            // Get questions
            res.json(db.getQuestions());
        }
    } else if (req.method === "POST") {
        // Send answer to server
        const { clientId, name, score } = req.body;
        db.insert(clientId, { name, score });

        res.json({ message: "Answer added" });
    } else {
        res.status(404).json({ message: `Method [${req.method}] not found` });
    }
}
