import React from 'react';

// Component for displaying weapon information and actions
const WeaponDisplay = ({ weapon, onReroll, onBossDefeated, onBlacklist }) => (
    <div className="h-full flex flex-col animate-fade-in">
        <div className="text-center mb-6">
            <h2 className="text-4xl font-gothic font-bold text-gradient mb-2 animate-bounce-gentle">
                {weapon.name}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-accent/30 to-accent-light/30 mx-auto rounded-full"></div>
        </div>
        
        <div className="flex-grow flex flex-col items-center justify-center">
            <div className="w-full h-40 flex items-center justify-center mb-8 relative">
                <div className="absolute w-[260px] h-[260px] bg-gradient-to-r from-accent/5 to-accent-light/5 rounded-full blur-xl"></div>
                <img 
                    src={weapon.img} 
                    alt={weapon.name} 
                    className="max-h-full max-w-[250px] object-contain relative z-10 drop-shadow-2xl animate-bounce-gentle"
                />
            </div>
            
            <div className="text-center max-w-2xl">
                <h4 className="font-bold text-text-main mb-4 text-lg flex items-center justify-center gap-2">
                    <span className="text-accent cursor-default">⚡</span>
                    How to obtain this weapon:
                </h4>
                <div className="bg-element-light/50 rounded-lg p-4 mb-6">
                    <ul className="text-text-secondary space-y-2 text-left">
                        {weapon.locations.map((loc, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <span className="text-accent mt-1">•</span>
                                <span>{loc}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                
                <a 
                    href={weapon.wiki_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 text-accent hover:text-accent-light font-semibold transition-colors duration-300 hover:scale-105 transform"
                >
                    <span>View detailed guide on Wiki</span>
                    <span className="text-lg">→</span>
                </a>
            </div>
        </div>
        
        <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-element-light/50">
            <button 
                onClick={onReroll} 
                className="button-primary flex items-center gap-2"
            >
                <span className="cursor-default">🎲</span>
                <span>Reroll</span>
            </button>
            <button 
                onClick={onBossDefeated} 
                className="button-secondary flex items-center gap-2 bg-green-600 hover:bg-green-700 border-green-500"
            >
                <span className="cursor-default">💀</span>
                <span>Boss defeated</span>
            </button>
            <button 
                onClick={onBlacklist} 
                className="button-secondary flex items-center gap-2"
            >
                <span className="cursor-default">➕</span>
                <span>Blacklist</span>
            </button>
        </div>
    </div>
);

export default WeaponDisplay;
