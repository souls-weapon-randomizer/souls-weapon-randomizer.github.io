import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../config/analytics';

// Component to track page views for Google Analytics
const GoogleAnalytics = () => {
    const location = useLocation();

    useEffect(() => {
        // Track page view when location changes
        trackPageView(location.pathname + location.search);
    }, [location]);

    return null; // This component doesn't render anything
};

export default GoogleAnalytics;
