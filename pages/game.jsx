import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

/**
 * TODO:
 *   - [x] Answers will be saved in sessionStorage
 *   - [x] Will check totalQuestions and currentQuestion index to check if game is over
 *   - [x] When game is over:
 *       - [x] Send stored `answer scores` to server including `clientId` and `name`
 *       - [x] Redirect player to result page
 *   - [x] If game haven't started, redirect player to waiting room
 *   - [x] If game is over, redirect player to result
 */
export default function Game() {
    const router = useRouter();
    const [question, setQuestion] = useState("");
    const [questionIndex, setQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState();
    const [correctAnswer, setCorrectAnswer] = useState();
    const [timelapse, setTimelapse] = useState(0);
    const [answered, setAnswered] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState();
    const [alreadyAnswered, setAlreadyAnswered] = useState(false);

    useEffect(() => {
        const fetchState = async () => {
            try {
                const { data } = await axios.get("/api/state");

                console.log("[game] Current State:", data);
                if (!data.gameStarted) {
                    router.push("/waiting");
                }

                if (answered.length !== data.totalQuestions) {
                    setAnswered(Array.from(Array(data.totalQuestions)).fill(0));
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchState();
    }, [answered.length, router]);

    useEffect(() => {
        if (sessionStorage.getItem("answered")) {
            setAnswered(JSON.parse(sessionStorage.getItem("answered")));
        }
    }, []);

    useEffect(() => {
        const sendAnswers = async () => {
            try {
                await axios.post(
                    "/api/questionnaire",
                    {
                        clientId: sessionStorage.getItem("clientId"),
                        name: sessionStorage.getItem("name"),
                        score: answered.reduce((a, b) => a + b, 0),
                    },
                    { params: { lang: sessionStorage.getItem("lang") || "zh" } },
                );
            } catch (error) {
                console.error(error);
            }
        };

        const questionPollingInterval = setInterval(async () => {
            try {
                const { data } = await axios.get("/api/questionnaire", {
                    params: {
                        lang: sessionStorage.getItem("lang") || "zh",
                        current: true,
                    },
                });

                console.log("Current Question:", data);

                if (!data.question) {
                    sendAnswers();
                    clearInterval(questionPollingInterval);
                    router.push("/result");
                } else if (data.question.question !== question) {
                    setTimelapse(0);
                    setQuestion(data.question.question);
                    setQuestionIndex(data.index);
                    setAnswers(data.question.answers);
                    setCorrectAnswer(data.question.correctAnswer);
                    setSelectedAnswer(undefined);
                    setAlreadyAnswered(false);
                }
            } catch (error) {
                console.error(error);
            }
        }, 1000);

        const timelapseInterval = setInterval(() => {
            if (timelapse < 9) setTimelapse(timelapse + 1);
        }, 3000);

        return () => {
            clearInterval(questionPollingInterval);
            clearInterval(timelapseInterval);
        };
    }, [router, answered, question, timelapse]);

    /**
     * - [x] Will check if answer is correct
     * - [x] Set the score and store it in sessionStorage
     * - [x] Score is calculated by timelapse, each second is a point deducted until 1 (For correct answers, incorrect answers is 0)
     * - [ ] Highlight the right and wrong answers in green and red respectively
     */
    const answerQuestion = (answerIndex) => {
        if (alreadyAnswered) return;

        setSelectedAnswer(answerIndex);
        setAlreadyAnswered(true);

        if (answerIndex === correctAnswer) {
            answered[questionIndex] = 10 - timelapse;
            sessionStorage.setItem("answered", JSON.stringify(answered));
            setAnswered(answered);
        }
    };

    return (
        <>
            <Head>
                <title>Questionnaire</title>
            </Head>
            <div id="main">
                <div id="top-section">
                    <h1 className="m-10">{question}</h1>
                </div>
                <div id="bottom-section">
                    <div className="grid grid-cols-2 gap-5">
                        {answers
                            ? answers.map((answer, i) => (
                                <a
                                    onClick={() => answerQuestion(i)}
                                    key={i}
                                    className={
                                        "border-2 rounded-md shadow-lg text-center flex justify-center items-center w-40 h-40 p-2 " +
                                        (selectedAnswer === i
                                            ? selectedAnswer === correctAnswer
                                                ? "border-green-900 bg-green-300"
                                                : "border-red-900 bg-red-300"
                                            : "border-gray-400 bg-white")
                                    }
                                >
                                    <div>{answer}</div>
                                </a>
                            ))
                            : null}
                    </div>
                </div>
            </div>
        </>
    );
}
