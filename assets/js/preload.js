/**
 * preload.js - Applies stored theme and text direction before first paint.
 * Loaded in <head> so RTL/dark pages never flash their default state.
 */
(function () {
    var root = document.documentElement;

    try {
        var theme = localStorage.getItem('theme');
        if (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            theme = 'dark';
        }
        if (theme === 'dark' || theme === 'light') {
            root.setAttribute('data-theme', theme);
        }

        var dir = localStorage.getItem('dir');
        if (dir === 'rtl' || dir === 'ltr') {
            root.setAttribute('dir', dir);
        }
    } catch (e) {
        /* storage blocked — fall back to the markup defaults */
    }
})();
