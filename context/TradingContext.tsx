"use client"
import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react"
import { CashOutBet, EmitBetData } from "@/actions/socketHandler"
import { Account, useSession } from "./SessionProvider"

interface Trade {
  buy_price: number
  status: string
  profit: number
}

interface TradingContextType {
  account: any
  trades: Trade[]
  RoundStarted: boolean
  setRoundStarted: (value: boolean) => void
  setAccount: (value: any) => void
  PlaceBet: (data: any, account: Account) => void
  CashOut: (account: Account) => void
}

const TradingContext = createContext<TradingContextType | undefined>(undefined)

interface TradingProviderProps {
  children: ReactNode
  socket: WebSocket
  username: any
}

export const TradingProvider = ({ children, socket, username }: TradingProviderProps) => {
  const [account, setAccount] = useState<Account>()
  const [RoundStarted, setRoundStarted] = useState(false)

  const [trades, setTrades] = useState<Trade[]>([])
  const [previousStatus, setPreviousStatus] = useState<any>(null)
  const { roundId } = useSession();

  const RoundStartedRef = useRef(RoundStarted)
  const tradesRef = useRef(trades)
  const RoundIDRef = useRef(roundId)
  const previousStatusRef = useRef(previousStatus)

  useEffect(() => {
    RoundStartedRef.current = RoundStarted
    tradesRef.current = trades
    RoundIDRef.current = roundId
    previousStatusRef.current = previousStatus
  }, [RoundStarted, roundId, trades, previousStatus])

  const PlaceBet = (data: any, account: Account,) => {
    const url = localStorage.getItem("userAvatar") || "assets/images/avatar.png"
    const betdata = {
      status: "open",
      bet_amount: data?.amount,
      code: account?.userId,
      currency: account?.currency,
      profit: 0,
      avatar: url,
      username: account?.username,
      platformId: data.platformId,
      multiplier: `${data?.autoCashout}` || "",
    }
    EmitBetData(socket, betdata)
  }

  const CashOut = (account: Account) => {
    const cashoutdata = {
      userId: account?.userId,
      platformId: account?.platformId
    }
    CashOutBet(socket, cashoutdata)
  }

  const value = {
    account,
    trades: tradesRef.current,
    RoundStarted: RoundStartedRef.current,
    RoundID: RoundIDRef.current,
    setRoundStarted,
    setAccount,
    PlaceBet,
    CashOut
  }

  return <TradingContext.Provider value={value}>{children}</TradingContext.Provider>
}

export const useTrading = () => {
  const context = useContext(TradingContext)
  if (!context) throw new Error("useTrading must be used within a TradingProvider")
  return context
}