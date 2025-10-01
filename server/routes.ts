import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketServer } from "socket.io";
import { randomBytes } from "crypto";

type CellValue = "X" | "O" | null;

interface Player {
  id: string;
  nickname: string;
  symbol: "X" | "O";
  score: number;
}

interface Room {
  code: string;
  players: Player[];
  board: CellValue[];
  currentTurn: "X" | "O";
  gameStarted: boolean;
  winningLine: number[] | null;
  result: "win" | "draw" | null;
  winner: string | null;
  firstPlayerIndex: number;
}

const rooms = new Map<string, Room>();

function generateRoomCode(): string {
  return randomBytes(3).toString('hex').toUpperCase();
}

function checkWinner(board: CellValue[]): { winner: "X" | "O" | null; line: number[] | null } {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as "X" | "O", line };
    }
  }

  return { winner: null, line: null };
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const io = new SocketServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Player connected:", socket.id);

    socket.on("create-room", (nickname: string) => {
      let roomCode: string;
      do {
        roomCode = generateRoomCode();
      } while (rooms.has(roomCode));

      const room: Room = {
        code: roomCode,
        players: [{
          id: socket.id,
          nickname,
          symbol: "X",
          score: 0,
        }],
        board: Array(9).fill(null),
        currentTurn: "X",
        gameStarted: false,
        winningLine: null,
        result: null,
        winner: null,
        firstPlayerIndex: 0,
      };

      rooms.set(roomCode, room);
      socket.join(roomCode);
      
      socket.emit("room-created", {
        roomCode,
        player: room.players[0],
      });

      console.log(`Room ${roomCode} created by ${nickname}`);
    });

    socket.on("join-room", (data: { roomCode: string; nickname: string }) => {
      const room = rooms.get(data.roomCode);

      if (!room) {
        socket.emit("room-error", { message: "Room not found" });
        return;
      }

      if (room.players.length >= 2) {
        socket.emit("room-error", { message: "Room is full" });
        return;
      }

      const player: Player = {
        id: socket.id,
        nickname: data.nickname,
        symbol: "O",
        score: 0,
      };

      room.players.push(player);
      room.gameStarted = true;
      socket.join(data.roomCode);

      io.to(data.roomCode).emit("game-start", {
        playerX: room.players[0].nickname,
        playerO: room.players[1].nickname,
        board: room.board,
        currentTurn: room.currentTurn,
        scores: {
          X: room.players[0].score,
          O: room.players[1].score,
        },
      });

      socket.emit("joined-room", {
        roomCode: data.roomCode,
        player,
      });

      console.log(`${data.nickname} joined room ${data.roomCode}`);
    });

    socket.on("make-move", (data: { roomCode: string; index: number }) => {
      const room = rooms.get(data.roomCode);
      
      if (!room || !room.gameStarted || room.result !== null) {
        return;
      }

      if (data.index < 0 || data.index > 8) {
        return;
      }

      const player = room.players.find((p: Player) => p.id === socket.id);
      if (!player || player.symbol !== room.currentTurn) {
        return;
      }

      if (room.board[data.index] !== null) {
        return;
      }

      room.board[data.index] = player.symbol;

      const { winner, line } = checkWinner(room.board);

      if (winner) {
        room.winningLine = line;
        room.result = "win";
        room.winner = player.nickname;
        room.gameStarted = false;
        player.score += 1;

        io.to(data.roomCode).emit("game-over", {
          board: room.board,
          result: "win",
          winner: player.nickname,
          winnerSymbol: player.symbol,
          winningLine: line,
          scores: {
            X: room.players.find(p => p.symbol === "X")!.score,
            O: room.players.find(p => p.symbol === "O")!.score,
          },
        });
      } else if (room.board.every((cell: CellValue) => cell !== null)) {
        room.result = "draw";
        room.gameStarted = false;

        io.to(data.roomCode).emit("game-over", {
          board: room.board,
          result: "draw",
          winner: null,
          winningLine: null,
          scores: {
            X: room.players.find(p => p.symbol === "X")!.score,
            O: room.players.find(p => p.symbol === "O")!.score,
          },
        });
      } else {
        room.currentTurn = room.currentTurn === "X" ? "O" : "X";

        io.to(data.roomCode).emit("move-made", {
          board: room.board,
          currentTurn: room.currentTurn,
          index: data.index,
        });
      }
    });

    socket.on("rematch", (roomCode: string) => {
      const room = rooms.get(roomCode);
      
      if (!room) {
        return;
      }

      const player = room.players.find((p: Player) => p.id === socket.id);
      if (!player) {
        return;
      }

      room.firstPlayerIndex = room.firstPlayerIndex === 0 ? 1 : 0;
      
      room.players[0].symbol = room.firstPlayerIndex === 0 ? "X" : "O";
      room.players[1].symbol = room.firstPlayerIndex === 1 ? "X" : "O";
      
      room.board = Array(9).fill(null);
      room.currentTurn = room.players[room.firstPlayerIndex].symbol;
      room.winningLine = null;
      room.result = null;
      room.winner = null;
      room.gameStarted = true;

      const playerXData = room.players.find(p => p.symbol === "X")!;
      const playerOData = room.players.find(p => p.symbol === "O")!;

      io.to(roomCode).emit("rematch-start", {
        board: room.board,
        currentTurn: room.currentTurn,
        playerX: playerXData.nickname,
        playerO: playerOData.nickname,
        scores: {
          X: playerXData.score,
          O: playerOData.score,
        },
        playerSymbols: {
          [playerXData.id]: "X",
          [playerOData.id]: "O",
        },
      });

      console.log(`Rematch started in room ${roomCode}`);
    });

    socket.on("disconnect", () => {
      console.log("Player disconnected:", socket.id);

      for (const [roomCode, room] of Array.from(rooms.entries())) {
        const playerIndex = room.players.findIndex((p: Player) => p.id === socket.id);
        
        if (playerIndex !== -1) {
          const disconnectedPlayer = room.players[playerIndex];
          
          socket.to(roomCode).emit("player-disconnected", {
            nickname: disconnectedPlayer.nickname,
          });

          rooms.delete(roomCode);
          console.log(`Room ${roomCode} deleted due to disconnect`);
          break;
        }
      }
    });
  });

  return httpServer;
}
