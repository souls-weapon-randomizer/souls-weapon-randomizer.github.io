import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllGames } from '../../games/index.js';
import GameSelector from '../../components/GameSelector/GameSelector';

const HomePage = () => {
    const navigate = useNavigate();
    const [selectedGame, setSelectedGame] = useState('dsr');
    const games = getAllGames();
    
    const handleGameSelect = (gameId) => {
        setSelectedGame(gameId);
    };
    
    const handleStartGame = () => {
        navigate(`/game/${selectedGame}`);
    };
    
    return (
        <div className="min-h-screen bg-background text-text-main">
            {/* Header */}
            <header className="glass-effect border-b border-element-light/30 p-6 text-center sticky top-0 z-20 shadow-lg">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl font-gothic font-bold tracking-wider text-gradient animate-fade-in mb-4">
                        SOULS WEAPON RANDOMIZER
                    </h1>
                    <p className="text-text-secondary text-lg font-medium">
                        Choose your game and randomize your weapon journey
                    </p>
                </div>
            </header>
            
            {/* Main Content */}
            <main className="p-6 sm:p-8 max-w-6xl mx-auto">
                {/* Game Selection */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-center mb-8 text-text-main">
                        Select Your Game
                    </h2>
                    <GameSelector 
                        selectedGame={selectedGame}
                        onGameSelect={handleGameSelect}
                        className="mb-8"
                    />
                </section>
                
                {/* Game Description */}
                {selectedGame && (
                    <section className="mb-12">
                        <div className="glass-effect rounded-xl p-8 text-center">
                            <div className="text-6xl mb-4">
                                {games.find(g => g.id === selectedGame)?.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-text-main mb-4">
                                {games.find(g => g.id === selectedGame)?.name}
                            </h3>
                            <p className="text-text-muted text-lg mb-6 max-w-2xl mx-auto">
                                {games.find(g => g.id === selectedGame)?.description}
                            </p>
                            <button 
                                onClick={handleStartGame}
                                className="button-primary text-lg px-8 py-4"
                                style={{
                                    background: `linear-gradient(135deg, ${games.find(g => g.id === selectedGame)?.color}, ${games.find(g => g.id === selectedGame)?.color}CC)`
                                }}
                            >
                                Start Randomizing
                            </button>
                        </div>
                    </section>
                )}
                
                {/* Features */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-effect rounded-xl p-6 text-center">
                        <div className="text-4xl mb-4">🎲</div>
                        <h3 className="text-xl font-bold text-text-main mb-2">Random Weapon</h3>
                        <p className="text-text-muted">Get a random weapon after each boss defeat</p>
                    </div>
                    <div className="glass-effect rounded-xl p-6 text-center">
                        <div className="text-4xl mb-4">⚔️</div>
                        <h3 className="text-xl font-bold text-text-main mb-2">Boss Progression</h3>
                        <p className="text-text-muted">Track your boss defeats and unlock new weapons</p>
                    </div>
                    <div className="glass-effect rounded-xl p-6 text-center">
                        <div className="text-4xl mb-4">🚫</div>
                        <h3 className="text-xl font-bold text-text-main mb-2">Blacklist</h3>
                        <p className="text-text-muted">Exclude weapons you don't want to use</p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default HomePage;
