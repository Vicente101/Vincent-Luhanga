import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
    AltArrowDown,
    ArrowRight,
    CalendarMark,
    ChartSquare,
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
        const routePath = normalizeRoutePath(redirectedPath);
        window.history.replaceState({}, '', routeHref(routePath));
        return routePath;
    }

    const pathname = window.location.pathname || '/';
    const routePath = basePath && (pathname === basePath || pathname.startsWith(`${basePath}/`))
        ? pathname.slice(basePath.length) || '/'
        : pathname;

    return normalizeRoutePath(routePath);
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
            { path: '/capabilities', label: 'Capabilities', icon: ChartSquare },
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
    webApp: assetUrl('card-bg/web-app.svg'),
    mobile: assetUrl('card-bg/mobile-app.svg'),
    database: assetUrl('card-bg/data-grid.svg'),
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

const capabilities = [
    {
        title: 'Full-Stack Engineering',
        copy: 'Maintainable web and mobile software shaped by clear requirements, sound structure, and attention to the complete user journey.',
        image: cardImages.webApp,
    },
    {
        title: 'Problem Solving & Design',
        copy: 'Complex requirements are broken into practical components, data flows, interfaces, and implementation decisions.',
        image: cardImages.mobile,
    },
    {
        title: 'Quality Engineering',
        copy: 'Testing, debugging, validation, and edge-case thinking support software that behaves predictably and protects data integrity.',
        image: cardImages.database,
    },
    {
        title: 'Collaboration & Delivery',
        copy: 'Clear communication, agile teamwork, documentation, and responsible handover keep delivery aligned and maintainable.',
        image: cardImages.quality,
    },
];

const buildStages = [
    {
        index: '01',
        title: 'Understand & define',
        copy: 'Clarify the business need, users, constraints, acceptance criteria, and technical risks before implementation.',
    },
    {
        index: '02',
        title: 'Design & implement',
        copy: 'Translate requirements into maintainable components, data structures, integrations, and accessible user experiences.',
    },
    {
        index: '03',
        title: 'Verify & improve',
        copy: 'Test expected and edge-case behaviour, resolve defects, document decisions, and refine the result through feedback.',
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

const stackGroups = [
    { title: 'Engineering Practice', items: ['Requirements analysis', 'System design', 'Maintainable code', 'Version control'] },
    { title: 'Quality & Reliability', items: ['Testing', 'Debugging', 'Edge cases', 'Data integrity'] },
    { title: 'Product Delivery', items: ['Responsive UI', 'APIs & integrations', 'Documentation', 'Technical handover'] },
    { title: 'Team Contribution', items: ['Agile collaboration', 'Clear communication', 'Feedback', 'Continuous learning'] },
];

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

function useRoute() {
    const [path, setPath] = useState(routeFromLocation);

    useEffect(() => {
        const onPop = () => setPath(routeFromLocation());
        window.addEventListener('popstate', onPop);
        return () => window.removeEventListener('popstate', onPop);
    }, []);

    const navigate = useCallback((nextPath) => {
        const routePath = normalizeRoutePath(nextPath);
        if (routePath === path) return;
        window.history.pushState({}, '', routeHref(routePath));
        setPath(routePath);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [path]);

    return [path, navigate];
}

function useReveal(path) {
    useEffect(() => {
        const items = document.querySelectorAll('.reveal');
        if (!('IntersectionObserver' in window)) {
            items.forEach((item) => item.classList.add('in'));
            return undefined;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                entry.target.classList.toggle('in', entry.isIntersecting);
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
    const [path, navigate] = useRoute();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
    const [nightMode, setNightMode] = useState(() => localStorage.getItem('portfolio-theme') === 'night');
    const [themeBurst, setThemeBurst] = useState(false);
    useReveal(path);

    useEffect(() => {
        document.body.classList.toggle('theme-night', nightMode);
        localStorage.setItem('portfolio-theme', nightMode ? 'night' : 'day');
    }, [nightMode]);

    useEffect(() => {
        const move = (event) => {
            document.documentElement.style.setProperty('--cursor-y', `${event.clientY}px`);
        };
        window.addEventListener('pointermove', move);
        return () => window.removeEventListener('pointermove', move);
    }, []);

    useEffect(() => {
        if (!mobileOpen) setMobileAboutOpen(false);
    }, [mobileOpen]);

    const toggleTheme = useCallback(() => {
        setNightMode((value) => !value);
        setThemeBurst(true);
        window.setTimeout(() => setThemeBurst(false), 850);
    }, []);

    const page = useMemo(() => {
        if (path === '/projects' || path === '/work') return <ProjectsPage navigate={navigate} nightMode={nightMode} toggleTheme={toggleTheme} />;
        if (path === '/capabilities') return <CapabilitiesPage />;
        if (path === '/experience') return <ExperiencePage />;
        if (path === '/contact') return <ContactPage />;
        return <HomePage navigate={navigate} />;
    }, [path, navigate, nightMode, toggleTheme]);

    return (
        <div className="app-shell">
            <div className="cursor-line" aria-hidden="true" />
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

            <main className="page-shell" key={path}>
                {page}
            </main>

            {path === '/' && <SiteFooter navigate={navigate} />}
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
                            <a className="action-button secondary" href={routeHref('/capabilities')} onClick={(event) => handleNav(event, '/capabilities', navigate)}>
                                <span>Professional strengths</span>
                                <ChartSquare size={19} weight="Bold" />
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
                        icon={ChartSquare}
                        title="Capabilities"
                        copy="Core engineering strengths across problem-solving, implementation, quality, and professional delivery."
                        path="/capabilities"
                        navigate={navigate}
                    />
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
                </div>
            </section>

            <HomeProfileSection />
        </>
    );
}

const desktopLinks = [
    { label: 'Home', path: '/', x: -1.42, y: 0.82 },
    { label: 'Projects', path: '/projects', x: -0.28, y: 0.82 },
    { label: 'Capabilities', path: '/capabilities', x: 0.86, y: 0.82 },
    { label: 'Experience', path: '/experience', x: -0.86, y: -0.34 },
    { label: 'Contact', path: '/contact', x: 0.48, y: -0.34 },
];

const pcPalettes = {
    night: {
        mode: 'Night',
        screen: '#041117',
        screenSoft: '#0b222d',
        panel: 'rgba(8, 22, 31, 0.92)',
        panelStrong: '#0d2632',
        grid: 'rgba(200, 221, 239, 0.13)',
        line: '#c8ddef',
        muted: 'rgba(200, 221, 239, 0.68)',
        accent: '#16b8ad',
        accentSoft: 'rgba(22, 184, 173, 0.18)',
        frameThree: 0x061018,
        trimThree: 0xc8ddef,
        keyThree: 0x11252f,
        towerThree: 0x0a1b24,
        accentThree: 0x16b8ad,
        particleThree: 0xbad8ef,
    },
    day: {
        mode: 'Day',
        screen: '#dce9f4',
        screenSoft: '#edf5fb',
        panel: 'rgba(200, 221, 239, 0.9)',
        panelStrong: '#c8ddef',
        grid: 'rgba(14, 29, 37, 0.14)',
        line: '#0e1d25',
        muted: 'rgba(14, 29, 37, 0.64)',
        accent: '#0f948e',
        accentSoft: 'rgba(15, 148, 142, 0.16)',
        frameThree: 0x10212a,
        trimThree: 0xe8f2fb,
        keyThree: 0xb4c6d4,
        towerThree: 0x152d38,
        accentThree: 0x0f948e,
        particleThree: 0x0f948e,
    },
};

function getPcPalette(nightMode) {
    return nightMode ? pcPalettes.night : pcPalettes.day;
}

function createCanvasTexture(THREE, width, height, draw) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    draw(context, width, height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 2;
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return texture;
}

function createDesktopTexture(THREE, nightMode = false) {
    const palette = getPcPalette(nightMode);

    return createCanvasTexture(THREE, 1024, 620, (context, width, height) => {
        context.fillStyle = palette.screen;
        context.fillRect(0, 0, width, height);

        const glow = context.createRadialGradient(width * 0.74, height * 0.18, 28, width * 0.74, height * 0.18, 440);
        glow.addColorStop(0, palette.accentSoft);
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        context.fillStyle = glow;
        context.fillRect(0, 0, width, height);

        context.strokeStyle = palette.grid;
        context.lineWidth = 1;
        for (let x = 0; x < width; x += 82) {
            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x, height);
            context.stroke();
        }
        for (let y = 0; y < height; y += 82) {
            context.beginPath();
            context.moveTo(0, y);
            context.lineTo(width, y);
            context.stroke();
        }

        context.fillStyle = palette.panel;
        context.fillRect(0, 0, width, 54);
        context.fillStyle = palette.line;
        context.font = '800 22px Arial';
        context.fillText('VINCENT OS', 34, 35);
        context.fillStyle = palette.accent;
        context.fillRect(186, 20, 68, 6);
        context.fillStyle = palette.muted;
        context.font = '700 16px Arial';
        context.fillText(`${palette.mode.toUpperCase()} WORKSTATION`, width - 260, 34);

        context.fillStyle = palette.panel;
        context.strokeStyle = palette.grid;
        context.lineWidth = 3;
        context.fillRect(42, 80, 260, 126);
        context.strokeRect(42, 80, 260, 126);
        context.fillStyle = palette.line;
        context.font = '800 22px Arial';
        context.fillText('SYSTEMS BOARD', 70, 122);
        context.fillStyle = palette.muted;
        context.font = '700 15px Arial';
        context.fillText('Management systems / Mobile / Data', 70, 154);
        context.fillText('Web apps / Workflows / Records', 70, 178);
        context.fillStyle = palette.accent;
        context.fillRect(70, 188, 164, 7);
        context.fillStyle = palette.grid;
        context.fillRect(70, 200, 208, 6);

        context.fillStyle = palette.panel;
        context.fillRect(width - 282, 82, 224, 118);
        context.strokeRect(width - 282, 82, 224, 118);
        context.fillStyle = palette.accent;
        context.fillRect(width - 252, 114, 34, 34);
        context.fillRect(width - 202, 114, 34, 34);
        context.fillRect(width - 152, 114, 34, 34);
        context.fillStyle = palette.line;
        context.font = '800 18px Arial';
        context.fillText('5 ROUTES', width - 252, 176);

        context.fillStyle = palette.panel;
        context.fillRect(0, height - 58, width, 58);
        context.fillStyle = palette.line;
        context.font = '700 24px Arial';
        context.fillText('SOFTWARE ENGINEER WORKSPACE', 34, height - 22);
        context.fillStyle = palette.accent;
        context.fillRect(width - 170, height - 38, 108, 6);
    });
}

function drawDesktopGlyph(context, label, centerX, centerY, palette, active) {
    const accent = active ? palette.accent : palette.line;
    context.save();
    context.translate(centerX, centerY);
    context.strokeStyle = accent;
    context.fillStyle = active ? palette.accent : palette.line;
    context.lineWidth = 9;
    context.lineJoin = 'miter';
    context.lineCap = 'square';

    if (label === 'Home') {
        context.beginPath();
        context.moveTo(-56, 0);
        context.lineTo(0, -48);
        context.lineTo(56, 0);
        context.moveTo(-38, -4);
        context.lineTo(-38, 44);
        context.lineTo(38, 44);
        context.lineTo(38, -4);
        context.stroke();
        context.fillRect(-10, 12, 20, 32);
    } else if (label === 'Projects') {
        context.beginPath();
        context.moveTo(-54, -24);
        context.lineTo(-12, -24);
        context.lineTo(2, -8);
        context.lineTo(58, -8);
        context.lineTo(58, 38);
        context.lineTo(-54, 38);
        context.closePath();
        context.stroke();
    } else if (label === 'Capabilities') {
        context.beginPath();
        context.moveTo(-52, 38);
        context.lineTo(-52, -34);
        context.moveTo(-52, 38);
        context.lineTo(56, 38);
        context.moveTo(-34, 18);
        context.lineTo(-10, -6);
        context.lineTo(16, 8);
        context.lineTo(48, -28);
        context.stroke();
    } else if (label === 'Experience') {
        context.strokeRect(-56, -36, 112, 78);
        context.beginPath();
        context.moveTo(-56, -12);
        context.lineTo(56, -12);
        context.moveTo(-28, -48);
        context.lineTo(-28, -24);
        context.moveTo(28, -48);
        context.lineTo(28, -24);
        context.stroke();
        context.fillRect(-32, 6, 18, 18);
        context.fillRect(-4, 6, 18, 18);
        context.fillRect(24, 6, 18, 18);
    } else {
        context.strokeRect(-58, -34, 116, 70);
        context.beginPath();
        context.moveTo(-58, -34);
        context.lineTo(0, 10);
        context.lineTo(58, -34);
        context.moveTo(-58, 36);
        context.lineTo(-14, 2);
        context.moveTo(58, 36);
        context.lineTo(14, 2);
        context.stroke();
    }

    context.restore();
}

function createFolderTexture(THREE, label, active = false, nightMode = false) {
    const palette = getPcPalette(nightMode);

    return createCanvasTexture(THREE, 320, 260, (context, width, height) => {
        context.clearRect(0, 0, width, height);
        context.fillStyle = active ? palette.panelStrong : palette.panel;
        context.strokeStyle = active ? palette.accent : palette.line;
        context.lineWidth = 5;
        context.fillRect(18, 18, width - 36, height - 36);
        context.strokeRect(18, 18, width - 36, height - 36);

        context.fillStyle = active ? palette.accent : palette.line;
        context.beginPath();
        context.moveTo(18, 18);
        context.lineTo(72, 18);
        context.lineTo(18, 72);
        context.closePath();
        context.fill();

        drawDesktopGlyph(context, label, width / 2, 116, palette, active);

        context.fillStyle = active ? palette.accent : palette.line;
        context.font = '800 24px Arial';
        context.textAlign = 'center';
        const words = label.split(' ');
        if (words.length > 1) {
            context.fillText(words[0].toUpperCase(), width / 2, 206);
            context.fillText(words.slice(1).join(' ').toUpperCase(), width / 2, 232);
        } else {
            context.fillText(label.toUpperCase(), width / 2, 220);
        }
    });
}

function createStatusTexture(THREE, link, nightMode = false) {
    const palette = getPcPalette(nightMode);
    const label = link?.label || 'Workspace';
    const path = link?.path || 'Ready';

    return createCanvasTexture(THREE, 520, 150, (context, width, height) => {
        context.clearRect(0, 0, width, height);
        context.fillStyle = palette.panel;
        context.fillRect(0, 0, width, height);
        context.strokeStyle = palette.accent;
        context.lineWidth = 4;
        context.strokeRect(2, 2, width - 4, height - 4);
        context.fillStyle = palette.accent;
        context.fillRect(22, 24, 48, 12);
        context.fillStyle = palette.line;
        context.font = '800 34px Arial';
        context.fillText(label.toUpperCase(), 22, 82);
        context.fillStyle = palette.muted;
        context.font = '700 22px Arial';
        context.fillText(path, 22, 118);
        context.fillStyle = palette.accentSoft;
        context.fillRect(width - 144, 28, 92, 92);
        context.strokeStyle = palette.line;
        context.lineWidth = 7;
        context.strokeRect(width - 120, 52, 44, 44);
    });
}

function createModeSwitchTexture(THREE, nightMode = false, active = false) {
    const palette = getPcPalette(nightMode);
    const nextMode = nightMode ? 'DAY' : 'NIGHT';

    return createCanvasTexture(THREE, 360, 150, (context, width, height) => {
        context.clearRect(0, 0, width, height);
        context.fillStyle = active ? palette.panelStrong : palette.panel;
        context.fillRect(0, 0, width, height);
        context.strokeStyle = active ? palette.accent : palette.line;
        context.lineWidth = 5;
        context.strokeRect(3, 3, width - 6, height - 6);

        context.fillStyle = palette.accent;
        context.fillRect(24, 30, 62, 62);
        context.fillStyle = palette.screen;
        context.beginPath();
        if (nightMode) {
            context.arc(55, 61, 20, 0, Math.PI * 2);
            context.fill();
        } else {
            context.arc(55, 61, 16, 0, Math.PI * 2);
            context.fill();
            for (let index = 0; index < 8; index += 1) {
                const angle = (Math.PI * 2 * index) / 8;
                context.fillRect(54 + Math.cos(angle) * 25, 60 + Math.sin(angle) * 25, 4, 11);
            }
        }

        context.fillStyle = palette.line;
        context.font = '900 28px Arial';
        context.fillText(`SWITCH ${nextMode}`, 112, 62);
        context.fillStyle = palette.muted;
        context.font = '800 18px Arial';
        context.fillText('CLICK TO CHANGE MODE', 112, 98);
    });
}

function ThreeModelStage({ navigate, nightMode, toggleTheme }) {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return undefined;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const compactViewport = window.matchMedia('(max-width: 760px)').matches;
        const deviceMemory = Number(navigator.deviceMemory || 0);
        const lowMemoryDevice = deviceMemory > 0 && deviceMemory <= 4;

        if (prefersReducedMotion || compactViewport || lowMemoryDevice) {
            mount.classList.add('three-model-static');
            return () => mount.classList.remove('three-model-static');
        }

        let cancelled = false;
        let disposeScene = () => {};

        import('./three-runtime.js').then((THREE) => {
            if (cancelled) return;

        const palette = getPcPalette(nightMode);
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: (window.devicePixelRatio || 1) <= 1.5,
            powerPreference: 'low-power',
        });
        const pcGroup = new THREE.Group();
        const clickable = [];
        const hoverRings = [];
        const ledKeys = [];
        const keyboardKeys = [];
        const ownedTextures = new Set();
        const raycaster = new THREE.Raycaster();
        const pointer = { x: 0, y: 0 };
        let hovered = null;
        let isVisible = true;
        let pageVisible = !document.hidden;
        let frameId = 0;
        const trackTexture = (texture) => {
            ownedTextures.add(texture);
            return texture;
        };

        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.domElement.setAttribute('data-three-canvas', 'portfolio-model');
        renderer.domElement.style.display = 'block';
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        mount.appendChild(renderer.domElement);
        mount.classList.add('three-model-ready');

        camera.position.set(0.35, 1.04, 8.25);
        scene.add(pcGroup);
        scene.add(new THREE.AmbientLight(nightMode ? 0xc8ddef : 0xf4fbff, nightMode ? 1.25 : 1.55));

        const keyLight = new THREE.DirectionalLight(0xffffff, nightMode ? 2.25 : 2.7);
        keyLight.position.set(4, 5, 5);
        scene.add(keyLight);

        const accentLight = new THREE.PointLight(palette.accentThree, nightMode ? 4.2 : 3.2, 10);
        accentLight.position.set(-3.2, 1.8, 3.8);
        scene.add(accentLight);

        const towerLight = new THREE.PointLight(palette.accentThree, nightMode ? 2.5 : 1.6, 7);
        towerLight.position.set(3.1, 0.2, 1.4);
        scene.add(towerLight);

        const edgeMaterial = new THREE.LineBasicMaterial({
            color: palette.trimThree,
            transparent: true,
            opacity: nightMode ? 0.68 : 0.46,
        });

        const materials = {
            frame: new THREE.MeshStandardMaterial({ color: palette.frameThree, metalness: 0.68, roughness: 0.24 }),
            tower: new THREE.MeshStandardMaterial({ color: palette.towerThree, metalness: 0.6, roughness: 0.3 }),
            bevel: new THREE.MeshStandardMaterial({ color: palette.trimThree, metalness: 0.26, roughness: 0.32 }),
            screen: new THREE.MeshBasicMaterial({ map: trackTexture(createDesktopTexture(THREE, nightMode)) }),
            glow: new THREE.MeshBasicMaterial({ color: palette.accentThree, transparent: true, opacity: nightMode ? 0.21 : 0.13 }),
            key: new THREE.MeshStandardMaterial({ color: palette.keyThree, metalness: 0.34, roughness: 0.38 }),
            keyLit: new THREE.MeshBasicMaterial({ color: palette.accentThree, transparent: true, opacity: 0.86 }),
            keyboardGlow: new THREE.MeshBasicMaterial({ color: palette.accentThree, transparent: true, opacity: nightMode ? 0.48 : 0.34 }),
            glass: new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: nightMode ? 0.055 : 0.11, depthWrite: false }),
        };

        const addBox = (size, position, material, target = pcGroup, edges = true) => {
            const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
            mesh.position.set(...position);
            target.add(mesh);

            if (edges) {
                const edgeLines = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), edgeMaterial);
                edgeLines.position.copy(mesh.position);
                edgeLines.rotation.copy(mesh.rotation);
                target.add(edgeLines);
            }

            return mesh;
        };

        const monitorGroup = new THREE.Group();
        pcGroup.add(monitorGroup);

        addBox([5.05, 3.22, 0.24], [0, 0.56, -0.1], materials.frame, monitorGroup);
        addBox([4.5, 2.66, 0.07], [0, 0.58, 0.05], materials.screen, monitorGroup);
        addBox([0.88, 0.14, 0.24], [-1.82, 2.06, 0.07], materials.bevel, monitorGroup);
        addBox([0.58, 0.14, 0.24], [1.9, -0.82, 0.07], materials.bevel, monitorGroup);
        addBox([0.18, 0.18, 0.12], [0, 2.02, 0.13], materials.bevel, monitorGroup, false);
        addBox([0.48, 1.06, 0.3], [0, -1.28, -0.12], materials.frame, monitorGroup);
        addBox([2.18, 0.18, 0.82], [0, -1.9, 0.18], materials.frame, monitorGroup);
        const keyboardGroup = new THREE.Group();
        monitorGroup.add(keyboardGroup);
        keyboardGroup.position.set(-0.36, -2.1, 0.78);
        keyboardGroup.rotation.x = 0.22;
        keyboardGroup.userData = { baseY: keyboardGroup.position.y };
        addBox([4.32, 0.16, 1.22], [0, 0, 0], materials.key, keyboardGroup);
        addBox([4.04, 0.04, 0.08], [0, 0.13, 0.55], materials.keyboardGlow, keyboardGroup, false);
        addBox([3.94, 0.035, 0.06], [0, 0.1, -0.55], materials.bevel, keyboardGroup, false);

        const keyRows = [
            { count: 12, startX: -1.68, y: 0.13, z: 0.36, offset: 0 },
            { count: 11, startX: -1.52, y: 0.19, z: 0.12, offset: 0.04 },
            { count: 10, startX: -1.34, y: 0.25, z: -0.12, offset: 0.08 },
            { count: 7, startX: -1.08, y: 0.31, z: -0.38, offset: 0.12 },
        ];

        keyRows.forEach((rowSpec, row) => {
            for (let col = 0; col < rowSpec.count; col += 1) {
                const isLed = (row + col) % 5 === 0;
                const isSpacebar = row === 3 && col === 3;
                const key = addBox(
                    [isSpacebar ? 1.02 : 0.24, 0.058, 0.16],
                    [rowSpec.startX + col * 0.3 + rowSpec.offset, rowSpec.y, rowSpec.z],
                    isLed ? materials.keyLit : materials.key,
                    keyboardGroup,
                    true,
                );
                key.userData = {
                    baseY: key.position.y,
                    phase: row * 0.72 + col * 0.23,
                };
                keyboardKeys.push(key);
                if (isLed) ledKeys.push(key);
            }
        });
        addBox([0.84, 0.12, 0.68], [2.54, 0.16, 0.08], materials.key, keyboardGroup);
        addBox([0.048, 0.026, 0.46], [2.54, 0.235, 0.08], materials.bevel, keyboardGroup, false);
        addBox([0.32, 0.026, 0.08], [2.54, 0.25, 0.36], materials.keyboardGlow, keyboardGroup, false);

        const screenGlow = new THREE.Mesh(new THREE.PlaneGeometry(4.52, 2.76), materials.glow);
        screenGlow.position.set(0, 0.58, 0.1);
        monitorGroup.add(screenGlow);

        const scanLine = new THREE.Mesh(
            new THREE.PlaneGeometry(4.26, 0.035),
            new THREE.MeshBasicMaterial({ color: palette.accentThree, transparent: true, opacity: nightMode ? 0.62 : 0.34, depthWrite: false }),
        );
        scanLine.position.set(0, 1.76, 0.27);
        monitorGroup.add(scanLine);

        const glassSheen = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 2.66), materials.glass);
        glassSheen.position.set(0, 0.58, 0.29);
        monitorGroup.add(glassSheen);

        const statusTextures = new Map();
        statusTextures.set('ready', trackTexture(createStatusTexture(THREE, null, nightMode)));
        statusTextures.set('theme', trackTexture(createStatusTexture(THREE, {
            label: 'Theme',
            path: nightMode ? 'Switch to day mode' : 'Switch to night mode',
        }, nightMode)));
        desktopLinks.forEach((link) => {
            statusTextures.set(link.path, trackTexture(createStatusTexture(THREE, link, nightMode)));
        });

        const statusMaterial = new THREE.MeshBasicMaterial({
            map: statusTextures.get('ready'),
            transparent: true,
        });
        const statusPanel = new THREE.Mesh(new THREE.PlaneGeometry(1.86, 0.52), statusMaterial);
        statusPanel.position.set(1.12, -0.48, 0.22);
        monitorGroup.add(statusPanel);

        const modeNormalMap = trackTexture(createModeSwitchTexture(THREE, nightMode, false));
        const modeActiveMap = trackTexture(createModeSwitchTexture(THREE, nightMode, true));
        const modeMaterial = new THREE.MeshBasicMaterial({
            map: modeNormalMap,
            transparent: true,
        });
        const modeSwitch = new THREE.Mesh(new THREE.PlaneGeometry(1.04, 0.43), modeMaterial);
        modeSwitch.position.set(1.73, 1.4, 0.22);
        const modeRing = new THREE.Mesh(
            new THREE.RingGeometry(0.58, 0.64, 4),
            new THREE.MeshBasicMaterial({ color: palette.accentThree, transparent: true, opacity: 0, side: THREE.DoubleSide }),
        );
        modeRing.rotation.z = Math.PI / 4;
        modeRing.position.z = 0.026;
        modeSwitch.add(modeRing);
        modeSwitch.userData = {
            action: 'toggleTheme',
            label: nightMode ? 'Switch Day' : 'Switch Night',
            statusKey: 'theme',
            baseScale: 1,
            baseY: modeSwitch.position.y,
            ring: modeRing,
            material: modeMaterial,
            normalMap: modeNormalMap,
            activeMap: modeActiveMap,
        };
        hoverRings.push(modeRing);
        clickable.push(modeSwitch);
        monitorGroup.add(modeSwitch);

        const towerGroup = new THREE.Group();
        towerGroup.position.set(3.06, -0.12, -0.15);
        monitorGroup.add(towerGroup);
        addBox([0.84, 2.58, 0.58], [0, 0.28, 0], materials.tower, towerGroup);
        addBox([0.5, 0.1, 0.08], [0, 1.32, 0.34], materials.bevel, towerGroup, false);
        addBox([0.12, 1.24, 0.1], [-0.26, 0.25, 0.34], materials.keyLit, towerGroup, false);
        addBox([0.12, 0.72, 0.1], [0.26, -0.12, 0.34], materials.keyLit, towerGroup, false);

        const fanRing = new THREE.Mesh(
            new THREE.TorusGeometry(0.22, 0.022, 8, 42),
            new THREE.MeshBasicMaterial({ color: palette.accentThree, transparent: true, opacity: 0.72 }),
        );
        fanRing.position.set(0, 0.42, 0.36);
        towerGroup.add(fanRing);

        const fanBlade = addBox([0.38, 0.035, 0.04], [0, 0.42, 0.38], materials.bevel, towerGroup, false);

        desktopLinks.forEach((link) => {
            const normalMap = trackTexture(createFolderTexture(THREE, link.label, false, nightMode));
            const activeMap = trackTexture(createFolderTexture(THREE, link.label, true, nightMode));
            const material = new THREE.MeshBasicMaterial({
                map: normalMap,
                transparent: true,
            });
            const icon = new THREE.Mesh(new THREE.PlaneGeometry(0.84, 0.68), material);
            icon.position.set(link.x, link.y + 0.58, 0.18);

            const ring = new THREE.Mesh(
                new THREE.RingGeometry(0.46, 0.52, 4),
                new THREE.MeshBasicMaterial({ color: palette.accentThree, transparent: true, opacity: 0, side: THREE.DoubleSide }),
            );
            ring.rotation.z = Math.PI / 4;
            ring.position.z = 0.025;
            icon.add(ring);

            icon.userData = {
                path: link.path,
                label: link.label,
                baseScale: 1,
                baseY: icon.position.y,
                ring,
                material,
                normalMap,
                activeMap,
            };
            hoverRings.push(ring);
            clickable.push(icon);
            monitorGroup.add(icon);
        });

        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 120;
        const particlePositions = new Float32Array(particleCount * 3);
        for (let index = 0; index < particleCount; index += 1) {
            particlePositions[index * 3] = -3.1 + Math.random() * 6.7;
            particlePositions[index * 3 + 1] = -2.2 + Math.random() * 4.7;
            particlePositions[index * 3 + 2] = -1.2 + Math.random() * 2.7;
        }
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        const particles = new THREE.Points(
            particleGeometry,
            new THREE.PointsMaterial({ color: palette.particleThree, size: 0.018, transparent: true, opacity: nightMode ? 0.62 : 0.32 }),
        );
        scene.add(particles);

        pcGroup.rotation.y = -0.08;
        pcGroup.rotation.x = 0.02;
        pcGroup.position.x = -0.18;

        const resize = () => {
            const { clientWidth, clientHeight } = mount;
            const width = Math.max(clientWidth, 1);
            const height = Math.max(clientHeight, 1);
            const aspect = width / height;
            const scale = aspect < 0.95 ? 0.72 : aspect < 1.2 ? 0.82 : 0.9;
            pcGroup.scale.setScalar(scale);
            pcGroup.position.x = aspect < 0.95 ? -0.28 : -0.18;
            camera.position.z = aspect < 0.95 ? 8.9 : 8.25;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height, false);
            renderer.render(scene, camera);
        };

        const updatePointer = (event) => {
            const rect = mount.getBoundingClientRect();
            pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
        };

        const updateHover = () => {
            raycaster.setFromCamera(pointer, camera);
            const hit = raycaster.intersectObjects(clickable, false)[0]?.object || null;

            if (hit !== hovered) {
                if (hovered) {
                    hovered.material.map = hovered.userData.normalMap;
                    hovered.material.needsUpdate = true;
                    hovered.scale.setScalar(hovered.userData.baseScale);
                    hovered.userData.ring.material.opacity = 0;
                }
                hovered = hit;
                mount.style.cursor = hovered ? 'pointer' : 'default';
                if (hovered) {
                    hovered.material.map = hovered.userData.activeMap;
                    hovered.material.needsUpdate = true;
                    hovered.scale.setScalar(1.14);
                    hovered.userData.ring.material.opacity = 0.58;
                    statusMaterial.map = statusTextures.get(hovered.userData.statusKey || hovered.userData.path) || statusTextures.get('ready');
                } else {
                    statusMaterial.map = statusTextures.get('ready');
                }
                statusMaterial.needsUpdate = true;
            }
        };

        const onPointerMove = (event) => {
            updatePointer(event);
            updateHover();
        };

        const onPointerLeave = () => {
            if (hovered) {
                hovered.material.map = hovered.userData.normalMap;
                hovered.material.needsUpdate = true;
                hovered.scale.setScalar(hovered.userData.baseScale);
                hovered.userData.ring.material.opacity = 0;
            }
            hovered = null;
            mount.style.cursor = 'default';
            statusMaterial.map = statusTextures.get('ready');
            statusMaterial.needsUpdate = true;
        };

        const onClick = (event) => {
            updatePointer(event);
            updateHover();
            if (hovered?.userData?.action === 'toggleTheme') {
                toggleTheme();
                return;
            }
            if (hovered?.userData?.path) {
                navigate(hovered.userData.path);
            }
        };

        let startTime = 0;
        const animate = (time) => {
            frameId = 0;
            if (!startTime) startTime = time;
            const elapsed = (time - startTime) / 1000;
            pcGroup.rotation.y += ((-0.08 + pointer.x * 0.06) - pcGroup.rotation.y) * 0.035;
            pcGroup.rotation.x += ((0.02 - pointer.y * 0.025) - pcGroup.rotation.x) * 0.035;
            keyboardGroup.position.y = keyboardGroup.userData.baseY + Math.sin(elapsed * 1.25) * 0.012;
            scanLine.position.y = 1.7 - ((elapsed * 0.42) % 2.42);
            screenGlow.material.opacity = (nightMode ? 0.21 : 0.13) + Math.sin(elapsed * 1.7) * 0.025;
            fanRing.rotation.z = elapsed * 1.6;
            fanBlade.rotation.z = elapsed * 3.2;
            particles.rotation.y = elapsed * 0.035;
            particles.rotation.x = Math.sin(elapsed * 0.22) * 0.02;
            clickable.forEach((icon, index) => {
                icon.position.y = icon.userData.baseY + Math.sin(elapsed * 1.6 + index * 0.9) * 0.015;
                icon.userData.ring.rotation.z += hovered === icon ? 0.018 : 0.004;
            });
            ledKeys.forEach((key, index) => {
                key.scale.y = 1 + Math.sin(elapsed * 3.2 + index) * 0.18;
            });
            keyboardKeys.forEach((key) => {
                const tap = Math.max(0, Math.sin(elapsed * (hovered ? 5.2 : 2.8) + key.userData.phase));
                key.position.y = key.userData.baseY - tap * 0.016;
            });
            hoverRings.forEach((ring) => {
                const target = hovered && hovered.userData.ring === ring ? 0.58 : 0;
                ring.material.opacity += (target - ring.material.opacity) * 0.16;
            });
            renderer.render(scene, camera);
            if (isVisible && pageVisible) {
                frameId = window.requestAnimationFrame(animate);
            }
        };

        const stopAnimation = () => {
            if (!frameId) return;
            window.cancelAnimationFrame(frameId);
            frameId = 0;
        };

        const startAnimation = () => {
            if (prefersReducedMotion || !isVisible || !pageVisible || frameId) return;
            frameId = window.requestAnimationFrame(animate);
        };

        const onVisibilityChange = () => {
            pageVisible = !document.hidden;
            if (pageVisible) {
                startAnimation();
            } else {
                stopAnimation();
            }
        };

        const visibilityObserver = 'IntersectionObserver' in window
            ? new IntersectionObserver(([entry]) => {
                isVisible = entry.isIntersecting;
                if (isVisible) {
                    startAnimation();
                } else {
                    stopAnimation();
                }
            }, { rootMargin: '160px 0px', threshold: 0.01 })
            : null;

        resize();
        mount.addEventListener('pointermove', onPointerMove);
        mount.addEventListener('pointerleave', onPointerLeave);
        mount.addEventListener('click', onClick);
        window.addEventListener('resize', resize);
        document.addEventListener('visibilitychange', onVisibilityChange);
        visibilityObserver?.observe(mount);

        if (prefersReducedMotion) {
            renderer.render(scene, camera);
        } else {
            startAnimation();
        }

        disposeScene = () => {
            stopAnimation();
            mount.removeEventListener('pointermove', onPointerMove);
            mount.removeEventListener('pointerleave', onPointerLeave);
            mount.removeEventListener('click', onClick);
            window.removeEventListener('resize', resize);
            document.removeEventListener('visibilitychange', onVisibilityChange);
            visibilityObserver?.disconnect();
            mount.classList.remove('three-model-ready');
            if (renderer.domElement.parentNode === mount) {
                mount.removeChild(renderer.domElement);
            }
            scene.traverse((object) => {
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach((material) => {
                            material.dispose();
                        });
                    } else {
                        object.material.dispose();
                    }
                }
            });
            ownedTextures.forEach((texture) => texture.dispose());
            renderer.dispose();
            renderer.forceContextLoss();
        };
        }).catch(() => {
            if (!cancelled) mount.classList.add('three-model-unavailable');
        });

        return () => {
            cancelled = true;
            disposeScene();
        };
    }, [navigate, nightMode, toggleTheme]);

    return (
        <div className="three-model-stage reveal" ref={mountRef} data-mode={nightMode ? 'night' : 'day'}>
            <div className="three-static-preview" aria-hidden="true">
                <div className="three-static-monitor">
                    <header>
                        <strong>VINCENT OS</strong>
                        <span>{nightMode ? 'Night' : 'Day'} workspace</span>
                    </header>
                    <div>
                        {desktopLinks.map((link) => (
                            <span key={link.path}>{link.label}</span>
                        ))}
                    </div>
                    <footer>Software Engineer Workspace</footer>
                </div>
                <div className="three-static-tower"><span /><span /></div>
            </div>
            <span className="sr-only">Interactive 3D PC desktop with clickable folders for portfolio sections and a theme switch.</span>
            <nav className="sr-only" aria-label="3D desktop fallback links">
                {desktopLinks.map((link) => <a key={link.path} href={routeHref(link.path)}>{link.label}</a>)}
            </nav>
        </div>
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
                    <a href={routeHref('/capabilities')} onClick={(event) => handleNav(event, '/capabilities', navigate)}><ChartSquare size={18} weight="Bold" />Capabilities</a>
                    <a href={routeHref('/experience')} onClick={(event) => handleNav(event, '/experience', navigate)}><CalendarMark size={18} weight="Bold" />Experience</a>
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

function ProjectsPage({ navigate, nightMode, toggleTheme }) {
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
                        <a className="action-button compact" href={routeHref('/capabilities')} onClick={(event) => handleNav(event, '/capabilities', navigate)}>
                            <span>View capabilities</span>
                            <ArrowRight size={18} weight="Bold" />
                        </a>
                    </div>
                    <div className="project-model-panel" data-mode={nightMode ? 'night' : 'day'}>
                        <div className="pc-scene-chrome" aria-hidden="true">
                            <span><Monitor size={17} weight="Bold" />Workstation</span>
                            <span>{nightMode ? <Moon size={16} weight="Bold" /> : <Sun size={16} weight="Bold" />}{nightMode ? 'Night' : 'Day'}</span>
                        </div>
                        <ThreeModelStage navigate={navigate} nightMode={nightMode} toggleTheme={toggleTheme} />
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

function CapabilitiesPage() {
    return (
        <>
            <PageHeading
                eyebrow="Capabilities"
                title="Engineering capability grounded in problem-solving, quality, and professional delivery."
                copy="A balanced software engineering profile covering requirements, implementation, data, user experience, testing, collaboration, and maintainability."
            />

            <section className="section-pad slim">
                <CapabilityBoard />
            </section>

            <CapabilityDetailSection />
            <BuildMethodSection />
        </>
    );
}

function CapabilityBoard() {
    return (
        <div className="container-max capability-board reveal">
            <div className="capability-board-row top">
                {capabilities.slice(0, 2).map((item, index) => (
                    <CapabilityBoardItem key={item.title} item={item} index={index} />
                ))}
            </div>

            <div className="capability-board-divider" aria-hidden="true">
                <span />
                <strong>+</strong>
                <span />
            </div>

            <div className="capability-board-row bottom">
                {capabilities.slice(2).map((item, index) => (
                    <CapabilityBoardItem key={item.title} item={item} index={index + 2} />
                ))}
            </div>
        </div>
    );
}

function CapabilityBoardItem({ item, index = 0 }) {
    return (
        <article className="capability-board-item" style={staggerStyle(index)}>
            <h2>{item.title}</h2>
            <p>{item.copy}</p>
        </article>
    );
}

function CapabilityDetailSection() {
    return (
        <section className="section-pad slim">
            <div className="container-max">
                <div className="section-heading reveal">
                    <div>
                        <p className="eyebrow">Professional Toolkit</p>
                        <h2>Competencies that support the full software lifecycle.</h2>
                    </div>
                    <p>
                        Technical execution is supported by quality awareness, communication, documentation,
                        and a willingness to learn from feedback.
                    </p>
                </div>

                <div className="capability-stack-console reveal">
                    <p className="eyebrow font-extrabold uppercase">Engineering Strengths</p>
                    {stackGroups.map((group, index) => (
                        <div className="stack-line" key={group.title} style={staggerStyle(index)}>
                            <strong>{group.title}</strong>
                            <div className="stack-item-list" aria-label={`${group.title} capabilities`}>
                                {group.items.map((item) => (
                                    <span className="stack-chip" key={item}>{item}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function ExperiencePage() {
    return (
        <>
            <PageHeading
                eyebrow="Experience"
                title="Professional experience shaped by accuracy, accountability, and continuous improvement."
                copy="Development practice and quality-focused operational experience have built a disciplined approach to software, data, communication, and reliable delivery."
                dark
            />
            <section className="section-pad">
                <div className="container-max timeline-grid">
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
                <div className="container-max timeline-grid">
                    {educationItems.map((item, index) => (
                        <TimelineCard key={item.title} item={item} index={index} />
                    ))}
                </div>
            </section>
        </>
    );
}

function BuildMethodSection() {
    return (
        <section className="section-pad">
            <div className="container-max method-layout compact-method">
                <div className="method-intro reveal">
                    <p className="eyebrow">Engineering Approach</p>
                    <h2>Clear thinking from requirement to reliable release.</h2>
                    <p>
                        Each stage balances user needs, technical constraints, maintainability, and the quality
                        checks required for confident delivery.
                    </p>
                </div>

                <div className="method-rail reveal">
                    {buildStages.map((stage, index) => (
                        <div className="method-row" key={stage.index} style={staggerStyle(index)}>
                            <span>{stage.index}</span>
                            <div>
                                <h3>{stage.title}</h3>
                                <p>{stage.copy}</p>
                            </div>
                        </div>
                    ))}
                </div>
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

function PageHeading({ eyebrow, title, copy, dark = false }) {
    return (
        <section className="container-max">
            <div className={`page-heading reveal ${dark ? 'dark' : ''}`}>
                <p className="eyebrow">{eyebrow}</p>
                <h1>{title}</h1>
                <p>{copy}</p>
            </div>
        </section>
    );
}

function CapabilityItem({ item, compact = false }) {
    return (
        <div className={`capability-item image-card ${compact ? 'compact' : ''}`} style={cardBackgroundStyle(item.image)}>
            <span className="card-bg-image" aria-hidden="true" />
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
        </div>
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
