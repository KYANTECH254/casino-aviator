import Account from "@/components/Admin/Account";
import { SessionProvider } from "@/components/Admin/context/SessionProvider";

export default function Page() {
    return (
        <>
            <SessionProvider>
                <Account />
            </SessionProvider>
        </>
    )
}