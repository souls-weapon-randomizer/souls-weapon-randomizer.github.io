import React, { useEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';

// Animation duration constant
const ANIMATION_DURATION = 300;

export default function Notification({ message, type = 'info', duration = 4000, onClose }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => {
                onClose();
            }, ANIMATION_DURATION); // Wait for animation to complete
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const typeStyles = useMemo(() => {
        const styles = {
            success: 'bg-gradient-to-r from-green-600 to-green-500 border-green-400 text-white shadow-green-500/50 shadow-lg',
            warning: 'bg-yellow-600 border-yellow-500 text-white',
            error: 'bg-red-600 border-red-500 text-white',
            info: 'bg-accent border-accent-light text-white'
        };
        return styles[type] || styles.info;
    }, [type]);

    const icon = useMemo(() => {
        const icons = {
            success: '🎉',
            warning: '⚠️',
            error: '❌',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }, [type]);

    return createPortal(
        <div
            className={`fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg border-2 shadow-lg transform transition-all duration-300 ${
                isVisible 
                    ? 'translate-x-0 opacity-100 scale-100' 
                    : 'translate-x-full opacity-0 scale-95'
            } ${typeStyles}`}
        >
            <div className="flex items-center gap-3">
                <span className="text-xl">{icon}</span>
                <div className="flex-1">
                    <p className="font-semibold text-sm">{message}</p>
                </div>
                <button
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(() => onClose(), ANIMATION_DURATION);
                    }}
                    className="text-white/80 hover:text-white transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>,
        document.body
    );
}
