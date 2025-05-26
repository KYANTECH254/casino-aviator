"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
    startTransition,
    ReactNode,
} from "react";
import { useAviatorAccount, AviatorAccountsT } from "@/hooks/useAviatorAccount";
import useAvatar from "@/hooks/useAvatars";
import useWebSocket from "@/hooks/useWebSocket";
import { cache } from "react";
import ErrorLoader from "@/components/ErrorLoader";
import useUserInteraction from "@/hooks/useUserInteraction";
import { useAlert } from "./AlertContext";

export type Account = {
    id: string;
    userId: string;
    username: string;
    balance: string;
    token: string;
    auth_token: string;
    phoneNumber: string;
    email: string;
    platformId: string;
    currency: string;
    createdAt: string;
    updatedAt: string;
}

type SessionContextType = {
    account: any;
    accounts: Account[];
    loading: boolean;
    error: string | null;
    connected: boolean;
    username: string;
    avatar: string | null;
    multiplier: any;
    multipliers: any[];
    UpdatedBetData: any[];
    maxMultiplier: any;
    crashed: string;
    socket: any;
    handleAvatarUpdate: (avatar: string) => void;
    connectionComplete: boolean;
    cookieExists: number;
    roundId: any;
    prevroundId: any;
    ErrorMessage: string;
    cashoutSuccess: any;
    setCashOutSuccess: any;
    AllbetsData: any[];
    isTrading: any;
    app:any;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error("useSession must be used within a SessionProvider");
    }
    return context;
};

export const SessionProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [connectionComplete, setConnectionComplete] = useState(false);
    const [authToken, setAuthToken] = useState('');
    const [cookieExists, setCookieExists] = useState(1);

    const [username, setUsername] = useState('');
    const [multipliers, setMultipliers] = useState([]);
    const [multiplier, setMultiplier] = useState();
    const [UpdatedBetData, setUpdatedBetData] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [AllbetsData, setAllbetsData] = useState([]);
    const [app, setApp] = useState([]);
    const [account, setAccount] = useState();
    const [maxMultiplier, setMaxMultiplier] = useState(0);
    const [crashed, setCrashed] = useState("");
    const [roundId, setRoundId] = useState("");
    const [prevroundId, setPrevRoundId] = useState("")
    const [ErrorMessage, setErrorMessage] = useState<string>("")
    const [cashoutSuccess, setCashOutSuccess] = useState()
    const [isTrading, setisTrading] = useState()

    const AviatorAccount = useAviatorAccount();
    const [aviatoraccount, setAviatorAccount] = useState<AviatorAccountsT>(AviatorAccount);
    const { avatar, updateAvatar } = useAvatar();
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(avatar);

    const authTokenRef = useRef(authToken);
    const connectionCompleteRef = useRef(connectionComplete);
    const cookieExistsRef = useRef(cookieExists);
    const multipliersRef = useRef(multipliers);
    const multiplierRef = useRef(multiplier);
    const accountsRef = useRef(accounts)
    const roundIdRef = useRef(roundId)
    const UpdatedBetDataRef = useRef(UpdatedBetData);
    const prevroundIdRef = useRef(prevroundId)

    const { addAlert } = useAlert();

    const { socket } = useWebSocket({
        onMessage: ({ eventName, data }) => {
            switch (eventName) {
                case "app":
                    if (!data) return;
                    setApp(data.app);
                    break;
                case "accounts":
                    if (!data) return;
                    if (aviatoraccount?.screen === data.accounts.screen) {
                        setAccounts(data.accounts.accounts);
                        accountsRef.current = data.accounts.accounts;
                        setisTrading(data.accounts.isTrading)
                    }
                    break;
                case "multiplier_data":
                    if (!data) return;
                    setMultipliers(data);
                    multipliersRef.current = data;
                    break;
                case "bets":
                    if (!data) return;
                    setUpdatedBetData(data);
                    UpdatedBetDataRef.current = data;
                    break;
                case "bet_history":
                    if (!data) return;
                    setAllbetsData(data.bets);
                    break;
                case "multiplier":
                    if (!data.multiplier) return;
                    setMultiplier(data.multiplier);
                    multiplierRef.current = data.multiplier;
                    break;
                case "maxMultiplier":
                    if (!data) return;
                    setMaxMultiplier(data.value);
                    multiplierRef.current = data.value;
                    break;
                case "crashed":
                    if (!data) return;
                    setCrashed(data.crashed);
                    multiplierRef.current = data.crashed;
                    break;
                case "round_id":
                    if (!data) return;
                    setRoundId(data.round_id)
                    roundIdRef.current = data.round_id;
                    break;
                case "prev_round_id":
                    if (!data) return;
                    setPrevRoundId(data)
                    prevroundIdRef.current = data;
                    break;
                case "cashout_success":
                    if (!data) return;
                    setCashOutSuccess(data);
                    const won = {
                        amount: (data.profit).toFixed(2),
                        cashout: parseFloat(data.multiplier).toFixed(2),
                        currency: 'KES'
                    };
                    addAlert(won, 5000, "green", 2, true);
                    break;
                case "error":
                    if (!data) return;
                    setErrorMessage(data)
                    addAlert(data, 3000, "red", 1, false);
                    break;
                default:
                    return null;
            }
        },
        onConnect: () => {
            setConnected(true);
            console.log('WebSocket connected!');
        },
        onDisconnect: () => {
            setConnected(false);
            console.log('WebSocket disconnected!');
        },
    });

    useEffect(() => {
        if (!socket) return;
        let socketInteval = setInterval(() => {
            socket.emit("join_game", { platformId: aviatoraccount.platformId, screen: aviatoraccount.screen });
            socket.emit("round_bets", { platformId: aviatoraccount.platformId, screen: aviatoraccount.screen });
        }, 1000);
        return () => {
            clearInterval(socketInteval)
        };
    }, [aviatoraccount, socket])

    useEffect(() => {
        authTokenRef.current = authToken;
        connectionCompleteRef.current = connectionComplete;
        cookieExistsRef.current = cookieExists;
    }, [authToken, connectionComplete, cookieExists]);

    const validateAndFetchToken = cache(async () => {
        try {
            setLoading(true);
            setAviatorAccount(prev => ({ ...prev, origin: window.location.origin }));

            const app_data = {
                acc: aviatoraccount,
                origin: window.location.origin,
            };

            await new Promise<void>((resolve) => {
                startTransition(() => {
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/authorize`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(app_data),
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (!data.success) {
                                setError(data.message);
                                return;
                            }
                            setConnected(true);
                            setConnectionComplete(true);
                            setAccounts(data.accounts);
                        })
                        .catch(error => {
                            setError('API error');
                            console.log(error);
                        })
                        .finally(() => {
                            setLoading(false);
                            resolve();
                        });
                });
            });
        } catch (error) {
            console.log('Validation error:', error);
            setError('Validation failed');
            setLoading(false);
        }
    });

    useEffect(() => {
        validateAndFetchToken();
    }, []);

    const handleAvatarUpdate = (newAvatar: string) => {
        updateAvatar(newAvatar);
        setSelectedAvatar(newAvatar);
    };

    useEffect(() => {
        setSelectedAvatar(avatar);
    }, [avatar]);

    if (error) {
        <ErrorLoader />
    }

    return (
        <SessionContext.Provider
            value={{
                roundId,
                prevroundId,
                account,
                accounts,
                loading,
                error,
                connected,
                username,
                avatar: selectedAvatar,
                multiplier,
                multipliers,
                UpdatedBetData,
                maxMultiplier,
                crashed,
                socket,
                handleAvatarUpdate,
                connectionComplete,
                cookieExists,
                ErrorMessage,
                cashoutSuccess,
                setCashOutSuccess,
                AllbetsData,
                isTrading,
                app
            }}
        >
            {children}
        </SessionContext.Provider>
    );
};