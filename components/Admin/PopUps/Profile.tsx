"use client";

import { useAlert } from "@/context/AlertContext";
import { useEffect, useRef, useState } from "react";
import { useSession } from "../context/SessionProvider";

export default function Profile({ onClose }: { onClose: () => void; }) {
    const popupRef = useRef<HTMLDivElement>(null);
    const { token, account } = useSession();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [platformId, setPlatformId] = useState("")
    const { addAlert } = useAlert();

    const handleOutsideClick = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            onClose();
        }
    };
    useEffect(() => {
        setEmail(account?.email)
        setPlatformId(account?.platformId)
        setPhone(account?.phoneNumber)   
    }, [account])

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const UpdateUserF = () => {
        if (phone.length < 10) {
            return addAlert("Invalid phone number!", 3000, "red", 1, true);
        }
        setLoading(true)
        const data = {
            token: token,
            email:email,
            phoneNumber:phone
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
                    <div className="aviator-popup-header-left">User Profile</div>
                    <div onClick={onClose} id="aviator-avatar-popup-close" className="aviator-popup-header-right">
                        <i className="fa fa-times" aria-hidden="true"></i>
                    </div>
                </div>
                <div className="aviator-avatar-popup-body">
                    <form method="post" className="aviator-form">
                        <label htmlFor="Email">Email</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" readOnly />
                        <label htmlFor="Phone">Phone</label>
                        <input value={phone} onChange={(e) => setPhone(e.target.value)} type="phone" name="phone" placeholder="Enter phone" />
                        <label htmlFor="Platform Id">Platform Id</label>
                        <input value={platformId} onChange={(e) => setPlatformId(e.target.value)} type="text" name="platformId" readOnly />
                        <button onClick={UpdateUserF} type="button">{loading ? 'Saving...' : 'Save'}</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
