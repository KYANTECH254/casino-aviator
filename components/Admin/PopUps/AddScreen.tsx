"use client";

import { useAlert } from "@/context/AlertContext";
import { useEffect, useRef, useState } from "react";
import { useSession } from "../context/SessionProvider";

export default function AddScreen({ onClose }: { onClose: () => void; }) {
    const popupRef = useRef<HTMLDivElement>(null);
    const [name, setName] = useState("");
    const { addAlert } = useAlert();
    const [loading, setLoading] = useState(false);
    const [stations, setStations] = useState<any>([]);
    const [station, setStation] = useState("");
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
    }, [])

    const AddScreenF = async () => {
        if (!name) {
            addAlert("Screen name is required!", 3000, "red", 1, true);
        }
        const data = {
            token: token,
            name: name,
            stationId: station
        }
        setLoading(true)
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/addScreen`, {
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
                    <div className="aviator-popup-header-left">Add Screen</div>
                    <div onClick={onClose} id="aviator-avatar-popup-close" className="aviator-popup-header-right">
                        <i className="fa fa-times" aria-hidden="true"></i>
                    </div>
                </div>
                <div className="aviator-avatar-popup-body">
                    <form method="post" className="aviator-form">
                        <label htmlFor="Screen Name">Station</label>
                        {stations.length === 0 ? (
                            <h4>No Stations found, add station first!</h4>
                        ) : (
                            <>
                                <select name="Station" id="Station" onChange={(e) => setStation(e.target.value)} required>
                                    <option value="">--Choose Station--</option>
                                    {stations.map((s: any) => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </>
                        )}
                        <label htmlFor="Screen Name">Screen Name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} type="text" name="name" id="name" placeholder="Enter screen name" />
                        <button onClick={AddScreenF} type="button">{loading ? 'Creating...' : 'Add'}</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
