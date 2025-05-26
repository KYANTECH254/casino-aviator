"use client";

import { useEffect, useState } from "react";
import { useSession } from "./context/SessionProvider";
import { useAlert } from "@/context/AlertContext";

export default function Settings() {
    const { token } = useSession();
    const [loading, setLoading] = useState(false);
    const [edge, setEdge] = useState<any>();
    const [minbet, setMinBet] = useState<any>();
    const [maxbet, setMaxBet] = useState<any>();
    const [maxbetwin, setMaxBetWin] = useState<any>();
    const { addAlert } = useAlert();
    const [app, setApp] = useState<any>([])


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
                    setEdge((parseFloat(data.app.edge) * 100).toString())
                    setMinBet((data.app.minbet).toString())
                    setMaxBet((data.app.maxbet).toString())
                    setMaxBetWin((data.app.maxbetwin).toString())
                })
                .catch(error => {
                    addAlert("An error occured!", 3000, "red", 1, true);
                    console.log(error);
                })
        }
        fetchApp();
    }, [token])

    const handleUpdate = () => {
        if (!app.id) {
            return addAlert("All fields are required!", 3000, "red", 1, true);
        }
        if (parseFloat(edge) < 0 || parseFloat(edge) > 100) {
            return addAlert("Invalid value for edge!", 3000, "red", 1, true);
        }
        if (parseFloat(minbet) < 0 || parseFloat(maxbet) < 0 || parseFloat(maxbetwin) < 0) {
            return addAlert("Invalid value in provided fields!", 3000, "red", 1, true);
        }
        const data = {
            token: token,
            id: app.id,
            edge,
            minbet,
            maxbet,
            maxbetwin
        }
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/updateApp`, {
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
                addAlert(data.message, 3000, "green", 1, true);
            })
            .catch(error => {
                addAlert("An error occured!", 3000, "red", 1, true);
                console.log(error);
            })
    }

    return (
        <>
            <div className="admin-dashboard">
                <div className="space-between">
                    <h2>Settings</h2>
                </div>
                <div className="admin-card-section">
                    <form method="post" className="aviator-form">
                        <div className="column rowg1">
                            <label htmlFor="House Edge">House Edge (e.g 60%)</label>
                            <input value={edge || "0"} onChange={(e) => setEdge(e.target.value)} type="number" name="edge" id="edge" placeholder="Enter percentage" />
                        </div>
                        <div className="column rowg1">
                            <label htmlFor="MInimum Bet Amount">Minimum Bet Amount</label>
                            <input value={minbet || "0"} onChange={(e) => setMinBet(e.target.value)} type="number" name="minbet" id="minbet" placeholder="Enter amount" />
                        </div>
                        <div className="column rowg1">
                            <label htmlFor="Maximum Bet Amount">Maximum Bet Amount </label>
                            <input value={maxbet || "0"} onChange={(e) => setMaxBet(e.target.value)} type="number" name="maxbet" id="maxbet" placeholder="Enter amount" />
                        </div>
                        <div className="column rowg1">
                            <label htmlFor="Maximum Bet Win">Maximum Bet Win </label>
                            <input value={maxbetwin || "0"} onChange={(e) => setMaxBetWin(e.target.value)} type="number" name="maxbetwin" id="maxbetwin" placeholder="Enter amount" />
                        </div>
                        <button disabled={loading} onClick={handleUpdate} type="button">{loading ? 'Saving...' : 'Save'}</button>
                    </form>
                </div>
            </div>
        </>
    )
}