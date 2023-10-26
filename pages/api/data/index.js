import questions from "./questions";

class Database {
    constructor() {
        this.questions = questions;
        this.currentLoggedInUser = null;
        this.gameStarted = false;
        this.answers = {};
        this.clients = new Set();
    }

    getConnected() {
        return this.clients.size;
    }

    getGameState() {
        return this.gameStarted;
    }

    getLoggedInUser() {
        return this.currentLoggedInUser;
    }

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

    addClient(clientId) {
        this.clients.add(clientId);
    }

    removeClient(clientId) {
        this.clients.delete(clientId);
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
