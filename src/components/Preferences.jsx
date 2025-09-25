import React, { useState, useEffect } from 'react';

// -> Logic is the same, just updated with the new theme classes
export default function Preferences({ setPreferences, onSave, currentPreferences, onShowNewGameConfirmation, onClose, gameConfig, isVisible }) {
    // Track if form has been initialized to prevent resetting after user interaction
    const [isInitialized, setIsInitialized] = useState(false);
    
    // Local state to manage form values
    const [formState, setFormState] = useState({
        startingClass: currentPreferences?.startingClass || gameConfig?.startingClasses?.[0] || 'Warrior',
        startingGift: currentPreferences?.startingGift || 'Black Firebomb',
        readyToFarm: currentPreferences?.readyToFarm || false,
        allowNotGuaranteed: currentPreferences?.allowNotGuaranteed || false,
        allowPyromancy: currentPreferences?.allowPyromancy || false,
        allowCatalysts: currentPreferences?.allowCatalysts || false,
        allowTalismans: currentPreferences?.allowTalismans || false,
        allowRanged: currentPreferences?.allowRanged || false,
        allowConsumables: currentPreferences?.allowConsumables || false,
        allowBlackKnightWeapons: currentPreferences?.allowBlackKnightWeapons || false,
        useMasterKey: currentPreferences?.useMasterKey || false,
    });

    // Only initialize form state once when component first mounts
    useEffect(() => {
        if (currentPreferences && !isInitialized) {
            setFormState({
                startingClass: currentPreferences.startingClass || gameConfig?.startingClasses?.[0] || 'Warrior',
                startingGift: currentPreferences.startingGift || 'Black Firebomb',
                readyToFarm: currentPreferences.readyToFarm || false,
                allowNotGuaranteed: currentPreferences.allowNotGuaranteed || false,
                allowPyromancy: currentPreferences.allowPyromancy || false,
                allowCatalysts: currentPreferences.allowCatalysts || false,
                allowTalismans: currentPreferences.allowTalismans || false,
                allowRanged: currentPreferences.allowRanged || false,
                allowConsumables: currentPreferences.allowConsumables || false,
                allowBlackKnightWeapons: currentPreferences.allowBlackKnightWeapons || false,
                useMasterKey: currentPreferences.useMasterKey || false,
            });
            setIsInitialized(true);
        }
    }, [currentPreferences, gameConfig, isInitialized]);

    const handleInputChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormState(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setPreferences(formState);
        onSave(formState);
    };

    return (
        <div className={`fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300 ${
            isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}>
            <div className="glass-effect p-8 rounded-2xl shadow-2xl w-full max-w-3xl border border-element-light/50 animate-slide-up">
                <div className="text-center mb-8 relative">
                    {currentPreferences && onClose && (
                        <button
                            onClick={() => {
                                setPreferences(formState);
                                onSave(formState);
                            }}
                            className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center rounded-full bg-element-light/20 hover:bg-element-light/30 transition-colors duration-200"
                        >
                            <span className="cursor-default text-text-main text-lg">✕</span>
                        </button>
                    )}
                    <h2 className="text-3xl font-gothic font-bold text-gradient mb-2">
                        Setup Your {gameConfig?.name || 'Game'} Run
                    </h2>
                    <p className="text-text-secondary">
                        Configure your randomized {gameConfig?.name || 'game'} experience
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label htmlFor="startingClass" className="block text-text-main font-semibold mb-3 flex items-center gap-2">
                            <span>🎭</span>
                            <span>Starting Class</span>
                        </label>
                        <select 
                            name="startingClass" 
                            id="startingClass" 
                            className="input-field w-full"
                            value={formState.startingClass}
                            onChange={handleInputChange}
                        >
                            {gameConfig.startingClasses.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label htmlFor="startingGift" className="block text-text-main font-semibold mb-3 flex items-center gap-2">
                            <span>🎁</span>
                            <span>Starting Gift</span>
                        </label>
                        <select 
                            name="startingGift" 
                            id="startingGift" 
                            className="input-field w-full"
                            value={formState.startingGift}
                            onChange={handleInputChange}
                        >
                            <option value="Black Firebomb">Black Firebomb</option>
                            <option value="Master Key">Master Key</option>
                            <option value="Something else">Something else</option>
                        </select>
                    </div>
                    
                    <div>
                        <h3 className="text-xl font-semibold text-text-main mb-4 flex items-center gap-2">
                            <span className="cursor-default">⚙️</span>
                            <span>Weapon Preferences</span>
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="flex items-center p-3 bg-element-light/30 rounded-lg border border-element-light/50 cursor-pointer hover:bg-element-light/50 transition-colors">
                                <input 
                                    type="checkbox" 
                                    name="readyToFarm" 
                                    checked={formState.readyToFarm}
                                    onChange={handleInputChange}
                                    className="h-5 w-5 bg-element-light border-element-light rounded text-accent focus:ring-accent focus:ring-2" 
                                />
                                <span className="ml-3 text-text-secondary font-medium">I'm okay with farming for weapons</span>
                            </label>
                            
                            <label className="flex items-center p-3 bg-element-light/30 rounded-lg border border-element-light/50 cursor-pointer hover:bg-element-light/50 transition-colors">
                                <input 
                                    type="checkbox" 
                                    name="allowNotGuaranteed" 
                                    checked={formState.allowNotGuaranteed}
                                    onChange={handleInputChange}
                                    className="h-5 w-5 bg-element-light border-element-light rounded text-accent focus:ring-accent focus:ring-2" 
                                />
                                <span className="ml-3 text-text-secondary font-medium">Allow unguaranteed weapons</span>
                            </label>
                            
                            <label className="flex items-center p-3 bg-element-light/30 rounded-lg border border-element-light/50 cursor-pointer hover:bg-element-light/50 transition-colors">
                                <input 
                                    type="checkbox" 
                                    name="allowRanged" 
                                    checked={formState.allowRanged}
                                    onChange={handleInputChange}
                                    className="h-5 w-5 bg-element-light border-element-light rounded text-accent focus:ring-accent focus:ring-2" 
                                />
                                <span className="ml-3 text-text-secondary font-medium">Allow Ranged Weapons</span>
                            </label>
                            
                            <label className="flex items-center p-3 bg-element-light/30 rounded-lg border border-element-light/50 cursor-pointer hover:bg-element-light/50 transition-colors">
                                <input 
                                    type="checkbox" 
                                    name="allowPyromancy" 
                                    checked={formState.allowPyromancy}
                                    onChange={handleInputChange}
                                    className="h-5 w-5 bg-element-light border-element-light rounded text-accent focus:ring-accent focus:ring-2" 
                                />
                                <span className="ml-3 text-text-secondary font-medium">Allow Pyromancy Flame</span>
                            </label>
                            
                            <label className="flex items-center p-3 bg-element-light/30 rounded-lg border border-element-light/50 cursor-pointer hover:bg-element-light/50 transition-colors">
                                <input 
                                    type="checkbox" 
                                    name="allowCatalysts" 
                                    checked={formState.allowCatalysts}
                                    onChange={handleInputChange}
                                    className="h-5 w-5 bg-element-light border-element-light rounded text-accent focus:ring-accent focus:ring-2" 
                                />
                                <span className="ml-3 text-text-secondary font-medium">Allow Catalysts</span>
                            </label>
                            
                            <label className="flex items-center p-3 bg-element-light/30 rounded-lg border border-element-light/50 cursor-pointer hover:bg-element-light/50 transition-colors">
                                <input 
                                    type="checkbox" 
                                    name="allowTalismans" 
                                    checked={formState.allowTalismans}
                                    onChange={handleInputChange}
                                    className="h-5 w-5 bg-element-light border-element-light rounded text-accent focus:ring-accent focus:ring-2" 
                                />
                                <span className="ml-3 text-text-secondary font-medium">Allow Talismans</span>
                            </label>

                            <label className="flex items-center p-3 bg-element-light/30 rounded-lg border border-element-light/50 cursor-pointer hover:bg-element-light/50 transition-colors">
                                <input 
                                    type="checkbox" 
                                    name="allowConsumables" 
                                    checked={formState.allowConsumables}
                                    onChange={handleInputChange}
                                    className="h-5 w-5 bg-element-light border-element-light rounded text-accent focus:ring-accent focus:ring-2" 
                                />
                                <span className="ml-3 text-text-secondary font-medium">Allow Consumables</span>
                            </label>

                            {gameConfig?.features?.blackKnightWeapons && (
                                <label className="flex items-center p-3 bg-element-light/30 rounded-lg border border-element-light/50 cursor-pointer hover:bg-element-light/50 transition-colors">
                                    <input 
                                        type="checkbox" 
                                        name="allowBlackKnightWeapons" 
                                        checked={formState.allowBlackKnightWeapons}
                                        onChange={handleInputChange}
                                        className="h-5 w-5 bg-element-light border-element-light rounded text-accent focus:ring-accent focus:ring-2" 
                                    />
                                    <span className="ml-3 text-text-secondary font-medium">Allow Black Knight Weapons</span>
                                </label>
                            )}
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <button 
                            type="submit" 
                            className="button-primary w-full text-lg py-4 flex items-center justify-center gap-2"
                        >
                            <span className="cursor-default">🚀</span>
                            <span>{currentPreferences ? 'Continue the Journey' : 'Begin the Journey'}</span>
                        </button>
                        
                        {currentPreferences && (
                            <button
                                type="button"
                                onClick={onShowNewGameConfirmation}
                                className="w-full text-lg py-4 flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 border border-orange-500 transition-all duration-300 transform hover:scale-105 font-semibold rounded-lg"
                            >
                                <span className="cursor-default">🎯</span>
                                <span>New Game</span>
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}