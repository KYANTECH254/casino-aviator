import { SessionProvider } from "@/components/Admin/context/SessionProvider";
import Header from "@/components/Admin/Header";
import SideBar from "@/components/Admin/SideBar";
import Users from "@/components/Admin/Users";

export default function Page() {
    return (
        <SessionProvider>
            <div className="aviator-admin-container">
                <Header />
                <SideBar />
                <Users />
            </div>
        </SessionProvider>
    )
}