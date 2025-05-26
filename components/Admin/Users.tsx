"use client";

import { useEffect, useState } from "react";
import { useSession } from "./context/SessionProvider";
import { useAlert } from "@/context/AlertContext";
import AddUser from "./PopUps/AddUser";

export default function Users() {
    const [popup, setPopUp] = useState<string>("")
    const { token } = useSession();
    const [users, setUsers] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const { addAlert } = useAlert();

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

    const handleDelete = async (id: number) => {
        if (!id) {
            return addAlert("Missing ID is required!", 3000, "red", 1, true);
        }
        const data = {
            token: token,
            id: id
        }
        setLoading(true)
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deleteUser`, {
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
                setUsers(users.filter((s: any) => parseInt(s.id) !== id))
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
                    <h2>Users</h2>
                    <button onClick={() => setPopUp("user")} type="button" className="primary-btn">
                        Add User
                        <i className="fa fa-plus"></i>
                    </button>
                </div>


                <div className="admin-card-section">
                    {users.length === 0 && (
                        <h3>No Users available</h3>
                    )}
                    {users.map((s: any) => (
                        <div key={s.id} className="admin-card column">
                            <div className="text">{s.username} : {s.currency} {s.balance}</div>
                            <div className="info">{s.screen}</div>
                            <div className="info">{s.userId}</div>
                            <div className="info">{new Date(s.createdAt).toLocaleString()}</div>
                            <div className="space-between mt1">
                                <i onClick={() => handleDelete(s.id)} className="fa fa-trash" style={{ color: "red", fontSize: "24px" }}></i>
                            </div>
                        </div>
                    ))}

                </div>
                {popup === "user" && (<AddUser onClose={() => setPopUp("")} />)}
            </div>
        </>
    )
}