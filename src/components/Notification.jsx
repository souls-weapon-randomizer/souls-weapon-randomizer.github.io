import React, { useEffect, useState } from 'react';

export default function Notification({ message, type = 'info', duration = 4000, onClose }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onClose(), 300); // Wait for animation to complete
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getTypeStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-gradient-to-r from-green-600 to-green-500 border-green-400 text-white shadow-green-500/50 shadow-lg';
            case 'warning':
                return 'bg-yellow-600 border-yellow-500 text-white';
            case 'error':
                return 'bg-red-600 border-red-500 text-white';
            default:
                return 'bg-accent border-accent-light text-white';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '🎉';
            case 'warning':
                return '⚠️';
            case 'error':
                return '❌';
            default:
                return 'ℹ️';
        }
    };

    return (
        <div
            className={`fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg border-2 shadow-lg transform transition-all duration-300 ${
                isVisible 
                    ? 'translate-x-0 opacity-100 scale-100' 
                    : 'translate-x-full opacity-0 scale-95'
            } ${getTypeStyles()}`}
        >
            <div className="flex items-center gap-3">
                <span className="text-xl">{getIcon()}</span>
                <div className="flex-1">
                    <p className="font-semibold text-sm">{message}</p>
                </div>
                <button
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(() => onClose(), 300);
                    }}
                    className="text-white/80 hover:text-white transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
