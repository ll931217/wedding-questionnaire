import Head from "next/head";

import Login from "../components/Login";

export default function Home() {
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
