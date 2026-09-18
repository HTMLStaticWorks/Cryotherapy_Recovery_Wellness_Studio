/**
 * main.js - Core functionality for CyroCore
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Theme Toggle ---
    const themeToggles = document.querySelectorAll('.theme-toggle');
    const root = document.documentElement;
    
    // Check local storage or system preference
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (storedTheme === 'dark' || (!storedTheme && systemPrefersDark)) {
        root.setAttribute('data-theme', 'dark');
        updateThemeIcons('dark');
    }

    themeToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTheme = root.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            root.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcons(newTheme);
        });
    });

    function updateThemeIcons(theme) {
        themeToggles.forEach(btn => {
            const icon = btn.querySelector('i');
            if (icon) {
                if (theme === 'dark') {
                    icon.classList.remove('ph-moon');
                    icon.classList.add('ph-sun');
                } else {
                    icon.classList.remove('ph-sun');
                    icon.classList.add('ph-moon');
                }
            }
        });
    }

    // --- RTL Toggle ---
    const rtlToggles = document.querySelectorAll('.rtl-toggle');
    
    rtlToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentDir = root.getAttribute('dir') || 'ltr';
            const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
            root.setAttribute('dir', newDir);
        });
    });


    // --- Drawer Menu ---
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const drawer = document.querySelector('.drawer');
    const drawerOverlay = document.querySelector('.drawer-overlay');
    const drawerCloseBtn = document.querySelector('.drawer-close');

    function toggleDrawer() {
        if(drawer) {
            drawer.classList.toggle('open');
            drawerOverlay.classList.toggle('open');
            document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
        }
    }

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', toggleDrawer);
    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', toggleDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', toggleDrawer);


    // --- Form Validation (Generic) ---
    const forms = document.querySelectorAll('.needs-validation');
    
    forms.forEach(form => {
        form.addEventListener('submit', event => {
            let isValid = true;
            const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    setInvalid(input, 'This field is required');
                    isValid = false;
                } else if (input.type === 'email' && !validateEmail(input.value)) {
                    setInvalid(input, 'Please enter a valid email address');
                    isValid = false;
                } else if (input.type === 'password' && input.value.length < 8) {
                    setInvalid(input, 'Password must be at least 8 characters');
                    isValid = false;
                } else {
                    setValid(input);
                }
            });

            // Password confirmation check
            const pwd = form.querySelector('input[name="password"]');
            const confirmPwd = form.querySelector('input[name="confirm_password"]');
            if (pwd && confirmPwd && pwd.value !== confirmPwd.value) {
                setInvalid(confirmPwd, 'Passwords do not match');
                isValid = false;
            }

            // Checkbox (Terms)
            const terms = form.querySelector('input[name="terms"]');
            if (terms && !terms.checked) {
                setInvalid(terms, 'You must accept the terms and conditions');
                isValid = false;
            }

            if (!isValid) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                // Prevent actual submission for template demo
                event.preventDefault();
                const successMsg = form.querySelector('.form-success-msg');
                if(successMsg) successMsg.style.display = 'block';
                form.reset();
                inputs.forEach(input => {
                    input.classList.remove('is-valid');
                });
            }
        });

        // Clear validation on input
        form.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('is-invalid');
                input.classList.remove('is-valid');
            });
        });
    });

    function setInvalid(input, message) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        const feedback = input.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.textContent = message;
        }
    }

    function setValid(input) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }


    /* ==================================================================
       Sticky header — glass bar appears once the page leaves the hero
       ================================================================== */
    const header = document.querySelector('.header');

    if (header) {
        const setHeaderState = () => {
            header.classList.toggle('is-scrolled', window.scrollY > 24);
        };
        setHeaderState();
        window.addEventListener('scroll', setHeaderState, { passive: true });
    }


    /* ==================================================================
       Scroll reveal — anything with .reveal fades up once in view
       ================================================================== */
    const revealTargets = document.querySelectorAll('.reveal');

    if (revealTargets.length) {
        if ('IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

            revealTargets.forEach(el => revealObserver.observe(el));
        } else {
            revealTargets.forEach(el => el.classList.add('is-visible'));
        }
    }


    /* ==================================================================
       Protocol Simulator (index.html)
       Live physiological readout driven by temperature + duration.
       ================================================================== */
    const simulator = document.querySelector('[data-simulator]');

    if (simulator) {
        const MODALITIES = {
            cryo: {
                label: 'Whole-Body Cryotherapy',
                unit: '°C',
                tempMin: -160,
                tempMax: -80,
                tempDefault: -130,
                durMin: 1,
                durMax: 4,
                durDefault: 3,
                durStep: 0.5,
                scaleLow: '-160°C',
                scaleHigh: '-80°C',
                warm: false,
                tempLabel: 'Chamber temperature',
                durUnit: 'min',
                barLabels: ['Vasoconstriction response', 'Inflammation reduction', 'Lymphatic clearance'],
                note: 'Below -110°C the cold-shock response engages fully. Three minutes is the clinically validated ceiling.',
                copy: t => t <= -140
                    ? 'Deep protocol. Maximum vasoconstriction — core blood is stripped of waste and re-oxygenated.'
                    : t <= -115
                        ? 'Standard protocol. The cold-shock response is fully engaged across the whole body.'
                        : 'Introductory protocol. Gentle adaptation for a first exposure or a lighter training week.',
                metrics: (t, d) => {
                    const cold = (Math.abs(t) - 80) / 80;       // 0 → 1
                    const time = (d - 1) / 3;                    // 0 → 1
                    return {
                        primary: clamp(38 + cold * 46 + time * 14),
                        secondary: clamp(30 + cold * 40 + time * 26),
                        tertiary: clamp(25 + cold * 30 + time * 42),
                        kcal: Math.round(110 + cold * 340 + time * 190),
                        norep: (2.1 + cold * 2.4 + time * 0.9).toFixed(1) + 'x',
                        recovery: Math.round(46 - cold * 16 - time * 10) + 'h'
                    };
                }
            },
            compression: {
                label: 'Compression Therapy',
                unit: ' mmHg',
                tempMin: 30,
                tempMax: 110,
                tempDefault: 70,
                durMin: 15,
                durMax: 60,
                durDefault: 30,
                durStep: 5,
                scaleLow: '30 mmHg',
                scaleHigh: '110 mmHg',
                warm: false,
                tempLabel: 'Peak pressure',
                durUnit: 'min',
                barLabels: ['Lymphatic clearance', 'Venous return', 'Metabolic waste flushed'],
                note: 'Sequential pressure mimics the muscle pump. Longer, lower-pressure cycles suit endurance athletes.',
                copy: p => p >= 90
                    ? 'High-pressure cycle. Aggressive lymphatic flush for post-event or heavy-load recovery.'
                    : p >= 60
                        ? 'Standard cycle. Balanced sequential compression across all chambers.'
                        : 'Restorative cycle. Low pressure for sensitive tissue and active rest days.',
                metrics: (p, d) => {
                    const force = (p - 30) / 80;
                    const time = (d - 15) / 45;
                    return {
                        primary: clamp(30 + force * 30 + time * 38),
                        secondary: clamp(40 + force * 45 + time * 12),
                        tertiary: clamp(28 + force * 26 + time * 44),
                        kcal: Math.round(45 + force * 60 + time * 95),
                        norep: (1.2 + force * 0.9 + time * 0.6).toFixed(1) + 'x',
                        recovery: Math.round(40 - force * 12 - time * 12) + 'h'
                    };
                }
            },
            infrared: {
                label: 'Infrared Sauna',
                unit: '°C',
                tempMin: 45,
                tempMax: 75,
                tempDefault: 60,
                durMin: 20,
                durMax: 60,
                durDefault: 45,
                durStep: 5,
                scaleLow: '45°C',
                scaleHigh: '75°C',
                warm: true,
                tempLabel: 'Cabin temperature',
                durUnit: 'min',
                barLabels: ['Vasodilation response', 'Heat shock protein expression', 'Cellular detox load'],
                note: 'Full-spectrum infrared heats tissue directly, so the cabin runs cooler than a traditional sauna.',
                copy: t => t >= 68
                    ? 'Peak thermal load. Strong heat-shock protein expression — hydrate before and after.'
                    : t >= 55
                        ? 'Standard thermal protocol. Deep tissue penetration with a sustainable core rise.'
                        : 'Gentle thermal protocol. Circulatory warm-up and parasympathetic downshift.',
                metrics: (t, d) => {
                    const heat = (t - 45) / 30;
                    const time = (d - 20) / 40;
                    return {
                        primary: clamp(34 + heat * 40 + time * 22),
                        secondary: clamp(26 + heat * 34 + time * 36),
                        tertiary: clamp(30 + heat * 28 + time * 40),
                        kcal: Math.round(180 + heat * 260 + time * 240),
                        norep: (1.4 + heat * 1.1 + time * 0.7).toFixed(1) + 'x',
                        recovery: Math.round(44 - heat * 13 - time * 13) + 'h'
                    };
                }
            }
        };

        function clamp(n) { return Math.max(0, Math.min(100, Math.round(n))); }

        const tabs = simulator.querySelectorAll('.sim-tab');
        const tempRange = simulator.querySelector('#sim-temp');
        const durRange = simulator.querySelector('#sim-duration');
        const tempOut = simulator.querySelector('#sim-temp-out');
        const durOut = simulator.querySelector('#sim-duration-out');
        const tempLabel = simulator.querySelector('#sim-temp-label');
        const durLabel = simulator.querySelector('#sim-duration-label');
        const scaleLow = simulator.querySelector('#sim-scale-low');
        const scaleHigh = simulator.querySelector('#sim-scale-high');
        const stage = simulator.querySelector('.sim-stage');
        const bigTemp = simulator.querySelector('#sim-big-temp');
        const bigUnit = simulator.querySelector('#sim-big-unit');
        const stageChip = simulator.querySelector('#sim-chip-label');
        const stageCaption = simulator.querySelector('#sim-caption');
        const noteText = simulator.querySelector('#sim-note');
        const bars = simulator.querySelectorAll('.sim-bar i');
        const barValues = simulator.querySelectorAll('[data-bar-value]');
        const barTitles = simulator.querySelectorAll('[data-bar-title]');
        const tempUnit = simulator.querySelector('#sim-temp-unit');
        const statKcal = simulator.querySelector('#sim-kcal');
        const statNorep = simulator.querySelector('#sim-norep');
        const statRecovery = simulator.querySelector('#sim-recovery');

        let current = 'cryo';

        function fillRange(input) {
            const pct = ((input.value - input.min) / (input.max - input.min)) * 100;
            input.style.setProperty('--sim-fill', pct + '%');
            return pct;
        }

        function applyModality(key) {
            const m = MODALITIES[key];
            current = key;

            tempRange.min = m.tempMin;
            tempRange.max = m.tempMax;
            tempRange.step = 1;
            tempRange.value = m.tempDefault;

            durRange.min = m.durMin;
            durRange.max = m.durMax;
            durRange.step = m.durStep;
            durRange.value = m.durDefault;

            tempLabel.textContent = m.tempLabel;
            durLabel.textContent = 'Session duration';
            scaleLow.textContent = m.scaleLow;
            scaleHigh.textContent = m.scaleHigh;
            stageChip.textContent = m.label;
            bigUnit.textContent = key === 'compression' ? 'mmHg' : '°C';

            barTitles.forEach((el, i) => { el.textContent = m.barLabels[i]; });

            simulator.querySelectorAll('.sim-bar').forEach(bar => {
                bar.classList.toggle('is-warm', m.warm);
            });

            simulator.querySelectorAll('.sim-range').forEach(range => {
                range.classList.toggle('is-warm', m.warm);
            });

            render();
        }

        function render() {
            const m = MODALITIES[current];
            const t = Number(tempRange.value);
            const d = Number(durRange.value);

            fillRange(tempRange);
            fillRange(durRange);

            tempOut.textContent = t;
            tempUnit.textContent = current === 'compression' ? 'mmHg' : '°C';
            durOut.textContent = current === 'cryo' ? d.toFixed(1) : d;
            bigTemp.textContent = t;

            const r = m.metrics(t, d);
            const values = [r.primary, r.secondary, r.tertiary];

            bars.forEach((bar, i) => { bar.style.width = values[i] + '%'; });
            barValues.forEach((el, i) => { el.textContent = values[i] + '%'; });

            statKcal.textContent = r.kcal;
            statNorep.textContent = r.norep;
            statRecovery.textContent = r.recovery;

            stageCaption.textContent = m.copy(t);
            noteText.textContent = m.note;

            // Visual temperature: colder and longer means more frost, bluer glow
            const intensity = current === 'infrared'
                ? (t - m.tempMin) / (m.tempMax - m.tempMin)
                : current === 'compression'
                    ? (t - m.tempMin) / (m.tempMax - m.tempMin)
                    : (Math.abs(t) - 80) / 80;

            const frost = current === 'infrared' ? 0.12 : 0.25 + intensity * 0.75;
            const glow = m.warm
                ? 'rgba(249, 115, 22, ' + (0.28 + intensity * 0.42).toFixed(2) + ')'
                : 'rgba(56, 189, 248, ' + (0.28 + intensity * 0.45).toFixed(2) + ')';

            stage.style.setProperty('--sim-frost', frost.toFixed(2));
            stage.style.setProperty('--sim-glow', glow);
        }

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.setAttribute('aria-selected', 'false'));
                tab.setAttribute('aria-selected', 'true');
                applyModality(tab.dataset.modality);
            });
        });

        tempRange.addEventListener('input', render);
        durRange.addEventListener('input', render);

        applyModality('cryo');
    }


    /* ==================================================================
       Recovery Timeline (home2.html)
       Steps through the physiological cascade of a single session.
       ================================================================== */
    const timeline = document.querySelector('[data-timeline]');

    if (timeline) {
        const STAGES = [
            {
                phase: 'Phase 01 — Entry',
                title: 'Cold shock and skin receptor firing',
                body: 'The first thirty seconds are the loudest. Thermoreceptors in the skin fire en masse, breathing sharpens, and the sympathetic nervous system floods the bloodstream with norepinephrine. Nothing has cooled below the surface yet — this is a signal, not damage.',
                markers: ['Skin temp 12°C', 'Breath rate 2.4x', 'Norepinephrine spike'],
                value: 28,
                gauge: 'Sympathetic drive climbing',
                glow: 'rgba(56, 189, 248, 0.45)'
            },
            {
                phase: 'Phase 02 — Constriction',
                title: 'Peripheral blood withdraws to the core',
                body: 'Vasoconstriction pulls blood out of the limbs and into the trunk, where it circulates past the organs and is enriched with oxygen, enzymes and nutrients. Surface inflammation drops sharply as blood flow to the extremities falls.',
                markers: ['Peripheral flow -60%', 'Core enrichment active', 'Inflammation falling'],
                value: 62,
                gauge: 'Core circulation enriched',
                glow: 'rgba(14, 165, 233, 0.5)'
            },
            {
                phase: 'Phase 03 — Exit',
                title: 'Rapid rewarming and the flush',
                body: 'On leaving the chamber, vasodilation reverses the process. Enriched blood returns to the muscles under pressure, flushing metabolic waste out of the tissue. This is the mechanism that clears delayed onset soreness before it sets in.',
                markers: ['Vasodilation peak', 'Lactate clearance', 'Endorphin release'],
                value: 84,
                gauge: 'Systemic flush at peak',
                glow: 'rgba(34, 211, 238, 0.55)'
            },
            {
                phase: 'Phase 04 — Window',
                title: 'The two-hour metabolic window',
                body: 'Metabolic rate stays elevated for up to two hours. Mood and focus lift on the back of the endorphin and norepinephrine response, which is why most members schedule cryotherapy before deep work rather than after it.',
                markers: ['Metabolic rate +21%', 'Focus elevated', 'Mood response'],
                value: 71,
                gauge: 'Elevated metabolic output',
                glow: 'rgba(129, 140, 248, 0.5)'
            },
            {
                phase: 'Phase 05 — Adaptation',
                title: 'Cumulative adaptation at 24 hours',
                body: 'Inflammatory cytokine levels remain suppressed a full day later. Repeated across a training block, this is where the compounding return lives — recovery capacity rises rather than simply resetting after each session.',
                markers: ['Cytokines suppressed', 'DOMS reduced 41%', 'Sleep quality up'],
                value: 93,
                gauge: 'Adaptation compounding',
                glow: 'rgba(16, 185, 129, 0.45)'
            }
        ];

        const steps = timeline.querySelectorAll('.timeline-step');
        const progress = timeline.querySelector('.timeline-progress');
        const panel = timeline.querySelector('.timeline-body');
        const gauge = timeline.querySelector('.timeline-gauge');
        const ring = timeline.querySelector('.gauge-ring');
        const gaugeValue = timeline.querySelector('#tl-value');
        const gaugeCaption = timeline.querySelector('#tl-caption');

        function selectStage(index) {
            const s = STAGES[index];
            if (!s) return;

            steps.forEach((step, i) => step.setAttribute('aria-selected', String(i === index)));
            // 0–1 along the rail; CSS turns it into a width or a height by axis
            progress.parentElement.style.setProperty('--tl-fill', index / (STAGES.length - 1));

            panel.innerHTML =
                '<span class="timeline-phase">' + s.phase + '</span>' +
                '<h3>' + s.title + '</h3>' +
                '<p>' + s.body + '</p>' +
                '<div class="timeline-markers">' +
                s.markers.map(m => '<span class="timeline-marker"><i class="ph ph-pulse"></i>' + m + '</span>').join('') +
                '</div>';

            // restart the entrance animation
            panel.style.animation = 'none';
            void panel.offsetWidth;
            panel.style.animation = '';

            ring.style.setProperty('--tl-value', s.value);
            gauge.style.setProperty('--tl-glow', s.glow);
            gaugeCaption.textContent = s.gauge;

            animateCount(gaugeValue, Number(gaugeValue.textContent) || 0, s.value);
        }

        function animateCount(el, from, to) {
            const duration = 650;
            const start = performance.now();

            function tick(now) {
                const p = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(from + (to - from) * eased);
                if (p < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        }

        steps.forEach((step, i) => {
            step.addEventListener('click', () => selectStage(i));
            step.addEventListener('keydown', e => {
                if (e.key === 'ArrowRight' && steps[i + 1]) { steps[i + 1].focus(); selectStage(i + 1); }
                if (e.key === 'ArrowLeft' && steps[i - 1]) { steps[i - 1].focus(); selectStage(i - 1); }
            });
        });

        progress.parentElement.style.setProperty('--tl-count', String(STAGES.length));
        selectStage(0);
    }
});
