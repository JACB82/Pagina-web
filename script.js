/* ==========================================================================
   JACB — Interacciones ligeras (sin dependencias)
   ========================================================================== */
(() => {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const $ = (selector, scope = document) => scope.querySelector(selector);
    const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

    /* ---------- Navegación ----------
       El menú de escritorio y el dock móvil comparten los mismos anchors.
       Así el estado activo se mantiene sincronizado en ambos. */
    const navLinks = $('#navLinks');
    const navToggle = $('#navToggle');
    const closeMenu = () => {
        if (!navToggle || !navLinks) return;
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Abrir menú');
        navLinks.classList.remove('open');
    };

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!isOpen));
            navToggle.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
            navLinks.classList.toggle('open', !isOpen);
        });
        $$('a', navLinks).forEach((link) => link.addEventListener('click', closeMenu));
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMenu();
    });

    /* ---------- Header y progreso de lectura ---------- */
    const header = $('.site-header');
    const progress = $('#scrollProgress');
    const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 20);
        if (progress) {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
            progress.style.transform = `scaleX(${ratio})`;
        }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    /* ---------- Revelado al entrar en viewport ---------- */
    const revealItems = $$('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
        revealItems.forEach((item) => item.classList.add('is-visible'));
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
        revealItems.forEach((item) => revealObserver.observe(item));
    }

    /* ---------- Enlace activo del menú ---------- */
    const sections = $$('main section[id]');
    const navAnchors = $$('.nav-links a, .dock a');
    if ('IntersectionObserver' in window) {
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                navAnchors.forEach((anchor) => {
                    const isActive = anchor.getAttribute('href') === `#${entry.target.id}`;
                    anchor.classList.toggle('active', isActive);
                    if (isActive) {
                        anchor.setAttribute('aria-current', 'location');
                    } else {
                        anchor.removeAttribute('aria-current');
                    }
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        sections.forEach((section) => navObserver.observe(section));
    }

    /* ---------- Efecto de escritura ---------- */
    const typed = $('#typed');
    const roles = ['Soporte Técnico', 'Ciberseguridad', 'Aprendizaje continuo'];

    if (typed && !reduceMotion) {
        let roleIndex = 0;
        let charIndex = roles[0].length;
        let deleting = true;

        const typeStep = () => {
            const current = roles[roleIndex];
            charIndex += deleting ? -1 : 1;
            typed.textContent = current.slice(0, charIndex);

            let delay = deleting ? 55 : 95;
            if (!deleting && charIndex === current.length) {
                deleting = true;
                delay = 2200;
            } else if (deleting && charIndex === 0) {
                deleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                delay = 350;
            }
            window.setTimeout(typeStep, delay);
        };
        window.setTimeout(typeStep, 1800);
    }

    /* ---------- Halo que sigue al cursor ---------- */
    const glow = $('#cursorGlow');
    if (glow && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduceMotion) {
        let targetX = -400;
        let targetY = -400;
        let currentX = -400;
        let currentY = -400;
        let running = false;

        const render = () => {
            currentX += (targetX - currentX) * 0.12;
            currentY += (targetY - currentY) * 0.12;
            glow.style.setProperty('--x', `${currentX}px`);
            glow.style.setProperty('--y', `${currentY}px`);
            if (Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
                requestAnimationFrame(render);
            } else {
                running = false;
            }
        };

        window.addEventListener('mousemove', (event) => {
            document.body.classList.add('has-mouse');
            targetX = event.clientX;
            targetY = event.clientY;
            if (!running) {
                running = true;
                requestAnimationFrame(render);
            }
        }, { passive: true });

        document.addEventListener('mouseleave', () => document.body.classList.remove('has-mouse'));
    }

    /* ---------- Toast reutilizable ---------- */
    const toast = $('#toast');
    let toastTimer;
    const showToast = (message) => {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2600);
    };

    /* ---------- Copiar correo ---------- */
    const copyButton = $('#copyEmail');
    if (copyButton) {
        copyButton.addEventListener('click', async () => {
            const email = 'josecuesta8234@gmail.com';
            try {
                await navigator.clipboard.writeText(email);
                showToast('✓ Correo copiado al portapapeles');
            } catch {
                // Fallback para navegadores sin permiso de portapapeles.
                const helper = document.createElement('textarea');
                helper.value = email;
                helper.style.position = 'fixed';
                helper.style.opacity = '0';
                document.body.appendChild(helper);
                helper.select();
                const copied = document.execCommand('copy');
                helper.remove();
                showToast(copied ? '✓ Correo copiado al portapapeles' : `Escríbeme a ${email}`);
            }
        });
    }

    /* ---------- Formulario -> mailto (sin backend) ---------- */
    const form = $('#contactForm');
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            if (!form.reportValidity()) return;

            const data = new FormData(form);
            const name = String(data.get('name') || '').trim();
            const email = String(data.get('email') || '').trim();
            const message = String(data.get('message') || '').trim();

            const subject = `Contacto desde portafolio — ${name}`;
            const body = `Hola Jose Armando:\n\n${message}\n\n---\nNombre: ${name}\nCorreo: ${email}`;

            window.location.href = `mailto:josecuesta8234@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            showToast('✓ Abriendo tu aplicación de correo');
        });
    }

    /* ---------- Año dinámico ---------- */
    const year = $('#year');
    if (year) year.textContent = String(new Date().getFullYear());
})();
