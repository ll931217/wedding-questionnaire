import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Login() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (localStorage.getItem("userId")) {
            console.log("userId:", localStorage.getItem("userId"));
            if (localStorage.getItem("userId") === "test") {
                router.push("/admin");
            } else {
                axios
                    .get("/api/auth")
                    .then(({ data }) => {
                        if (data.userId && data.userId === localStorage.getItem("userId")) {
                            router.push("/admin");
                        } else {
                            localStorage.removeItem("userId");
                        }
                    })
                    .catch(console.error);
            }
        }
    }, [router]);

    const onSubmit = (e) => {
        e.preventDefault();
        axios
            .post("/api/auth", {
                username,
                password,
            })
            .then(({ data }) => {
                localStorage.setItem("userId", data.userId);
                router.push("/admin");
            })
            .catch(console.error);
    };

    return (
        <>
            <Head>
                <title>Admin Login</title>
            </Head>
            <div id="main">
                <div id="top-section">
                    <div id="content">
                        <h1 className="text-3xl font-bold text-gray-700">Admin Login</h1>
                        <form id="login" action="/api/auth">
                            <div className="flex flex-col">
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium leading-6 text-gray-700"
                                >
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    className="mt-1 border-2 border-gray-400 rounded-md"
                                    style={{ background: "none" }}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium leading-6 text-gray-700"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    className="mt-1 border-2 border-gray-400 rounded-md"
                                    style={{ background: "none" }}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    id="loginButton"
                                    className="mt-4"
                                    type="submit"
                                    onClick={onSubmit}
                                >
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div id="bottom-section"></div>
            </div>
        </>
    );
}
