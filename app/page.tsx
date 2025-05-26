"use client";

import { Suspense } from "react";
import ConnectionLoader from "@/components/ConnectionLoader";
import PoweredByLoader from "@/components/PoweredByLoader";
import Header from "@/components/Header";
import Bet from "@/components/Sections/Bet";
import RoundHistory from "@/components/Sections/RoundHistory";
import ErrorLoader from "@/components/ErrorLoader";
import { SessionProvider, useSession } from "@/context/SessionProvider";
import Main from "@/components/LightWeightGameCanvas/Main";
import { SettingsProvider } from "@/context/SettingsContext";
import { TradingProvider } from "@/context/TradingContext";

export default function Page() {
  return (
    <Suspense>
      <SessionProvider>
        <Home />
      </SessionProvider>
    </Suspense>
  );
}

function Home() {
  const {
    accounts,
    loading,
    error,
    connected,
    username,
    avatar,
    multipliers,
    handleAvatarUpdate,
    connectionComplete,
    cookieExists,
    socket,
  } = useSession();

  if (loading) {
    return <PoweredByLoader />;
  }

  if (error) {
    return <ErrorLoader />;
  }

  if (!connected) {
    return <ConnectionLoader />;
  }

  if (cookieExists === 3) {
    return <ErrorLoader />;
  }

  if (!connectionComplete) {
    return <ConnectionLoader />;
  }

  return (
    <SettingsProvider>
      <TradingProvider socket={socket} username={username}>
        <div id="main-content" className="aviator-container">
          <Header
            accounts={accounts}
            username={username}
            avatar={avatar}
            onAvatarUpdate={handleAvatarUpdate}
          />

          <main className={`aviator-objects`}>
            <section className="aviator-betting-section" id="aviator-betting-section">
              <RoundHistory multipliers={multipliers} />
              <Main />
              <Bet />
            </section>
          </main>
        </div>
      </TradingProvider>
    </SettingsProvider>
  );
}