class Database {
    constructor() {
        this.data = {
            currentLoggedInUser: null,
            gameStarted: false,
            currentQuestion: 0,
            answers: {},
        };
    }

    getGameState() {
        return this.data.gameStarted;
    }

    getLoggedInUser() {
        return this.data.currentLoggedInUser;
    }

    getCurrentQuestion() {
        return this.data.currentQuestion;
    }

    startGame() {
        this.data.gameStarted = true;
        return this.data.gameStarted;
    }

    stopGame() {
        this.data.gameStarted = false;
    }

    nextQuestion() {
        this.data.currentQuestion += 1;
    }

    loginAdmin(userId) {
        this.data.currentLoggedInUser = userId;
    }

    logoutAdmin() {
        this.data.currentLoggedInUser = null;
    }

    find(clientId = null) {
        if (!clientId) return this.data.answers;
        return this.data.answers[clientId];
    }

    insert(key, data) {
        this.data.answers[key] = data;
    }

    update(key, data) {
        this.data.answers[key] = data;
    }

    delete(key) {
        delete this.data.answers[key];
    }
}

const db = new Database();

export default db;
