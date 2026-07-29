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
    Layers,
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
        label: 'Professional Profile',
        icon: UserCircle,
        children: [
            { path: '/experience', label: 'Experience', icon: CalendarMark },
            { path: '/projects', label: 'Projects', icon: Folder },
        ],
    },
    { path: '/contact', label: 'Contact', icon: Letter },
];

const whatsappContact = {
    label: '+260 768891429',
    href: 'https://wa.me/260768891429?text=Hello%20Vincent%2C%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20contact%20you.',
};

const contactPhones = [
    { label: '0963659222', href: 'tel:0963659222' },
    { label: '0955334043', href: 'tel:0955334043' },
];

const cardImages = {
    quality: assetUrl('card-bg/interface-quality.svg'),
    student: assetUrl('card-bg/student-system.svg'),
    booking: assetUrl('card-bg/venue-booking.svg'),
    visualizer: assetUrl('card-bg/data-visualizer.svg'),
    smartgrow: assetUrl('card-bg/smartgrow.svg'),
    delivery: assetUrl('card-bg/operations-flow.svg'),
    learning: assetUrl('card-bg/learning.svg'),
    education: assetUrl('card-bg/education.svg'),
};

const projects = [
    {
        title: 'Student Information System',
        role: 'Academic management system',
        signal: 'Academic Operations',
        result: 'A structured interface for student records, academic results, and admin dashboards.',
        detail: 'Built with Laravel-backed workflows, clean data entry, validation states, role-aware screens, and fast record review.',
        tags: ['Laravel', 'React.js', 'MySQL', 'Tailwind CSS'],
        image: cardImages.student,
    },
    {
        title: 'Venue Booking System',
        role: 'Venue management system',
        signal: 'Reservations & Scheduling',
        result: 'A booking flow for checking availability, managing reservations, and keeping venue schedules clear.',
        detail: 'Built around Laravel workflows, mobile usability, reusable state, Supabase-backed data, and action-ready booking screens.',
        tags: ['Laravel', 'React.js', 'Supabase', 'Booking UI'],
        image: cardImages.booking,
    },
    {
        title: 'Database Visualizer',
        role: 'Developer system tool',
        signal: 'Developer Tooling',
        result: 'A visual tool that helps developers inspect tables, relationships, and structure faster.',
        detail: 'Designed for technical users who need clear context, stateful controls, and readable schema views.',
        tags: ['React.js', 'TypeScript', 'Context UI', 'Open Source'],
        image: cardImages.visualizer,
    },
    {
        title: 'Crop Recommendation System',
        role: 'Decision support system',
        signal: 'Open SmartGrow',
        result: 'A simple decision-support screen that turns agricultural inputs into useful crop guidance.',
        detail: 'Designed around clear form logic, readable results, and a flow that non-technical users can follow.',
        tags: ['HTML', 'CSS', 'JavaScript', 'MySQL'],
        liveUrl: 'https://smartgrow.nyimboo.com/HTML/index.php',
        image: cardImages.smartgrow,
    },
];

const timeline = [
    {
        time: '2026 - Present',
        title: 'Software Engineer, WebDev Technologies Limited',
        copy: 'Software development, testing, debugging, system maintenance, and collaboration with development teams in an agile environment.',
        image: cardImages.delivery,
    },
    {
        time: '2025',
        title: 'Docufree Workflow Placement, Wiphan',
        copy: 'Strengthened quality-assurance discipline through document verification, accurate data handling, and consistent process compliance.',
        image: cardImages.quality,
    },
];

const homeSignals = [
    {
        value: 'Structured',
        label: 'Problem Solving',
        copy: 'Requirements are analysed carefully, divided into manageable parts, and translated into practical technical decisions.',
    },
    {
        value: 'Dependable',
        label: 'Engineering Quality',
        copy: 'Maintainable code, thoughtful validation, testing, debugging, and data integrity are treated as core responsibilities.',
    },
    {
        value: 'Collaborative',
        label: 'Team Contribution',
        copy: 'Clear updates, constructive feedback, accountability, and continuous learning support healthy product delivery.',
    },
];

const technologyStack = [
    { id: 'javascript', label: 'JavaScript', x: 50, y: 10, color: '#f7df1e' },
    { id: 'typescript', label: 'TypeScript', x: 70, y: 13, color: '#5aa7e8' },
    { id: 'react', label: 'React', x: 86, y: 27, color: '#61dafb' },
    { id: 'supabase', label: 'Supabase', x: 92, y: 49, color: '#4ade80' },
    { id: 'laravel', label: 'Laravel', x: 86, y: 72, color: '#ff6b68' },
    { id: 'php', label: 'PHP', x: 69, y: 87, color: '#a7a9dc' },
    { id: 'mysql', label: 'MySQL', x: 47, y: 91, color: '#67c5e8' },
    { id: 'git', label: 'Git', x: 26, y: 86, color: '#f97352' },
    { id: 'tailwind', label: 'Tailwind CSS', x: 9, y: 68, color: '#38bdf8' },
    { id: 'css', label: 'CSS3', x: 7, y: 45, color: '#57a9e9' },
    { id: 'html', label: 'HTML5', x: 16, y: 25, color: '#ff7849' },
    { id: 'api', label: 'REST APIs', x: 31, y: 13, color: '#c8ddef' },
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
        time: 'Ongoing',
        title: 'Professional Growth',
        copy: 'Continuous learning across software engineering, UI/UX design, database management, testing, and mobile application development.',
        image: cardImages.learning,
    },
    {
        time: 'December 2025',
        title: 'Bachelor of Software Engineering',
        copy: 'Zambia University College of Technology. Strong academic performance with multiple distinctions.',
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
    const [nightMode, setNightMode] = useState(() => localStorage.getItem('portfolio-theme') === 'night');
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
        localStorage.setItem('portfolio-theme', nightMode ? 'night' : 'day');
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
                {path === '/' && <SiteFooter navigate={navigate} />}
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
    const slides = useMemo(() => [
        config.assets?.cover,
        config.assets?.image,
        config.assets?.professional,
        config.assets?.profile,
    ].filter(Boolean), []);
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
                        <h1 className="hero-title reveal">VINCENT <span>LUHANGA</span></h1>
                        <p className="hero-label reveal font-extrabold">Software Engineer</p>
                        <p className="reveal">
                            Software engineer focused on dependable, maintainable products and responsible delivery.
                            Brings structured problem-solving, full-stack development, quality discipline, and clear
                            collaboration from requirement to release.
                        </p>
                        <div className="hero-actions reveal">
                            <a className="action-button secondary" href={routeHref('/projects')} onClick={(event) => handleNav(event, '/projects', navigate)}>
                                <span>View projects</span>
                                <Folder size={19} weight="Bold" />
                            </a>
                            <a className="action-button" href={routeHref('/experience')} onClick={(event) => handleNav(event, '/experience', navigate)}>
                                <span>View experience</span>
                                <ArrowRight size={19} weight="Bold" />
                            </a>
                            <a className="action-button download" href={config.cvUrl} download>
                                <span>Download CV</span>
                                <Download size={19} weight="Bold" />
                            </a>
                        </div>
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

            <section className="section-pad home-hub">
                <div className="container-max hub-grid">
                    <FeatureLink
                        icon={CalendarMark}
                        title="Experience"
                        copy="Relevant work, formal engineering training, and the responsibilities that shaped a dependable professional."
                        path="/experience"
                        navigate={navigate}
                    />
                    <FeatureLink
                        icon={Layers}
                        title="Selected Work"
                        copy="A focused selection of software that demonstrates technical decisions, usability, and practical execution."
                        path="/projects"
                        navigate={navigate}
                    />
                    <FeatureLink
                        icon={Letter}
                        title="Contact"
                        copy="Get in touch to discuss software engineering opportunities, product needs, and professional collaboration."
                        path="/contact"
                        navigate={navigate}
                    />
                </div>
            </section>

            <HomeProfileSection />
        </>
    );
}

function FeatureLink({ icon: Icon, title, copy, path, navigate }) {
    return (
        <a className="feature-link reveal" href={routeHref(path)} onClick={(event) => handleNav(event, path, navigate)}>
            <div className="feature-link-head">
                <Icon size={28} weight="Bold" />
                <h2>{title}</h2>
            </div>
            <p>{copy}</p>
            <span>
                Open
                <ArrowRight size={17} weight="Bold" />
            </span>
        </a>
    );
}

function HomeProfileSection() {
    return (
        <section className="section-pad home-profile">
            <div className="container-max home-profile-layout">
                <div className="home-profile-copy reveal">
                    <p className="eyebrow">Professional Value</p>
                    <h2>A dependable software engineer who turns requirements into clear, maintainable solutions.</h2>
                    <p>
                        Combines technical foundations with professional ownership, careful reasoning, and a practical
                        understanding of how software supports users, teams, and business goals.
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
                    <p>
                        Software engineer bringing structured problem-solving, dependable implementation,
                        quality discipline, and clear collaboration to product teams.
                    </p>
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
                        <p className="eyebrow">Selected Work</p>
                        <h1>Practical software that demonstrates sound engineering decisions.</h1>
                        <p>
                            These examples show the application of requirements analysis, interface design, data
                            modelling, validation, and full-stack implementation to real user needs.
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
                <div className="container-max section-heading reveal">
                    <div>
                        <p className="eyebrow">Selected Projects</p>
                        <h2>Evidence of technical ability, thoughtful execution, and practical outcomes.</h2>
                    </div>
                </div>
                <div className="container-max project-grid">
                    {projects.map((project, index) => (
                        <ProjectCard key={project.title} project={project} index={index} />
                    ))}
                </div>
            </section>
        </>
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
                        <p className="eyebrow">Education & Growth</p>
                        <h2>Formal training backed by ongoing practical learning.</h2>
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

function AnimatedHeadline({ text }) {
    let letterIndex = 0;
    const words = text.split(' ');

    return (
        <h1 className="experience-hero-title" aria-label={text}>
            <span aria-hidden="true">
                {words.map((word, wordIndex) => (
                    <React.Fragment key={`${word}-${wordIndex}`}>
                        <span className="headline-word">
                            {Array.from(word).map((letter, index) => {
                                const delay = 100 + (letterIndex * 12);
                                letterIndex += 1;

                                return (
                                    <span
                                        className="headline-letter"
                                        style={{ '--letter-delay': `${delay}ms` }}
                                        key={`${letter}-${index}`}
                                    >
                                        {letter}
                                    </span>
                                );
                            })}
                        </span>
                        {wordIndex < words.length - 1 && ' '}
                    </React.Fragment>
                ))}
            </span>
        </h1>
    );
}

function ExperienceHero() {
    const title = 'Professional experience shaped by accuracy, accountability, and continuous improvement.';

    return (
        <section className="experience-hero">
            <div className="container-max experience-hero-content">
                <p className="eyebrow">Experience</p>
                <AnimatedHeadline text={title} />
                <p className="experience-hero-copy">
                    Development practice and quality-focused operational experience have built a disciplined approach to software, data, communication, and reliable delivery.
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
                title="Looking for a thoughtful, dependable software engineer?"
                copy="Open to software engineering opportunities where strong problem-solving, responsible delivery, teamwork, and continuous growth are valued."
            />
            <section className="section-pad">
                <div className="container-max frame-card inner reveal">
                    <div className="contact-layout">
                        <div>
                            <p className="eyebrow">Direct Lines</p>
                            <h2>Let's start with a chat.</h2>
                            <div className="contact-links">
                                <a href="mailto:vluhanga64@gmail.com"><Letter size={21} weight="Bold" />vluhanga64@gmail.com</a>
                                <PhoneSequenceLinks iconSize={21} />
                                <a href="https://github.com/vicente101" target="_blank" rel="noreferrer"><GitHubIcon size={21} />github.com/vicente101</a>
                                <a href="https://www.linkedin.com/in/vincent-luhanga-782256240/" target="_blank" rel="noreferrer"><LinkedInIcon size={21} />LinkedIn profile</a>
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
    return (
        <article className={`project-detail image-card reveal ${project.liveUrl ? 'has-live-link' : ''}`} style={{ ...cardBackgroundStyle(project.image), ...staggerStyle(index) }}>
            <span className="card-bg-image" aria-hidden="true" />
            <header>
                <h2>{project.title}</h2>
            </header>
            <div className="project-columns">
                <div>
                    <h3>{project.signal}</h3>
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
            {project.liveUrl && (
                <a className="project-live-link" href={project.liveUrl} target="_blank" rel="noreferrer">
                    <span>Go to project</span>
                    <SquareArrowRightUp size={17} weight="Bold" />
                </a>
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
