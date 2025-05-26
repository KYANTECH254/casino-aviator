"use client";

import { useSession } from "@/context/SessionProvider";
import { useEffect, useRef, MouseEvent } from "react";

interface GameLimitsProps {
    onClose: () => void;
}

export default function GameLimits({ onClose }: GameLimitsProps) {
    const popupRef = useRef<HTMLDivElement>(null);
    const { app } = useSession()

    const handleOutsideClick = (event: MouseEvent | any) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    });

    return (
        <div id="aviator-gamelimits-tab" className="aviator-popup-container">
            <div ref={popupRef} className="aviator-gamelimits-popup">
                <div className="aviator-popup-header">
                    <div className="aviator-popup-header-left">GAME LIMITS</div>
                    <div
                        onClick={onClose}
                        id="aviator-gamelimits-popup-close"
                        className="aviator-popup-header-right"
                    >
                        <i className="fa fa-times" aria-hidden="true"></i>
                    </div>
                </div>
                <div className="aviator-popup-gamelimits-body">
                    <div className="aviator-gamelimits-bodycontainer">
                        <div className="aviator-gamelimits-bodycontainer-top">
                            <div className="aviator-gamelimits-bodycontainer-right">
                                Minimum bet KES:
                            </div>
                            <div className="aviator-gamelimits-bodycontainer-left">{(app.minbet).toLocaleString() || "10.00"}</div>
                        </div>
                        <div className="aviator-gamelimits-bodycontainer-middle">
                            <div className="aviator-gamelimits-bodycontainer-right">
                                Maximum bet KES:
                            </div>
                            <div className="aviator-gamelimits-bodycontainer-left">
                                {(app.maxbet).toLocaleString() || "200.00"}
                            </div>
                        </div>
                        <div className="aviator-gamelimits-bodycontainer-middle">
                            <div className="aviator-gamelimits-bodycontainer-right">
                                Maximum Win KES:
                            </div>
                            <div className="aviator-gamelimits-bodycontainer-left">
                                {(app.maxbetwin).toLocaleString() || "20,000.00"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
