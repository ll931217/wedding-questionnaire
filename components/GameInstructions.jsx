import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import io from "socket.io-client";

import styles from "./GameInstructions.module.css";

let socket;

export default function GameInstructions() {
    const [connectedClients, setConnectedClients] = useState(0);
    const [lang, setLang] = useState("zh");

    const t = {
        zh: {
            back: "返回",
            gameIntroduction: "遊戲介紹",
            instructions1: "共10題，每題10分",
            instructions2: "回答速度越快越多分",
            instructions3: "得分最高玩家即可",
            instructions4: "獲得精美小禮物一份",
            statusWaiting: "等待中",
        },
        en: {
            back: "Back",
            gameIntroduction: "Game Introduction",
            instructions1: "Try to guess 10 questions about us",
            instructions2: "Each question count 10 points",
            instructions3: "You get more points the faster you answer",
            instructions4: "The winner receives a prize",
            statusWaiting: "Waiting",
        },
    };

    useEffect(() => {
        setLang(sessionStorage.getItem("lang") || "zh");
    }, []);

    useEffect(() => {
        const socketInializer = async () => {
            socket = io(undefined, { path: "/api/socket" });

            socket.emit("clientConnect", sessionStorage.getItem("clientId"));

            socket.on("connectedClients", (clients) => {
                if (clients >= 0) {
                    setConnectedClients(clients);
                }
            });
        };

        socketInializer();

        return () => {
            socket.emit("clientDisconnect", sessionStorage.getItem("clientId"));
        };
    }, []);

    useEffect(() => {
        axios
            .get("/api/connected")
            .then(({ data }) => {
                setConnectedClients(data.connected);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    return (
        <div id={styles.content}>
            <Link
                href={{ pathname: "/", query: { from: "waiting" } }}
                className="underline"
            >
                {t[lang]["back"]}
            </Link>

            <h1>{t[lang]["gameIntroduction"]}</h1>

            <div id={styles.instructions}>
                <p>{t[lang]["instructions1"]}</p>
                <p>{t[lang]["instructions2"]}</p>
                <p>{t[lang]["instructions3"]}</p>
                <p>{t[lang]["instructions4"]}</p>
            </div>

            <h3 style={{ textAlign: "center" }}>
                <div id={styles.waiting}>
                    <span className={styles.typewriter}>
                        {t[lang]["statusWaiting"]}...
                    </span>
                </div>
            </h3>
            <h3 style={{ textAlign: "center" }}>Connected: {connectedClients}</h3>
        </div>
    );
}
