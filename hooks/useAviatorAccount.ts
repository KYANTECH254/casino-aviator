"use client"

import { useGetQueryParams } from "./useGetQueryParams";

export type AviatorAccountsT = {
    apiKey: string;
    platform: string;
    platformId: String;
    origin:String;
    screen:string;
};

export const useAviatorAccount = (): AviatorAccountsT => {
    const aviatorAccount = useGetQueryParams();

    return {
        apiKey: aviatorAccount.apiKey || "",  
        platform: aviatorAccount.platform || "", 
        platformId: aviatorAccount.platformId || '',  
        screen: aviatorAccount.screen || '',  
        origin: "",
    };
};


