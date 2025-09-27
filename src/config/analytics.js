// Google Analytics Configuration

export const GA_MEASUREMENT_ID = 'G-TWC734KQDY';

// Google Analytics utility functions
export const trackPageView = (url) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

export const trackEvent = (action, category, label, value) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Game-specific tracking events
export const trackGameStart = (gameName) => {
  trackEvent('game_start', 'Gameplay', gameName);
};

export const trackBossDefeated = (gameName, bossName) => {
  trackEvent('boss_defeated', 'Gameplay', `${gameName} - ${bossName}`);
};

export const trackWeaponRandomized = (gameName, weaponName) => {
  trackEvent('weapon_randomized', 'Gameplay', `${gameName} - ${weaponName}`);
};

export const trackWeaponBlacklisted = (gameName, weaponName) => {
  trackEvent('weapon_blacklisted', 'Gameplay', `${gameName} - ${weaponName}`);
};

export const trackNewGame = (gameName) => {
  trackEvent('new_game', 'Gameplay', gameName);
};
