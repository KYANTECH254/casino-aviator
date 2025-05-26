import Bets from "@/components/Admin/Bets";
import { SessionProvider } from "@/components/Admin/context/SessionProvider";
import Header from "@/components/Admin/Header";
import SideBar from "@/components/Admin/SideBar";

export default function Page() {
    return (
        <SessionProvider>
            <div className="aviator-admin-container">
                <Header />
                <SideBar />
                <Bets />
            </div>
        </SessionProvider>
    )
}