import React, { useState, useEffect } from 'react';
import { Wheel } from 'react-custom-roulette';
import { allBosses } from '../data/bosses';
import WeaponDisplay from './WeaponDisplay';
import BossSelectionModal from './BossSelectionModal';

// Enhanced color palette with more vibrant and pleasant colors
const richWarmWheelColors = [
  '#fbbf24', // Bright golden
  '#f59e0b', // Amber
  '#ea580c', // Orange
  '#dc2626', // Red
  '#b91c1c', // Dark red
  '#92400e', // Dark amber
  '#ca8a04', // Yellow
  '#d97706', // Dark amber
];


export default function Roulette({ activeWeapons, randomizedWeapon, setRandomizedWeapon, addToBlacklist, showNotification, addDefeatedBoss, defeatedBosses }) {
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [wheelData, setWheelData] = useState([{ option: 'No Weapons' }]);
    const [showBossSelection, setShowBossSelection] = useState(false);
    const [selectedBoss, setSelectedBoss] = useState('');

    useEffect(() => {
        const data = activeWeapons.length > 0
            ? activeWeapons.map(weapon => ({ 
                option: weapon.name.length > 15 ? weapon.name.substring(0, 12) + '...' : weapon.name 
              }))
            : [{ option: 'No Weapons Available', style: { textColor: '#a8a29e' } }];
        setWheelData(data);
    }, [activeWeapons]);

    useEffect(() => {
        if (showBossSelection) {
            const availableBosses = allBosses.filter(b => !defeatedBosses.includes(b));
            if (availableBosses.length > 0) {
                setSelectedBoss(availableBosses[0]);
            } else {
                setSelectedBoss('');
            }
        }
    }, [showBossSelection, defeatedBosses]);

    const handleSpinClick = () => {
        if (activeWeapons.length > 0 && !mustSpin) {
            const newPrizeNumber = Math.floor(Math.random() * activeWeapons.length);
            setPrizeNumber(newPrizeNumber);
            setMustSpin(true);
        }
    };

    const onStopSpinning = () => {
        setMustSpin(false);
        setRandomizedWeapon(activeWeapons[prizeNumber]);
    };

    const handleBossSelection = () => {
        if (selectedBoss) {
            addToBlacklist(randomizedWeapon);
            addDefeatedBoss(selectedBoss);
            setShowBossSelection(false);
            setRandomizedWeapon(null);
        }
    };

    const handleCancelBossSelection = () => {
        setShowBossSelection(false);
    };

    // Boss selection modal overlay
    if (showBossSelection) {
        const availableBosses = allBosses.filter(b => !defeatedBosses.includes(b));
        
        return (
            <>
                {randomizedWeapon && (
                    <WeaponDisplay 
                        weapon={randomizedWeapon}
                        onReroll={() => setRandomizedWeapon(null)}
                        onBossDefeated={() => setShowBossSelection(true)}
                        onBlacklist={() => {
                            addToBlacklist(randomizedWeapon);
                            setRandomizedWeapon(null);
                        }}
                    />
                )}
                
                <BossSelectionModal 
                    availableBosses={availableBosses}
                    selectedBoss={selectedBoss}
                    onBossChange={setSelectedBoss}
                    onConfirm={handleBossSelection}
                    onCancel={handleCancelBossSelection}
                    isDisabled={!selectedBoss}
                />
            </>
        );
    }

    if (randomizedWeapon) {
        return (
            <WeaponDisplay 
                weapon={randomizedWeapon}
                onReroll={() => setRandomizedWeapon(null)}
                onBossDefeated={() => setShowBossSelection(true)}
                onBlacklist={() => {
                    addToBlacklist(randomizedWeapon);
                    setRandomizedWeapon(null);
                }}
            />
        );
    }

    // If no weapons available, show only message
    if (activeWeapons.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="mb-6">
                    <h3 className="text-2xl font-gothic font-bold text-gradient mb-2">Weapon Roulette</h3>
                    <p className="text-text-secondary">
                        <span className="text-accent font-semibold">0</span> weapons available in the pool
                    </p>
                </div>
                
                <div className="text-center">
                    <p className="text-text-muted text-sm">Adjust your preferences or defeat more bosses</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center text-center py-6">
            <div className="mb-6">
                <h3 className="text-2xl font-gothic font-bold text-gradient mb-2">Weapon Roulette</h3>
                <p className="text-text-secondary">
                    <span className="text-accent font-semibold">{activeWeapons.length}</span> weapons available in the pool
                </p>
            </div>
            
            <div className="relative w-full max-w-[60vh] aspect-square flex items-center justify-center mb-4">
                {/* Glow effect behind wheel */}
                <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-accent-light/5 rounded-full blur-2xl scale-110"></div>
                
                <Wheel
                    mustStartSpinning={mustSpin}
                    prizeNumber={prizeNumber}
                    data={wheelData}
                    onStopSpinning={onStopSpinning}
                    
                    // Enhanced styling with larger wheel
                    backgroundColors={richWarmWheelColors}
                    textColors={['#f5f5f5']}
                    outerBorderColor='#4a4a4a'
                    outerBorderWidth={8}
                    innerBorderColor='#4a4a4a'
                    radiusLineColor='#4a4a4a'
                    radiusLineWidth={4}
                    fontSize={14}
                    textDistance={50}
                    
                    // // Custom pointer with proper positioning
                    // pointerProps={{
                    //     src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23fbbf24'%3E%3Cpath d='M12 0C11.493 0 11.034.404 10.938.908l-2.738 13.69A1 1 0 009.2 16h5.6a1 1 0 00.992-1.402L13.062.908A1 1 0 0012 0z'/%3E%3C/svg%3E",
                    //     style: { 
                    //         width: '35px', 
                    //         transform: 'rotate(180deg) translateY(-35px)',
                    //         filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.8))'
                    //     }
                    // }}
                />
                
                <button 
                    onClick={handleSpinClick} 
                    className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-accent to-accent-hover border-4 border-accent-light/30 text-white font-display font-bold text-xl shadow-glow hover:shadow-glow-lg transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    disabled={activeWeapons.length === 0 || mustSpin}
                >
                    <span className="flex flex-col items-center">
                        <span className="text-3xl mb-1 cursor-default">🎲</span>
                        <span>SPIN</span>
                    </span>
                </button>
            </div>
            
            <div className="text-center">
                <button 
                    onClick={handleSpinClick} 
                    className="button-primary text-lg px-8 py-3 flex items-center gap-3 mx-auto"
                    disabled={mustSpin}
                >
                    <span className="text-2xl cursor-default">🎲</span>
                    <span>Roll</span>
                </button>
            </div>
        </div>
    );

}