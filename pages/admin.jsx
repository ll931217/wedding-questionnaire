import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Admin() {
    const router = useRouter();

    // Check whether the user is logged in and check if id is valid
    useEffect(() => {
        if (!localStorage.getItem("userId")) {
            router.push("/login");
        }

        axios
            .get("/api/auth")
            .then(({ data }) => {
                if (!data.userId || data.userId !== localStorage.getItem("userId")) {
                    localStorage.removeItem("userId");
                    router.push("/login");
                }
            })
            .catch(console.log);
    }, [router]);

    /**
     * Features of admin page:
     *
     * 1. Start game
     * 2. Set next question
     * 3. End game
     * 4. Check results
     */
    return <div>Admin</div>;
}
