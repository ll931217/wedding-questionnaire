import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import io from "socket.io-client";

import styles from "./GameInstructions.module.css";

let socket;

export default function GameInstructions() {
    const { t } = useTranslation();
    const [connectedClients, setConnectedClients] = useState(0);

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
                {t("back")}
            </Link>

            <h1>{t("gameIntroduction")}</h1>

            <div id={styles.instructions}>
                <p>{t("instructions1")}</p>
                <p>{t("instructions2")}</p>
                <p>{t("instructions3")}</p>
                <p>{t("instructions4")}</p>
            </div>

            <h3 style={{ textAlign: "center" }}>
                <div id={styles.waiting}>
                    <span className={styles.typewriter}>{t("statusWaiting")}...</span>
                </div>
            </h3>
            <h3 style={{ textAlign: "center" }}>Connected: {connectedClients}</h3>
        </div>
    );
}
