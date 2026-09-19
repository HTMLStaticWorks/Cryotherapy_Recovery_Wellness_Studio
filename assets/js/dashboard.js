/**
 * dashboard.js — section switching and off-canvas sidebar for the member portal
 */

document.addEventListener('DOMContentLoaded', () => {

    const navLinks = document.querySelectorAll('.dash-nav-link');
    const sections = document.querySelectorAll('.dash-section');
    const sidebar = document.getElementById('dashSidebar');
    const overlay = document.getElementById('dashOverlay');
    const menuBtn = document.getElementById('dashMenuBtn');
    const topbarTitle = document.getElementById('dashTopbarTitle');

    /* --- Off-canvas sidebar (below 1024px) --- */
    function setSidebar(open) {
        if (!sidebar) return;
        sidebar.classList.toggle('open', open);
        if (overlay) overlay.classList.toggle('open', open);
        if (menuBtn) menuBtn.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            setSidebar(!sidebar.classList.contains('open'));
        });
    }

    if (overlay) overlay.addEventListener('click', () => setSidebar(false));

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') setSidebar(false);
    });

    // Reset the drawer state when the layout goes back to a docked sidebar
    window.matchMedia('(min-width: 1025px)').addEventListener('change', e => {
        if (e.matches) setSidebar(false);
    });

    /* --- Section switching --- */
    function showSection(target) {
        const section = document.getElementById(target);
        if (!section) return;

        navLinks.forEach(n => n.classList.toggle('active', n.dataset.target === target));
        sections.forEach(s => s.classList.remove('active'));
        section.classList.add('active');

        // Keep the topbar label in step with the section on show
        if (topbarTitle) {
            const heading = section.querySelector('.dash-title');
            if (heading) topbarTitle.textContent = heading.textContent.trim();
        }

        // On mobile the drawer covers the content — close it after navigating
        setSidebar(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => showSection(link.dataset.target));
    });

    // Buttons elsewhere on the page that jump to a section
    document.querySelectorAll('[data-jump]').forEach(btn => {
        btn.addEventListener('click', () => showSection(btn.dataset.jump));
    });
});
