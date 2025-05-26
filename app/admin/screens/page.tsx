import { SessionProvider } from "@/components/Admin/context/SessionProvider";
import Header from "@/components/Admin/Header";
import Screens from "@/components/Admin/Screens";
import SideBar from "@/components/Admin/SideBar";

export default function Page() {
    return (
        <SessionProvider>
            <div className="aviator-admin-container">
                <Header />
                <SideBar />
                <Screens />
            </div>
        </SessionProvider>
    )
}