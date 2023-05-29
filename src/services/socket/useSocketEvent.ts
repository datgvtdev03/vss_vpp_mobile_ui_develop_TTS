import { useContext, useEffect, useState } from "react";
import SocketContext from "./SocketContext";

export function useSocket<ReceivingData, SendingData>(
  eventKey: string
): [ReceivingData | undefined, (data: SendingData) => void] {
  const { socket } = useContext(SocketContext);
  const [data, setData] = useState<ReceivingData>();

  const emit = (sendingData: SendingData) => {
    socket?.emit(eventKey, sendingData);
  };

  useEffect(() => {
    const onReceiveEvent = (args: ReceivingData) => {
      setData(args);
    };
    socket?.on(eventKey, onReceiveEvent);
    return () => {
      socket?.off(eventKey, onReceiveEvent);
    };
  }, [eventKey, socket]);

  return [data, emit];
}
