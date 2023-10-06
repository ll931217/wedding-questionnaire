import {
    answerQuestion,
    getCurrentQuestion,
    getLoggedInUser,
    nextQuestion,
} from "../state";

export default function handler(req, res) {
    if (!req.query.lang) {
        res.status(400).send({ error: "Did not set lang query" });
    } else if (req.method === "GET") {
        res.status(200).json(getCurrentQuestion(req.query.lang));
    } else if (req.method === "POST") {
        if (!req.body.operation) res.status(400);

        if (req.body.operation === "nextQuestion") {
            if (req.body.userId !== getLoggedInUser()) {
                res.status(401).json({ message: "Not logged in" });
                return;
            }
            nextQuestion();
            res.status(200).json(getCurrentQuestion(req.query.lang));
        } else if (req.body.operation === "answerQuestion") {
            const answers = answerQuestion(req.body.correctAnswer);
            res.status(200).json({ answers });
        }
    } else {
        res.status(404).json({ message: `Method [${req.method}] not found` });
    }
}
