import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

type CellValue = "X" | "O" | null;

interface SocketCallbacks {
  onRoomCreated?: (data: { roomCode: string; player: { symbol: "X" | "O" } }) => void;
  onJoinedRoom?: (data: { roomCode: string; player: { symbol: "X" | "O" } }) => void;
  onGameStart?: (data: { playerX: string; playerO: string; board: CellValue[]; currentTurn: "X" | "O"; scores: Record<string, number> }) => void;
  onMoveMade?: (data: { board: CellValue[]; currentTurn: "X" | "O"; index: number }) => void;
  onGameOver?: (data: { board: CellValue[]; result: "win" | "draw"; winner: string | null; winnerSymbol?: "X" | "O"; winningLine: number[] | null; scores: Record<string, number> }) => void;
  onRematchStart?: (data: { board: CellValue[]; currentTurn: "X" | "O"; playerX: string; playerO: string; scores: Record<string, number>; playerSymbols: Record<string, "X" | "O"> }) => void;
  onPlayerDisconnected?: (data: { nickname: string }) => void;
  onRoomError?: (data: { message: string }) => void;
}

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  socketId: string | null;
  createRoom: (nickname: string) => void;
  joinRoom: (nickname: string, roomCode: string) => void;
  makeMove: (roomCode: string, index: number) => void;
  requestRematch: (roomCode: string) => void;
}

export function useSocket(callbacks: SocketCallbacks): UseSocketReturn {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState<string | null>(null);
  const callbacksRef = useRef(callbacks);

  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  useEffect(() => {
    const socket = io({
      path: "/socket.io",
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
      setSocketId(socket.id || null);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsConnected(false);
    });

    socket.on("room-created", (data) => {
      callbacksRef.current.onRoomCreated?.(data);
    });

    socket.on("joined-room", (data) => {
      callbacksRef.current.onJoinedRoom?.(data);
    });

    socket.on("game-start", (data) => {
      callbacksRef.current.onGameStart?.(data);
    });

    socket.on("move-made", (data) => {
      callbacksRef.current.onMoveMade?.(data);
    });

    socket.on("game-over", (data) => {
      callbacksRef.current.onGameOver?.(data);
    });

    socket.on("rematch-start", (data) => {
      callbacksRef.current.onRematchStart?.(data);
    });

    socket.on("player-disconnected", (data) => {
      callbacksRef.current.onPlayerDisconnected?.(data);
    });

    socket.on("room-error", (data) => {
      callbacksRef.current.onRoomError?.(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const createRoom = useCallback((nickname: string) => {
    if (socketRef.current) {
      socketRef.current.emit("create-room", nickname);
    }
  }, []);

  const joinRoom = useCallback((nickname: string, roomCode: string) => {
    if (socketRef.current) {
      socketRef.current.emit("join-room", { roomCode, nickname });
    }
  }, []);

  const makeMove = useCallback((roomCode: string, index: number) => {
    if (socketRef.current) {
      socketRef.current.emit("make-move", { roomCode, index });
    }
  }, []);

  const requestRematch = useCallback((roomCode: string) => {
    if (socketRef.current) {
      socketRef.current.emit("rematch", roomCode);
    }
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    socketId,
    createRoom,
    joinRoom,
    makeMove,
    requestRematch,
  };
}
