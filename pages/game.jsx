import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

/**
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

    const sendAnswers = useCallback(async () => {
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
    }, [answered]);

    const getQuestion = useCallback(
        async (index = 0) => {
            try {
                const { data } = await axios.get("/api/questionnaire", {
                    params: {
                        lang: sessionStorage.getItem("lang") || "zh",
                        index,
                    },
                });

                if (data.question) {
                    setTimelapse(0);

                    setQuestionIndex(index);
                    setQuestion(data.question.question);
                    setAnswers(data.question.answers);
                    setCorrectAnswer(data.question.correctAnswer);

                    setSelectedAnswer(undefined);
                    setAlreadyAnswered(false);
                } else {
                    await sendAnswers();
                    setQuestion(`Game has ended/遊戲結束`);
                    setAnswers([]);

                    let i = 0;
                    const interval = setInterval(() => {
                        ++i;
                        if (i === 3) {
                            clearInterval(interval);
                            router.push("/result");
                        }
                    }, 1000);
                }
            } catch (error) {
                console.error(error);
            }
        },
        [router, sendAnswers],
    );

    useEffect(() => {
        const fetchState = async () => {
            try {
                const { data } = await axios.get("/api/state");

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
        let answered = [];

        if (sessionStorage.getItem("answered")) {
            answered = JSON.parse(sessionStorage.getItem("answered"));
            setAnswered(answered);
        }

        // Check if already started answering
        if (Array.from(new Set(answered)).length > 1) {
            // Loop reversely to find the latest answered
            for (let i = answered.length - 1; i >= 0; i--) {
                if (answered[i]) {
                    getQuestion(i);
                    break;
                }
            }
        } else {
            // Get first question
            getQuestion();
        }
    }, [getQuestion]);

    useEffect(() => {
        const timelapseInterval = setInterval(() => {
            if (timelapse < 9) setTimelapse(timelapse + 1);
        }, 3000);

        return () => {
            clearInterval(timelapseInterval);
        };
    }, [timelapse]);

    /**
     * - [x] Will check if answer is correct
     * - [x] Set the score and store it in sessionStorage
     * - [x] Score is calculated by timelapse, each second is a point deducted until 1 (For correct answers, incorrect answers is 0)
     * - [x] Highlight the right and wrong answers in green and red respectively
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

        setTimeout(() => getQuestion(questionIndex + 1), 1000);
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
