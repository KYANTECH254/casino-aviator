"use client";

import { useAlert } from "@/context/AlertContext";
import { useEffect, useRef, useState } from "react";
import { useSession } from "../context/SessionProvider";
import { validateAmount } from "@/lib/Functions";

export default function RechargeUser({ onClose }: { onClose: () => void; }) {
    const popupRef = useRef<HTMLDivElement>(null);
    const [balance, setBalance] = useState("0");
    const { addAlert } = useAlert();
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<any>([]);
    const [screens, setScreens] = useState<any>([]);
    const [station, setStation] = useState("");
    const [screen, setScreen] = useState("");
    const { token } = useSession();

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

    useEffect(() => {
        if (screen) {
            const selectedusers = users.filter((user: any) => user.screen === screen);
            setUsers(selectedusers)
        }
    }, [station, screen])

    useEffect(() => {
        const fetchScreens = async () => {
            const data = {
                token: token,
            }
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fetchScreens`, {
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
                    setScreens(data.screens)
                })
                .catch(error => {
                    addAlert("An error occured!", 3000, "red", 1, true);
                    console.log(error);
                })
        }
        fetchScreens();
    }, [])

    useEffect(() => {
        if (token === "") return;
        const fetchUsers = async () => {
            const data = {
                token: token,
            }
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fetchUsers`, {
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
                    setUsers(data.users)
                })
                .catch(error => {
                    addAlert("An error occured!", 3000, "red", 1, true);
                    console.log(error);
                })
        }
        fetchUsers();
    }, [token])

    const EditUserF = async () => {
        if (!balance || !station) {
            return addAlert("All fields are required!", 3000, "red", 1, true);
        }
        if (!validateAmount(balance)) {
            return addAlert("Invalid amount!", 3000, "red", 1, true);
        }
        const data = {
            token: token,
            balance: balance,
            id: station,
            type:"deposit"
        }
        setLoading(true)
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/updateUser`, {
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
                onClose()
                setLoading(false)
                addAlert(data.message, 3000, "green", 1, true);
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
        <div id="aviator-avatar-tab" className="aviator-popup-container">
            <div ref={popupRef} className="aviator-avatar-popup">
                <div className="aviator-popup-header">
                    <div className="aviator-popup-header-left">RECHARGE USER ACCOUNT</div>
                    <div onClick={onClose} id="aviator-avatar-popup-close" className="aviator-popup-header-right">
                        <i className="fa fa-times" aria-hidden="true"></i>
                    </div>
                </div>
                <div className="aviator-avatar-popup-body">
                    <form method="post" className="aviator-form">
                        <label htmlFor="Screen">Screen</label>
                        {screens.length === 0 ? (
                            <h4>No Screens found, add screens first!</h4>
                        ) : (
                            <>
                                <select name="Screen" id="Screen" onChange={(e) => setScreen(e.target.value)} required>
                                    <option value="">--Choose Screen--</option>
                                    {screens.map((s: any) => (
                                        <option key={s.name} value={s.name}>{s.name}</option>
                                    ))}
                                </select>
                            </>
                        )}
                        <label htmlFor="User">User</label>
                        {users.length === 0 ? (
                            <h4>No Users found, add users first!</h4>
                        ) : (
                            <>
                                <select name="User" id="User" onChange={(e) => setStation(e.target.value)} required>
                                    <option value="">--Choose User--</option>
                                    {users.map((s: any) => (
                                        <option key={s.id} value={s.id}>{s.username}: {s.currency} {s.balance}</option>
                                    ))}
                                </select>
                            </>
                        )}
                        <label htmlFor="Deposit Amount">Deposit Amount</label>
                        <input value={balance} onChange={(e) => setBalance(e.target.value)} type="number" name="balance" id="balance" placeholder="Enter amount" />
                        <button disabled={station === "" || balance === ""} onClick={EditUserF} type="button">{loading ? 'Processing...' : 'Deposit'}</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
