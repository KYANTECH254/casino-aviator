"use client";

import { useState } from "react";
import { useSession } from "./context/SessionProvider";
import Link from "next/link";

export default function SideBar() {
    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useSession();

    return (
        <>
            <div onClick={() => setIsOpen((prev => !prev))} className="row colg1 mtp5 sidebar-btns">
                {!isOpen ? (
                    <div className="sidebar-button"><i className="fa fa-chevron-right"></i> </div>
                ) : (
                    <div className="sidebar-button"><i className="fa fa-chevron-left"></i> </div>
                )}
            </div>
            {isOpen && (
                <div className="aviator-admin-sidebar">
                    <>
                        <Link className="aviator-admin-sidebar-item" href="/admin"> <i className="fa fa-home"></i> Dashboard</Link>
                        <Link className="aviator-admin-sidebar-item" href="/admin/stations"><i className="fa fa-cloud"></i> Stations</Link>
                        <Link className="aviator-admin-sidebar-item" href="/admin/screens"> <i className="fa fa-tv"></i> Screens</Link>
                        <Link className="aviator-admin-sidebar-item" href="/admin/users"> <i className="fa fa-users"></i> Users</Link>
                        <Link className="aviator-admin-sidebar-item" href="/admin/bets"> <i className="fa fa-book"></i> Bets</Link>
                        <Link className="aviator-admin-sidebar-item" href="/admin/settings"> <i className="fa fa-cog"></i> Settings</Link>
                        <div className="aviator-admin-sidebar-item" onClick={logout}><i className="fa fa-arrow-left"></i> Logout</div>
                    </>
                </div >
            )}
        </>
    )
}