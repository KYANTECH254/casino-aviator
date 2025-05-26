"use client";

import { useEffect, useState } from "react";
import { useSession } from "./context/SessionProvider";
import { useRouter } from "next/navigation";
import AddScreen from "./PopUps/AddScreen";
import AddStation from "./PopUps/AddStation";
import AddUser from "./PopUps/AddUser";
import RechargeUser from "./PopUps/RechargeUser";
import Withdraw from "./PopUps/Withdraw";

export default function DashBoard() {
    const [popup, setPopUp] = useState<string>("")
    const { Authenticated, account } = useSession();
    const router = useRouter();

    return (
        <>
            <div className="admin-dashboard">
                <h2>Overview</h2>
                <div className="admin-card-section">
                    <div className="admin-card column">
                        <div className="text">KSH {account?.balance}</div>
                        <div className="info">Profit Today</div>
                    </div>
                    <div className="admin-card column">
                        <div className="text">KSH {account?.yesterbalance}</div>
                        <div className="info">Profit Yesterday</div>
                    </div>
                    <div className="admin-card column">
                        <div className="text">KSH {account?.deposits}</div>
                        <div className="info">Deposits Today</div>
                    </div>
                    <div className="admin-card column">
                        <div className="text">KSH {account?.withdrawals}</div>
                        <div className="info">Withdrawals Today</div>
                    </div>
                    <div className="admin-card column">
                        <div className="text">{account?.betstoday}</div>
                        <div className="info">Bets Today</div>
                    </div>
                    <div className="admin-card column">
                        <div className="text">{account?.wonbetstoday}</div>
                        <div className="info">Bets Won Today</div>
                    </div>
                    <div className="admin-card column">
                        <div className="text">{account?.lostbetstoday}</div>
                        <div className="info">Bets Lost Today</div>
                    </div>

                    <div className="admin-card column">
                        <div className="text">{account?.stations}</div>
                        <div className="info">Stations</div>
                    </div>
                    <div className="admin-card column">
                        <div className="text">{account?.screens}</div>
                        <div className="info">Screens</div>
                    </div>
                    <div className="admin-card column">
                        <div className="text">{account?.users}</div>
                        <div className="info">Users</div>
                    </div>
                </div>
                <h2>Quick Action</h2>
                <div className="admin-card-section">
                    <div className="action-card" onClick={() => setPopUp("recharge")}>
                        <div className="text">Recharge User</div>
                        <div className=""><i className="fa fa-plus orange"></i></div>
                    </div>
                    <div className="action-card" onClick={() => setPopUp("withdraw")}>
                        <div className="text">Withdraw User Funds</div>
                        <div className=""><i className="fa fa-minus orange"></i></div>
                    </div>
                    <div className="action-card" onClick={() => setPopUp("screen")}>
                        <div className="text">Add Screen</div>
                        <div className=""><i className="fa fa-plus orange"></i></div>
                    </div>
                    <div className="action-card" onClick={() => setPopUp("station")}>
                        <div className="text">Add Station</div>
                        <div className=""><i className="fa fa-plus orange"></i></div>
                    </div>
                    <div className="action-card" onClick={() => setPopUp("user")}>
                        <div className="text">Add User</div>
                        <div className=""><i className="fa fa-plus orange"></i></div>
                    </div>
                </div>
                {popup === "screen" && (<AddScreen onClose={() => setPopUp("")} />)}
                {popup === "station" && (<AddStation onClose={() => setPopUp("")} />)}
                {popup === "user" && (<AddUser onClose={() => setPopUp("")} />)}
                {popup === "recharge" && (<RechargeUser onClose={() => setPopUp("")} />)}
                {popup === "withdraw" && (<Withdraw onClose={() => setPopUp("")} />)}

            </div>
        </>
    )
}