"use client";

import { useAlert } from "@/context/AlertContext";
import { useEffect, useRef, useState } from "react";
import { useSession } from "../context/SessionProvider";

export default function ChangePasword({ onClose }: { onClose: () => void; }) {
    const popupRef = useRef<HTMLDivElement>(null);
    const { token, account } = useSession();
    const [loading, setLoading] = useState(false);
    const [showpassword, setShowPassword] = useState(false)
    const [password, setPassword] = useState("")
    const [cpassword, setCpassword] = useState("")
    const { addAlert } = useAlert();

    const handleOutsideClick = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            onClose();
        }
    };


    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const UpdateUserF = () => {
        if (password.length < 6) {
            return addAlert("Invalid password 6 characters required!", 3000, "red", 1, true);
        }
        setLoading(true)
        const data = {
            token: token,
            email: account.email,
            password,
            cpassword
        }
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/updateAdmin`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    addAlert(data.message, 3000, "red", 1, true);
                    setLoading(false)
                    return;
                }
                setLoading(false)
                addAlert(data.message, 3000, "green", 1, true);
            })
            .catch(error => {
                addAlert("An error occured!", 3000, "red", 1, true);
                console.log(error);
                setLoading(false)
            })
    }

    return (
        <div id="aviator-avatar-tab" className="aviator-popup-container">
            <div ref={popupRef} className="aviator-avatar-popup">
                <div className="aviator-popup-header">
                    <div className="aviator-popup-header-left">Change User Password</div>
                    <div onClick={onClose} id="aviator-avatar-popup-close" className="aviator-popup-header-right">
                        <i className="fa fa-times" aria-hidden="true"></i>
                    </div>
                </div>
                <div className="aviator-avatar-popup-body">
                    <form method="post" className="aviator-form">
                        <label htmlFor="Current Password">Current Password</label>
                        <input value={cpassword} onChange={(e) => setCpassword(e.target.value)} type={showpassword ? "text" : "password"} name="password" placeholder="Enter current password" />
                        <label htmlFor="New Password">New Password</label>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} type={showpassword ? "text" : "password"} name="password" placeholder="Enter new password" />
                        <div onClick={() => setShowPassword((prev) => !prev)} className="row colg1 orange">{showpassword ? 'Hide Password' : 'Show Password'} <i className="fa fa-eye" aria-hidden="true"></i></div>
                        <button onClick={UpdateUserF} type="button">{loading ? 'Saving...' : 'Change'}</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
