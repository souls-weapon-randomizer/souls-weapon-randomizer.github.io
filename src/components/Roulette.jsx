import React, { useState, useEffect, useRef, useCallback } from 'react';
import { allBosses } from '../data/bosses';
import WeaponDisplay from './WeaponDisplay';
import BossSelectionModal from './BossSelectionModal';
import CustomWheel from './CustomWheel';

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
    const wheelRef = useRef(null);

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

    const handleSpinClick = useCallback(() => {
        if (activeWeapons.length === 0 || mustSpin) {
            return;
        }
        
        setMustSpin(true);
        if (wheelRef.current) {
            wheelRef.current.startSpin();
        }
    }, [activeWeapons.length, mustSpin]);

    const onStopSpinning = useCallback((winningIndex, winningItem) => {
        if (winningItem && activeWeapons[winningIndex]) {
            setMustSpin(false);
            setRandomizedWeapon(activeWeapons[winningIndex]);
        }
    }, [activeWeapons]);

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
            <div className="mb-20">
                <h3 className="text-2xl font-gothic font-bold text-gradient mb-2">Weapon Roulette</h3>
                <p className="text-text-secondary">
                    <span className="text-accent font-semibold">{activeWeapons.length}</span> weapons available in the pool
                </p>
            </div>
            
            <div className="relative w-full flex items-center justify-center mb-4" style={{ height: '700px' }}>
                {/* Glow effect behind wheel */}
                <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-accent-light/5 rounded-full blur-2xl scale-110"></div>
                
                <CustomWheel
                    ref={wheelRef}
                    items={activeWeapons.length > 0 ? activeWeapons.map(w => w.name) : ['No Weapons Available']}
                    onSpinComplete={onStopSpinning}
                    isSpinning={mustSpin}
                    colors={richWarmWheelColors}
                />
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