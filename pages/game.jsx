import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Answers } from "./components/Answers";
import { Question } from "./components/Question";

export default function Game() {
    const router = useRouter();
    const [question, setQuestion] = useState();
    const [answers, setAnswers] = useState();
    const [correctAnswer, setCorrectAnswer] = useState();

    useEffect(() => {
        axios
            .get("/api/state")
            .then((res) => {
                if (!res.data.gameStarted) {
                    router.push("/waiting");
                }
            })
            .catch(console.error);

        axios
            .get("/api/questionnaire", {
                params: {
                    lang: localStorage.getItem("lang") || "zh",
                },
            })
            .then((res) => {
                console.log("Current Question:", res.data);
                setQuestion(res.data.question);
                setAnswers(res.data.answers);
                setCorrectAnswer(res.data.correctAnswer);
            })
            .catch(console.error);
    }, [router]);

    return (
        <>
            <div id="main">
                <div id="top-section">
                    <Question question={question} />
                </div>
                <div id="bottom-section">
                    <Answers answers={answers} correctAnswer={correctAnswer} />
                </div>
            </div>
        </>
    );
}
