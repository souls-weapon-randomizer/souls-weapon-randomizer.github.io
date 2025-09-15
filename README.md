# DSR Weapon Randomizer

A web application for randomizing weapons in Dark Souls Remastered, helping players discover new playstyles and weapons they might not have tried before.

## Features

- **Weapon Randomization**: Spin the roulette wheel to get a random weapon
- **Preference Settings**: Customize your run with various filters:
  - Starting class selection
  - Weapon type preferences (ranged, pyromancy, catalysts, talismans, consumables)
  - Farming tolerance settings
  - Guaranteed vs unguaranteed weapons
- **Boss Management**: Track defeated bosses to unlock new weapons
- **Blacklist System**: Exclude weapons you don't want to use
- **Session Persistence**: Your progress is automatically saved locally
- **Modern UI**: Beautiful dark theme with glass effects and animations

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Gorogorov/dsr-weapon-randomized.git
cd dsr-weapon-randomized
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## How to Use

1. **Setup Your Run**: Configure your preferences including starting class and weapon type preferences
2. **Spin the Wheel**: Click the "SPIN" button to get a random weapon
3. **Defeat Bosses**: When you defeat a boss with a weapon, mark it as defeated to unlock new weapons
4. **Manage Blacklist**: Add weapons to your blacklist to exclude them from future spins
5. **Start New Game**: Use the "New Game" button to reset your progress

## Technology Stack

- **React 18** - Frontend framework
- **Vite** - Build tool and development server
- **Tailwind CSS** - Styling framework
- **React Custom Roulette** - Roulette wheel component
- **Local Storage** - Session persistence

## Project Structure

```
src/
├── components/          # React components
│   ├── App.jsx         # Main application component
│   ├── Preferences.jsx # Settings modal
│   ├── Roulette.jsx    # Roulette wheel component
│   ├── Bosses.jsx      # Boss management
│   ├── Blacklist.jsx   # Weapon blacklist
│   ├── Notification.jsx # Toast notifications
│   ├── WeaponDisplay.jsx # Weapon result display
│   └── BossSelectionModal.jsx # Boss selection modal
├── data/               # Game data
│   ├── weapons.js      # Weapon definitions
│   └── bosses.js       # Boss definitions
├── index.css           # Global styles
└── main.jsx           # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Dark Souls Remastered game data and weapon information
- React and Vite communities for excellent tooling
- Tailwind CSS for beautiful styling utilities