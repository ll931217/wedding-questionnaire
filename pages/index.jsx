import Head from "next/head";

import Login from "../components/Login";
import { useEffect } from "react";

export default function Home() {
    useEffect(() => {
        sessionStorage.removeItem("answers");
    }, []);

    return (
        <>
            <Head>
                <title>Wedding Questionnaire</title>
            </Head>
            <div id="main">
                <div id="top-section">
                    <Login />
                </div>
                <div id="bottom-section"></div>
            </div>
        </>
    );
}
