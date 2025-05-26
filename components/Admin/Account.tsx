"use client";

import { useAlert } from "@/context/AlertContext";
import { useState } from "react";
import { useSession } from "./context/SessionProvider";
import { useRouter } from "next/navigation";

export default function Account() {
    const { addAlert } = useAlert();
    const { login } = useSession();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const LoginUser = async () => {
        if (!email || !password) {
            addAlert("Email and password are required!", 3000, "red", 1, true);
        }
        const data = {
            email: email,
            password: password
        }
        setLoading(true)
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/loginAdmin`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    addAlert(data.message, 3000, "red", 1, true);
                    return;
                }
                login(data.token, data.account)
                setLoading(false)
                addAlert(data.message, 3000, "green", 1, true);
                router.push("/admin");
            })
            .catch(error => {
                addAlert("An error occured!", 3000, "red", 1, true);
                setLoading(false)
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <>
            <div className="aviator-popup-page">
                <div className="aviator-popup">
                    <div className="aviator-popup-header">
                        <div className="aviator-popup-header-left">LOGIN TO PORTAL</div>
                    </div>
                    <div className="aviator-avatar-popup-body">
                        <form method="post" className="aviator-form">
                            <label htmlFor="Email">Email</label>
                            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" placeholder="Enter email" />
                            <label htmlFor="Password">Password</label>
                            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" name="password" placeholder="Enter password" />
                            <button onClick={(LoginUser)} type="button">{loading ? 'Checking...' : 'Continue'}</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
