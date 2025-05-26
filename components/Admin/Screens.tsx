"use client";

import { useEffect, useState } from "react";
import { useSession } from "./context/SessionProvider";
import { useAlert } from "@/context/AlertContext";
import AddScreen from "./PopUps/AddScreen";

export default function Screens() {
    const [popup, setPopUp] = useState<string>("")
    const { token, account } = useSession();
    const [loading, setLoading] = useState(false);
    const [screens, setScreens] = useState<any>([]);
    const { addAlert } = useAlert();
 const [app, setApp] = useState<any>([])

    useEffect(() => {
        if (token === "") return;
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
    }, [token])

    useEffect(() => {
        if (token === "") return;
        const fetchApp = async () => {
            const data = {
                token: token,
            }
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fetchApp`, {
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
                    setApp(data.app)
                })
                .catch(error => {
                    addAlert("An error occured!", 3000, "red", 1, true);
                    console.log(error);
                })
        }
        fetchApp();
    }, [token])
    const handleDelete = async (id: number) => {
        if (!id) {
            return addAlert("Missing ID is required!", 3000, "red", 1, true);
        }
        const data = {
            token: token,
            id: id
        }
        setLoading(true)
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deleteScreen`, {
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
                setScreens(screens.filter((s: any) => s.id === id))
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

    const handleCopy = async (screen: any) => {
        const url = `/?apiKey=${app.apiKey}&platform=${app.platform}&platformId=${account.platformId}&screen=${screen.name}`
        navigator.clipboard.writeText(`${window.location.origin}${url}`);
        addAlert("Screen Url copied!", 3000, "green", 1, true);
    }

    return (
        <>
            <div className="admin-dashboard">
                <div className="space-between">
                    <h2>Screens</h2>
                    <button onClick={() => setPopUp("screen")} type="button" className="primary-btn">
                        Add Screen
                        <i className="fa fa-plus"></i>
                    </button>
                </div>


                <div className="admin-card-section">
                    {screens.length === 0 && (
                        <h3>No Screens available</h3>
                    )}
                    {screens.map((s: any) => (
                        <div key={s.id} className="admin-card column">
                            <div className="text">{s.name}</div>
                            <div className="info">{s.station}</div>
                            <div className="space-between mt1">
                                <i onClick={() => handleCopy(s)} className="fa fa-clipboard" style={{ fontSize: "20px" }}></i>
                                <i onClick={() => handleDelete(s.id)} className="fa fa-trash" style={{ color: "red", fontSize: "24px" }}></i>
                            </div>
                        </div>
                    ))}

                </div>
                {popup === "screen" && (<AddScreen onClose={() => setPopUp("")} />)}
            </div>
        </>
    )
}