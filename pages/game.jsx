import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import destr from "destr";

const timePerQuestion = 10000;

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

    let timelapseInterval = useRef(null);

    const sendAnswers = useCallback(async () => {
        try {
            console.log("Answered before score:", answered);
            const score = answered.reduce((a, b) => a + b, 0);
            console.log("Final score:", score);
            await axios.post(
                "/api/questionnaire",
                {
                    clientId: sessionStorage.getItem("clientId"),
                    name: sessionStorage.getItem("name"),
                    score,
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
                let data;
                try {
                    // !ERROR IS HERE!
                    const response = await axios.get("/api/questionnaire", {
                        params: {
                            lang: sessionStorage.getItem("lang") || "zh",
                            index,
                        },
                    });
                    data = response.data;
                } catch (error) {
                    console.error(error);
                }

                if (data.question) {
                    clearInterval(timelapseInterval.current);

                    setTimelapse(0);
                    timelapseInterval.current = setInterval(() => {
                        if (timelapse < 9) setTimelapse(timelapse + 1);
                    }, timePerQuestion);

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

                    setTimeout(() => {
                        router.push("/result");
                    }, 3000);
                }
            } catch (error) {
                console.error(error);
            }
        },
        [router, sendAnswers, timelapse],
    );

    useEffect(() => {
        const fetchState = async () => {
            try {
                const { data } = await axios.get("/api/state");

                if (!data.gameStarted) {
                    router.push("/waiting");
                }

                if (!sessionStorage.getItem("answered")) {
                    console.log("Populate answered");
                    setAnswered(Array.from(Array(data.totalQuestions)).fill(0));
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchState();
    }, [answered.length, router]);

    useEffect(() => {
        const answered = destr(sessionStorage.getItem("answered")) || [];
        setAnswered(answered);

        // Check if already started answering
        if (Array.from(new Set(answered)).length > 1) {
            // Loop reversely to find the latest answered
            for (let i = answered.length - 1; i >= 0; i--) {
                if (answered[i]) {
                    console.log("Answered:", answered);
                    getQuestion(i + 1);
                    break;
                }
            }
        } else {
            // Get first question
            getQuestion();
        }
    }, []);

    useEffect(() => {
        timelapseInterval.current = setInterval(() => {
            if (timelapse < 9) setTimelapse(timelapse + 1);
        }, timePerQuestion);

        return () => {
            clearInterval(timelapseInterval.current);
        };
    }, [timelapse, timelapseInterval]);

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

        setTimeout(() => {
            getQuestion(questionIndex + 1);
        }, 1000);
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
                                        ([0, 1, 2, 3].includes(selectedAnswer)
                                            ? selectedAnswer === i
                                                ? selectedAnswer === correctAnswer
                                                    ? "border-green-900 bg-green-300"
                                                    : "border-red-900 bg-red-300"
                                                : correctAnswer === i
                                                    ? "border-green-900 bg-green-300"
                                                    : "border-gray-400 bg-white"
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
