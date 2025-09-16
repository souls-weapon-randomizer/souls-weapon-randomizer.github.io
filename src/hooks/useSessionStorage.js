import { useState, useEffect } from 'react';

/**
 * Custom hook for managing sessionStorage with React state
 * @param {string} key - sessionStorage key
 * @param {*} initialValue - initial value if no data in sessionStorage
 * @returns {[*, function]} - [value, setValue]
 */
export function useSessionStorage(key, initialValue) {
    // Get from session storage then parse stored json or return initialValue
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.sessionStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Error reading sessionStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that persists the new value to sessionStorage
    const setValue = (value) => {
        try {
            // Allow value to be a function so we have the same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            
            // Save to sessionStorage
            if (valueToStore === undefined) {
                window.sessionStorage.removeItem(key);
            } else {
                window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.warn(`Error setting sessionStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue];
}
