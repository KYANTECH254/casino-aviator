import { useAlert } from "@/context/AlertContext";
import { useSession } from "@/context/SessionProvider";
import { useTrading } from "@/context/TradingContext";
import useUserInteraction from "@/hooks/useUserInteraction";
import App from "next/app";
import { useEffect, useRef, useState } from "react";

export type BetStates = {
    betId: string;
    betStatus: string;
    betPlaced: boolean;
    betAutoTrade: boolean;
    betStake: number,
    wonAmount: number,
    takeProfit: number,
    cashOut: boolean;
}

function BetItem({ account, flyAwayRef, multiplierRef }: {
    account: any;
    flyAwayRef: React.MutableRefObject<string>;
    multiplierRef: React.MutableRefObject<string>;
    RoundStarted: boolean;
    setRoundStarted: (value: boolean) => void;
}) {
    const {
        socket,
        roundId,
        ErrorMessage,
        UpdatedBetData,
        prevroundId,
        cashoutSuccess,
        app
    } = useSession();
    const { addAlert } = useAlert();
    const { eventTriggered } = useUserInteraction();
    const {
        setAccount,
        PlaceBet,
        CashOut
    } = useTrading();

    const [isAutoBetVisible, setIsAutoBetVisible] = useState(false);
    const [isAutoCashoutInputEnabled, setIsAutoCashoutInputEnabled] = useState(false);
    const [isAuto, setIsAuto] = useState(false);
    const [inputValues, setInputValues] = useState({ stake: 10.00, multiplier: 1.10 });
    const [lastAddedValues, setLastAddedValues] = useState({ stake: 0 });
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
    const [betstates, setBetstate] = useState<BetStates>({
        betId: "",
        betStatus: "",
        betPlaced: false,
        betAutoTrade: false,
        betStake: 10,
        wonAmount: 0,
        takeProfit: 1.10,
        cashOut: false
    })
    const [currentBet, setCurrentBet] = useState<any>();
    const [playedround, setPlayedRound] = useState('');
    const isAutoCashoutInputEnabledRef = useRef(isAutoCashoutInputEnabled);
    const isAutoRef = useRef(isAuto);
    const CashOutBetOneRef = useRef(betstates.cashOut)
    const betOnePlacedRef = useRef(betstates.betPlaced)
    const betOneStatusRef = useRef(betstates.betStatus)
    const AutoTradeBetOneRef = useRef(betstates.betAutoTrade)
    const stakeForbetOneRef = useRef(betstates.betStake)
    const WonAmountRef = useRef(betstates.wonAmount)
    const takeProfitForBetOneRef = useRef(betstates.takeProfit)
    const RoundIDRef = useRef(roundId)
    const currentBetRef = useRef(currentBet)

    // Live Bet updates from server
    useEffect(() => {
        const Bet = UpdatedBetData.filter((bet: any) => bet.code === account.userId);
        setCurrentBet(Bet[0]);
        if (Bet.length > 0 && Bet[0].code === account.userId && Bet[0].status === "open") {
            setBetstate((prev: any) => ({
                ...prev,
                betStatus: "active",
                betPlaced: true,
                cashOut: false,
            }))
        }
    }, [socket, UpdatedBetData, account, RoundIDRef.current])

    // Current round id
    useEffect(() => {
        RoundIDRef.current = roundId
    }, [roundId])

    // Refs for betstates
    useEffect(() => {
        CashOutBetOneRef.current = betstates.cashOut
        betOnePlacedRef.current = betstates.betPlaced
        betOneStatusRef.current = betstates.betStatus
        AutoTradeBetOneRef.current = betstates.betAutoTrade
        stakeForbetOneRef.current = betstates.betStake
        WonAmountRef.current = betstates.wonAmount
        takeProfitForBetOneRef.current = betstates.takeProfit
        currentBetRef.current = currentBet;
    }, [betstates, currentBet])

    // Set bet item to userid
    useEffect(() => {
        setAccount(account);
        setBetstate((prev: any) => ({
            ...prev,
            betId: `${account.userId}`
        }));
    }, [account])

    useEffect(() => {
        isAutoCashoutInputEnabledRef.current = isAutoCashoutInputEnabled;
        isAutoRef.current = isAuto;
    }, [isAutoCashoutInputEnabled, isAuto]);

    useEffect(() => {
        if (ErrorMessage) {
            setBetstate((prev: any) => ({
                ...prev,
                betPlaced: false,
                betStatus: "",
                betAutoTrade: false
            }))
            setIsAuto(false)
        }
    }, [ErrorMessage]);

    // Handle auto trade
    useEffect(() => {
        if (betstates.betAutoTrade && !betstates.betStatus && betstates.betId === account.userId) {
            sendBet();
            setIsAuto(true);
        } else if (!betstates.betAutoTrade && betstates.betPlaced && isAutoRef.current) {
            sendBet();
            setIsAuto(false);
            console.log("Auto trade has been cancelled.");
        }
    }, [betstates.betAutoTrade, betstates]);

    // Handle bet status when game crashes
    useEffect(() => {
        if (betstates.betStatus === "active" && betstates.betPlaced && flyAwayRef.current === "true" && RoundIDRef.current !== prevroundId) {
            setBetstate((prev: any) => ({
                ...prev,
                betPlaced: false,
                betStatus: "",
                cashOut: false
            }))
        }
    }, [flyAwayRef.current, RoundIDRef.current]);

    useEffect(() => {
        if (!cashoutSuccess) return;
        setBetstate((prev: any) => ({
            ...prev,
            betPlaced: false,
            betStatus: "",
            cashOut: true
        }));

        // const won = {
        //     amount: (cashoutSuccess.profit).toFixed(2),
        //     cashout: parseFloat(cashoutSuccess.multiplier).toFixed(2),
        //     currency: account?.currency
        // };

        // addAlert(won, 5000, "green", 2, true);

        if (eventTriggered) {
            const audio = new Audio('/assets/audio/aviatorwin.mp3');
            audio.play().catch((err) => console.error("Audio playback failed:", err));
        }
    }, [cashoutSuccess]);

    useEffect(() => {
        if (flyAwayRef.current !== "true" || RoundIDRef.current === prevroundId) return;
        if (betstates.betPlaced) {
            const stake = inputValues.stake;
            const multiplier = inputValues.multiplier;

            if (!account) return;
            if (stake > account.balance) {
                addAlert("Not enough balance", 3000, "red", 1, true);
                setBetstate((prev: any) => ({
                    ...prev,
                    betPlaced: false,
                    betStatus: "",
                    betAutoTrade: false
                }))
                return;
            }
            if (betstates.betStatus === "active") return;
            if (isAutoCashoutInputEnabledRef.current && RoundIDRef.current !== playedround) {
                setPlayedRound(RoundIDRef.current)
                setBetstate((prev: any) => ({
                    ...prev,
                    betStatus: "active",
                }))
                const data = {
                    amount: stake,
                    autoCashout: multiplier,
                    platformId: account?.platformId
                }
                PlaceBet(data, account)
            } else {
                setBetstate((prev: any) => ({
                    ...prev,
                    betStatus: "active",
                }))
                const data = {
                    amount: stake,
                    platformId: account?.platformId
                }
                PlaceBet(data, account)
            }
            console.log("Sending Bet Data: ", { stake, multiplier });
        }
    }, [flyAwayRef.current, betstates.betPlaced, betstates.betStatus, RoundIDRef.current]);

    const handleDataValueClick = (input: 'stake', value: number) => {
        setInputValues(prev => ({
            ...prev,
            [input]: prev[input] + value
        }));
        setLastAddedValues(prev => ({
            ...prev,
            [input]: value
        }));
    };

    const handleRepeatedDataValueClick = (input: 'stake') => {
        setInputValues(prev => ({
            ...prev,
            [input]: prev[input] + lastAddedValues[input]
        }));
    };

    const startAdjustingValue = (input: 'stake', change: number) => {
        setInputValues(prev => ({
            ...prev,
            [input]: Math.max(0, prev[input] + change)
        }));
        const id = setInterval(() => {
            setInputValues(prev => ({
                ...prev,
                [input]: Math.max(0, prev[input] + change)
            }));
        }, 100);
        setIntervalId(id);
    };

    const stopAdjustingValue = () => {
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    };

    const handleAutoBetToggle = (type: 'bet' | 'auto') => {
        if (betstates.betAutoTrade) return;
        setIsAutoBetVisible(type === 'auto');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, id } = e.target;
        setInputValues(prev => ({
            ...prev,
            [id]: parseFloat(value) || 0,
        }));
    };

    const handleCashOutInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const parsedValue = parseFloat(e.target.value) || 1.10;
        setInputValues(prev => ({
            ...prev,
            multiplier: parsedValue,
        }));
    };

    const sendBet = () => {
        const defaultStake = 10.00;
        const defaultMultiplier = 1.10;
        const minimumMultiplier = 1.01;
        const minimumBet = app?.minbet;
        const maximumBet = app?.maxbet;

        const isInvalidValue = (value: number, min: number, max: number) =>
            isNaN(value) || value < min || value > max;

        if (betstates.betPlaced) {
            const stake = inputValues.stake || 10;
            const multiplier = inputValues.multiplier || 0;

            if (isAutoCashoutInputEnabledRef.current) {
                setBetstate((prev: any) => ({
                    ...prev,
                    betStake: stake,
                    betPlaced: false,
                    betStatus: "",
                    takeProfit: 1.1
                }))
            }
            setBetstate((prev: any) => ({
                ...prev,
                betStake: stake,
                betPlaced: false,
                betStatus: "",
            }))
            console.log("Bet data has been removed.");
        } else {
            let stake = inputValues.stake;
            let multiplier = inputValues.multiplier || 0;

            if (isInvalidValue(stake, minimumBet, maximumBet)) {
                if (isAuto) {
                    setIsAuto(false)
                }
                if (betstates.betPlaced === false && betstates.betStatus === "") return;
                setBetstate((prev: any) => ({
                    ...prev,
                    betPlaced: false,
                    betStatus: "",
                    cashOut: true
                }));
                return;
            }
            if (isInvalidValue(multiplier, minimumMultiplier, Infinity)) {
                multiplier = defaultMultiplier;
            }

            if (isAutoCashoutInputEnabledRef.current) {
                setBetstate((prev: any) => ({
                    ...prev,
                    betStake: stake,
                    betPlaced: true,
                    betStatus: "pending",
                    takeProfit: multiplier
                }))
            }

            setBetstate((prev: any) => ({
                ...prev,
                betStake: stake,
                betPlaced: true,
                betStatus: "pending",
            }))
            console.log("Bet data has been set.");
        }
    };

    const getBetClass = () => {
        if (betstates.betPlaced && !betstates.cashOut && flyAwayRef.current === "false" && betstates.betStatus === "active") {
            return "cashoutActive";
        }
        if (betstates.betPlaced && betstates.betStatus === "pending") {
            return "betActive";
        }
        if (betstates.betPlaced && betstates.betStatus === "active" && flyAwayRef.current === "true") {
            return "betActive";
        }
        return "";
    };

    const handleCashout = () => {
        setBetstate((prev: any) => ({
            ...prev,
            betPlaced: false,
            betStatus: "",
            cashOut: true
        }))
        CashOut(account)
    };

    return (
        <div
            id={`aviator-btn-container-${account.userId}`}
            className={`aviator-btn-container-2 ${getBetClass()}`}
        >
            <div className="aviator-btn-top-container">
                <div className="row colgp5 currency-display display-center">
                    {account.balance.toLocaleString()}
                    <span className="aviator-heading-currency">{account.currency}</span> : {account.username}
                </div>
                <div className="aviator-btn-top-container-btns">
                    <div
                        onClick={() => handleAutoBetToggle('bet')}
                        className={`aviator-bet-btn ${!isAutoBetVisible ? 'active' : ''}`}
                    >
                        Bet
                    </div>
                    <div
                        onClick={() => handleAutoBetToggle('auto')}
                        className={`aviator-bet-btn ${isAutoBetVisible ? 'active' : ''}`}
                    >
                        Auto
                    </div>
                </div>
            </div>

            <div className="aviator-btn-bottom-container">
                {betstates.betPlaced && (
                    <div className="aviator-btn-bottom-container-disable"></div>
                )}

                <div className="aviator-btn-bottom-container-left">
                    <div className="aviator-bet-container">
                        <div
                            className="minus-btn"
                            onMouseDown={() => startAdjustingValue('stake', -1)}
                            onMouseUp={stopAdjustingValue}
                            onMouseLeave={stopAdjustingValue}
                        >-</div>
                        <input
                            type="number"
                            className="aviator-bet-input"
                            id="stake"
                            onChange={handleInputChange}
                            value={inputValues.stake.toFixed(2)}
                        />
                        <div
                            className="plus-btn"
                            onMouseDown={() => startAdjustingValue('stake', 1)}
                            onMouseUp={stopAdjustingValue}
                            onMouseLeave={stopAdjustingValue}
                        >+</div>
                    </div>

                    <div className="aviator-input-btn-container">
                        {[10, 50].map((value) => (
                            <div
                                key={value}
                                className="aviator-input-btn"
                                onClick={() => {
                                    if (lastAddedValues.stake === value) {
                                        handleRepeatedDataValueClick('stake');
                                    } else {
                                        handleDataValueClick('stake', value);
                                    }
                                }}
                            >
                                {value.toFixed(2)}
                            </div>
                        ))}
                    </div>
                    <div className="aviator-input-btn-container">
                        {[100, 200].map((value) => (
                            <div
                                key={value}
                                className="aviator-input-btn"
                                onClick={() => {
                                    if (lastAddedValues.stake === value) {
                                        handleRepeatedDataValueClick('stake');
                                    } else {
                                        handleDataValueClick('stake', value);
                                    }
                                }}
                            >
                                {value.toFixed(2)}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="aviator-btn-bottom-container-right">
                    {flyAwayRef.current === "false" && betstates.betStatus === "pending" && betstates.betPlaced && (
                        <span className="next-round-text display-center">Waiting for next round</span>
                    )}
                    <button
                        onClick={() => {
                            if (betstates.betPlaced && betstates.betStatus === "active" && !betstates.cashOut) {
                                handleCashout();
                            } else {
                                sendBet();
                            }
                        }}
                        className={`aviator-betting-btn ${flyAwayRef.current === "false" && betstates.betPlaced && betstates.betStatus === "pending" ? "active" : "none"
                            }`}
                    >
                        {betstates.betPlaced && betstates.betStatus === "pending" && (
                            <span className="aviator-bet-btn-text">CANCEL</span>
                        )}
                        {betstates.betPlaced && betstates.betStatus === "active" && flyAwayRef.current === "true" && (
                            <span className="aviator-bet-btn-text">CANCEL</span>
                        )}
                        {betstates.betPlaced && !betstates.cashOut && flyAwayRef.current === "false" && betstates.betStatus === "active" && (
                            <>
                                <span className="aviator-bet-btn-text">CASH OUT</span>
                                <span id="aviator-bet-btn-amount2" className="aviator-bet-btn-amount">{((betstates.betStake) * parseFloat(multiplierRef.current)).toFixed(2)} {account?.currency}</span>
                            </>
                        )}
                        {!betstates.betPlaced && (
                            <>
                                <span className="aviator-bet-btn-text">BET</span>
                                <span id="aviator-bet-btn-amount2" className="aviator-bet-btn-amount">{(inputValues.stake).toLocaleString()} {account?.currency}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {isAutoBetVisible && (
                <>
                    <div className="aviator-autobet-separator"></div>
                    <div className="aviator-auto-bet-container">
                        <div className="aviator-autobet-btns">
                            <div className="aviator-autobet-title">Auto Bet</div>
                            <div className="toggle-switch">
                                <input
                                    type="checkbox"
                                    id={`toggle${account?.userId}`}
                                    checked={betstates.betAutoTrade}
                                    onChange={() =>
                                        setBetstate((prev: any) => ({
                                            ...prev,
                                            betAutoTrade: betstates.betAutoTrade ? false : true,
                                        }))
                                    }
                                />
                                <label htmlFor={`toggle${account?.userId}`} className="slider"></label>
                            </div>
                        </div>

                        <div className="aviator-autocashout-btns">
                            <div className="aviator-autocashout-title">Auto Cash Out</div>
                            <div className="toggle-switch">
                                <input
                                    disabled={betstates.betAutoTrade}
                                    checked={isAutoCashoutInputEnabled}
                                    type="checkbox"
                                    id={`toggle${account?.username}`}
                                    onChange={() => setIsAutoCashoutInputEnabled(prev => !prev)}
                                />
                                <label htmlFor={`toggle${account?.username}`} className="slider"></label>
                            </div>
                            <div className="aviator-auto-multiplier-input">
                                <input
                                    disabled={!isAutoCashoutInputEnabled || betstates.betAutoTrade}
                                    type="text"
                                    className="aviator-auto-multiplier"
                                    onChange={handleCashOutInputChange}
                                    value={inputValues.multiplier.toFixed(2)}
                                />
                                <button
                                    disabled={!isAutoCashoutInputEnabled}
                                    className="aviator-auto-multiplier-clearinput"
                                    onClick={() => setInputValues(prev => ({ ...prev, multiplier: 0 }))}
                                >
                                    &times;
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default function Bet() {
    const { accounts, isTrading } = useSession();
    const { RoundStarted, setRoundStarted, setAccount } = useTrading();
    const { multiplier, maxMultiplier, crashed } = useSession()

    const multiplierRef = useRef(multiplier);
    const maxMultiplierRef = useRef(maxMultiplier);
    const flyAwayRef = useRef(crashed);

    useEffect(() => {
        multiplierRef.current = multiplier;
        maxMultiplierRef.current = maxMultiplier;
        flyAwayRef.current = crashed;
    }, [crashed, multiplier, maxMultiplier]);


    return (
        <div className="aviator-btns-container">
            {!isTrading && (
                <>
                    <h1>BETTING IS DISABLED!</h1>
                </>
            )}
            {accounts.length === 0 && (
                <>
                    <h1>ADD USER ACCOUNTS TO START BETTING!</h1>
                </>
            )}
            {isTrading && accounts
                .sort((a, b) => parseFloat(a.userId) - parseFloat(b.userId))
                .map((account) => (
                    <BetItem
                        key={account.userId}
                        account={account}
                        flyAwayRef={flyAwayRef}
                        multiplierRef={multiplierRef}
                        RoundStarted={RoundStarted}
                        setRoundStarted={setRoundStarted}
                    />
                ))}
        </div>
    );
}