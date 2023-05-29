import React, { useState } from "react";
import SocketContext from "./SocketContext";
import * as SocketIOClient from "socket.io-client";

export interface ISocketProviderProps {
  children: React.ReactNode;
}

const SocketProvider = ({
  children,
}: ISocketProviderProps): React.ReactElement => {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
