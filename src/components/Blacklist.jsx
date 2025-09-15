import React, { useState, useEffect } from 'react';

export default function Blacklist({ blacklist, addToBlacklist, removeFromBlacklist, activeWeapons }) {
    const [selectedWeapon, setSelectedWeapon] = useState('');
    
    // Get available weapons from current roulette pool (not in blacklist)
    const availableWeapons = activeWeapons.filter(weapon => 
        !blacklist.some(b => b.name === weapon.name)
    );

    useEffect(() => {
        if (availableWeapons.length > 0) setSelectedWeapon(availableWeapons[0].name);
        else setSelectedWeapon('');
    }, [blacklist, activeWeapons]);

    const handleAddToBlacklist = (weaponName) => {
        const weapon = activeWeapons.find(w => w.name === weaponName);
        if (weapon) {
            addToBlacklist(weapon);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-gothic font-bold text-gradient mb-4 flex items-center gap-2">
                    <span className="cursor-default">🚫</span>
                    <span>Blacklisted Weapons</span>
                </h3>
                
                <div className="bg-element-light/30 rounded-lg p-4 min-h-[120px] border border-element-light/50">
                    {blacklist.length > 0 ? (
                        <div className="space-y-2">
                            {blacklist.map(weapon => (
                                <div key={weapon.name} className="flex items-center justify-between p-2 bg-element/50 rounded border border-element-light/30">
                                    <div className="flex items-center gap-3">
                                        <img 
                                            src={weapon.img} 
                                            alt={weapon.name}
                                            className="w-8 h-8 object-contain"
                                        />
                                        <span className="text-text-secondary text-sm font-bold">{weapon.name}</span>
                                    </div>
                                    <button 
                                        onClick={() => removeFromBlacklist(weapon)}
                                        className="text-error hover:text-error/80 transition-colors p-1"
                                        title="Remove from blacklist"
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
                            <p className="text-text-muted text-sm">No weapons blacklisted.</p>
                            <p className="text-text-muted text-xs mt-1">Add weapons from the current pool to exclude them.</p>
                        </div>
                    )}
                </div>
            </div>
            
            <div>
                <h4 className="text-lg font-semibold text-text-main mb-3 flex items-center gap-2">
                    <span className="cursor-default">➕</span>
                    <span>Add to Blacklist</span>
                    <span 
                        className="text-accent text-sm font-normal cursor-default"
                        title="Add weapons from the current pool to exclude them."
                    >
                        ?
                    </span>
                </h4>
                
                <div className="space-y-3">
                    <select 
                        value={selectedWeapon} 
                        onChange={(e) => setSelectedWeapon(e.target.value)} 
                        className="input-field w-full text-sm"
                    >
                        {availableWeapons.map(weapon => (
                            <option key={weapon.name} value={weapon.name}>{weapon.name}</option>
                        ))}
                    </select>
                    
                    <button 
                        onClick={() => handleAddToBlacklist(selectedWeapon)} 
                        disabled={!selectedWeapon} 
                        className="button-primary w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <span>Add to Blacklist</span>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
