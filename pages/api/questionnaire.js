import {
    answerQuestion,
    getCurrentQuestion,
    getLoggedInUser,
    nextQuestion,
} from "../state";

export default function handler(req, res) {
    if (!req.query.lang) {
        res.status(400).send({ message: "Did not set lang query" });
    } else if (req.method === "GET") {
        if (req.query.result) {
            return res.status(200).json(getResult());
        }
        res.status(200).json(getCurrentQuestion(req.query.lang));
    } else if (req.method === "POST") {
        console.log(req.body);
        if (!req.body.operation) res.status(400);

        if (req.body.operation === "nextQuestion") {
            if (
                req.body.userId &&
                req.body.userId !== "test" &&
                req.body.userId !== getLoggedInUser()
            ) {
                res.status(401).json({ message: "Not logged in" });
                return;
            }
            nextQuestion();
            res.status(200).json(getCurrentQuestion(req.query.lang));
        } else if (req.body.operation === "answerQuestion") {
            const answers = answerQuestion(
                req.body.clientId,
                req.body.name,
                req.body.score,
            );
            res.status(200).json({ answers });
        }
    } else {
        res.status(404).json({ message: `Method [${req.method}] not found` });
    }
}
