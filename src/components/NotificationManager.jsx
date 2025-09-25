import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Notification from './Notification';

// Notification types
export const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
    INFO: 'info'
};

// Default duration
const DEFAULT_DURATION = 4000;

// Global notification manager that doesn't affect parent component state
class NotificationManager {
    constructor() {
        this.notifications = [];
        this.listeners = [];
        this.nextId = 1;
    }

    addNotification(notification) {
        const id = this.nextId++;
        const newNotification = { ...notification, id };
        this.notifications.push(newNotification);
        this.notifyListeners();
        
        // Auto-remove after duration
        setTimeout(() => {
            this.removeNotification(id);
        }, notification.duration || DEFAULT_DURATION);
        
        return id;
    }

    removeNotification(id) {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.notifyListeners();
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notifyListeners() {
        this.listeners.forEach(listener => listener([...this.notifications]));
    }

    getNotifications() {
        return [...this.notifications];
    }

    // Alias for addNotification for convenience
    show(notification) {
        return this.addNotification(notification);
    }
}

// Global instance
const notificationManager = new NotificationManager();

// Hook to use notifications
export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);

    React.useEffect(() => {
        const unsubscribe = notificationManager.subscribe(setNotifications);
        setNotifications(notificationManager.getNotifications());
        return unsubscribe;
    }, []);

    const showNotification = useCallback((notification) => {
        return notificationManager.addNotification(notification);
    }, []);

    const removeNotification = useCallback((id) => {
        notificationManager.removeNotification(id);
    }, []);

    return { notifications, showNotification, removeNotification };
};

// Component to render notifications
export const NotificationContainer = () => {
    const [notifications, setNotifications] = useState([]);

    React.useEffect(() => {
        const unsubscribe = notificationManager.subscribe(setNotifications);
        setNotifications(notificationManager.getNotifications());
        return unsubscribe;
    }, []);

    const notificationsContainer = document.getElementById('notifications-root');
    if (!notificationsContainer) {
        return null;
    }

    return createPortal(
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {notifications.map(notification => (
                <Notification
                    key={notification.id}
                    message={notification.message}
                    type={notification.type}
                    duration={notification.duration}
                    onClose={() => notificationManager.removeNotification(notification.id)}
                />
            ))}
        </div>,
        notificationsContainer
    );
};

export default notificationManager;
