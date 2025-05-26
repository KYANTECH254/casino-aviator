"use client"

import { useSession } from "@/context/SessionProvider";
import { useEffect, useRef } from "react";

export default function Accounts({ onClose }: any) {
    const popupRef = useRef<HTMLDivElement>(null);
    const { accounts } = useSession()

    const handleOutsideClick = (event: any) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    return (
        <div id="aviator-freebets-tab" className="aviator-popup-container">
            <div ref={popupRef} className="aviator-freebets-popup">
                <div className="aviator-popup-header">
                    <div className="aviator-popup-header-left">MY ACCOUNTS</div>
                    <div onClick={onClose} id="aviator-popup-close" className="aviator-popup-header-right">
                        <i className="fa fa-times" aria-hidden="true"></i>
                    </div>
                </div>
                <div id="free-bets-tab" className="aviator-popup-freebets-body">
                    <div className="aviator-popup-freebets-body-container display-center">
                        <div className="aviator-popup-freebets-body-container-bottom display-center">
                            {accounts.length === 0 ? (
                                <div className="no-accounts-message">
                                    No accounts available
                                </div>
                            ) : (
                                accounts
                                .sort((a, b) => parseFloat(a.userId) - parseFloat(b.userId))
                                .map((account) => (
                                    <div
                                        key={account.userId}
                                        className={`aviator-popup-accounts-box selected display-center`}
                                    >
                                        {account.username} : {account.userId} : {(account.balance).toLocaleString()} {account.currency}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
