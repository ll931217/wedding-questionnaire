import questions from "./questions";

let loggedInUser = null;
let currentQuestion = 0;
const answers = {};

let timelapsed = 0;
let interval = setInterval(() => {
    if (timelapsed === 10) {
        clearInterval(interval);
    }
    timelapsed += 1;
}, 1000);

export let gameStarted = false;

export const startGame = () => (gameStarted = true);

export const nextQuestion = () => {
    timelapsed = 0;
    clearInterval(interval);
    currentQuestion += 1;
    interval = setInterval(() => {
        if (timelapsed === 10) {
            clearInterval(interval);
        }
        timelapsed += 1;
    }, 1000);
};
export const getCurrentQuestion = (lang) => questions[lang][currentQuestion];
export const getQuestions = (lang) => questions[lang];

export const answerQuestion = (uuid, correctAnswer) => {
    if (!Object.prototype.hasOwnProperty.call(answers, uuid)) {
        answers[uuid] = Array.from(Array(10)).fill(false);
    }

    answers[uuid][currentQuestion] = correctAnswer;

    return answers;
};

export const loginUser = (userId) => {
    loggedInUser = userId;
};
export const getLoggedInUser = () => loggedInUser;
