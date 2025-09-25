import React, { useState, useEffect } from 'react';

export default function Bosses({ defeatedBosses, addDefeatedBoss, removeDefeatedBoss, gameConfig }) {
    const [selectedBoss, setSelectedBoss] = useState('');
    const allBosses = gameConfig?.allBosses || [];
    const availableBosses = allBosses.filter(b => !defeatedBosses.includes(b));
    useEffect(() => {
        if (availableBosses.length > 0) setSelectedBoss(availableBosses[0]);
        else setSelectedBoss('');
    }, [defeatedBosses]);
    const handleAddBoss = () => { 
        if (selectedBoss) {
            addDefeatedBoss(selectedBoss);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-gothic font-bold text-gradient mb-4 flex items-center gap-2">
                    <span className="cursor-default">👑</span>
                    <span>Defeated Bosses</span>
                </h3>
                
                <div className="bg-element-light/30 rounded-lg p-4 min-h-[120px] border border-element-light/50">
                    {defeatedBosses.length > 0 ? (
                        <div className="space-y-2">
                            {defeatedBosses.map((boss, index) => (
                                <div key={boss} className={`flex items-center justify-between p-2 rounded border border-element-light/90 shadow-xl ${index % 2 === 0 ? 'bg-element/80' : 'bg-element-light/60'}`}>
                                    <div className="flex items-center gap-2">
                                        <span className="text-accent cursor-default">✓</span>
                                        <span className={`text-sm font-bold ${gameConfig?.isDlcBoss?.(boss) ? 'text-blue-400' : 'text-text-secondary'}`}>
                                            {boss}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={() => removeDefeatedBoss(boss)}
                                        className="text-error hover:text-error/80 transition-colors p-1 rounded"
                                        title="Remove from defeated bosses"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-text-muted text-sm">No bosses defeated yet.</p>
                            <p className="text-text-muted text-xs mt-1">Defeat bosses to unlock more weapons!</p>
                        </div>
                    )}
                </div>
            </div>
            
            <div>
                <h4 className="text-lg font-semibold text-text-main mb-3 flex items-center gap-2">
                    <span className="cursor-default">💀</span>
                    <span>Add Defeated Boss</span>
                </h4>
                
                <div className="space-y-3">
                    <select 
                        value={selectedBoss} 
                        onChange={(e) => setSelectedBoss(e.target.value)} 
                        className="input-field w-full text-sm"
                    >
                        {availableBosses.map(boss => (
                            <option key={boss} value={boss}>
                                {gameConfig?.isDlcBoss?.(boss) ? `${boss} (DLC)` : boss}
                            </option>
                        ))}
                    </select>
                    
                    <button 
                        onClick={handleAddBoss} 
                        disabled={!selectedBoss} 
                        className="button-primary w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <span>Add Boss</span>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}