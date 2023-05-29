import { createContext, Dispatch, SetStateAction } from "react";
import * as SocketIOClient from "socket.io-client";

interface SocketContextState {
  socket: SocketIOClient.Socket | null;
  setSocket: Dispatch<SetStateAction<SocketIOClient.Socket | null>>;
}

const SocketContext = createContext<SocketContextState>({
  socket: null,
  setSocket: () => null,
});

export default SocketContext;
