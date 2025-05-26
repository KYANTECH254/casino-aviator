import { SessionProvider } from "@/components/Admin/context/SessionProvider";
import Header from "@/components/Admin/Header";
import SideBar from "@/components/Admin/SideBar";
import Stations from "@/components/Admin/Stations";

export default function Page() {
    return (
        <SessionProvider>
            <div className="aviator-admin-container">
                <Header />
                <SideBar />
                <Stations />
            </div>
        </SessionProvider>
    )
}