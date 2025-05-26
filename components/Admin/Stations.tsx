"use client";

import { useEffect, useState } from "react";
import { useSession } from "./context/SessionProvider";
import AddStation from "./PopUps/AddStation";
import { useAlert } from "@/context/AlertContext";

export default function Stations() {
    const [popup, setPopUp] = useState<string>("")
    const { token } = useSession();
    const [stations, setStations] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [station, setStation] = useState("");
    const { addAlert } = useAlert();

    useEffect(() => {
        if (token === "") return;
        const fetchStations = async () => {
            const data = {
                token: token,
            }
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fetchStations`, {
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
                    setStations(data.stations)
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
            return addAlert("Missing ID is required!", 3000, "red", 1, true);
        }
        const data = {
            token: token,
            id: id
        }
        setLoading(true)
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deleteStation`, {
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
                setStations(stations.filter((s: any) => parseInt(s.id) !== id))
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
                    <h2>Stations</h2>
                    <button onClick={() => setPopUp("station")} type="button" className="primary-btn">
                        Add Station
                        <i className="fa fa-plus"></i>
                    </button>
                </div>


                <div className="admin-card-section">
                    {stations.length === 0 && (
                        <h3>No Stations available</h3>
                    )}
                    {stations.map((s: any) => (
                        <div key={s.id} className="admin-card column">
                            <div className="text">{s.name}</div>
                            <div className="info">Screens : {s.screens}</div>
                            <div className="space-between mt1">
                                <i onClick={() => handleDelete(s.id)} className="fa fa-trash" style={{ color: "red", fontSize: "24px" }}></i>
                            </div>
                        </div>
                    ))}

                </div>
                {popup === "station" && (<AddStation onClose={() => setPopUp("")} />)}
            </div>
        </>
    )
}