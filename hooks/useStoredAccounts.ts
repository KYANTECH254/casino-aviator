import { useState, useEffect, useRef } from 'react';

export default function useStoredAccounts() {
    const [activeAccount, setActiveAccount] = useState<any>('');
    const [storedAccounts, setStoredAccounts] = useState<any[]>([]);

    const activeAccountRef = useRef(activeAccount);
    const storedAccountsRef = useRef(storedAccounts);

    useEffect(() => {
        activeAccountRef.current = activeAccount;
        storedAccountsRef.current = storedAccounts;
    }, [ activeAccount, storedAccounts]);


    useEffect(() => {
        const activeAccountSetting = sessionStorage.getItem('activeAccount');
        const storedAccountsSetting = sessionStorage.getItem('accounts');

        setActiveAccount(activeAccountSetting ? JSON.parse(activeAccountSetting) : '');
        setStoredAccounts(storedAccountsSetting ? JSON.parse(storedAccountsSetting) : []);
    }, []);

    const toggleActiveAccount = (account: any) => {
        if (!account) return null;
        setActiveAccount(account);
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('activeAccount', JSON.stringify(account));
        }
    };

    const setDerivAccounts = (accounts: any) => {
        if (!accounts) return null;
        const newAccounts = accounts || [];
        setStoredAccounts(newAccounts);
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('accounts', JSON.stringify(newAccounts));
        }
    };

    return {
        activeAccount,
        toggleActiveAccount,
        storedAccounts,
        setDerivAccounts,
        setActiveAccount
    };
}
