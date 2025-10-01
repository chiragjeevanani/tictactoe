# Tic Tac Toe Multiplayer

## Overview

A real-time multiplayer Tic Tac Toe game built with React, Express, Socket.IO, and Drizzle ORM. Players can create or join game rooms using unique room codes, play against each other with instant state synchronization, and request rematches. The application features a modern dark-themed UI with smooth animations using Framer Motion and shadcn/ui components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- TanStack Query (React Query) for server state management
- Socket.IO client for real-time bidirectional communication

**Component Structure:**
The application follows a single-page architecture with state-driven view rendering:
- `App.tsx` serves as the main orchestrator managing game state (`home`, `waiting`, `playing`, `result`)
- Custom hook `useSocket` encapsulates all WebSocket communication logic
- Presentational components (`HomePage`, `WaitingRoom`, `GameBoard`, `GameResult`, `DisconnectNotification`) handle specific UI states
- Shared UI components from shadcn/ui provide consistent design primitives

**State Management:**
Game state is managed locally in the main App component using React hooks. The Socket.IO connection handles synchronization between clients. Key state includes:
- Game phase (home/waiting/playing/result)
- Player information (nicknames, assigned symbols X/O)
- Board state (9-cell array)
- Turn tracking and win conditions

**Styling Approach:**
Tailwind CSS with custom design tokens defined in CSS variables, following Material Design principles adapted for gaming. The design uses a dark-first theme with vibrant accent colors (electric blue for Player X, pink for Player O). Animation is handled through Framer Motion for smooth transitions and game feedback.

### Backend Architecture

**Server Framework:**
Express.js serves as the HTTP server foundation with Socket.IO integrated for WebSocket support. The architecture separates concerns:
- `server/index.ts` - Express app setup with middleware and error handling
- `server/routes.ts` - Socket.IO event handlers and game room management
- `server/vite.ts` - Development-specific Vite integration for HMR

**Real-Time Communication:**
Socket.IO manages all real-time game events:
- Room creation with random 6-character hex codes
- Player joining and matchmaking (2 players per room)
- Move validation and broadcasting
- Win/draw detection with winning line identification
- Rematch functionality
- Disconnect handling with opponent notification

**Game Logic:**
Server-side game state validation ensures fair play:
- Board state maintained per room in memory (`Map<string, Room>`)
- Turn enforcement (players can only move on their turn)
- Win detection using predefined winning line combinations (rows, columns, diagonals)
- Draw detection when board is full with no winner

**Data Storage:**
The application uses an in-memory storage implementation (`MemStorage` in `server/storage.ts`) for user data. The schema is defined with Drizzle ORM for future PostgreSQL integration, but currently stores users in memory using a Map. This design allows easy migration to persistent storage by swapping the storage implementation.

### External Dependencies

**UI Component Library:**
- Radix UI primitives (@radix-ui/*) provide accessible, unstyled component foundations
- shadcn/ui configuration (components.json) defines the component architecture with "new-york" style
- Custom component wrappers in `client/src/components/ui/` apply Tailwind styling to Radix primitives

**Animation and Effects:**
- Framer Motion for declarative animations and transitions
- react-confetti for celebration effects on game wins

**Real-Time Communication:**
- Socket.IO (client and server) for WebSocket-based bidirectional event communication
- No fallback transports configured; assumes modern WebSocket support

**Database (Configured but not actively used):**
- Drizzle ORM configured with PostgreSQL dialect
- @neondatabase/serverless as the connection driver
- Schema defined in `shared/schema.ts` with users table
- Migration path configured but in-memory storage currently active

**Form Handling:**
- React Hook Form with @hookform/resolvers for form validation
- Zod for schema validation (integrated with Drizzle)

**Styling and Theming:**
- Tailwind CSS for utility-first styling
- class-variance-authority for component variant management
- clsx and tailwind-merge (via cn utility) for conditional class composition
- CSS custom properties for theme tokens (defined in client/src/index.css)

**Development Tools:**
- TypeScript for static typing across client, server, and shared code
- Replit-specific plugins (@replit/vite-plugin-*) for enhanced development experience
- ESBuild for production server bundling