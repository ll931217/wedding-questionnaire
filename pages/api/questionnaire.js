import db from "./data";

export default function handler(req, res) {
    if (!req.query.lang) {
        res.status(400).send({ message: "Did not set lang query" });
    } else if (req.method === "GET") {
        if (req.query.result) {
            // Get result
            return res.status(200).json(db.getResult());
        } else if (req.query.current) {
            // Get current question
            res.status(200).json({
                question: db.getCurrentQuestion(req.query.lang),
                index: db.getCurrentIndex(),
            });
        } else {
            // Get questions
            res.status(200).json(db.getQuestions());
        }
    } else if (req.method === "POST") {
        // Send answer to server
        const { clientId, name, score } = req.body;
        db.insert(clientId, { name, score });

        res.status(200).json({ message: "Answer added" });
    } else {
        res.status(404).json({ message: `Method [${req.method}] not found` });
    }
}
