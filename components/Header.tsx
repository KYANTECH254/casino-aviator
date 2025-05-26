"use client"

import { useEffect, useState } from "react";
import GameLimits from "./PopUps/GameLimits";
import Avatar from "./PopUps/Avatar";
import GameRules from "./PopUps/GameRules";
import HowToPlay from "./PopUps/HowToPlay";
import { useSettings } from "@/context/SettingsContext";
import MyBetHistory from "./PopUps/MyBetHistory";
import Accounts from "./PopUps/FreeBets";

interface HeaderProps {
    accounts: any[];
    username: any;
    avatar: string | null;
    onAvatarUpdate: (newAvatar: string) => void;
}

export default function Header({
    accounts,
    username,
    avatar,
    onAvatarUpdate,
}: HeaderProps) {
    const { isMusicEnabled, isSoundEnabled, isAnimationEnabled, toggleMusic, toggleSound, toggleAnimation } = useSettings();
    const [activeTab, setActiveTab] = useState<string>("");
    const [bal, setBal] = useState(0)

    useEffect(() => {
        let balance = 0;
        for (const acc of accounts) {
            balance += acc.balance
        }
        setBal(balance)
    }, [accounts])

    const handleTabClick = (tabName: string) => {
        setActiveTab((prevTab) => (prevTab === tabName ? "" : tabName));
    };

    return (
        <>
            <header className="aviator-heading">
                <div className="aviator-heading-left">
                    <div className="aviator-heading-logo">
                        <img src="assets/images/logo.png" alt="Aviator" />
                    </div>
                    <div
                        id="howtoplay-btn"
                        className="aviator-heading-1"
                        onClick={() => handleTabClick('HowToPlay')}
                    >
                        <i className="fa fa-question-circle-o" style={{ marginRight: "5px", fontSize: "20px" }} aria-hidden="true"></i>
                        How to play?
                    </div>
                    <div
                        id="howtoplay-mobbtn"
                        className="aviator-mobheading-1"
                        onClick={() => handleTabClick('HowToPlay')}
                    >
                        <i className="fa fa-question-circle-o" style={{ marginRight: "5px", fontSize: "20px" }} aria-hidden="true"></i>
                    </div>
                </div>
                <div className="aviator-heading-right">
                    <div className="aviator-heading-balance">
                        <span id="balance">{bal.toLocaleString('en-US')}</span>
                        <span className="aviator-heading-currency" id="currency">KSH</span>
                    </div>
                    <div className="aviator-heading-separator">|</div>
                    <div onClick={() => handleTabClick('SubMenu')} className="aviator-heading-submenu-btn" id="toggle-submenu">
                        <i className="fa fa-bars" aria-hidden="true"></i>
                    </div>

                </div>

                {activeTab === 'SubMenu' &&
                    <div className="aviator-heading-submenu">
                        <div className="aviator-submenu-avatar">
                            <div className="aviator-avatar-img">
                                <img
                                    id="avatar"
                                    src={avatar || "assets/images/av-1.png"}
                                    alt="Avatar"
                                />
                                <div className="aviator-submenu-username" id="username">{username.username}</div>
                            </div>
                            <div
                                id="avatar-popup-btn"
                                className="aviator-submenu-avatar-btn"
                                onClick={() => handleTabClick('Avatar')}
                            >
                                <i className="fa fa-user-circle-o" aria-hidden="true"></i>
                                <div className="aviator-submenu-avatar-text">Change Avatar</div>
                            </div>
                        </div>

                        <div className="aviator-menu-section-1">
                            <div className="aviator-menu-listitems">
                                <div className="aviator-menu-item">
                                    <div className="aviator-menu-left-item">
                                        <i className="fa fa-volume-up aviator-van-icon" aria-hidden="true"></i>
                                        <div className="aviator-menu-left-item-text">Sound</div>
                                    </div>
                                    <div className="aviator-menu-right-item">
                                        <div className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                id="toggle1"
                                                checked={isSoundEnabled}
                                                onChange={toggleSound}
                                            />
                                            <label htmlFor="toggle1" className="slider"></label>
                                        </div>
                                    </div>
                                </div>
                                <div className="aviator-submenu-item-separator"></div>
                                <div className="aviator-menu-item">
                                    <div className="aviator-menu-left-item">
                                        <i className="fa fa-music aviator-van-icon" aria-hidden="true"></i>
                                        <div className="aviator-menu-left-item-text">Music</div>
                                    </div>
                                    <div className="aviator-menu-right-item">
                                        <div className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                id="toggle2"
                                                checked={isMusicEnabled}
                                                onChange={toggleMusic}
                                            />
                                            <label htmlFor="toggle2" className="slider"></label>
                                        </div>
                                    </div>
                                </div>
                                <div className="aviator-submenu-item-separator"></div>
                                <div className="aviator-menu-item">
                                    <div className="aviator-menu-left-item">
                                        <i className="fa fa-plane aviator-van-icon" aria-hidden="true"></i>
                                        <div className="aviator-menu-left-item-text">Animation</div>
                                    </div>
                                    <div className="aviator-menu-right-item">
                                        <div className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                id="toggle3"
                                                checked={isAnimationEnabled}
                                                onChange={toggleAnimation} />
                                            <label htmlFor="toggle3" className="slider"></label>
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
                                    onClick={() => handleTabClick('Accounts')}
                                >
                                    <div className="aviator-menu-left-item">
                                        <i className="fa fa-lock aviator-van-icon" aria-hidden="true"></i>
                                        <div className="aviator-menu-left-item-text">My Accounts</div>
                                    </div>
                                </div>
                                <div className="aviator-submenu-item-separator"></div>

                                <div className="aviator-submenu-item-separator"></div>
                                <div
                                    id="aviator-rules-btn"
                                    className="aviator-menu-item"
                                    onClick={() => handleTabClick('GameRules')}
                                >
                                    <div className="aviator-menu-left-item">
                                        <i className="fa fa-book aviator-van-icon" aria-hidden="true"></i>
                                        <div className="aviator-menu-left-item-text">Game Rules</div>
                                    </div>
                                </div>
                                <div className="aviator-submenu-item-separator"></div>
                                <div
                                    id="aviator-bethistory-btn"
                                    className="aviator-menu-item"
                                    onClick={() => handleTabClick('MyBetHistory')}
                                >
                                    <div className="aviator-menu-left-item">
                                        <i className="fa fa-history aviator-van-icon" aria-hidden="true"></i>
                                        <div className="aviator-menu-left-item-text">My Bet History</div>
                                    </div>
                                </div>
                                <div className="aviator-submenu-item-separator"></div>
                                <div
                                    id="aviator-gamelimits-btn"
                                    className="aviator-menu-item"
                                    onClick={() => handleTabClick('GameLimits')}
                                >
                                    <div className="aviator-menu-left-item">
                                        <i className="fa fa-money aviator-van-icon" aria-hidden="true"></i>
                                        <div className="aviator-menu-left-item-text">Game Limits</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="aviator-menu-section-bottom">
                            <i className="fa fa-home" aria-hidden="true"></i>
                            <a className="home-link" href="https://topwebtools.online">
                                <div className="aviator-menu-section-bottom-text">Home</div>
                            </a>
                        </div>
                    </div>
                }

            </header>

            {activeTab === "HowToPlay" && <HowToPlay onClose={() => setActiveTab("")} />}
            {activeTab === "Avatar" && <Avatar onClose={() => setActiveTab("")} onAvatarUpdate={onAvatarUpdate} />}
            {activeTab === "GameRules" && <GameRules onClose={() => setActiveTab("")} />}
            {activeTab === "MyBetHistory" && <MyBetHistory onClose={() => setActiveTab("")} />}
            {activeTab === "GameLimits" && <GameLimits onClose={() => setActiveTab("")} />}
            {activeTab === "Accounts" && <Accounts onClose={() => setActiveTab("")} />}
        </>
    );
}
