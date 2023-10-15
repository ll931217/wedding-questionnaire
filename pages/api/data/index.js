import questions from "./questions";

class Database {
    constructor() {
        this.questions = questions;
        this.currentLoggedInUser = null;
        this.gameStarted = false;
        this.answers = {};
    }

    getGameState() {
        return this.gameStarted;
    }

    getLoggedInUser() {
        return this.currentLoggedInUser;
    }

    // getCurrentIndex() {
    //     return this.currentQuestion;
    // }
    //
    // getCurrentQuestion(lang = "zh") {
    //     return this.questions[lang][this.currentQuestion];
    // }

    getQuestion(index, lang = "zh") {
        return this.questions[lang][index] || null;
    }

    getQuestions(lang = "zh") {
        return this.questions[lang];
    }

    getResult() {
        return Object.fromEntries(
            Object.entries(this.answers).sort(([, a], [, b]) => b - a),
        );
    }

    startGame() {
        this.gameStarted = true;
        return true;
    }

    stopGame() {
        this.gameStarted = false;
        return false;
    }

    answerQuestion(clientId, name, index, score) {
        if (this.find(clientId)) {
            this.insert(clientId, {
                name,
                scores: Array.from(Array(this.questions["zh"].length)).fill(0),
            });
        }

        const answer = this.find(clientId);

        answer.scores[index] = score;

        this.update(clientId, answer);

        return this.find();
    }

    loginAdmin(userId) {
        this.currentLoggedInUser = userId;
        return userId;
    }

    logoutAdmin() {
        this.currentLoggedInUser = null;
    }

    // Find answer by clientId
    find(clientId = null) {
        if (!clientId) return this.answers;
        return this.answers[clientId];
    }

    // Insert answer for clientId
    insert(clientId, data) {
        this.answers[clientId] = data;
    }

    // Update answer by clientId
    update(clientId, data) {
        this.answers[clientId] = data;
    }

    // Delete answer by clientId
    delete(clientId) {
        delete this.answers[clientId];
    }
}

const db = new Database();

export default db;
