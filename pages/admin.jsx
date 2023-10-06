import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Admin() {
    const router = useRouter();

    const [gameState, setGameState] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [currentQuestion, setCurrentQuestion] = useState("");
    const [result, setResult] = useState({});

    // Check whether the user is logged in and check if id is valid
    useEffect(() => {
        if (!localStorage.getItem("userId")) {
            router.push("/login");
        }

        if (localStorage.getItem("userId") !== "test") {
            axios
                .get("/api/auth")
                .then(({ data }) => {
                    console.log("Server logged in userId:", data.userId, data);
                    if (!data.userId || data.userId !== localStorage.getItem("userId")) {
                        localStorage.removeItem("userId");
                        router.push("/login");
                    }
                })
                .catch(console.error);
        }

        const checkGameStateInterval = setInterval(() => {
            axios
                .get("/api/state")
                .then(({ data }) => {
                    setGameState(data.gameStarted);
                })
                .catch(console.error);
        }, 1000);

        axios
            .get("/api/questionnaire", {
                params: {
                    lang: "zh",
                },
            })
            .then(({ data }) => {
                setCurrentQuestion(data.question);
            });

        return () => {
            clearInterval(checkGameStateInterval);
        };
    }, [router]);

    const startGame = () => {
        axios
            .post("/api/state", {
                userId: localStorage.getItem("userId"),
            })
            .then(({ data }) => {
                setGameState(data.gameStarted);
            })
            .catch(console.error);
    };

    const nextQuestion = async () => {
        try {
            const response = await axios.post(
                "/api/questionnaire",
                {
                    operation: "nextQuestion",
                    userId: localStorage.getItem("userId"),
                },
                {
                    params: {
                        lang: localStorage.getItem("lang"),
                    },
                },
            );

            setCurrentQuestion(response.data.question);
        } catch (error) {
            console.error(error);
            setErrorMessage(error.response.data.message);
        }
    };

    /**
     * Features of admin page:
     *
     * 1. Start game
     * 2. Set next question
     * 3. End game
     * 4. Check results
     */
    return (
        <>
            <Head>
                <title>Admin Panel</title>
            </Head>
            <div id="content" className="p-4 w-full">
                <h1 className="text-3xl font-bold text-gray-700">Admin Panel</h1>

                <div className="my-4">
                    <button onClick={() => startGame()} disabled={gameState}>
                        Start game
                    </button>

                    <button onClick={() => nextQuestion()}>Next question</button>
                </div>

                <p>State: {gameState ? "Game started" : "Game not started"}</p>

                <p>Q: {currentQuestion}</p>

                <hr className="border border-slate-500 my-4" />

                <h3 className="text-2xl font-bold text-gray-700">Results</h3>
                <table className="border-collapse border border-slate-500 w-full">
                    <thead>
                        <tr>
                            <th className="border border-slate-500">Player</th>
                            <th className="border border-slate-500">Score</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
                <p>{errorMessage}</p>
            </div>
        </>
    );
}
