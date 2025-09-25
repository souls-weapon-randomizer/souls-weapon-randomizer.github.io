import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameData } from '../../hooks/useGameData';
import { getGameConfig } from '../../games/index.js';
// Import will be dynamic based on game
import Bosses from '../../components/Bosses';
import Roulette from '../../components/Roulette';
import Blacklist from '../../components/Blacklist';
import notificationManager, { NOTIFICATION_TYPES } from '../../components/NotificationManager';

// Clean background without particles
const BackgroundPattern = () => (
    <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Smooth gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background-secondary to-background"></div>
        
        {/* Subtle warm glow overlay */}
        <div 
            className="absolute inset-0 opacity-8"
            style={{
                background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.03) 0%, rgba(245, 158, 11, 0.02) 50%, rgba(217, 119, 6, 0.01) 100%)'
            }}
        ></div>
    </div>
);

const GamePage = () => {
    const { gameId } = useParams();
    const navigate = useNavigate();
    const gameConfig = getGameConfig(gameId);
    
    // Redirect to home if game not found
    useEffect(() => {
        if (!gameConfig) {
            navigate('/');
        }
    }, [gameConfig, navigate]);
    
    if (!gameConfig) {
        return null;
    }
    
    const {
        preferences,
        setPreferences,
        defeatedBosses,
        setDefeatedBosses,
        blacklist,
        setBlacklist,
        randomizedWeapon,
        setRandomizedWeapon,
        currentPage,
        setCurrentPage,
        activeWeapons
    } = useGameData(gameId);
    
    // Local state
    const [showPreferences, setShowPreferences] = useState(false);
    const [showNewGameConfirm, setShowNewGameConfirm] = useState(false);
    
    // Determine which page to show based on current page and preferences
    useEffect(() => {
        const hasPreferences = localStorage.getItem(gameConfig.storageKeys.PREFERENCES);
        
        // Show preferences if:
        // 1. No preferences are saved (first visit)
        // 2. Current page is preferences
        if (!hasPreferences || currentPage === 'preferences') {
            setShowPreferences(true);
        } else {
            setShowPreferences(false);
        }
    }, [currentPage, gameConfig.storageKeys.PREFERENCES]);
    
    const handleSavePreferences = (newPreferences) => {
        setPreferences(newPreferences);
        setCurrentPage('roulette');
        setShowPreferences(false);
    };
    
    const addDefeatedBoss = (bossName) => {
        setDefeatedBosses(prev => {
            if (prev.includes(bossName)) return prev;
            return [...prev, bossName];
        });
        
        // Check if any new weapons are unlocked
        setTimeout(() => {
            const newlyUnlocked = gameConfig.weapons.filter(weapon => {
                if (blacklist.some(w => w.name === weapon.name)) return false;
                
                // Use game-specific filter function with updated defeated bosses
                return gameConfig.filterWeapons(weapon, preferences, [...defeatedBosses, bossName]);
            });
            
            if (newlyUnlocked.length > 0) {
                notificationManager.show({
                    message: `Boss defeated! ${newlyUnlocked.length} new weapon(s) unlocked!`,
                    type: NOTIFICATION_TYPES.SUCCESS,
                    duration: 4000
                });
            } else {
                notificationManager.show({
                    message: `Boss defeated! Weapon blacklisted. No new weapons unlocked.`,
                    type: NOTIFICATION_TYPES.SUCCESS,
                    duration: 4000
                });
            }
        }, 100);
    };
    
    const removeDefeatedBoss = (bossName) => setDefeatedBosses(prev => prev.filter(boss => boss !== bossName));
    
    const addToBlacklist = (weapon) => setBlacklist(prev => {
        if (prev.some(w => w.name === weapon.name)) return prev;
        return [...prev, weapon];
    });
    
    const removeFromBlacklist = (weapon) => setBlacklist(prev => prev.filter(w => w.name !== weapon.name));
    
    const clearSession = () => {
        setPreferences(gameConfig.defaultPreferences);
        setDefeatedBosses([]);
        setBlacklist([]);
        setRandomizedWeapon(null);
        setCurrentPage('preferences');
        setShowNewGameConfirm(false);
        setShowPreferences(true);
        
        notificationManager.show({
            message: `New ${gameConfig.name} game started!`,
            type: NOTIFICATION_TYPES.SUCCESS,
            duration: 3000
        });
    };
    
    const showNewGameConfirmation = () => setShowNewGameConfirm(true);
    const cancelNewGame = () => setShowNewGameConfirm(false);
    
    return (
        <div className="text-text-main min-h-screen font-sans relative">
            <BackgroundPattern />
            <div className="relative z-10 min-h-screen">
                <gameConfig.Preferences 
                    setPreferences={setPreferences} 
                    onSave={handleSavePreferences} 
                    currentPreferences={preferences} 
                    onShowNewGameConfirmation={showNewGameConfirmation} 
                    onClose={handleSavePreferences}
                    gameConfig={gameConfig}
                    isVisible={showPreferences}
                />

                <header className="glass-effect border-b border-element-light/30 p-6 text-center sticky top-0 z-20 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <img 
                                src="/logo.svg" 
                                alt="Souls Weapon Randomizer" 
                                className="w-12 h-12 cursor-pointer hover:scale-105 transition-transform duration-200"
                                onClick={() => navigate('/')}
                            />
                        </div>
                        <div className="flex-1 text-center">
                            <h1 className="text-4xl font-gothic font-bold tracking-wider text-gradient animate-fade-in">
                                {gameConfig.shortName} WEAPON RANDOMIZER
                            </h1>
                            <p className="text-text-secondary mt-2 text-sm font-medium">
                                {gameConfig.description}
                            </p>
                        </div>
                        <div className="flex-1 flex justify-end">
                            <button 
                                onClick={() => {
                                    setCurrentPage('preferences');
                                    setShowPreferences(true);
                                }}
                                className="button-secondary flex items-center gap-2 text-base px-4 py-2"
                            >
                                <span className="cursor-default">⚙️</span>
                                <span>Settings</span>
                            </button>
                        </div>
                    </div>
                </header>

                {!showPreferences ? (
                    <main className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-9 gap-10 max-w-8xl mx-auto animate-slide-up min-h-[calc(100vh-120px)]">
                        {/* Enhanced left sidebar - First on mobile, left on desktop */}
                        <aside className="lg:col-span-2 space-y-8 order-2 lg:order-1">
                            <div className="glass-effect rounded-xl p-6 shadow-lg card-hover">
                                <Bosses 
                                    defeatedBosses={defeatedBosses} 
                                    addDefeatedBoss={addDefeatedBoss}
                                    removeDefeatedBoss={removeDefeatedBoss}
                                    gameConfig={gameConfig}
                                />
                            </div>
                        </aside>

                        {/* Enhanced main content area - Second on mobile, center on desktop */}
                        <section className="lg:col-span-5 h-[1050px] relative z-10 order-1 lg:order-2">
                            <div className="glass-effect rounded-xl p-6 shadow-lg card-hover h-full">
                                <Roulette 
                                    activeWeapons={activeWeapons}
                                    randomizedWeapon={randomizedWeapon}
                                    setRandomizedWeapon={setRandomizedWeapon}
                                    addToBlacklist={addToBlacklist}
                                    addDefeatedBoss={addDefeatedBoss}
                                    defeatedBosses={defeatedBosses}
                                    gameConfig={gameConfig}
                                />
                            </div>
                        </section>

                        {/* Right sidebar - Third on mobile, right on desktop */}
                        <aside className="lg:col-span-2 order-3 lg:order-3">
                            <div className="glass-effect rounded-xl p-6 shadow-lg card-hover">
                                <Blacklist 
                                    blacklist={blacklist}
                                    addToBlacklist={addToBlacklist}
                                    removeFromBlacklist={removeFromBlacklist}
                                    activeWeapons={activeWeapons}
                                />
                            </div>
                        </aside>
                    </main>
                ) : (
                    // Fallback content for debugging
                    <div className="p-6 text-center">
                        <div className="glass-effect rounded-xl p-8 max-w-md mx-auto">
                            <h2 className="text-2xl font-bold text-text-main mb-4">Loading...</h2>
                            <p className="text-text-muted">If you see this message, there might be an issue with the app initialization.</p>
                            <button 
                                onClick={() => {
                                    setCurrentPage('roulette');
                                    setShowPreferences(false);
                                }}
                                className="button-primary mt-4"
                            >
                                Go to Roulette
                            </button>
                        </div>
                    </div>
                )}

                {/* New Game Confirmation Modal */}
                {showNewGameConfirm && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="glass-effect border border-element-light/30 rounded-xl p-8 max-w-md mx-4 shadow-2xl animate-fade-in">
                            <div className="text-center">
                                <h3 className="font-gothic text-2xl text-text-main mb-4">
                                    Start New {gameConfig.name} Game?
                                </h3>
                                <p className="text-text-muted mb-6">
                                    Are you sure you want to start a new game? This will clear all your current progress, defeated bosses, and blacklisted weapons.
                                </p>
                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={cancelNewGame}
                                        className="button-secondary px-6 py-3 flex items-center gap-2"
                                    >
                                        <span className="cursor-default">❌</span>
                                        <span>Cancel</span>
                                    </button>
                                    <button
                                        onClick={clearSession}
                                        className="button-primary px-6 py-3 flex items-center gap-2 bg-orange-600 hover:bg-orange-700 border-orange-500"
                                    >
                                        <span>Start New Game</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                {!showPreferences && (
                    <footer className="border-t border-element-light/30 relative z-20" style={{background: 'linear-gradient(135deg,rgb(41, 40, 38) 0%,rgb(34, 32, 26) 100%)'}}>
                        <div className="mx-auto px-8 py-6 flex items-center justify-end">
                            <a 
                                href="https://t.me/hpaapipny" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-text-muted hover:text-accent transition-colors duration-300 flex items-center gap-2"
                            >
                                <span>Contact Developer</span>
                                <span className="cursor-default">📧</span>
                            </a>
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};

export default GamePage;
