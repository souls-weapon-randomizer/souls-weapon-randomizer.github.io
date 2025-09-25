import React from 'react';
import { getAllGames } from '../../games/index.js';

const GameSelector = ({ selectedGame, onGameSelect, className = '' }) => {
    const games = getAllGames();
    
    return (
        <div className={`game-selector ${className}`}>
            <div className="flex flex-wrap gap-4 justify-center">
                {games.map(game => (
                    <button
                        key={game.id}
                        onClick={() => onGameSelect(game.id)}
                        className={`
                            flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300
                            ${selectedGame === game.id 
                                ? 'border-accent bg-accent/10 shadow-lg' 
                                : 'border-element-light/50 bg-element/50 hover:border-accent/50 hover:bg-element/80'
                            }
                        `}
                        style={{
                            borderColor: selectedGame === game.id ? game.color : undefined
                        }}
                    >
                        <div className="text-4xl mb-2">{game.icon}</div>
                        <h3 className="font-bold text-text-main text-lg">{game.shortName}</h3>
                        <p className="text-text-muted text-sm text-center max-w-32">
                            {game.name}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default GameSelector;
