"use client";

import { useAlert } from "@/context/AlertContext";
import { useEffect, useRef, useState } from "react";
import { useSession } from "../context/SessionProvider";

export default function AddStation({ onClose }: { onClose: () => void; }) {
    const popupRef = useRef<HTMLDivElement>(null);
    const [name, setName] = useState("");
    const { addAlert } = useAlert();
    const [loading, setLoading] = useState(false);
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


    const AddStationF = async () => {
        if (!name) {
            addAlert("Station name is required!", 3000, "red", 1, true);
        }
        const data = {
            token: token,
            name: name,
        }
        setLoading(true)
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/addStation`, {
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
                    <div className="aviator-popup-header-left">Add Station</div>
                    <div onClick={onClose} id="aviator-avatar-popup-close" className="aviator-popup-header-right">
                        <i className="fa fa-times" aria-hidden="true"></i>
                    </div>
                </div>
                <div className="aviator-avatar-popup-body">
                    <form method="post" className="aviator-form">
                        <label htmlFor="Station Name">Station Name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} type="text" name="name" id="name" placeholder="Enter station name" />
                        <button onClick={AddStationF} type="button">{loading ? 'Creating...' : 'Add'}</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
