import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
    AltArrowDown,
    ArrowRight,
    CalendarMark,
    CloseSquare,
    Database,
    Download,
    Folder,
    HamburgerMenu,
    Letter,
    Monitor,
    Moon,
    Phone,
    SquareArrowRightUp,
    Sun,
    UserCircle,
} from './icons.js';
import './app.css';

const baseUrl = import.meta.env.BASE_URL || '/';
const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
const basePath = normalizedBaseUrl === '/' ? '' : normalizedBaseUrl.replace(/\/$/, '');

function assetUrl(path) {
    if (!path || /^(https?:|data:|mailto:|tel:|#)/.test(path)) return path;
    return `${normalizedBaseUrl}${String(path).replace(/^\/+/, '')}`;
}

function normalizeRoutePath(path) {
    const cleaned = String(path || '/').split(/[?#]/)[0];
    const prefixed = cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
    const withoutTrailingSlash = prefixed.length > 1 ? prefixed.replace(/\/+$/, '') : prefixed;
    return withoutTrailingSlash || '/';
}

function routeHref(path) {
    const routePath = normalizeRoutePath(path);
    if (!basePath) return routePath;
    return routePath === '/' ? `${basePath}/` : `${basePath}${routePath}`;
}

function routeFromLocation() {
    const redirectedPath = new URLSearchParams(window.location.search).get('path');

    if (redirectedPath) {
        const requestedPath = normalizeRoutePath(redirectedPath);
        const routePath = requestedPath === '/capabilities' ? '/' : requestedPath;
        window.history.replaceState({}, '', routeHref(routePath));
        return routePath;
    }

    const pathname = window.location.pathname || '/';
    const routePath = basePath && (pathname === basePath || pathname.startsWith(`${basePath}/`))
        ? pathname.slice(basePath.length) || '/'
        : pathname;

    const normalizedRoute = normalizeRoutePath(routePath);
    if (normalizedRoute === '/capabilities') {
        window.history.replaceState({}, '', routeHref('/'));
        return '/';
    }

    return normalizedRoute;
}

const defaultConfig = {
    cvUrl: assetUrl('Vincent-Luhanga-CV.pdf'),
    assets: {
        cover: assetUrl('cover.jpg'),
        image: assetUrl('image.jpg'),
        professional: assetUrl('professional.jpg'),
        profile: assetUrl('profile-2024-01-09-195208.jpg'),
    },
};

const externalConfig = window.portfolioConfig || {};
const config = {
    ...defaultConfig,
    ...externalConfig,
    assets: {
        ...defaultConfig.assets,
        ...(externalConfig.assets || {}),
    },
};

const routes = [
    { path: '/', label: 'Home', icon: Monitor },
    {
        label: 'Profile',
        icon: UserCircle,
        children: [
            { path: '/experience', label: 'Experience', icon: CalendarMark },
            { path: '/projects', label: 'Projects', icon: Folder },
        ],
    },
    { path: '/contact', label: 'Contact', icon: Letter },
];

const whatsappContact = {
    label: '+260 768 891 429',
    href: 'https://wa.me/260768891429?text=Hello%20Vincent%2C%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20contact%20you.',
};

const contactPhones = [
    { label: '+260 963 659 222', href: 'tel:+260963659222' },
    { label: '+260 955 334 043', href: 'tel:+260955334043' },
];

const profileLinks = {
    github: 'https://github.com/vicente101',
    linkedin: 'https://www.linkedin.com/in/vincent-luhanga-782256240/',
};

const heroProof = [
    { label: 'Currently at', value: 'WebDev Technologies Limited' },
    { label: 'Core stack', value: 'Laravel · React · TypeScript · SQL · Claude Code' },
    { label: 'Qualification', value: 'Bachelor of Software Engineering (with Distinction)' },
];

const cardImages = {
    quality: assetUrl('card-bg/interface-quality.svg'),
    student: assetUrl('card-bg/student-system.svg'),
    booking: assetUrl('card-bg/venue-booking.svg'),
    visualizer: assetUrl('card-bg/data-visualizer.svg'),
    smartgrow: assetUrl('card-bg/smartgrow.svg'),
    delivery: assetUrl('card-bg/operations-flow.svg'),
    education: assetUrl('card-bg/education.svg'),
};

const projects = [
    {
        title: 'Peza Venue',
        signal: 'Marketplace Platform',
        problem: 'Booking an event venue means chasing scattered listings and slow back-and-forth with providers, while venue owners lack a simple way to manage their own listings and incoming requests.',
        result: 'A two-sided marketplace where clients discover and compare event spaces and submit booking requests, while venue providers manage listings, scheduling and availability.',
        detail: 'Lead developer at WebDev Technologies Limited. Laravel and Supabase backend with a React, Vite and Tailwind CSS front end, covering listings, reservations, scheduling and availability.',
        tags: ['Laravel', 'React', 'Supabase', 'Tailwind CSS'],
        status: 'In active development at WebDev Technologies',
        image: cardImages.booking,
    },
    {
        title: 'Database Visualizer',
        signal: 'Developer Tooling',
        problem: 'Understanding an unfamiliar database means reading raw schema definitions table by table, which hides relationships and slows down debugging and onboarding.',
        result: 'An interactive schema explorer that renders tables and their relationships visually, so developers can understand a database structure at a glance.',
        detail: 'React and TypeScript application built with Vite, with a typed SQL DDL parser that turns table definitions into an interactive schema canvas, plus layout, export and browser-storage services.',
        tags: ['React', 'TypeScript', 'Vite', 'Open Source'],
        liveUrl: 'https://vicente101.github.io/Database-Schema-Visualizer/',
        repoUrl: 'https://github.com/vicente101/Database-Schema-Visualizer',
        image: cardImages.visualizer,
    },
    {
        title: 'Munda',
        signal: 'AgriTech',
        problem: 'Growers often decide what and when to plant without location-specific weather data, and generic advice rarely explains why a crop suits their conditions.',
        result: 'A crop intelligence application that combines location-aware weather data with explainable crop recommendations growers can act on.',
        detail: 'React and Vite front end integrating Open-Meteo forecast and historical climate data, with the recommendation and weather logic covered by unit tests using the Node.js test runner.',
        tags: ['React', 'Vite', 'Tailwind CSS', 'Open-Meteo API'],
        liveUrl: 'https://vicente101.github.io/Smartgrow/',
        repoUrl: 'https://github.com/vicente101/Smartgrow',
        image: cardImages.smartgrow,
    },
    {
        title: 'Student Information System',
        signal: 'Records Management',
        problem: 'Student records and results spread across spreadsheets and paperwork make data entry error-prone, reviews slow, and access hard to control by role.',
        result: 'A centralised system for student records, academic results and administrative dashboards, with validated data entry, role-based access and responsive views.',
        detail: 'Laravel and MySQL application with server-rendered views styled in Tailwind CSS, implementing validation, role-based access control and efficient record review workflows.',
        tags: ['Laravel', 'PHP', 'MySQL', 'Tailwind CSS'],
        repoUrl: 'https://github.com/vicente101/GradingSystem',
        image: cardImages.student,
    },
];

const timeline = [
    {
        time: '2026 – Present',
        title: 'Software Engineer, WebDev Technologies Limited',
        copy: 'Lead developer on Peza Venue, a venue-booking marketplace in active development, built with Laravel, Supabase, React and Tailwind CSS.',
        duties: [
            'Analyse requirements and translate them into features for listings, reservations, scheduling and availability.',
            'Design and develop features across the front end, back end and database layers.',
            'Test, debug and resolve defects so features perform to specification.',
            'Maintain and support the platform, shipping fixes and improvements.',
            'Collaborate with the engineering team in an agile workflow, using Git and GitHub for version control.',
        ],
        image: cardImages.delivery,
    },
    {
        time: '2025',
        title: 'Docufree Workflow Placement, Wiphan',
        copy: 'Document verification, data handling and quality assurance within enterprise systems, following consistent process compliance to protect accuracy and data integrity.',
        image: cardImages.quality,
    },
];

const homeSignals = [
    {
        value: 'Analyse',
        label: 'Requirements & Gaps',
        copy: 'I start from user needs and the limits of existing systems, and turn them into clear, testable requirements.',
    },
    {
        value: 'Design',
        label: 'Systems & Data',
        copy: 'I plan data models, application structure and interfaces up front so systems stay maintainable as they grow.',
    },
    {
        value: 'Build & Test',
        label: 'Quality to Specification',
        copy: 'I write code to defined requirements, then test and debug it until it performs as specified in real use.',
    },
    {
        value: 'Support',
        label: 'Maintain & Improve',
        copy: 'I maintain production systems, diagnose and fix defects, and refine features based on how they are used.',
    },
];

const technologyStack = [
    { id: 'javascript', label: 'JavaScript', x: 50, y: 9, color: '#f7df1e' },
    { id: 'typescript', label: 'TypeScript', x: 66, y: 12, color: '#5aa7e8' },
    { id: 'react', label: 'React', x: 80, y: 21, color: '#61dafb' },
    { id: 'java', label: 'Java', x: 89, y: 34, color: '#5b9bd5' },
    { id: 'supabase', label: 'Supabase', x: 92, y: 50, color: '#4ade80' },
    { id: 'laravel', label: 'Laravel', x: 89, y: 66, color: '#ff6b68' },
    { id: 'php', label: 'PHP', x: 80, y: 79, color: '#a7a9dc' },
    { id: 'mysql', label: 'MySQL', x: 66, y: 88, color: '#67c5e8' },
    { id: 'git', label: 'Git', x: 50, y: 91, color: '#f97352' },
    { id: 'tailwind', label: 'Tailwind CSS', x: 34, y: 88, color: '#38bdf8' },
    { id: 'css', label: 'CSS3', x: 20, y: 79, color: '#57a9e9' },
    { id: 'html', label: 'HTML5', x: 11, y: 66, color: '#ff7849' },
    { id: 'api', label: 'REST APIs', x: 8, y: 50, color: '#c8ddef' },
    { id: 'codex', label: 'Codex', x: 11, y: 34, color: '#10a37f' },
    { id: 'copilot', label: 'Copilot', x: 20, y: 21, color: '#c084fc' },
    { id: 'claude', label: 'Claude Code', x: 34, y: 12, color: '#d97757' },
];

const skillGroups = [
    { title: 'Languages', items: ['JavaScript', 'TypeScript', 'PHP', 'Java', 'SQL', 'HTML5', 'CSS3'] },
    { title: 'Frameworks & Libraries', items: ['React', 'Laravel', 'Tailwind CSS'] },
    { title: 'Databases', items: ['MySQL', 'Supabase'] },
    { title: 'Tools', items: ['Git', 'GitHub', 'Vite', 'Claude Code', 'OpenAI Codex', 'GitHub Copilot'] },
    { title: 'Engineering Practices', items: ['Requirements Analysis', 'System Design', 'Database Design', 'REST APIs', 'Testing & Debugging', 'Maintenance & Support', 'Agile Delivery', 'Prompt Engineering', 'UI/UX Design'] },
];

function TechnologyGlyph({ type }) {
    if (type === 'react') {
        return (
            <>
                <ellipse cx="24" cy="24" rx="19" ry="7.2" />
                <ellipse cx="24" cy="24" rx="19" ry="7.2" transform="rotate(60 24 24)" />
                <ellipse cx="24" cy="24" rx="19" ry="7.2" transform="rotate(120 24 24)" />
                <circle cx="24" cy="24" r="3.2" className="tech-glyph-fill" />
            </>
        );
    }

    if (type === 'javascript' || type === 'typescript') {
        return (
            <>
                <rect x="6" y="6" width="36" height="36" rx="5" />
                <text x="24" y="31">{type === 'javascript' ? 'JS' : 'TS'}</text>
            </>
        );
    }

    if (type === 'html' || type === 'css') {
        return (
            <>
                <path d="M9 5h30l-3 34-12 4-12-4z" />
                <path d="M15 13h19l-.7 7H22l.5 5h10.3l-1.1 9-7.7 2.5-7.6-2.5-.5-5" />
                <text x="24" y="19">{type === 'html' ? '5' : '3'}</text>
            </>
        );
    }

    if (type === 'tailwind') {
        return (
            <>
                <path d="M7 19c4.5-7 10-9 16.5-5.5 3.8 2 5.6 5 9.7 5 3.2 0 5.7-1.5 7.8-4.5-4.5 8.8-10.8 11.2-18.1 6.8C19.6 18.8 17.8 17 15 17c-3 0-5.7.7-8 2Z" />
                <path d="M7 31c4.5-7 10-9 16.5-5.5 3.8 2 5.6 5 9.7 5 3.2 0 5.7-1.5 7.8-4.5-4.5 8.8-10.8 11.2-18.1 6.8C19.6 30.8 17.8 29 15 29c-3 0-5.7.7-8 2Z" />
            </>
        );
    }

    if (type === 'supabase') {
        return <path d="M27 5 10 28h13l-2 15 17-24H25z" />;
    }

    if (type === 'laravel') {
        return (
            <>
                <path d="m6 12 10-5 10 5v12l-10 5-10-5z" />
                <path d="m26 18 9-4 7 4v10l-9 5-7-4M16 29v10l9 4 8-5v-5M6 12l10 6 10-6M16 18v11" />
            </>
        );
    }

    if (type === 'mysql') {
        return (
            <>
                <ellipse cx="24" cy="12" rx="15" ry="6" />
                <path d="M9 12v11c0 3.3 6.7 6 15 6s15-2.7 15-6V12M9 23v11c0 3.3 6.7 6 15 6s15-2.7 15-6V23" />
                <path d="m31 31 4 3 5-2" />
            </>
        );
    }

    if (type === 'git') {
        return (
            <>
                <path d="M14 10v19c0 5 4 9 9 9h3M14 19h13c4 0 7 3 7 7v3" />
                <circle cx="14" cy="9" r="4" />
                <circle cx="34" cy="33" r="4" />
                <circle cx="29" cy="19" r="4" />
            </>
        );
    }

    if (type === 'claude') {
        return (
            <>
                <path d="M24 7v34M7 24h34M12 12l24 24M36 12 12 36" />
                <circle cx="24" cy="24" r="4" className="tech-glyph-fill" />
            </>
        );
    }

    if (type === 'codex') {
        return (
            <>
                <rect x="6" y="9" width="36" height="30" rx="6" />
                <path d="m14 19 7 5-7 5M24 31h10" />
            </>
        );
    }

    if (type === 'copilot') {
        return (
            <>
                <path d="M9 25c0-9.4 6.7-16 15-16s15 6.6 15 16v5c0 5-6.7 9-15 9s-15-4-15-9z" />
                <rect x="13" y="19" width="9.5" height="8" rx="3" />
                <rect x="25.5" y="19" width="9.5" height="8" rx="3" />
                <path d="M19 33v2.5M29 33v2.5" />
            </>
        );
    }

    if (type === 'java') {
        return (
            <>
                <path d="M12 21h21v8a9 9 0 0 1-9 9h-3a9 9 0 0 1-9-9z" />
                <path d="M33 24h2.5a4.5 4.5 0 0 1 0 9H32M9 42h27" />
                <path d="M18 8c-2.4 2.6 2.4 4.4 0 7.5M24.5 6c-2.4 2.6 2.4 4.4 0 7.5M31 8c-2.4 2.6 2.4 4.4 0 7.5" />
            </>
        );
    }

    if (type === 'php') {
        return (
            <>
                <ellipse cx="24" cy="24" rx="20" ry="12" />
                <text x="24" y="29">PHP</text>
            </>
        );
    }

    return (
        <>
            <path d="m17 12-9 12 9 12M31 12l9 12-9 12M27 8l-6 32" />
        </>
    );
}

function StackConstellation() {
    const constellationRef = useRef(null);
    const [isOrbiting, setIsOrbiting] = useState(true);

    useEffect(() => {
        const constellation = constellationRef.current;
        if (!constellation) return undefined;
        if (!('IntersectionObserver' in window)) {
            setIsOrbiting(true);
            return undefined;
        }

        const observer = new IntersectionObserver(([entry]) => {
            setIsOrbiting(entry.isIntersecting);
        }, { threshold: 0.15 });
        observer.observe(constellation);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            className={`stack-constellation ${isOrbiting ? 'is-orbiting' : ''}`}
            ref={constellationRef}
            role="group"
            aria-label="Technology stack"
        >
            <div className="stack-orbit stack-orbit-outer" aria-hidden="true" />
            <div className="stack-orbit stack-orbit-inner" aria-hidden="true" />
            <div className="stack-core" aria-hidden="true">
                <span>&lt;/&gt;</span>
                <strong>Full-stack</strong>
                <small>Engineering toolkit</small>
            </div>
            <ul className="stack-node-list">
                {technologyStack.map((technology) => (
                    <li
                        className="stack-node"
                        key={technology.id}
                        style={{
                            '--stack-x': `${technology.x}%`,
                            '--stack-y': `${technology.y}%`,
                            '--stack-color': technology.color,
                        }}
                    >
                        <span className="stack-node-content">
                            <span className="stack-node-icon">
                                <svg viewBox="0 0 48 48" role="img" aria-label={technology.label}>
                                    <TechnologyGlyph type={technology.id} />
                                </svg>
                            </span>
                            <span className="stack-node-label">{technology.label}</span>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const staggerStyle = (index = 0, step = 70) => ({
    '--item-index': index,
    '--item-delay': `${index * step}ms`,
});

const educationItems = [
    {
        time: 'Conferred 2026',
        title: 'Bachelor of Software Engineering (with Distinction)',
        copy: 'Zambia University College of Technology. Studies completed December 2025; degree conferred 2026.',
        image: cardImages.education,
    },
];

function cardBackgroundStyle(image) {
    return image ? { '--card-image': `url("${image}")` } : undefined;
}

function resetScrollPosition() {
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    root.scrollTop = 0;
    document.body.scrollTop = 0;

    if (previousBehavior) {
        root.style.scrollBehavior = previousBehavior;
    } else {
        root.style.removeProperty('scroll-behavior');
    }
}

function useRoute() {
    const [path, setPath] = useState(routeFromLocation);
    const [isLeaving, setIsLeaving] = useState(false);
    const currentPathRef = useRef(path);
    const transitionTimerRef = useRef(null);

    const commitRoute = useCallback((routePath, pushHistory) => {
        if (pushHistory) {
            window.history.pushState({}, '', routeHref(routePath));
        }

        resetScrollPosition();
        currentPathRef.current = routePath;
        setPath(routePath);
        setIsLeaving(false);
        transitionTimerRef.current = null;
    }, []);

    const queueRoute = useCallback((routePath, pushHistory) => {
        if (routePath === currentPathRef.current) return;

        if (transitionTimerRef.current) {
            window.clearTimeout(transitionTimerRef.current);
        }

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            commitRoute(routePath, pushHistory);
            return;
        }

        setIsLeaving(true);
        transitionTimerRef.current = window.setTimeout(() => {
            commitRoute(routePath, pushHistory);
        }, 240);
    }, [commitRoute]);

    useEffect(() => {
        const previousScrollRestoration = window.history.scrollRestoration;
        window.history.scrollRestoration = 'manual';
        const onPop = () => queueRoute(routeFromLocation(), false);
        window.addEventListener('popstate', onPop);
        return () => {
            window.removeEventListener('popstate', onPop);
            window.history.scrollRestoration = previousScrollRestoration;
            if (transitionTimerRef.current) {
                window.clearTimeout(transitionTimerRef.current);
            }
        };
    }, [queueRoute]);

    const navigate = useCallback((nextPath) => {
        const requestedPath = normalizeRoutePath(nextPath);
        const routePath = requestedPath === '/capabilities' ? '/' : requestedPath;
        queueRoute(routePath, true);
    }, [queueRoute]);

    return [path, navigate, isLeaving];
}

function useReveal(path) {
    useEffect(() => {
        const items = document.querySelectorAll('.reveal');
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion || !('IntersectionObserver' in window)) {
            items.forEach((item) => item.classList.add('in'));
            return undefined;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('in');
                observer.unobserve(entry.target);
            });
        }, { rootMargin: '-8% 0px 12% 0px', threshold: 0.12 });

        items.forEach((item, index) => {
            item.classList.remove('in');
            item.style.setProperty('--delay', `${Math.min(index * 55, 260)}ms`);
            observer.observe(item);
        });

        return () => observer.disconnect();
    }, [path]);
}

function App() {
    const [path, navigate, isPageLeaving] = useRoute();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
    const [nightMode, setNightMode] = useState(() => {
        try {
            return localStorage.getItem('portfolio-theme') === 'night';
        } catch {
            return false;
        }
    });
    const [themeBurst, setThemeBurst] = useState(false);
    useReveal(path);

    useLayoutEffect(() => {
        resetScrollPosition();
        const frameId = window.requestAnimationFrame(resetScrollPosition);
        const settleTimer = window.setTimeout(resetScrollPosition, 100);
        return () => {
            window.cancelAnimationFrame(frameId);
            window.clearTimeout(settleTimer);
        };
    }, [path]);

    useEffect(() => {
        document.body.classList.toggle('theme-night', nightMode);
        try {
            localStorage.setItem('portfolio-theme', nightMode ? 'night' : 'day');
        } catch {
            // Storage is unavailable in some private modes; the theme still applies for this visit.
        }
    }, [nightMode]);

    useEffect(() => {
        if (!mobileOpen) setMobileAboutOpen(false);
    }, [mobileOpen]);

    const toggleTheme = useCallback(() => {
        setNightMode((value) => !value);
        setThemeBurst(true);
        window.setTimeout(() => setThemeBurst(false), 850);
    }, []);

    const page = useMemo(() => {
        if (path === '/projects' || path === '/work') return <ProjectsPage navigate={navigate} />;
        if (path === '/experience') return <ExperiencePage />;
        if (path === '/contact') return <ContactPage />;
        return <HomePage navigate={navigate} />;
    }, [path, navigate]);

    return (
        <div className="app-shell">
            <div className={`theme-burst ${themeBurst ? 'active' : ''}`} aria-hidden="true" />
            <header className="topbar">
                <div className="container-max nav-row">
                    <a href={routeHref('/')} className="brand-link" onClick={(event) => handleNav(event, '/', navigate)}>
                        <span>VINCENT</span>
                        <span>LUHANGA</span>
                    </a>

                    <nav className="nav-links desktop" aria-label="Primary navigation">
                        {routes.map((route) => (
                            <NavItem key={route.path || route.label} route={route} currentPath={path} navigate={navigate} />
                        ))}
                    </nav>

                    <div className="nav-tools">
                        <ThemeToggle nightMode={nightMode} toggleTheme={toggleTheme} />
                        <button
                            className="mobile-menu"
                            type="button"
                            onClick={() => setMobileOpen((open) => !open)}
                            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
                            aria-expanded={mobileOpen}
                        >
                            {mobileOpen ? <CloseSquare size={20} weight="Bold" /> : <HamburgerMenu size={20} weight="Bold" />}
                        </button>
                    </div>
                </div>

                <div className={`mobile-panel ${mobileOpen ? 'open' : ''}`}>
                    <div className="container-max mobile-panel-inner">
                        <div className="nav-links">
                            {routes.map((route) => (
                                <MobileNavItem
                                    key={route.path || route.label}
                                    route={route}
                                    currentPath={path}
                                    expanded={mobileAboutOpen}
                                    toggleExpanded={() => setMobileAboutOpen((open) => !open)}
                                    navigate={(nextPath) => {
                                        navigate(nextPath);
                                        setMobileOpen(false);
                                    }}
                                />
                            ))}
                        </div>
                        <a className="mobile-download" href={config.cvUrl}>
                            <span>Download CV</span>
                            <Download size={18} weight="Bold" />
                        </a>
                    </div>
                </div>
            </header>

            <main className={`page-shell ${isPageLeaving ? 'page-leaving' : ''}`} key={path}>
                {page}
                <SiteFooter navigate={navigate} />
            </main>
        </div>
    );
}

function ThemeToggle({ nightMode, toggleTheme }) {
    return (
        <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={nightMode ? 'Switch to day mode' : 'Switch to night mode'}
            title={nightMode ? 'Day mode' : 'Night mode'}
        >
            {nightMode ? <Sun size={19} weight="Bold" /> : <Moon size={19} weight="Bold" />}
        </button>
    );
}

function handleNav(event, path, navigate) {
    event.preventDefault();
    navigate(path);
}

function isRouteActive(route, currentPath) {
    if (route.children) {
        return route.children.some((child) => isRouteActive(child, currentPath));
    }

    return route.path === currentPath || (route.path === '/projects' && currentPath === '/work');
}

function NavItem({ route, currentPath, navigate }) {
    const Icon = route.icon;
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(false);
    }, [currentPath]);

    if (route.children) {
        const active = isRouteActive(route, currentPath);
        const menuId = `nav-menu-${route.label.toLowerCase().replace(/\s+/g, '-')}`;
        const closeDropdown = () => setOpen(false);
        const handleBlur = (event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
                closeDropdown();
            }
        };

        return (
            <div
                className={`nav-dropdown ${active ? 'active' : ''} ${open ? 'open' : ''}`}
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={closeDropdown}
                onBlur={handleBlur}
            >
                <button
                    className={`nav-button ${active ? 'active' : ''}`}
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={open}
                    aria-controls={menuId}
                    onClick={() => setOpen((value) => !value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Escape') closeDropdown();
                    }}
                >
                    {Icon && <Icon size={16} weight="Bold" />}
                    <span>{route.label}</span>
                    <AltArrowDown size={14} weight="Bold" />
                </button>
                <div className="nav-dropdown-menu" id={menuId} role="menu">
                    {route.children.map((child) => {
                        const ChildIcon = child.icon;

                        return (
                            <a
                                key={child.path}
                                href={routeHref(child.path)}
                                className={isRouteActive(child, currentPath) ? 'active' : ''}
                                role="menuitem"
                                onClick={(event) => {
                                    handleNav(event, child.path, navigate);
                                    closeDropdown();
                                }}
                            >
                                {ChildIcon && <ChildIcon size={16} weight="Bold" />}
                                {child.label}
                            </a>
                        );
                    })}
                </div>
            </div>
        );
    }

    return <NavButton route={route} currentPath={currentPath} navigate={navigate} />;
}

function MobileNavItem({ route, currentPath, navigate, expanded = false, toggleExpanded }) {
    const Icon = route.icon;

    if (route.children) {
        return (
            <div className="mobile-nav-group">
                <button
                    className={`mobile-group-label ${isRouteActive(route, currentPath) ? 'active' : ''}`}
                    type="button"
                    onClick={toggleExpanded}
                    aria-expanded={expanded}
                >
                    <span>
                        {Icon && <Icon size={17} weight="Bold" />}
                        {route.label}
                    </span>
                    <AltArrowDown size={14} weight="Bold" />
                </button>
                <div className={`mobile-subnav ${expanded ? 'open' : ''}`} aria-hidden={!expanded}>
                    {route.children.map((child) => (
                        <NavButton key={child.path} route={child} currentPath={currentPath} navigate={navigate} />
                    ))}
                </div>
            </div>
        );
    }

    return <NavButton route={route} currentPath={currentPath} navigate={navigate} />;
}

function NavButton({ route, currentPath, navigate }) {
    const active = isRouteActive(route, currentPath);
    const Icon = route.icon;

    return (
        <a
            href={routeHref(route.path)}
            className={`nav-button ${active ? 'active' : ''}`}
            onClick={(event) => handleNav(event, route.path, navigate)}
        >
            {Icon && <Icon size={16} weight="Bold" />}
            <span>{route.label}</span>
        </a>
    );
}

function HomePage({ navigate }) {
    const slides = useMemo(() => [config.assets?.cover].filter(Boolean), []);
    const [activeSlide, setActiveSlide] = useState(0);
    const [previousSlide, setPreviousSlide] = useState(null);

    const showSlide = useCallback((nextSlide) => {
        setActiveSlide((current) => {
            const next = typeof nextSlide === 'function' ? nextSlide(current) : nextSlide;
            if (next === current) return current;
            setPreviousSlide(current);
            return next;
        });
    }, []);

    useEffect(() => {
        if (slides.length < 2) return undefined;

        const timer = window.setInterval(() => {
            showSlide((current) => (current + 1) % slides.length);
        }, 5200);

        return () => window.clearInterval(timer);
    }, [showSlide, slides.length]);

    useEffect(() => {
        if (previousSlide === null) return undefined;
        const timer = window.setTimeout(() => setPreviousSlide(null), 1300);
        return () => window.clearTimeout(timer);
    }, [activeSlide, previousSlide]);

    return (
        <>
            <section className="hero-screen">
                <div className="hero-slideshow" aria-hidden="true">
                    {slides.map((slide, index) => (
                        (index === activeSlide || index === previousSlide) && (
                            <img
                                key={slide}
                                src={slide}
                                alt=""
                                className={index === activeSlide ? 'active' : 'leaving'}
                                loading={index === 0 ? 'eager' : 'lazy'}
                                decoding="async"
                                fetchPriority={index === 0 ? 'high' : 'low'}
                            />
                        )
                    ))}
                </div>
                <div className="hero-shade" aria-hidden="true" />

                <div className="container-max hero-window">
                    <div className="hero-copy">
                        <div className="hero-label reveal">
                            <span>Vincent Luhanga</span>
                            <span className="hero-label-divider" aria-hidden="true" />
                            <span>Software Engineer</span>
                        </div>
                        <h1 className="hero-title reveal">
                            I build and ship reliable software <span>from requirements through release.</span>
                        </h1>
                        <p className="hero-summary reveal">
                            Full-stack engineer focused on clean architecture, maintainable code, and practical
                            solutions that hold up in real use. I work across web and application development,
                            backend, data, AI-assisted development, and testing to deliver software that is clear, dependable, and
                            easy for the next engineer to build on.
                        </p>
                        <div className="hero-actions reveal">
                            <a className="action-button" href={routeHref('/projects')} onClick={(event) => handleNav(event, '/projects', navigate)}>
                                <span>View Projects</span>
                                <Folder size={19} weight="Bold" />
                            </a>
                            <a className="action-button outline" href={config.cvUrl} download>
                                <span>Download CV</span>
                                <Download size={19} weight="Bold" />
                            </a>
                            <a className="action-button outline" href={routeHref('/contact')} onClick={(event) => handleNav(event, '/contact', navigate)}>
                                <span>Contact Me</span>
                                <Letter size={19} weight="Bold" />
                            </a>
                        </div>
                        <div className="hero-profiles reveal" aria-label="Professional profiles">
                            <a className="hero-profile-link" href={profileLinks.github} target="_blank" rel="noreferrer">
                                <GitHubIcon size={17} />
                                <span>GitHub</span>
                                <SquareArrowRightUp size={14} weight="Bold" />
                            </a>
                            <a className="hero-profile-link" href={profileLinks.linkedin} target="_blank" rel="noreferrer">
                                <LinkedInIcon size={17} />
                                <span>LinkedIn</span>
                                <SquareArrowRightUp size={14} weight="Bold" />
                            </a>
                        </div>
                        <dl className="hero-proof reveal">
                            {heroProof.map((item) => (
                                <div key={item.label}>
                                    <dt>{item.label}</dt>
                                    <dd>{item.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>

                {slides.length > 1 && (
                    <div className="container-max slide-status reveal">
                        {slides.map((slide, index) => (
                            <button
                                key={slide}
                                type="button"
                                className={index === activeSlide ? 'active' : ''}
                                onClick={() => showSlide(index)}
                                aria-label={`Show hero image ${index + 1}`}
                            >
                                <span aria-hidden="true" />
                            </button>
                        ))}
                    </div>
                )}
            </section>

            <HomeProfileSection />
        </>
    );
}

function HomeProfileSection() {
    return (
        <section className="section-pad home-profile">
            <div className="container-max home-profile-layout">
                <div className="home-profile-copy reveal">
                    <p className="eyebrow">How I Work</p>
                    <h2>Engineering habits that keep software dependable long after launch.</h2>
                    <p>
                        I own features from requirements to production: I structure code for maintainability, test
                        and debug until it performs to specification, and collaborate closely with my team in an
                        agile workflow.
                    </p>
                </div>

                <div className="home-signal-grid reveal">
                    {homeSignals.map((signal, index) => (
                        <article className="home-signal-card" key={signal.label} style={staggerStyle(index)}>
                            <strong>{signal.value}</strong>
                            <span>{signal.label}</span>
                            <p>{signal.copy}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

function GitHubIcon({ size = 21 }) {
    return (
        <svg className="brand-mark" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
                fill="currentColor"
                d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.15c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.16 1.18.92-.26 1.9-.38 2.88-.39.98.01 1.96.13 2.88.39 2.2-1.49 3.16-1.18 3.16-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.83 1.18 3.08 0 4.42-2.69 5.39-5.25 5.67.41.35.77 1.04.77 2.1v3.1c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
            />
        </svg>
    );
}

function LinkedInIcon({ size = 21 }) {
    return (
        <svg className="brand-mark" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
                fill="currentColor"
                d="M20.45 20.45h-3.56v-5.58c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.67H9.34V8.98h3.41v1.57h.05a3.74 3.74 0 0 1 3.37-1.85c3.61 0 4.28 2.38 4.28 5.47v6.28ZM5.32 7.42a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.03H3.54V8.98H7.1v11.47ZM22.23 0H1.76C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.76 24h20.47c.97 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0Z"
            />
        </svg>
    );
}

function WhatsAppIcon({ size = 21 }) {
    return (
        <svg className="brand-mark whatsapp-mark" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
                fill="currentColor"
                d="M12.04 2.2A9.75 9.75 0 0 0 3.6 16.82L2.5 21.8l5.08-1.08a9.7 9.7 0 0 0 4.46 1.08h.01a9.8 9.8 0 0 0 0-19.6Zm0 17.95h-.01a8.05 8.05 0 0 1-4.1-1.12l-.29-.17-3.02.64.65-2.94-.19-.31a8.08 8.08 0 1 1 6.96 3.9Zm4.42-6.05c-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.1.16 1.52.1.46-.07 1.43-.58 1.63-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z"
            />
        </svg>
    );
}

function PhoneSequenceLinks({ iconSize = 18 }) {
    return (
        <div className="contact-methods" aria-label="Phone and WhatsApp contact options">
            <a className="whatsapp-link" href={whatsappContact.href} target="_blank" rel="noreferrer">
                <WhatsAppIcon size={iconSize} />
                <span className="whatsapp-copy">
                    <strong>WhatsApp</strong>
                    <span>{whatsappContact.label}</span>
                </span>
            </a>
            <div className="phone-sequence" aria-label="Direct call numbers">
                <Phone size={iconSize} weight="Bold" />
                <span>
                    {contactPhones.map((phone, index) => (
                        <React.Fragment key={phone.href}>
                            <a href={phone.href}>{phone.label}</a>
                            {index < contactPhones.length - 1 && <em>/</em>}
                        </React.Fragment>
                    ))}
                </span>
            </div>
        </div>
    );
}

function SiteFooter({ navigate }) {
    return (
        <footer className="site-footer">
            <div className="container-max footer-layout">
                <div>
                    <a href={routeHref('/')} className="footer-brand" onClick={(event) => handleNav(event, '/', navigate)}>
                        Vincent <span>Luhanga</span>
                    </a>
                    <p>Software Engineer · Full-stack, data and AI-assisted development.</p>
                </div>

                <nav className="footer-links" aria-label="Footer navigation">
                    <a href={routeHref('/projects')} onClick={(event) => handleNav(event, '/projects', navigate)}><Folder size={18} weight="Bold" />Projects</a>
                    <a href={routeHref('/experience')} onClick={(event) => handleNav(event, '/experience', navigate)}><CalendarMark size={18} weight="Bold" />Experience</a>
                    <a href={routeHref('/contact')} onClick={(event) => handleNav(event, '/contact', navigate)}><Letter size={18} weight="Bold" />Contact</a>
                </nav>

                <div className="footer-contact">
                    <h2 className="footer-contact-title">Contact & Professional Links</h2>
                    <a href="mailto:vluhanga64@gmail.com"><Letter size={18} weight="Bold" />vluhanga64@gmail.com</a>
                    <PhoneSequenceLinks iconSize={18} />
                    <a href="https://github.com/vicente101" target="_blank" rel="noreferrer"><GitHubIcon size={18} />github.com/vicente101</a>
                    <a href="https://www.linkedin.com/in/vincent-luhanga-782256240/" target="_blank" rel="noreferrer"><LinkedInIcon size={18} />LinkedIn profile</a>
                    <a href={config.cvUrl}><Download size={18} weight="Bold" />Download CV</a>
                </div>
            </div>
        </footer>
    );
}

function ProjectsPage({ navigate }) {
    return (
        <>
            <section className="project-hero">
                <div className="container-max project-hero-grid">
                    <div className="project-hero-copy reveal">
                        <p className="eyebrow">Case Studies</p>
                        <h1>Software engineered around real problems.</h1>
                        <p>
                            Marketplace platforms, developer tooling, data-driven applications and records
                            management, each taken from problem definition through architecture, implementation and
                            delivery.
                        </p>
                        <a className="action-button compact" href={routeHref('/experience')} onClick={(event) => handleNav(event, '/experience', navigate)}>
                            <span>View experience</span>
                            <ArrowRight size={18} weight="Bold" />
                        </a>
                    </div>
                    <div className="project-stack-panel">
                        <StackConstellation />
                    </div>
                </div>
            </section>

            <section className="section-pad">
                <div className="container-max project-grid">
                    {projects.map((project, index) => (
                        <ProjectCard key={project.title} project={project} index={index} />
                    ))}
                </div>
            </section>

            <SkillsSection />
        </>
    );
}

function SkillsSection() {
    return (
        <section className="section-pad slim">
            <div className="container-max section-heading reveal">
                <div>
                    <p className="eyebrow">Core Skills</p>
                    <h2>Technologies and practices behind the work.</h2>
                </div>
            </div>
            <div className="container-max skills-grid">
                {skillGroups.map((group, index) => (
                    <article className="skill-group-card reveal" key={group.title} style={staggerStyle(index)}>
                        <h3>{group.title}</h3>
                        <div className="tag-row">
                            {group.items.map((item) => <span className="tag" key={item}>{item}</span>)}
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

function ExperiencePage() {
    return (
        <>
            <ExperienceHero />
            <section className="section-pad">
                <div className="container-max timeline-grid experience-grid">
                    {timeline.map((item, index) => (
                        <TimelineCard key={item.title} item={item} index={index} />
                    ))}
                </div>
            </section>

            <section className="section-pad slim">
                <div className="container-max section-heading reveal">
                    <div>
                        <p className="eyebrow">Education</p>
                        <h2>Formal training in software engineering.</h2>
                    </div>
                </div>
                <div className="container-max timeline-grid experience-grid">
                    {educationItems.map((item, index) => (
                        <TimelineCard key={item.title} item={item} index={index} />
                    ))}
                </div>
            </section>
        </>
    );
}

function ExperienceHero() {
    const title = 'Professional experience and education.';

    return (
        <section className="experience-hero">
            <div className="container-max experience-hero-content">
                <p className="eyebrow">Experience</p>
                <h1 className="experience-hero-title">{title}</h1>
                <p className="experience-hero-copy">
                    Commercial software engineering in a delivery team, backed by a Bachelor of Software Engineering and a grounding in data quality and process discipline.
                </p>
            </div>
        </section>
    );
}

function ContactPage() {
    const [statusMessage, setStatusMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const name = String(formData.get('name') || '').trim();
        const email = String(formData.get('email') || '').trim();
        const message = String(formData.get('message') || '').trim();
        const subject = encodeURIComponent(`Portfolio inquiry from ${name || 'website visitor'}`);
        const body = encodeURIComponent([
            `Name: ${name}`,
            `Email: ${email}`,
            '',
            message,
        ].join('\n'));

        setStatusMessage('Opening your email app with the message ready to send.');
        window.location.href = `mailto:vluhanga64@gmail.com?subject=${subject}&body=${body}`;
    };

    return (
        <>
            <PageHeading
                eyebrow="Contact"
                title="Available for Software Engineer roles."
                copy="Email is the fastest way to reach me for roles, interviews or technical discussions. My CV, GitHub and LinkedIn are linked below."
            />
            <section className="section-pad">
                <div className="container-max frame-card inner reveal">
                    <div className="contact-layout">
                        <div>
                            <p className="eyebrow">Direct Lines</p>
                            <div className="contact-links">
                                <a href="mailto:vluhanga64@gmail.com"><Letter size={21} weight="Bold" />vluhanga64@gmail.com</a>
                                <PhoneSequenceLinks iconSize={21} />
                                <a href="https://github.com/vicente101" target="_blank" rel="noreferrer"><GitHubIcon size={21} />github.com/vicente101</a>
                                <a href="https://www.linkedin.com/in/vincent-luhanga-782256240/" target="_blank" rel="noreferrer"><LinkedInIcon size={21} />LinkedIn profile</a>
                                <a href={config.cvUrl} download><Download size={21} weight="Bold" />Download CV</a>
                            </div>
                        </div>

                        <div>
                            {statusMessage && <p className="status-message">{statusMessage}</p>}
                            <form onSubmit={handleSubmit} className="contact-form">
                                <Field id="name" label="Name" name="name" />
                                <Field id="email" label="Email" name="email" type="email" />
                                <Field id="message" label="Message" name="message" textarea />
                                <div className="field full">
                                    <button type="submit" className="action-button">
                                        <span>Send message</span>
                                        <ArrowRight size={19} weight="Bold" />
                                    </button>
                                    <p className="form-note">
                                        The form opens your email app. You can also email{' '}
                                        <a href="mailto:vluhanga64@gmail.com">vluhanga64@gmail.com</a> directly.
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

function PageHeading({ eyebrow, title, copy }) {
    return (
        <section className="container-max">
            <div className="page-heading reveal">
                <p className="eyebrow">{eyebrow}</p>
                <h1>{title}</h1>
                <p>{copy}</p>
            </div>
        </section>
    );
}

function ProjectCard({ project, index = 0 }) {
    const hasFooter = Boolean(project.liveUrl || project.repoUrl || project.status);

    return (
        <article className={`project-detail image-card reveal ${hasFooter ? 'has-live-link' : ''}`} style={{ ...cardBackgroundStyle(project.image), ...staggerStyle(index) }}>
            <span className="card-bg-image" aria-hidden="true" />
            <header>
                <p className="project-category">{project.signal}</p>
                <h2>{project.title}</h2>
            </header>
            <div className="project-problem">
                <h3>Gap</h3>
                <p>{project.problem}</p>
            </div>
            <div className="project-columns">
                <div>
                    <h3>System Overview</h3>
                    <p>{project.result}</p>
                </div>
                <div>
                    <h3>Technical Focus</h3>
                    <p>{project.detail}</p>
                    <div className="tag-row">
                        {project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
                    </div>
                </div>
            </div>
            {hasFooter && (
                <div className="project-links">
                    {project.status && (
                        <span className="project-status">
                            <span className="project-status-dot" aria-hidden="true" />
                            {project.status}
                        </span>
                    )}
                    {project.liveUrl && (
                        <a className="project-live-link" href={project.liveUrl} target="_blank" rel="noreferrer">
                            <span>View live product</span>
                            <SquareArrowRightUp size={17} weight="Bold" />
                        </a>
                    )}
                    {project.repoUrl && (
                        <a className={`project-live-link ${project.liveUrl ? 'secondary' : ''}`} href={project.repoUrl} target="_blank" rel="noreferrer">
                            <span>Source code</span>
                            <GitHubIcon size={16} />
                        </a>
                    )}
                </div>
            )}
        </article>
    );
}

function TimelineCard({ item, index = 0 }) {
    return (
        <article className="timeline-card image-card reveal" style={{ ...cardBackgroundStyle(item.image), ...staggerStyle(index) }}>
            <span className="card-bg-image" aria-hidden="true" />
            <span className="time">{item.time}</span>
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
            {item.duties && (
                <ul className="timeline-duties">
                    {item.duties.map((duty) => <li key={duty}>{duty}</li>)}
                </ul>
            )}
        </article>
    );
}

function Field({ id, label, name, type = 'text', textarea = false, defaultValue = '', error }) {
    return (
        <div className={`field ${textarea ? 'full' : ''}`}>
            <label htmlFor={id}>{label}</label>
            {textarea ? (
                <textarea id={id} name={name} defaultValue={defaultValue} required />
            ) : (
                <input id={id} name={name} type={type} defaultValue={defaultValue} required />
            )}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

createRoot(document.getElementById('portfolio-root')).render(<App />);
