"use client";

import { useEffect, useState } from "react";
import { useSession } from "./context/SessionProvider";
import { useAlert } from "@/context/AlertContext";

export default function Bets() {
    const { token } = useSession();
    const [bets, setBets] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const { addAlert } = useAlert();

    useEffect(() => {
        if (token === "") return;
        const fetchStations = async () => {
            const data = {
                token: token,
            }
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fetchBets`, {
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
                    setBets(data.bets)
                })
                .catch(error => {
                    addAlert("An error occured!", 3000, "red", 1, true);
                    console.log(error);
                })
        }
        fetchStations();
    }, [token])

    const handleDelete = async (id: number) => {
        if (!id) {
            addAlert("Missing ID is required!", 3000, "red", 1, true);
        }
        const data = {
            token: token,
            id: id
        }
        setLoading(true)
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deleteBet`, {
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
                setBets(bets.filter((s: any) => parseInt(s.id) !== id))
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
        <>
            <div className="admin-dashboard">
                <div className="space-between">
                    <h2>Bets</h2>
                </div>


                <div className="admin-card-section">
                    {bets.length === 0 && (
                        <h3>No Bets available</h3>
                    )}
                    <div className="table-cards-container">
                        <div className="table-admin-card-header row colg1 space-between">
                            <div className="info">Username</div>
                            <div className="info">User ID</div>
                            <div className="info">Amount</div>
                            <div className="info">Multiplier</div>
                            <div className="info">Profit</div>
                            <div className="info">Status</div>
                            <div className="info">Action</div>
                        </div>
                        {bets
                            .slice()
                            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .map((s: any) => (
                                <div key={s.id} className="table-admin-card-body column">
                                    <div className="table-admin-card row space-between">
                                        <div className="info">{s.username || 'Anonymous'}</div>
                                        <div className="info">{s.code || 'N/A'}</div>
                                        <div className="info"> {(s.bet_amount).toFixed(2)} {s.currency || ''}</div>
                                        <div className={`aviator-bets-multiplier ${parseFloat(s.multiplier) < 2 ? "small" : parseFloat(s.multiplier) > 2 ? "medium" : "large"}`}> {s.multiplier}</div>
                                        <div className="info"> {(s.profit).toFixed(2)}</div>
                                        <div className={`info ${s.status === "won" ? "green" : "red"}`}> {s.status}</div>
                                        <i
                                            onClick={() => handleDelete(s.id)}
                                            className="fa fa-trash"
                                            style={{ color: 'red', fontSize: '20px', cursor: 'pointer' }}
                                        ></i>
                                    </div>
                                </div>
                            ))}
                    </div>


                </div>
            </div>
        </>
    )
}