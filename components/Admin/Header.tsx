"use client";

import { useEffect, useState } from "react";
import { useSession } from "./context/SessionProvider";
import { useAlert } from "@/context/AlertContext";
import { connected } from "process";
import Profile from "./PopUps/Profile";
import ChangePasword from "./PopUps/Password";

export default function Header() {
    const [activeTab, setActiveTab] = useState<string>("");
    const [isBettingEnabled, setisBettingEnabled] = useState<boolean>(false)
    const [app, setApp] = useState<any>([])
    const { account, token } = useSession();
    const { addAlert } = useAlert();

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
                    setisBettingEnabled(data.app.connected === 1)
                    setApp(data.app)
                })
                .catch(error => {
                    addAlert("An error occured!", 3000, "red", 1, true);
                    console.log(error);
                })
        }
        fetchApp();
    }, [token])

    const handleTabClick = (tabName: string) => {
        setActiveTab((prevTab) => (prevTab === tabName ? "" : tabName));
    };

    const toggleBetting = () => {
        setisBettingEnabled((prev) => !prev)
        if (!app.id) {
            return addAlert("All fields are required!", 3000, "red", 1, true);
        }
        const data = {
            token: token,
            connected: isBettingEnabled ? 0 : 1,
            id: app.id
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
            <header className="aviator-heading">
                <div className="aviator-heading-left flex flex-row items-center gap-2">
                    <div className="aviator-heading-logo ">
                        <img src="/assets/images/logo.png" alt="Aviator" />
                    </div>
                    <span className="text">Portal</span>
                </div>
                <div className="aviator-heading-right">
                    <div className="aviator-heading-balance">
                        <span className="text">PROFIT TODAY</span>
                        <span id="balance">{account?.balance}</span>
                        <span className="aviator-heading-currency" id="currency">KSH</span>
                    </div>
                    <div className="aviator-heading-separator">|</div>
                    <div onClick={() => handleTabClick('SubMenu')} className="aviator-heading-submenu-btn" id="toggle-submenu">
                        <i className="fa fa-bars" aria-hidden="true"></i>
                    </div>
                </div>

                {activeTab === 'SubMenu' &&
                    <div className="aviator-heading-submenu">
                        <div className="aviator-menu-section-1">
                            <div className="aviator-menu-listitems">
                                <div className="aviator-menu-item">
                                    <div className="aviator-menu-left-item">
                                        <i className="fa fa-lock aviator-van-icon" aria-hidden="true"></i>
                                        <div className="aviator-menu-left-item-text">Disable Betting</div>
                                    </div>
                                    <div className="aviator-menu-right-item">
                                        <div className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                id="toggle1"
                                                checked={!isBettingEnabled}
                                                onChange={toggleBetting}
                                            />
                                            <label htmlFor="toggle1" className="slider"></label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="aviator-menu-section-separator"></div>
                        <div className="aviator-menu-section-2">
                            <div className="aviator-menu-listitems">
                                <div
                                    id="free-bets-btn"
                                    className="aviator-menu-item"
                                    onClick={() => handleTabClick('Profile')}
                                >
                                    <div className="aviator-menu-left-item">
                                        <i className="fa fa-user aviator-van-icon" aria-hidden="true"></i>
                                        <div className="aviator-menu-left-item-text">My Profile</div>
                                    </div>
                                </div>
                                <div className="aviator-submenu-item-separator"></div>


                                <div className="aviator-submenu-item-separator"></div>
                                <div
                                    id="aviator-gamelimits-btn"
                                    className="aviator-menu-item"
                                    onClick={() => handleTabClick('Change Password')}
                                >
                                    <div className="aviator-menu-left-item">
                                        <i className="fa fa-edit aviator-van-icon" aria-hidden="true"></i>
                                        <div className="aviator-menu-left-item-text">Change Password</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="aviator-menu-section-bottom">
                            <i className="fa fa-home" aria-hidden="true"></i>
                            <a className="home-link" href="/admin">
                                <div className="aviator-menu-section-bottom-text">Home</div>
                            </a>
                        </div>
                    </div>
                }
            </header>
            {activeTab === "Profile" && <Profile onClose={() => setActiveTab("")} />}
            {activeTab === "Change Password" && <ChangePasword onClose={() => setActiveTab("")} />}

        </>
    )
}