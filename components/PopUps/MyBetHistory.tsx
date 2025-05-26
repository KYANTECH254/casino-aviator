"use client";

import { useAlert } from "@/context/AlertContext";
import { useSession } from "@/context/SessionProvider";
import { useEffect, useState, useRef, MouseEvent } from "react";

interface Bet {
    id: string;
    code: string;
    appId: string;
    multiplier: number;
    bet_amount: number;
    createdAt: string;
    username: string;
    profit: number;
    status: "won" | "lost";
}

interface MyBetHistoryProps {
    onClose: () => void;
}

export default function MyBetHistory({
    onClose,
}: MyBetHistoryProps) {
    const [filteredBets, setFilteredBets] = useState<Bet[]>([]);
    const [visibleBets, setVisibleBets] = useState<Bet[]>([]);
    const [loading, setLoading] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);
    const { addAlert } = useAlert()
    const { accounts, AllbetsData } = useSession();

    const handleOutsideClick = (event: MouseEvent | Event) => {
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

    useEffect(() => {
        if (AllbetsData && filteredBets.length === 0) {
            setVisibleBets(AllbetsData.slice(0, 10));
        }
        if (AllbetsData) {
            setFilteredBets(AllbetsData);
        }
    }, [AllbetsData]);

    const getMultiplierClass = (multiplier: number) => {
        if (multiplier < 2) return "small";
        if (multiplier >= 2 && multiplier < 10) return "medium";
        return "large";
    };

    const loadMoreBets = () => {
        setLoading(true);
        setTimeout(() => {
            setVisibleBets((prevBets) => [
                ...prevBets,
                ...filteredBets.slice(prevBets.length, prevBets.length + 10),
            ]);
            setLoading(false);
        }, 1000);
    };

    const handleCopyBetId = (id: any) => {
        const message = `share_bet:${id}:`;
        navigator.clipboard.writeText(message).then(() => {
            addAlert('Copied for chat!', 3000, 'green', 1, false);
        }).catch((err) => {
            console.error('Failed to copy: ', err);
            addAlert('Failed to copy!', 3000, 'red', 1, false);
        });
    };

    return (
        <div id="aviator-bethistory-tab" className="aviator-popup-container">
            <div ref={popupRef} className="aviator-gamelimits-popup">
                <div className="aviator-popup-header">
                    <div className="aviator-popup-header-left">MY BET HISTORY</div>
                    <div
                        onClick={onClose}
                        id="aviator-bethistory-popup-close"
                        className="aviator-popup-header-right"
                    >
                        <i className="fa fa-times" aria-hidden="true"></i>
                    </div>
                </div>
                <div className="aviator-popup-bethistory-body">
                    <div className="aviator-bets-third-header">
                        <div className="aviator-bets-third-sub-header">User</div>
                        <div className="aviator-bets-third-sub-header">
                            Bet KES x
                        </div>
                        <div className="aviator-bets-third-sub-header">
                            Cash out KES
                        </div>
                    </div>

                    {loading ? (
                        <div
                            className="display-center column"
                            style={{ width: "100%" }}
                        >
                            <div className="popup-loader"></div>
                        </div>
                    ) : (
                        visibleBets
                            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .map((bet) => {
                                const formattedMultiplier = parseFloat(
                                    bet.multiplier.toString()
                                ).toFixed(2);
                                const multiplierClass = getMultiplierClass(
                                    parseFloat(formattedMultiplier)
                                );
                                const profitFormatted = bet.profit;

                                const totalFormatted = (profitFormatted + bet.bet_amount).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                });
                                return (
                                    <div
                                        key={bet.id}
                                        className={`aviator-bet-item ${bet.status === "won" ? "won" : ""
                                            }`}
                                    >
                                        <div className="aviator-bets-body-left-date rowgp5">
                                            <div className="row colgp5">
                                                <div className="column rowgp5">
                                                    <div className="aviator-bets-datetime">
                                                        {new Date(
                                                            bet.createdAt
                                                        ).toLocaleTimeString()}
                                                    </div>
                                                    <div className="aviator-bets-date">
                                                        {new Date(
                                                            bet.createdAt
                                                        ).toLocaleDateString()}
                                                    </div>
                                                </div>

                                                <div className="column orange">
                                                    <span>{bet.username}</span>
                                                    <span>{bet.code}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="aviator-bets-body-middle colgp5">
                                            <div className="aviator-bets-stake">
                                                {bet.bet_amount.toLocaleString(
                                                    undefined,
                                                    {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    }
                                                )}
                                            </div>

                                            {parseFloat(formattedMultiplier) > 0 && (<>
                                                <div className={`aviator-bets-multiplier ${multiplierClass}`}>
                                                    {formattedMultiplier}x
                                                </div>
                                            </>)}
                                        </div>
                                        <div className="aviator-bets-body-right">
                                            <div className="aviator-bets-cashout">
                                                {totalFormatted}
                                            </div>
                                            <div className="aviator-bets-btns" onClick={() => handleCopyBetId(bet.id)}>
                                                <i
                                                    className="fa fa-comment-o"
                                                    aria-hidden="true"
                                                ></i>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                    )}
                </div>

                <div className="aviator-bethistory-popup-footer">
                    <div
                        id="aviator-bethistory-loadmore"
                        className="aviator-bethistory-loadbtn"
                        onClick={loadMoreBets}
                    >
                        Load more
                    </div>
                </div>
            </div>
        </div>
    );
}

