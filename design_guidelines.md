# Tic Tac Toe Multiplayer - Design Guidelines

## Design Approach
**System-Based Gaming Experience** - Utilizing Material Design principles adapted for gaming interfaces with custom animations and dark theming. Focus on clear game state visibility, instant feedback, and celebratory moments.

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary Theme):**
- Background: 220 25% 8% (deep navy-black)
- Surface: 220 20% 12% (elevated dark surface)
- Card/Container: 220 18% 15% (game board background)

**Brand Colors:**
- Primary (Blue): 210 100% 55% (vibrant electric blue)
- Secondary (Pink): 330 85% 60% (energetic pink)
- Player X: 210 100% 55% (blue)
- Player O: 330 85% 60% (pink)

**Semantic Colors:**
- Win State: 142 76% 45% (bright green with glow)
- Draw State: 45 95% 55% (amber/gold)
- Error/Disconnect: 0 85% 60% (red)
- Text Primary: 0 0% 95% (near white)
- Text Secondary: 220 15% 65% (muted gray-blue)

### B. Typography
- **Primary Font:** Inter (Google Fonts) - clean, modern sans-serif
- **Display Font:** Poppins (Google Fonts) - for headlines and game status
- Heading Sizes: text-4xl (game title), text-3xl (nicknames), text-2xl (status messages)
- Body Sizes: text-lg (buttons, inputs), text-base (secondary info), text-sm (helper text)
- Font Weights: 700 (bold headlines), 600 (buttons, nicknames), 400 (body text)

### C. Layout System
**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-6 or p-8
- Section gaps: gap-4 or gap-6
- Margins: m-4, m-8, m-12
- Grid cells: Game board uses gap-2 or gap-3 between cells

**Container Strategy:**
- Home screen: max-w-md (centered vertical layout)
- Game board: max-w-2xl (optimized game area)
- Modal dialogs: max-w-sm (focused result display)

### D. Component Library

**Home Screen Components:**
- Gradient hero section with game title (h-screen flex centered)
- Nickname input: Large text field with dark surface bg-[220 18% 15%], blue focus ring, rounded-xl
- Action buttons: Full-width w-full, rounded-xl, py-4 with icon + text
- Create Game: bg-gradient-to-r from-blue to-blue-600, text-white
- Join Game: border-2 border-pink with transparent bg
- Room code display: Large monospace text with copy button, bg-[220 20% 12%] rounded-lg p-4

**Game Board:**
- 3x3 Grid: aspect-square with gap-3, each cell rounded-2xl with bg-[220 18% 15%]
- Cell size: Desktop: w-24 h-24, Mobile: w-20 h-20
- Active cells: Hover state with subtle bg-[220 20% 20%]
- Player markers: Large scale (text-6xl or text-7xl) with drop-shadow
- Player info bar: Flex row showing both nicknames with turn indicator (glowing ring around active player)
- Status text: Fixed top position showing "Your Turn" or "Opponent's Turn"

**Winning Line Animation:**
- Diagonal/Horizontal/Vertical overlay using absolute positioning
- Gradient stroke from blue to pink (4px width)
- Pulsing glow effect with shadow-lg shadow-blue-500/50
- Scale-in animation (0.8 to 1) with slight rotation

**Modal/Result Screen:**
- Backdrop: bg-black/80 backdrop-blur-sm
- Card: bg-[220 20% 12%] rounded-2xl p-8 with border-2
- Winner: border-green-500 with confetti overlay
- Draw: border-amber-500
- Action buttons: Two-button layout - "Play Again" (primary) and "Leave Game" (outline)

**Waiting Room:**
- Centered card with room code prominently displayed
- Animated pulsing dots or spinner
- Share button with clipboard functionality
- "Waiting for opponent..." message with loading animation

**Disconnect Notification:**
- Toast/banner at top: bg-red-600 text-white with "Opponent disconnected" message
- Auto-return to home option after 5 seconds

### E. Animations & Interactions

**Framer Motion Animations:**
- Page transitions: Fade + slide up (y: 20 to 0)
- Cell placement: Scale spring animation (0 to 1.2 to 1) with 0.3s duration
- X/O appearance: Rotate + scale-in with color fade
- Win celebration: Winning line draws in 0.5s, confetti bursts for 3s
- Button hover: Scale 1.02 with shadow increase
- Modal entry: Scale 0.95 to 1 with fade-in

**No Animation Zones:**
- Turn indicator updates (instant)
- Room code copy (instant feedback only)
- Disable animations on rematch for faster restart

### F. Responsive Behavior
- Mobile (< 768px): Single column, smaller cells (w-16 h-16), text-5xl markers
- Tablet/Desktop (≥ 768px): Larger board, text-7xl markers, side-by-side player info
- Touch targets: Minimum 44x44px for mobile cells
- Viewport: Game board always visible without scrolling on common devices

### G. Key UX Patterns
- **Feedback:** Every action has immediate visual/haptic response
- **State Clarity:** Current turn always visible with glowing indicator
- **Error Prevention:** Disable filled cells, show validation messages
- **Progressive Enhancement:** Room code generation visible step-by-step
- **Micro-interactions:** Button press ripples, input field focus rings, copy success checkmark

### H. Images
**No hero images required** - This is a functional game application where the game board itself is the visual centerpiece. Use gradient backgrounds and animated elements instead of static images.