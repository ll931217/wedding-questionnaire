import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Admin() {
    const router = useRouter();

    const [gameState, setGameState] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [result, setResult] = useState({});

    // Check whether the user is logged in and check if id is valid
    useEffect(() => {
        if (!sessionStorage.getItem("userId")) {
            router.push("/login");
        }

        if (sessionStorage.getItem("userId") !== "test") {
            axios
                .get("/api/auth")
                .then(({ data }) => {
                    console.log("Server logged in userId:", data.userId, data);
                    if (
                        !data.userId ||
                        data.userId !== sessionStorage.getItem("userId")
                    ) {
                        sessionStorage.removeItem("userId");
                        router.push("/login");
                    }
                })
                .catch(console.error);
        }
    }, [router]);

    useEffect(() => {
        const checkGameStateInterval = setInterval(async () => {
            try {
                const { data } = await axios.get("/api/state");
                setGameState(data.gameStarted);
            } catch (error) {
                console.error(error);
            }
        }, 1000);

        return () => {
            clearInterval(checkGameStateInterval);
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            const { data } = await axios.get("/api/result");

            setResult(data);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const startGame = () => {
        axios
            .post("/api/state", { userId: sessionStorage.getItem("userId") })
            .then(({ data }) => setGameState(data.gameStarted))
            .catch(console.error);
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
                </div>

                <p>State: {gameState ? "Game started" : "Game not started"}</p>

                <hr className="border border-slate-500 my-4" />

                <h3 className="text-2xl font-bold text-gray-700">Results</h3>
                <table className="border-collapse border border-slate-500 w-full">
                    <thead>
                        <tr>
                            <th className="border border-slate-500">Player</th>
                            <th className="border border-slate-500">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(result).map(([, { name, score }], index) => (
                            <tr key={index}>
                                <td className="border border-slate-500">{name}</td>
                                <td className="border border-slate-500">{score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p>{errorMessage}</p>
            </div>
        </>
    );
}
