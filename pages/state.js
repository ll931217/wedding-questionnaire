import db from "./data";

import questions from "./data/questions";

export const startGame = () => db.startGame();
export const stopGame = () => db.stopGame();

export const nextQuestion = () => {
    if (!db.getGameState()) return;

    if (questions["zh"].length <= db.getCurrentQuestion()) {
        return db.stopGame();
    }

    db.nextQuestion();
};
export const getCurrentQuestion = (lang) =>
    questions[lang][db.getCurrentQuestion()];
export const getQuestions = (lang) => questions[lang];

export const answerQuestion = (clientId, name, score) => {
    if (db.find(clientId)) {
        db.insert(clientId, {
            name,
            scores: Array.from(Array(questions["zh"].length)).fill(0),
        });
    }

    const answer = db.find(clientId);

    answer.scores[db.getCurrentQuestion()] = score;

    db.update(clientId, answer);

    return db.find();
};
export const getResult = () => {
    const result = {};
    Object.keys(db.find()).forEach((clientId) => {
        result[clientId] = {
            name: answers[clientId].name,
            score: answers[clientId].scores.reduce((a, b) => a + b, 0),
        };
    });
    return result;
};

export const loginUser = (userId) => db.loginAdmin(userId);
export const logoutUser = () => db.logoutAdmin();
export const getLoggedInUser = () => db.getLoggedInUser();
