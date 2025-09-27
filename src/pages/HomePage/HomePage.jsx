import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllGames } from '../../games/index.js';

const HomePage = () => {
    const navigate = useNavigate();
    const games = getAllGames();
    const [hoveredGame, setHoveredGame] = useState(null);
    const [currentBackground, setCurrentBackground] = useState('dsr'); // Default to DSR
    
    const handleGameClick = (gameId) => {
        navigate(`/game/${gameId}`);
    };
    
    const handleGameHover = (gameId) => {
        setHoveredGame(gameId);
        setCurrentBackground(gameId);
    };
    
    const handleGameLeave = () => {
        setHoveredGame(null);
        // Don't change currentBackground here - keep the last hovered game
    };
    
    return (
        <div className="min-h-screen text-text-main flex flex-col relative">
            {/* Dynamic Background Layers */}
            {games.map(game => (
                <div 
                    key={game.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentBackground === game.id ? 'opacity-100' : 'opacity-0'}`}
                    style={{
                        backgroundImage: `url(${game.backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center center',
                        backgroundRepeat: 'no-repeat',
                        backgroundAttachment: 'fixed'
                    }}
                />
            ))}
            
            {/* Dark Overlay */}
            <div 
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(135deg, rgba(26,26,26,0.9) 0%, rgba(40,40,40,0.95) 100%)'
                }}
            />

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col min-h-screen">
            {/* Header */}
            <header className="bg-element/1 backdrop-blur-md border-b border-element-light/30 p-6 text-center sticky top-0 z-20 shadow-lg">
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
            <main className="p-6 sm:p-8 max-w-6xl mx-auto flex-1">
                {/* Game Selection */}
                <section className="mb-12">
                    <div className="flex flex-wrap justify-center gap-6">
                        {games.map(game => (
                            <div
                                key={game.id}
                                onClick={() => handleGameClick(game.id)}
                                className="group cursor-pointer rounded-xl p-12 text-center transition-all duration-167 ease-out hover:scale-105 hover:shadow-lg hover:shadow-accent/20 border border-element-light/30 hover:border-accent/50 relative overflow-hidden min-h-[200px] w-80 flex items-center justify-center"
                                onMouseEnter={(e) => {
                                    handleGameHover(game.id);
                                    const backgroundElement = e.currentTarget.querySelector('.background-zoom');
                                    if (backgroundElement) {
                                        backgroundElement.classList.add('zoomed');
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    handleGameLeave();
                                    const backgroundElement = e.currentTarget.querySelector('.background-zoom');
                                    if (backgroundElement) {
                                        backgroundElement.classList.remove('zoomed');
                                    }
                                }}
                            >
                                {/* Background image container */}
                                <div 
                                    className="absolute inset-0 background-zoom"
                                    style={{
                                        backgroundImage: `url(${game.backgroundImage})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                
                                {/* Dark overlay for text readability */}
                                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-all duration-167 ease-out"></div>
                                
                                {/* Content */}
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-accent transition-colors duration-167 ease-out">
                                        {game.name}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-element/1 backdrop-blur-md border-t border-element-light/30 mt-auto">
                <div className="mx-auto px-8 py-6 flex items-center justify-end">
                    <a 
                        href="https://t.me/hpaapipny" 
                        rel="noopener noreferrer" 
                        target="_blank"
                        className="text-accent hover:text-accent-light transition-colors duration-200"
                    >
                        <span className="sr-only">Telegram</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                    </a>
                </div>
            </footer>
            </div>
        </div>
    );
};

export default HomePage;
