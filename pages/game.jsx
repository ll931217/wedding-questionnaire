import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Answers } from "./components/Answers";
import { Question } from "./components/Question";

export default function Game() {
    const router = useRouter();
    const [question, setQuestion] = useState("");
    const [answers, setAnswers] = useState();
    const [correctAnswer, setCorrectAnswer] = useState();
    const [timelapse, setTimelapse] = useState(0);

    useEffect(() => {
        axios
            .get("/api/state")
            .then((res) => {
                if (!res.data.gameStarted) {
                    router.push("/waiting");
                }
            })
            .catch(console.error);

        let interval = setInterval(() => {
            axios
                .get("/api/questionnaire", {
                    params: {
                        lang: localStorage.getItem("lang") || "zh",
                    },
                })
                .then((res) => {
                    console.log("Current Question:", res.data);
                    if (timelapse < 10) {
                        setTimelapse(timelapse + 1);
                    }

                    if (res.data.question !== question) {
                        clearInterval(interval);
                        setTimelapse(0);
                        setQuestion(res.data.question);
                        setAnswers(res.data.answers);
                        setCorrectAnswer(res.data.correctAnswer);
                    }
                })
                .catch(console.error);
        }, 1000);
    }, [router, question, timelapse]);

    return (
        <>
            <div id="main">
                <div id="top-section">
                    <Question question={question} />
                </div>
                <div id="bottom-section">
                    <Answers
                        answers={answers}
                        timelapse={timelapse}
                        correctAnswer={correctAnswer}
                    />
                </div>
            </div>
        </>
    );
}
