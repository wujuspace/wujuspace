// Theme Switcher - Toggle between light and dark themes
(function() {
    'use strict';

    const THEME_STORAGE_KEY = 'wuju-theme';
    const THEME_ATTRIBUTE = 'data-theme';
    
    // Get theme from localStorage or default to 'light'
    function getStoredTheme() {
        return localStorage.getItem(THEME_STORAGE_KEY) || 'light';
    }
    
    // Set theme in localStorage
    function setStoredTheme(theme) {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
    
    // Apply theme to document
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute(THEME_ATTRIBUTE, 'dark');
        } else {
            document.documentElement.removeAttribute(THEME_ATTRIBUTE);
        }
    }
    
    // Toggle theme
    function toggleTheme() {
        const currentTheme = getStoredTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        applyTheme(newTheme);
        setStoredTheme(newTheme);
    }
    
    // Initialize theme on page load
    function initTheme() {
        const theme = getStoredTheme();
        applyTheme(theme);
    }
    
    // Set up event listener when DOM is ready
    function setupThemeSwitcher() {
        const themeSwitcher = document.getElementById('theme-switcher');
        
        if (themeSwitcher) {
            themeSwitcher.addEventListener('click', toggleTheme);
        }
    }
    
    // Initialize on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initTheme();
            setupThemeSwitcher();
        });
    } else {
        // DOM already loaded
        initTheme();
        setupThemeSwitcher();
    }
})();

