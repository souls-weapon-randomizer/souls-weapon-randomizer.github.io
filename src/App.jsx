import React, { useState, useEffect } from 'react';
import Preferences from './components/Preferences';
import Bosses from './components/Bosses';
import Roulette from './components/Roulette';
import Blacklist from './components/Blacklist';
import notificationManager, { NOTIFICATION_TYPES } from './components/NotificationManager';
import { useLocalStorage } from './hooks/useLocalStorage';
import { STORAGE_KEYS, DEFAULT_VALUES, PAGES } from './constants/storage';
import { allWeapons } from './data/weapons';
import { allWeapons as allWeaponsMC } from './data/dsr_mc_weapons';

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


function App() {
    // Use localStorage hook for persistent data
    const [preferences, setPreferences] = useLocalStorage(STORAGE_KEYS.PREFERENCES, DEFAULT_VALUES.PREFERENCES);
    const [defeatedBosses, setDefeatedBosses] = useLocalStorage(STORAGE_KEYS.DEFEATED_BOSSES, DEFAULT_VALUES.DEFEATED_BOSSES);
    const [blacklist, setBlacklist] = useLocalStorage(STORAGE_KEYS.BLACKLIST, DEFAULT_VALUES.BLACKLIST);
    const [currentPage, setCurrentPage] = useLocalStorage(STORAGE_KEYS.CURRENT_PAGE, DEFAULT_VALUES.CURRENT_PAGE);
    
    // Local state
    const [showPreferences, setShowPreferences] = useState(false);
    
    // Determine which page to show based on current page and preferences
    useEffect(() => {
        const hasPreferences = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
        
        // Show preferences if:
        // 1. No preferences are saved (first visit)
        // 2. Current page is preferences
        if (!hasPreferences || currentPage === PAGES.PREFERENCES) {
            setShowPreferences(true);
        } else {
            setShowPreferences(false);
        }
    }, [currentPage]);


    const [randomizedWeapon, setRandomizedWeapon] = useLocalStorage(STORAGE_KEYS.RANDOMIZED_WEAPON, DEFAULT_VALUES.RANDOMIZED_WEAPON);
    const [activeWeapons, setActiveWeapons] = useState([]);
    const [showNewGameConfirm, setShowNewGameConfirm] = useState(false);
    
    // Use new notification system
    const showNotification = (notification) => {
        return notificationManager.addNotification(notification);
    };



    useEffect(() => {
        if (!preferences) return;
        
        // Choose the correct weapon dataset based on Master Key setting
        const weaponsData = preferences.useMasterKey ? allWeaponsMC : allWeapons;
        
        const filtered = weaponsData.filter(weapon => {
            if (blacklist.some(b => b.name === weapon.name)) return false;
            if (weapon.type === 'Pyromancy Flame' && !preferences.allowPyromancy) return false;
            if (weapon.type === 'Catalyst' && !preferences.allowCatalysts) return false;
            if (weapon.type === 'Talisman' && !preferences.allowTalismans) return false;
            const isRanged = weapon.type === 'Bow' || weapon.type === 'Greatbow' || weapon.type === 'Crossbow';
            if (isRanged && !preferences.allowRanged) return false;
            if (weapon.type === 'Consumable' && !preferences.allowConsumables) return false;
            if (weapon.black_knight_weapon && !preferences.allowBlackKnightWeapons) return false;
            if (weapon.starting_class === preferences.startingClass) return true;
            if (weapon.not_guaranteed && !preferences.allowNotGuaranteed) return false;
            if (weapon.farmable_only && !preferences.readyToFarm) return false;
            
            // Check required bosses - use alternative bosses if Master Key is enabled and they exist
            let reqs = (weapon.required_bosses_with_farm && preferences.readyToFarm) ? weapon.required_bosses_with_farm : weapon.required_bosses;
            
            // If Master Key is enabled and alternative bosses exist, use them
            if (preferences.useMasterKey && weapon.required_bosses_alternative) {
                reqs = weapon.required_bosses_alternative;
            }
            
            if (!reqs || reqs.length === 0) return true;
            return reqs.every(boss => defeatedBosses.includes(boss));
        });
        setActiveWeapons(filtered);
    }, [preferences, defeatedBosses, blacklist]);
    const handleSavePreferences = () => {
        setShowPreferences(false);
        // Set current page to roulette when user closes preferences
        setCurrentPage(PAGES.ROULETTE);
    };
    const addDefeatedBoss = (bossName) => { 
        if (!defeatedBosses.includes(bossName)) {
            const oldWeaponCount = activeWeapons.length;
            setDefeatedBosses(prev => [...prev, bossName]);
            
            // Calculate new weapon count after boss is added
            setTimeout(() => {
                // Choose the correct weapon dataset based on Master Key setting
                const weaponsData = preferences.useMasterKey ? allWeaponsMC : allWeapons;
                
                const newFiltered = weaponsData.filter(weapon => {
                    if (blacklist.some(b => b.name === weapon.name)) return false;
                    if (weapon.type === 'Pyromancy Flame' && !preferences.allowPyromancy) return false;
                    if (weapon.type === 'Catalyst' && !preferences.allowCatalysts) return false;
                    if (weapon.type === 'Talisman' && !preferences.allowTalismans) return false;
                    const isRanged = weapon.type === 'Bow' || weapon.type === 'Greatbow' || weapon.type === 'Crossbow';
                    if (isRanged && !preferences.allowRanged) return false;
                    if (weapon.type === 'Consumable' && !preferences.allowConsumables) return false;
                    if (weapon.black_knight_weapon && !preferences.allowBlackKnightWeapons) return false;
                    if (weapon.starting_class === preferences.startingClass) return true;
                    if (weapon.not_guaranteed && !preferences.allowNotGuaranteed) return false;
                    if (weapon.farmable_only && !preferences.readyToFarm) return false;
                    
                    // Check required bosses - use alternative bosses if Master Key is enabled and they exist
                    let reqs = (weapon.required_bosses_with_farm && preferences.readyToFarm) ? weapon.required_bosses_with_farm : weapon.required_bosses;
                    
                    // If Master Key is enabled and alternative bosses exist, use them
                    if (preferences.useMasterKey && weapon.required_bosses_alternative) {
                        reqs = weapon.required_bosses_alternative;
                    }
                    
                    const validReqs = reqs ? reqs.filter(boss => boss && boss.trim() !== '') : [];
                    if (!validReqs || validReqs.length === 0) return true;
                    return validReqs.every(boss => [...defeatedBosses, bossName].includes(boss));
                });
                
                const newWeaponCount = newFiltered.length;
                const addedWeapons = newWeaponCount - oldWeaponCount;
                
                if (addedWeapons > 0) {
                    showNotification({
                        message: `Boss defeated! ${addedWeapons} new weapon${addedWeapons > 1 ? 's' : ''} added to roulette and weapon blacklisted!`,
                        type: NOTIFICATION_TYPES.SUCCESS,
                        duration: 5000
                    });
                } else {
                    showNotification({
                        message: `Boss defeated! Weapon blacklisted. No new weapons unlocked.`,
                        type: NOTIFICATION_TYPES.SUCCESS,
                        duration: 4000
                    });
                }
            }, 100);
        }
    };
    const removeDefeatedBoss = (bossName) => setDefeatedBosses(prev => prev.filter(boss => boss !== bossName));
    const addToBlacklist = (weapon) => setBlacklist(prev => {
        // Check if weapon is already in blacklist
        if (prev.some(w => w.name === weapon.name)) {
            return prev; // Return unchanged list if already exists
        }
        return [...prev, weapon]; // Add weapon if not already in list
    });
    const removeFromBlacklist = (weapon) => setBlacklist(prev => prev.filter(w => w.name !== weapon.name));
    

    // Show new game confirmation
    const showNewGameConfirmation = () => {
        setShowNewGameConfirm(true);
    };

    // Clear session data
    const clearSession = () => {
        setPreferences(DEFAULT_VALUES.PREFERENCES);
        setDefeatedBosses(DEFAULT_VALUES.DEFEATED_BOSSES);
        setBlacklist(DEFAULT_VALUES.BLACKLIST);
        setRandomizedWeapon(DEFAULT_VALUES.RANDOMIZED_WEAPON);
        setCurrentPage(DEFAULT_VALUES.CURRENT_PAGE);
        setShowPreferences(true);
        setShowNewGameConfirm(false);
        showNotification({
            message: "Session cleared! Starting fresh.",
            type: NOTIFICATION_TYPES.INFO,
            duration: 3000
        });
    };

    // Cancel new game
    const cancelNewGame = () => {
        setShowNewGameConfirm(false);
    };


    return (
        <div className="text-text-main min-h-screen font-sans relative">
            <BackgroundPattern />
            <div className="relative z-10 min-h-screen">
                {showPreferences && <Preferences setPreferences={setPreferences} onSave={handleSavePreferences} currentPreferences={preferences} onShowNewGameConfirmation={showNewGameConfirmation} onClose={handleSavePreferences} />}

                <header className="glass-effect border-b border-element-light/30 p-6 text-center sticky top-0 z-20 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex-1"></div>
                        <div className="flex-1 text-center">
                            <h1 className="text-4xl font-gothic font-bold tracking-wider text-gradient animate-fade-in">
                                DSR WEAPON RANDOMIZER
                            </h1>
                            <p className="text-text-secondary mt-2 text-sm font-medium">
                                Embark on your randomized journey through Lordran
                            </p>
                        </div>
                        <div className="flex-1 flex justify-end">
                            <button 
                                onClick={() => {
                                    setCurrentPage(PAGES.PREFERENCES);
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

                {!showPreferences && (
                    <main className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-9 gap-10 max-w-8xl mx-auto animate-slide-up min-h-[calc(100vh-120px)]">
                        {/* Enhanced left sidebar - First on mobile, left on desktop */}
                        <aside className="lg:col-span-2 space-y-8 order-2 lg:order-1">
                            <div className="glass-effect rounded-xl p-6 shadow-lg card-hover">
                                <Bosses 
                                    defeatedBosses={defeatedBosses} 
                                    addDefeatedBoss={addDefeatedBoss}
                                    removeDefeatedBoss={removeDefeatedBoss}
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
                )}

                {/* New Game Confirmation Modal */}
            {showNewGameConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="glass-effect border border-element-light/30 rounded-xl p-8 max-w-md mx-4 shadow-2xl animate-fade-in">
                        <div className="text-center">
                            <h3 className="font-gothic text-2xl text-text-main mb-4">
                                🎯 New Game
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
                )}
            </div>
        </div>
    );
}

export default App;