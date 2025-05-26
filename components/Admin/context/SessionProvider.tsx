"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";

import { cache } from "react";
import ErrorLoader from "@/components/ErrorLoader";
import PoweredByLoader from "@/components/PoweredByLoader";
import { useRouter } from "next/navigation";

export type Account = {
    id: string;
    balance: string;
    yesterbalance: string;
    betstoday: number;
    wonbetstoday: number;
    lostbetstoday: number;
    withdrawals: number;
    deposits: number;
    token: string;
    phoneNumber: string;
    email: string;
    platformId: string;
    screens: string;
    stations: string;
    users: string;
    createdAt: string;
    updatedAt: string;
}

type SessionContextType = {
    token: string;
    account: any;
    login: (token: string, account: Account[]) => Promise<void>;
    logout: () => void;
    Authenticated: boolean;
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
    const [account, setAccount] = useState([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [Authenticated, setAuthenticated] = useState(false);
    const [token, settoken] = useState("");
    const router = useRouter();

    const login = async (token: string, account: any) => {
        setAccount(account);
        sessionStorage.setItem("token", token);
        setAuthenticated(true);
    }

    const logout = async () => {
        const token = sessionStorage.getItem("token");
        if (!token) return;
        sessionStorage.removeItem("token");
        router.push("/admin/login");
    }

    const validateAndFetchToken = cache(async () => {
        try {
            const atoken = sessionStorage.getItem("token")
            if (!atoken) {
                setAccount([])
                setAuthenticated(false)
                router.push("/admin/login")
                return;
            }

            settoken(atoken)
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/query-user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: atoken }),
            })
                .then(response => response.json())
                .then(data => {
                    if (!data.success) {
                        setError(data.message);
                        setAuthenticated(false)
                        router.push("/admin/login");
                        return;
                    }
                    settoken(data.token)
                    setAccount(data.account);
                    setAuthenticated(true)
                })
                .catch(error => {
                    setError('API error');
                    console.log(error);
                })
                .finally(() => {
                    setLoading(false);
                });
        } catch (error) {
            console.log('Validation error:', error);
            setError('Validation failed');
            setLoading(false);
        }
    });

    useEffect(() => {
        setInterval(() => {
            validateAndFetchToken();
        }, 1000);
        
    }, []);

    if (error) {
        <ErrorLoader />
    }

    if (loading) {
        return <PoweredByLoader />;
    }

    return (
        <SessionContext.Provider
            value={{
                token,
                account,
                login,
                logout,
                Authenticated
            }}
        >
            {children}
        </SessionContext.Provider>
    );
};