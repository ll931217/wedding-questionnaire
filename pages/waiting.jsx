import axios from "axios";
import { useRouter } from "next/router";

import { GameInstructions } from "./components/GameInstructions";
import { useEffect } from "react";
import Head from "next/head";

export default function Waiting() {
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            axios
                .get("/api/state")
                .then((res) => {
                    if (res.data.gameStarted) {
                        clearInterval(interval);
                        router.push("/game");
                    }
                })
                .catch(console.error);
        }, 1000);
    });

    return (
        <>
            <Head>
                <title>Game about to start</title>
            </Head>
            <div id="main">
                <div id="top-section">
                    <GameInstructions />
                </div>
                <div id="bottom-section"></div>
            </div>
        </>
    );
}
