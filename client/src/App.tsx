import { useState, useCallback, useRef, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "./components/HomePage";
import WaitingRoom from "./components/WaitingRoom";
import GameBoard from "./components/GameBoard";
import GameResult from "./components/GameResult";
import DisconnectNotification from "./components/DisconnectNotification";
import { useSocket } from "./hooks/useSocket";

type GameState = "home" | "waiting" | "playing" | "result";
type CellValue = "X" | "O" | null;

function App() {
  const nicknameRef = useRef<string>("");
  const socketIdRef = useRef<string | null>(null);
  const [gameState, setGameState] = useState<GameState>("home");
  const [nickname, setNickname] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState<"X" | "O">("X");
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [playerX, setPlayerX] = useState("");
  const [playerO, setPlayerO] = useState("");
  const [scores, setScores] = useState<Record<string, number>>({});
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [result, setResult] = useState<"win" | "draw" | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [winnerSymbol, setWinnerSymbol] = useState<"X" | "O" | null>(null);
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [disconnectMessage, setDisconnectMessage] = useState("");

  const handleLeaveGame = useCallback(() => {
    setGameState("home");
    setNickname("");
    nicknameRef.current = "";
    setRoomCode("");
    setBoard(Array(9).fill(null));
    setCurrentTurn("X");
    setCurrentPlayer("X");
    setPlayerX("");
    setPlayerO("");
    setScores({});
    setWinningLine(null);
    setResult(null);
    setWinner(null);
    setWinnerSymbol(null);
    setShowDisconnect(false);
    setDisconnectMessage("");
  }, []);

  const { isConnected, socketId, createRoom, joinRoom, makeMove, requestRematch } = useSocket({
    onRoomCreated: useCallback((data: { roomCode: string; player: { symbol: "X" | "O" } }) => {
      setRoomCode(data.roomCode);
      setCurrentPlayer(data.player.symbol);
      setPlayerX(nicknameRef.current);
      setGameState("waiting");
    }, []),

    onJoinedRoom: useCallback((data: { roomCode: string; player: { symbol: "X" | "O" } }) => {
      setCurrentPlayer(data.player.symbol);
    }, []),

    onGameStart: useCallback((data: { playerX: string; playerO: string; board: CellValue[]; currentTurn: "X" | "O"; scores: Record<string, number> }) => {
      setPlayerX(data.playerX);
      setPlayerO(data.playerO);
      setBoard(data.board);
      setCurrentTurn(data.currentTurn);
      setScores(data.scores);
      setGameState("playing");
    }, []),

    onMoveMade: useCallback((data: { board: CellValue[]; currentTurn: "X" | "O"; index: number }) => {
      setBoard(data.board);
      setCurrentTurn(data.currentTurn);
    }, []),

    onGameOver: useCallback((data: { board: CellValue[]; result: "win" | "draw"; winner: string | null; winnerSymbol?: "X" | "O"; winningLine: number[] | null; scores: Record<string, number> }) => {
      setBoard(data.board);
      setWinningLine(data.winningLine);
      setResult(data.result);
      setWinner(data.winner);
      setScores(data.scores);
      setWinnerSymbol(data.winnerSymbol || null);
      setGameState("result");
    }, []),

    onRematchStart: useCallback((data: { board: CellValue[]; currentTurn: "X" | "O"; playerX: string; playerO: string; scores: Record<string, number>; playerSymbols: Record<string, "X" | "O"> }) => {
      setBoard(data.board);
      setCurrentTurn(data.currentTurn);
      setPlayerX(data.playerX);
      setPlayerO(data.playerO);
      setScores(data.scores);
      
      if (socketIdRef.current && data.playerSymbols[socketIdRef.current]) {
        setCurrentPlayer(data.playerSymbols[socketIdRef.current]);
      }
      
      setWinningLine(null);
      setResult(null);
      setWinner(null);
      setGameState("playing");
    }, []),

    onPlayerDisconnected: useCallback((data: { nickname: string }) => {
      setDisconnectMessage(`${data.nickname} disconnected`);
      setShowDisconnect(true);
      setTimeout(() => {
        handleLeaveGame();
      }, 3000);
    }, [handleLeaveGame]),

    onRoomError: useCallback((data: { message: string }) => {
      alert(data.message);
      handleLeaveGame();
    }, [handleLeaveGame]),
  });

  useEffect(() => {
    if (socketId) {
      socketIdRef.current = socketId;
    }
  }, [socketId]);

  const handleCreateGame = (playerNickname: string) => {

    if (!isConnected) {
      alert("Connecting to server...");
      return;
    }
    setNickname(playerNickname);
    nicknameRef.current = playerNickname;
    createRoom(playerNickname);
  };

  const handleJoinGame = (playerNickname: string, code: string) => {
    if (!isConnected) {
      alert("Connecting to server...");
      return;
    }
    setNickname(playerNickname);
    nicknameRef.current = playerNickname;
    setRoomCode(code);
    joinRoom(playerNickname, code);
    setGameState("waiting");
  };

  const handleCellClick = (index: number) => {
    if (currentTurn !== currentPlayer || board[index] !== null || winningLine) {
      return;
    }
    makeMove(roomCode, index);
  };

  const handleRematch = () => {
    requestRematch(roomCode);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {gameState === "home" && (
          <HomePage
            onCreateGame={handleCreateGame}
            onJoinGame={handleJoinGame}
          />
        )}

        {gameState === "waiting" && (
          <WaitingRoom
            roomCode={roomCode}
            playerNickname={nickname}
            onLeave={handleLeaveGame}
          />
        )}

        {gameState === "playing" && (
          <GameBoard
            playerX={playerX}
            playerO={playerO}
            currentPlayer={currentPlayer}
            board={board}
            onCellClick={handleCellClick}
            currentTurn={currentTurn}
            winningLine={winningLine}
            scores={scores}
          />
        )}

        <GameResult
          isOpen={gameState === "result"}
          result={result}
          winner={winner}
          winnerSymbol={winnerSymbol}
          onRematch={handleRematch}
          onLeave={handleLeaveGame}
          scores={scores}
        />

        <DisconnectNotification
          isVisible={showDisconnect}
          message={disconnectMessage}
          onDismiss={() => setShowDisconnect(false)}
        />

        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
