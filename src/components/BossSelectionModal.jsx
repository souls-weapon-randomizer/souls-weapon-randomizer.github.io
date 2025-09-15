import React from 'react';
import { isDlcBoss } from '../data/bosses';

// Modal component for selecting defeated boss
const BossSelectionModal = ({ 
    availableBosses, 
    selectedBoss, 
    onBossChange, 
    onConfirm, 
    onCancel, 
    isDisabled 
}) => (
    <div 
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4 animate-fade-in"
        style={{
            isolation: 'isolate',
            transform: 'translateZ(0)',
            willChange: 'auto'
        }}
    >
        <div 
            className="bg-element/90 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-element-light/50 animate-slide-up"
            style={{
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
                perspective: '1000px',
                filter: 'none !important',
                backdropFilter: 'none !important'
            }}
        >
            <div className="text-center mb-6">
                <h3 className="text-2xl font-gothic font-bold text-gradient mb-2">Select Defeated Boss</h3>
                <p className="text-text-secondary">Choose which boss you defeated with this weapon</p>
            </div>
            
            <div className="space-y-4">
                <select 
                    value={selectedBoss} 
                    onChange={(e) => onBossChange(e.target.value)} 
                    className="input-field w-full"
                >
                    {availableBosses.map(boss => (
                        <option key={boss} value={boss}>
                            {isDlcBoss(boss) ? `${boss} (DLC)` : boss}
                        </option>
                    ))}
                </select>
                
                <div className="flex gap-3">
                    <button 
                        onClick={onConfirm}
                        disabled={isDisabled}
                        className="button-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <span className="cursor-default">💀</span>
                            <span>Confirm</span>
                        </span>
                    </button>
                    <button 
                        onClick={onCancel}
                        className="button-secondary flex-1"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <span className="cursor-default">❌</span>
                            <span>Cancel</span>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export default BossSelectionModal;
