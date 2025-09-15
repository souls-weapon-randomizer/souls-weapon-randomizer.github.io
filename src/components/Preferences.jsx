import React from 'react';
import { startingClasses } from '../data/bosses';

// -> Logic is the same, just updated with the new theme classes
export default function Preferences({ setPreferences, onSave, currentPreferences, onShowNewGameConfirmation, onClose }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const prefs = {
            startingClass: formData.get('startingClass'),
            readyToFarm: formData.get('readyToFarm') === 'on',
            allowNotGuaranteed: formData.get('allowNotGuaranteed') === 'on',
            allowPyromancy: formData.get('allowPyromancy') === 'on',
            allowCatalysts: formData.get('allowCatalysts') === 'on',
            allowTalismans: formData.get('allowTalismans') === 'on',
            allowRanged: formData.get('allowRanged') === 'on',
            allowConsumables: formData.get('allowConsumables') === 'on',
        };
        setPreferences(prefs);
        onSave();
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="glass-effect p-8 rounded-2xl shadow-2xl w-full max-w-3xl border border-element-light/50 animate-slide-up">
                <div className="text-center mb-8 relative">
                    {currentPreferences && onClose && (
                        <button
                            onClick={onClose}
                            className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center rounded-full bg-element-light/20 hover:bg-element-light/30 transition-colors duration-200"
                        >
                            <span className="cursor-default text-text-main text-lg">✕</span>
                        </button>
                    )}
                    <h2 className="text-3xl font-gothic font-bold text-gradient mb-2">Setup Your Run</h2>
                    <p className="text-text-secondary">Configure your randomized Dark Souls Remastered experience</p>
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
                            defaultValue={currentPreferences?.startingClass || startingClasses[0]}
                        >
                            {startingClasses.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
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
                                    defaultChecked={currentPreferences?.readyToFarm ?? false}
                                    className="h-5 w-5 bg-element-light border-element-light rounded text-accent focus:ring-accent focus:ring-2" 
                                />
                                <span className="ml-3 text-text-secondary font-medium">I'm okay with farming for weapons</span>
                            </label>
                            
                            <label className="flex items-center p-3 bg-element-light/30 rounded-lg border border-element-light/50 cursor-pointer hover:bg-element-light/50 transition-colors">
                                <input 
                                    type="checkbox" 
                                    name="allowNotGuaranteed" 
                                    defaultChecked={currentPreferences?.allowNotGuaranteed ?? false}
                                    className="h-5 w-5 bg-element-light border-element-light rounded text-accent focus:ring-accent focus:ring-2" 
                                />
                                <span className="ml-3 text-text-secondary font-medium">Allow unguaranteed weapons</span>
                            </label>
                            
                            <label className="flex items-center p-3 bg-element-light/30 rounded-lg border border-element-light/50 cursor-pointer hover:bg-element-light/50 transition-colors">
                                <input 
                                    type="checkbox" 
                                    name="allowRanged" 
                                    defaultChecked={currentPreferences?.allowRanged ?? true}
                                    className="h-5 w-5 bg-element-light border-element-light rounded text-accent focus:ring-accent focus:ring-2" 
                                />
                                <span className="ml-3 text-text-secondary font-medium">Allow Ranged Weapons</span>
                            </label>
                            
                            <label className="flex items-center p-3 bg-element-light/30 rounded-lg border border-element-light/50 cursor-pointer hover:bg-element-light/50 transition-colors">
                                <input 
                                    type="checkbox" 
                                    name="allowPyromancy" 
                                    defaultChecked={currentPreferences?.allowPyromancy ?? true}
                                    className="h-5 w-5 bg-element-light border-element-light rounded text-accent focus:ring-accent focus:ring-2" 
                                />
                                <span className="ml-3 text-text-secondary font-medium">Allow Pyromancy Flame</span>
                            </label>
                            
                            <label className="flex items-center p-3 bg-element-light/30 rounded-lg border border-element-light/50 cursor-pointer hover:bg-element-light/50 transition-colors">
                                <input 
                                    type="checkbox" 
                                    name="allowCatalysts" 
                                    defaultChecked={currentPreferences?.allowCatalysts ?? true}
                                    className="h-5 w-5 bg-element-light border-element-light rounded text-accent focus:ring-accent focus:ring-2" 
                                />
                                <span className="ml-3 text-text-secondary font-medium">Allow Catalysts</span>
                            </label>
                            
                            <label className="flex items-center p-3 bg-element-light/30 rounded-lg border border-element-light/50 cursor-pointer hover:bg-element-light/50 transition-colors">
                                <input 
                                    type="checkbox" 
                                    name="allowTalismans" 
                                    defaultChecked={currentPreferences?.allowTalismans ?? false}
                                    className="h-5 w-5 bg-element-light border-element-light rounded text-accent focus:ring-accent focus:ring-2" 
                                />
                                <span className="ml-3 text-text-secondary font-medium">Allow Talismans</span>
                            </label>

                            <label className="flex items-center p-3 bg-element-light/30 rounded-lg border border-element-light/50 cursor-pointer hover:bg-element-light/50 transition-colors">
                                <input 
                                    type="checkbox" 
                                    name="allowConsumables" 
                                    defaultChecked={currentPreferences?.allowConsumables ?? true}
                                    className="h-5 w-5 bg-element-light border-element-light rounded text-accent focus:ring-accent focus:ring-2" 
                                />
                                <span className="ml-3 text-text-secondary font-medium">Allow Consumables</span>
                            </label>
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
                                className="button-secondary w-full text-lg py-4 flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 border-orange-500"
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