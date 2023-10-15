import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

import GameInstructions from "../components/GameInstructions";

export default function Waiting() {
    const router = useRouter();

    useEffect(() => {
        if (
            !sessionStorage.getItem("name") ||
            sessionStorage.getItem("name") === "" ||
            !sessionStorage.getItem("clientId")
        ) {
            router.push("/");
        }

        const interval = setInterval(async () => {
            try {
                const { data } = await axios.get("/api/state");
                if (data.gameStarted) {
                    clearInterval(interval);
                    router.push("/game");
                }
            } catch (error) {
                console.error(error);
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [router]);

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
