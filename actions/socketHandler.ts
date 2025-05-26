export const EmitBetData = (socket:any, data:any) => {
    socket.emit("new-bet", data)
}

export const CashOutBet = (socket:any, data:any) => {
    socket.emit("cashout-bet", data)
}

export const ListenBetsLiveData = (socket:any) => {
    const data = "emit";
    socket.emit("load-live-bets", data)
}