import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as THREE from 'three';
import {
    AltArrowDown,
    ArrowRight,
    Box,
    CalendarMark,
    ChartSquare,
    CheckCircle,
    Code,
    CodeSquare,
    Copy,
    Database,
    Download,
    Folder,
    HamburgerMenu,
    Layers,
    Letter,
    Monitor,
    Moon,
    Phone,
    UserCircle,
    Stars,
    Sun,
    Widget5,
    CloseSquare,
} from '@solar-icons/react';
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
        label: 'About Me',
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
    backend: assetUrl('card-bg/server-flow.svg'),
    database: assetUrl('card-bg/data-grid.svg'),
    quality: assetUrl('card-bg/interface-quality.svg'),
    student: assetUrl('card-bg/student-system.svg'),
    booking: assetUrl('card-bg/venue-booking.svg'),
    visualizer: assetUrl('card-bg/data-visualizer.svg'),
    smartgrow: assetUrl('card-bg/smartgrow.svg'),
    delivery: assetUrl('card-bg/operations-flow.svg'),
    communication: assetUrl('card-bg/communication.svg'),
    learning: assetUrl('card-bg/learning.svg'),
    leadership: assetUrl('card-bg/leadership.svg'),
    education: assetUrl('card-bg/education.svg'),
    certificate: assetUrl('card-bg/certificate.svg'),
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
        image: cardImages.smartgrow,
    },
];

const capabilities = [
    {
        title: 'System Frontends',
        copy: 'React interfaces for dashboards, forms, records, portals, and system control panels.',
        image: cardImages.webApp,
    },
    {
        title: 'React Systems',
        copy: 'Stateful screens, validation flows, access-aware views, and maintainable application logic.',
        image: cardImages.backend,
    },
    {
        title: 'Data Workflows',
        copy: 'MySQL and Supabase structures for management systems, reporting, relationships, and reliable records.',
        image: cardImages.database,
    },
    {
        title: 'Quality & Delivery',
        copy: 'Careful testing, debugging, verification, documentation, and practical team communication.',
        image: cardImages.quality,
    },
];

const buildStages = [
    {
        index: '01',
        title: 'Model the workflow',
        copy: 'I identify the users, records, permissions, and decisions before the interface gets busy.',
    },
    {
        index: '02',
        title: 'Design the surface',
        copy: 'Layouts, forms, tables, and states are shaped so repeated tasks feel clear and controlled.',
    },
    {
        index: '03',
        title: 'Connect the system',
        copy: 'React components, data contracts, Supabase or MySQL-backed flows, and validation logic are wired into one product experience.',
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
        copy: 'Document management, data entry, verification, and quality assurance with attention to data integrity.',
        image: cardImages.quality,
    },
    {
        time: '2020 - 2022',
        title: 'Sales Assistant & Cashier',
        copy: 'Customer service, cash handling, stock control, and sales operations in a fast-paced environment.',
        image: cardImages.communication,
    },
];

const homeSignals = [
    {
        value: 'React',
        label: 'System Interfaces',
        copy: 'Dashboards, portals, admin panels, forms, and workflow screens built with reusable components.',
    },
    {
        value: 'Data',
        label: 'Management Logic',
        copy: 'Records, permissions, filters, validation, reporting, and data views shaped around real operations.',
    },
    {
        value: 'Delivery',
        label: 'Build Discipline',
        copy: 'Careful debugging, testing, documentation awareness, and practical handoff habits.',
    },
];

const homeProfileCards = [
    {
        icon: Folder,
        title: 'Management Systems',
        copy: 'I build software for records, approvals, bookings, academic operations, reporting, and internal workflows.',
    },
    {
        icon: Monitor,
        title: 'Engineer Mindset',
        copy: 'I think through data models, user roles, edge cases, states, and handoff before polishing the interface.',
    },
    {
        icon: CheckCircle,
        title: 'Delivery Discipline',
        copy: 'I care about debugging, edge cases, data checks, and communication because small misses become real user friction.',
    },
];

const skillProofItems = [
    {
        icon: Code,
        title: 'Application Development',
        copy: 'React, Laravel, APIs, validation, responsive layouts, reusable patterns, and interaction states that feel considered.',
    },
    {
        icon: Database,
        title: 'Data-Aware Systems',
        copy: 'Systems that respect records, relationships, validation, reporting needs, and data integrity.',
    },
    {
        icon: Layers,
        title: 'Practical Delivery',
        copy: 'From problem scope to screen states, testing pass, and handoff notes that help the project keep moving.',
    },
];

const stackGroups = [
    { title: 'Frontend', items: ['HTML', 'CSS', 'JavaScript', 'React.js', 'Tailwind CSS'] },
    { title: 'Backend & APIs', items: ['Laravel', 'PHP', 'REST APIs'] },
    { title: 'Database', items: ['MySQL', 'Supabase'] },
    { title: 'Tools', items: ['GitHub', 'Canva', 'Adobe XD', 'MS Office'] },
];

const projectProcess = [
    'Problem scope',
    'Data structure',
    'Screen states',
    'Access rules',
    'Testing pass',
    'Delivery notes',
];

const staggerStyle = (index = 0, step = 70) => ({
    '--item-index': index,
    '--item-delay': `${index * step}ms`,
});

const capabilityDetails = [
    {
        title: 'Interface Design',
        copy: 'System planning, responsive layouts, dashboard composition, and reusable component architecture.',
    },
    {
        title: 'Application Logic',
        copy: 'React state, Laravel workflows, validation, API-ready features, debugging, and maintainable application behavior.',
    },
    {
        title: 'Data Confidence',
        copy: 'MySQL and Supabase structures, data verification, relationship modeling, and clean record handling.',
    },
    {
        title: 'Team Delivery',
        copy: 'Agile collaboration, communication, testing, documentation awareness, and practical handoffs.',
    },
];

const educationItems = [
    {
        time: 'December 2025',
        title: 'Bachelor of Software Engineering',
        copy: 'Zambia University College of Technology. Strong academic performance with multiple distinctions.',
        image: cardImages.education,
    },
    {
        time: 'December 2019',
        title: 'Grade 12 Certificate',
        copy: 'Naboye Secondary School. Foundation for technical study, communication, and structured problem solving.',
        image: cardImages.certificate,
    },
    {
        time: 'Ongoing',
        title: 'Professional Growth',
        copy: 'Continuous learning across React, UI/UX design, database management, testing, and mobile app basics.',
        image: cardImages.learning,
    },
];

function createTemplateCode({ component, title, kicker, accent, family }) {
    if (family === 'dashboard') {
        return `function ${component}() {
  const nav = ['Live', 'Queue', 'Teams', 'Reports'];
  const stats = [
    ['Open Queue', '128'],
    ['Completed', '94'],
    ['Risk Holds', '07']
  ];

  return (
    <section style={{ display: 'grid', gridTemplateColumns: '108px 1fr', gap: 16, borderRadius: 24, padding: 20, background: '#f7f5ff', color: '#111827', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <aside style={{ display: 'grid', gap: 10, alignContent: 'start', borderRadius: 18, background: '#111827', color: '#fff', padding: 12 }}>
        <strong style={{ borderRadius: 12, background: '#fff', color: '#111827', padding: 14 }}>OPER</strong>
        {nav.map((item) => <button key={item} style={{ border: 0, borderRadius: 12, background: item === 'Live' ? '#fff' : 'rgba(255,255,255,.1)', color: item === 'Live' ? '#111827' : '#fff', padding: 12, fontWeight: 800 }}>{item}</button>)}
      </aside>
      <main style={{ display: 'grid', gap: 12 }}>
        <header style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: 12, border: '1px solid #d9d3ff', borderRadius: 18, background: '#fff', padding: 18 }}>
          <div>
            <span style={{ color: '${accent}', fontWeight: 900, textTransform: 'uppercase' }}>${kicker}</span>
            <h2 style={{ margin: '6px 0 0', fontSize: 32, lineHeight: 1 }}>${title}</h2>
          </div>
          <strong style={{ display: 'grid', placeItems: 'center', borderRadius: 16, background: '#ebe8ff', fontSize: 34 }}>96%</strong>
        </header>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {stats.map(([label, value]) => <article key={label} style={{ borderRadius: 16, background: '#fff', padding: 16 }}><span>{label}</span><strong style={{ display: 'block', marginTop: 8, fontSize: 28 }}>{value}</strong></article>)}
        </div>
      </main>
    </section>
  );
}`;
    }

    if (family === 'finance flow') {
        return `function ${component}() {
  const channels = [['Card', '42%'], ['Mobile Money', '31%'], ['Bank', '18%'], ['Cash', '9%']];
  const rows = ['Airtel Money batch', 'Visa settlement', 'Invoice batch'];

  return (
    <section style={{ borderRadius: 24, padding: 22, background: '#f0fdfa', color: '#111827', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <header style={{ borderRadius: 18, background: '#fff', padding: 20 }}>
        <span style={{ color: '${accent}', fontWeight: 900, textTransform: 'uppercase' }}>${kicker}</span>
        <strong style={{ display: 'block', marginTop: 8, fontSize: 42 }}>ZMW 84.2k</strong>
      </header>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 12 }}>
        {channels.map(([label, value]) => <article key={label} style={{ borderRadius: 16, background: '#fff', padding: 16 }}><span>{label}</span><strong style={{ display: 'block', marginTop: 8, fontSize: 24 }}>{value}</strong></article>)}
      </div>
      <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
        {rows.map((row) => <div key={row} style={{ display: 'flex', justifyContent: 'space-between', borderRadius: 16, background: '#fff', padding: 14 }}><strong>{row}</strong><span style={{ color: '${accent}', fontWeight: 900 }}>Clear</span></div>)}
      </div>
    </section>
  );
}`;
    }

    if (family === 'home page') {
        return `function ${component}() {
  return (
    <main style={{ overflow: 'hidden', borderRadius: 24, background: '#ffffff', color: '#111827', boxShadow: '0 28px 70px rgba(15,23,42,.13)', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', gap: 18, borderBottom: '1px solid #eef0f5', padding: 16 }}>
        <strong>${title.split(' ')[0]}OS</strong>
        <span style={{ marginLeft: 'auto' }}>Product</span>
        <button style={{ border: 0, borderRadius: 12, background: '${accent}', color: '#fff', padding: '10px 14px', fontWeight: 900 }}>Start</button>
      </nav>
      <section style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 20, alignItems: 'center', padding: 24 }}>
        <div>
          <p style={{ margin: 0, color: '${accent}', fontWeight: 900, textTransform: 'uppercase' }}>${kicker}</p>
          <h1 style={{ margin: '10px 0 0', fontSize: 42, lineHeight: 1 }}>${title}</h1>
        </div>
        <aside style={{ display: 'grid', gap: 10, borderRadius: 18, background: '#f7f8fb', padding: 16 }}>
          {['Fast setup', 'Responsive UI', 'Clean handoff'].map((item) => <strong key={item}>{item}</strong>)}
        </aside>
      </section>
    </main>
  );
}`;
    }

    if (family === 'contact page') {
        return `function ${component}() {
  const fields = ['Name', 'Email', 'Project details'];

  return (
    <section style={{ display: 'grid', gridTemplateColumns: '.85fr 1.15fr', gap: 16, borderRadius: 24, padding: 20, background: '#fff', color: '#111827', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <aside style={{ display: 'grid', alignContent: 'end', borderRadius: 18, background: '#111827', color: '#fff', padding: 20 }}>
        <span style={{ color: '${accent}', fontWeight: 900, textTransform: 'uppercase' }}>${kicker}</span>
        <h2 style={{ margin: '8px 0 0', fontSize: 34, lineHeight: 1 }}>${title}</h2>
      </aside>
      <form style={{ display: 'grid', gap: 10 }}>
        {fields.map((field) => <label key={field} style={{ display: 'grid', gap: 6, fontWeight: 800 }}><span>{field}</span><input style={{ minHeight: 44, border: '1px solid #e3e8ef', borderRadius: 12, padding: 12 }} /></label>)}
        <button type="button" style={{ border: 0, borderRadius: 12, background: '${accent}', color: '#fff', padding: 14, fontWeight: 900 }}>Send inquiry</button>
      </form>
    </section>
  );
}`;
    }

    return `function ${component}() {
  const milestones = ['Discover', 'Design', 'Build', 'Verify'];

  return (
    <section style={{ borderRadius: 24, padding: 22, background: '#ffffff', color: '#111827', boxShadow: '0 28px 70px rgba(15,23,42,.13)', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <p style={{ margin: 0, color: '${accent}', fontWeight: 900, textTransform: 'uppercase' }}>${kicker}</p>
      <h2 style={{ margin: '8px 0 0', fontSize: 38, lineHeight: 1 }}>${title}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 22 }}>
        {milestones.map((item, index) => <article key={item} style={{ minHeight: 140, borderRadius: 16, background: index === 0 ? '${accent}' : '#f7f8fb', color: index === 0 ? '#fff' : '#111827', padding: 16 }}><small>0{index + 1}</small><strong style={{ display: 'block', marginTop: 54 }}>{item}</strong></article>)}
      </div>
    </section>
  );
}`;
}

function createComponentCode({ component, title, accent, family }) {
    if (family === 'button') {
        return `import React from 'react';

function ${component}() {
  const [active, setActive] = React.useState(false);

  return (
    <section style={{ display: 'grid', gap: 18, maxWidth: 520, borderRadius: 22, background: '#fff', padding: 26, boxShadow: '0 28px 70px rgba(15,23,42,.14)', color: '#111827', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div>
        <span style={{ color: '${accent}', fontSize: 12, fontWeight: 900, textTransform: 'uppercase' }}>Launch action</span>
        <h3 style={{ margin: '8px 0 0', fontSize: 32, lineHeight: 1 }}>{active ? 'Workspace created' : '${title}'}</h3>
        <p style={{ margin: '10px 0 0', color: '#667085', fontWeight: 800 }}>Conversion button with product context and click feedback.</p>
      </div>
      <button onClick={() => setActive(!active)} style={{ display: 'inline-flex', width: 'fit-content', alignItems: 'center', gap: 10, border: 0, borderRadius: 999, background: active ? '#111827' : '${accent}', color: '#fff', padding: '14px 20px', fontWeight: 900, boxShadow: '0 18px 40px rgba(15,23,42,.18)', cursor: 'pointer' }}>
        {active ? 'Launched' : 'Start building'}
        <span aria-hidden="true">-></span>
      </button>
    </section>
  );
}`;
    }

    if (family === 'input') {
        return `import React from 'react';

function ${component}() {
  const [value, setValue] = React.useState('Client portal redesign');

  return (
    <label style={{ display: 'grid', gap: 10, maxWidth: 520, border: '2px solid ${accent}', borderRadius: 20, background: '#fff', padding: 22, color: '#111827', boxShadow: '0 28px 70px rgba(15,23,42,.12)', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <span style={{ color: '${accent}', fontSize: 12, fontWeight: 900, textTransform: 'uppercase' }}>${title}</span>
      <input value={value} onChange={(event) => setValue(event.target.value)} style={{ border: 0, outline: 0, background: '#f7f9fc', borderRadius: 14, padding: 14, fontSize: 20, fontWeight: 900 }} />
      <small style={{ color: '#667085', fontWeight: 800 }}>{value.length} characters captured in state.</small>
    </label>
  );
}`;
    }

    if (family === 'data card') {
        return `import React from 'react';

function ${component}() {
  const [selected, setSelected] = React.useState('Week');
  const periods = ['Day', 'Week', 'Month'];

  return (
    <article style={{ display: 'grid', gap: 14, maxWidth: 520, borderRadius: 22, background: '#fff', padding: 22, boxShadow: '0 28px 70px rgba(15,23,42,.12)', color: '#111827', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
        <span style={{ color: '${accent}', fontSize: 12, fontWeight: 900, textTransform: 'uppercase' }}>${title}</span>
        <div style={{ display: 'flex', gap: 6, borderRadius: 999, background: '#f2f4f7', padding: 4 }}>
          {periods.map((period) => <button key={period} onClick={() => setSelected(period)} style={{ border: 0, borderRadius: 999, background: selected === period ? '${accent}' : 'transparent', color: selected === period ? '#fff' : '#667085', padding: '6px 10px', fontWeight: 900 }}>{period}</button>)}
        </div>
      </header>
      <strong style={{ fontSize: 46, lineHeight: 1 }}>{selected === 'Month' ? '71.4%' : selected === 'Day' ? '58.2%' : '64.8%'}</strong>
      <div style={{ height: 10, borderRadius: 999, background: 'linear-gradient(90deg, ${accent} 70%, #eef2f7 70%)' }} />
      <p style={{ margin: 0, color: '#667085', fontWeight: 800 }}>+9.2% this week</p>
    </article>
  );
}`;
    }

    if (family === 'navigation') {
        return `import React from 'react';

function ${component}() {
  const [active, setActive] = React.useState('Preview');
  const tabs = ['Preview', 'Code', 'Settings'];

  return (
    <nav style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, maxWidth: 520, border: '1px solid #e2e7ef', borderRadius: 18, background: '#f7f9fc', padding: 6, boxShadow: '0 20px 50px rgba(15,23,42,.1)' }}>
      {tabs.map((tab) => <button key={tab} onClick={() => setActive(tab)} style={{ border: 0, borderRadius: 12, background: active === tab ? '${accent}' : 'transparent', color: active === tab ? '#fff' : '#667085', padding: 13, fontWeight: 900, cursor: 'pointer' }}>{tab}</button>)}
    </nav>
  );
}`;
    }

    return `import React from 'react';

function ${component}() {
  const [dismissed, setDismissed] = React.useState(false);

  return (
    <button type="button" onClick={() => setDismissed(!dismissed)} role="status" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 12, alignItems: 'center', maxWidth: 520, border: 0, borderLeft: '7px solid ${accent}', borderRadius: 18, background: '#fff', padding: 18, boxShadow: '0 22px 48px rgba(15,23,42,.12)', color: '#111827', textAlign: 'left', cursor: 'pointer', opacity: dismissed ? .74 : 1, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <span aria-hidden="true" style={{ width: 28, height: 28, borderRadius: '50%', background: '${accent}' }} />
      <div>
        <strong>{dismissed ? 'Dismissed' : '${title}'}</strong>
        <p style={{ margin: '4px 0 0', color: '#667085', fontWeight: 700 }}>{dismissed ? 'Click again to restore this state.' : 'Use this state for clear product feedback.'}</p>
      </div>
    </button>
  );
}`;
}

const templateCategories = [
    {
        id: 'dashboards',
        label: 'Dashboards',
        icon: ChartSquare,
        description: 'Five command centers for operations, teams, products, logistics, and support.',
        templates: [
            { id: 'ops-command-center', title: 'Operations Command Center', kicker: 'Operations', summary: 'A bright metric cockpit with queue cards and an active work graph.', tags: ['KPIs', 'Queue', 'Graph'], icon: ChartSquare, family: 'dashboard', accent: '#6d5dfc', soft: '#f4f1ff', code: createTemplateCode({ component: 'OperationsCommandCenter', title: 'Operations Command Center', kicker: 'Operations', accent: '#6d5dfc', family: 'dashboard' }) },
            { id: 'executive-overview', title: 'Executive Overview', kicker: 'Executive', summary: 'A boardroom dashboard with revenue signals, region split, and strategic alerts.', tags: ['Leadership', 'Revenue', 'Regions'], icon: Monitor, family: 'dashboard', accent: '#f97316', soft: '#fff4ec', code: createTemplateCode({ component: 'ExecutiveOverview', title: 'Executive Overview', kicker: 'Executive', accent: '#f97316', family: 'dashboard' }) },
            { id: 'product-health-board', title: 'Product Health Board', kicker: 'Product', summary: 'A product analytics board for activation, retention, incidents, and release readiness.', tags: ['Product', 'Retention', 'Incidents'], icon: Stars, family: 'dashboard', accent: '#0ea5e9', soft: '#edf9ff', code: createTemplateCode({ component: 'ProductHealthBoard', title: 'Product Health Board', kicker: 'Product', accent: '#0ea5e9', family: 'dashboard' }) },
            { id: 'logistics-control-room', title: 'Logistics Control Room', kicker: 'Logistics', summary: 'A dispatch view with shipment load, route confidence, and late-risk markers.', tags: ['Dispatch', 'Routes', 'Risk'], icon: Layers, family: 'dashboard', accent: '#16a34a', soft: '#effcf3', code: createTemplateCode({ component: 'LogisticsControlRoom', title: 'Logistics Control Room', kicker: 'Logistics', accent: '#16a34a', family: 'dashboard' }) },
            { id: 'support-desk-dashboard', title: 'Support Desk Dashboard', kicker: 'Support', summary: 'A service desk control panel for SLA state, tickets, and customer sentiment.', tags: ['SLA', 'Tickets', 'Sentiment'], icon: Letter, family: 'dashboard', accent: '#db2777', soft: '#fff0f7', code: createTemplateCode({ component: 'SupportDeskDashboard', title: 'Support Desk Dashboard', kicker: 'Support', accent: '#db2777', family: 'dashboard' }) },
        ],
    },
    {
        id: 'finance-flow',
        label: 'Finance Flow',
        icon: Database,
        description: 'Five finance screens for payments, invoices, reconciliation, budgets, and payout tracking.',
        templates: [
            { id: 'payment-command-flow', title: 'Payment Command Flow', kicker: 'Payments', summary: 'A transaction monitoring flow with success rates and channel breakdowns.', tags: ['Payments', 'Channels', 'Status'], icon: Database, family: 'finance', accent: '#0f766e', soft: '#ecfdf8', code: createTemplateCode({ component: 'PaymentCommandFlow', title: 'Payment Command Flow', kicker: 'Payments', accent: '#0f766e', family: 'finance flow' }) },
            { id: 'invoice-studio', title: 'Invoice Studio', kicker: 'Invoices', summary: 'A clean invoice workspace with totals, approvals, and aging buckets.', tags: ['Invoices', 'Approvals', 'Aging'], icon: CodeSquare, family: 'finance', accent: '#7c3aed', soft: '#f5f0ff', code: createTemplateCode({ component: 'InvoiceStudio', title: 'Invoice Studio', kicker: 'Invoices', accent: '#7c3aed', family: 'finance flow' }) },
            { id: 'reconciliation-desk', title: 'Reconciliation Desk', kicker: 'Reconcile', summary: 'A review surface for unmatched records, proof documents, and exception notes.', tags: ['Audit', 'Records', 'Exceptions'], icon: CheckCircle, family: 'finance', accent: '#ca8a04', soft: '#fff9db', code: createTemplateCode({ component: 'ReconciliationDesk', title: 'Reconciliation Desk', kicker: 'Reconcile', accent: '#ca8a04', family: 'finance flow' }) },
            { id: 'budget-planner', title: 'Budget Planner', kicker: 'Budgets', summary: 'A planning screen with categories, spend caps, and utilization bars.', tags: ['Budget', 'Planning', 'Spend'], icon: ChartSquare, family: 'finance', accent: '#2563eb', soft: '#eef5ff', code: createTemplateCode({ component: 'BudgetPlanner', title: 'Budget Planner', kicker: 'Budgets', accent: '#2563eb', family: 'finance flow' }) },
            { id: 'payout-tracker', title: 'Payout Tracker', kicker: 'Payouts', summary: 'A payout status page with settlement timelines and account destinations.', tags: ['Payouts', 'Timeline', 'Accounts'], icon: CalendarMark, family: 'finance', accent: '#dc2626', soft: '#fff1f1', code: createTemplateCode({ component: 'PayoutTracker', title: 'Payout Tracker', kicker: 'Payouts', accent: '#dc2626', family: 'finance flow' }) },
        ],
    },
    {
        id: 'home-pages',
        label: 'Home Pages',
        icon: Monitor,
        description: 'Five first-screen systems for SaaS, agencies, products, creators, and communities.',
        templates: [
            { id: 'saas-launch-home', title: 'SaaS Launch Home', kicker: 'SaaS', summary: 'A polished software home page with an offer, proof stack, and product panel.', tags: ['Hero', 'SaaS', 'Proof'], icon: Monitor, family: 'home', accent: '#4f46e5', soft: '#f3f0ff', code: createTemplateCode({ component: 'SaasLaunchHome', title: 'SaaS Launch Home', kicker: 'SaaS', accent: '#4f46e5', family: 'home page' }) },
            { id: 'agency-sprint-home', title: 'Agency Sprint Home', kicker: 'Agency', summary: 'A service studio landing page with capabilities and a compact conversion block.', tags: ['Services', 'CTA', 'Studio'], icon: Stars, family: 'home', accent: '#ea580c', soft: '#fff3e9', code: createTemplateCode({ component: 'AgencySprintHome', title: 'Agency Sprint Home', kicker: 'Agency', accent: '#ea580c', family: 'home page' }) },
            { id: 'mobile-app-home', title: 'Mobile App Home', kicker: 'App', summary: 'A vibrant app landing page with screen cards, feature chips, and launch CTA.', tags: ['Mobile', 'Features', 'Launch'], icon: Phone, family: 'home', accent: '#0891b2', soft: '#ecfeff', code: createTemplateCode({ component: 'MobileAppHome', title: 'Mobile App Home', kicker: 'App', accent: '#0891b2', family: 'home page' }) },
            { id: 'creator-hub-home', title: 'Creator Hub Home', kicker: 'Creator', summary: 'A creator platform home page with profile stats and content highlights.', tags: ['Creator', 'Content', 'Stats'], icon: Widget5, family: 'home', accent: '#c026d3', soft: '#fdf4ff', code: createTemplateCode({ component: 'CreatorHubHome', title: 'Creator Hub Home', kicker: 'Creator', accent: '#c026d3', family: 'home page' }) },
            { id: 'community-portal-home', title: 'Community Portal Home', kicker: 'Community', summary: 'A member portal home page with upcoming moments and community signals.', tags: ['Community', 'Events', 'Members'], icon: Layers, family: 'home', accent: '#65a30d', soft: '#f7fee7', code: createTemplateCode({ component: 'CommunityPortalHome', title: 'Community Portal Home', kicker: 'Community', accent: '#65a30d', family: 'home page' }) },
        ],
    },
    {
        id: 'contact-pages',
        label: 'Contact Pages',
        icon: Letter,
        description: 'Five contact flows for support, sales, projects, bookings, and multi-channel teams.',
        templates: [
            { id: 'support-contact-page', title: 'Support Contact Page', kicker: 'Support', summary: 'A support-led contact page with routes, priority options, and a structured form.', tags: ['Support', 'Form', 'Routes'], icon: Letter, family: 'contact', accent: '#2563eb', soft: '#eff6ff', code: createTemplateCode({ component: 'SupportContactPage', title: 'Support Contact Page', kicker: 'Support', accent: '#2563eb', family: 'contact page' }) },
            { id: 'sales-contact-page', title: 'Sales Contact Page', kicker: 'Sales', summary: 'A conversion-focused contact flow with company size, budget, and lead score areas.', tags: ['Sales', 'Lead', 'CTA'], icon: Phone, family: 'contact', accent: '#f43f5e', soft: '#fff1f3', code: createTemplateCode({ component: 'SalesContactPage', title: 'Sales Contact Page', kicker: 'Sales', accent: '#f43f5e', family: 'contact page' }) },
            { id: 'project-brief-page', title: 'Project Brief Page', kicker: 'Brief', summary: 'A project inquiry screen for scope, timeline, budget, and attachment hints.', tags: ['Brief', 'Scope', 'Project'], icon: Code, family: 'contact', accent: '#7c3aed', soft: '#f5f0ff', code: createTemplateCode({ component: 'ProjectBriefPage', title: 'Project Brief Page', kicker: 'Brief', accent: '#7c3aed', family: 'contact page' }) },
            { id: 'booking-contact-page', title: 'Booking Contact Page', kicker: 'Booking', summary: 'A contact page for scheduling calls, events, demos, or consultation slots.', tags: ['Booking', 'Calendar', 'Slots'], icon: CalendarMark, family: 'contact', accent: '#0d9488', soft: '#ecfdfa', code: createTemplateCode({ component: 'BookingContactPage', title: 'Booking Contact Page', kicker: 'Booking', accent: '#0d9488', family: 'contact page' }) },
            { id: 'multi-channel-contact', title: 'Multi-Channel Contact', kicker: 'Channels', summary: 'A multi-channel page with social, email, call, chat, and location blocks.', tags: ['Channels', 'Social', 'Location'], icon: Layers, family: 'contact', accent: '#d97706', soft: '#fff7ed', code: createTemplateCode({ component: 'MultiChannelContact', title: 'Multi-Channel Contact', kicker: 'Channels', accent: '#d97706', family: 'contact page' }) },
        ],
    },
    {
        id: 'about-pages',
        label: 'About Pages',
        icon: Stars,
        description: 'Five about pages for story, team, process, values, and milestones.',
        templates: [
            { id: 'studio-about-page', title: 'Studio About Page', kicker: 'Story', summary: 'A studio story page with proof, values, and crisp positioning.', tags: ['Story', 'Values', 'Proof'], icon: Stars, family: 'about', accent: '#7c3aed', soft: '#f5f0ff', code: createTemplateCode({ component: 'StudioAboutPage', title: 'Studio About Page', kicker: 'Story', accent: '#7c3aed', family: 'about page' }) },
            { id: 'team-about-page', title: 'Team About Page', kicker: 'Team', summary: 'A people-first about page with member cards and delivery principles.', tags: ['Team', 'People', 'Principles'], icon: Widget5, family: 'about', accent: '#0891b2', soft: '#ecfeff', code: createTemplateCode({ component: 'TeamAboutPage', title: 'Team About Page', kicker: 'Team', accent: '#0891b2', family: 'about page' }) },
            { id: 'process-about-page', title: 'Process About Page', kicker: 'Process', summary: 'A method-led page that explains discovery, prototype, build, and verification.', tags: ['Process', 'Timeline', 'Method'], icon: Layers, family: 'about', accent: '#ea580c', soft: '#fff3e9', code: createTemplateCode({ component: 'ProcessAboutPage', title: 'Process About Page', kicker: 'Process', accent: '#ea580c', family: 'about page' }) },
            { id: 'values-about-page', title: 'Values About Page', kicker: 'Values', summary: 'A values-focused company page with belief cards and decision rules.', tags: ['Values', 'Culture', 'Rules'], icon: CheckCircle, family: 'about', accent: '#16a34a', soft: '#effcf3', code: createTemplateCode({ component: 'ValuesAboutPage', title: 'Values About Page', kicker: 'Values', accent: '#16a34a', family: 'about page' }) },
            { id: 'milestones-about-page', title: 'Milestones About Page', kicker: 'Milestones', summary: 'A timeline about page for history, growth, releases, and trust markers.', tags: ['Timeline', 'History', 'Trust'], icon: CalendarMark, family: 'about', accent: '#db2777', soft: '#fff0f7', code: createTemplateCode({ component: 'MilestonesAboutPage', title: 'Milestones About Page', kicker: 'Milestones', accent: '#db2777', family: 'about page' }) },
        ],
    },
];

const componentGroups = [
    {
        id: 'buttons',
        label: 'Buttons',
        icon: Stars,
        items: [
            { title: 'Glow CTA Button', summary: 'A soft gradient call-to-action with a focused shadow.', family: 'button', accent: '#7c3aed', code: createComponentCode({ component: 'GlowCtaButton', title: 'Glow CTA Button', accent: '#7c3aed', family: 'button' }) },
            { title: 'Split Action Button', summary: 'Primary action with a secondary icon cell.', family: 'button', accent: '#ea580c', code: createComponentCode({ component: 'SplitActionButton', title: 'Split Action Button', accent: '#ea580c', family: 'button' }) },
            { title: 'Soft Pill Button', summary: 'Rounded product button for app and SaaS surfaces.', family: 'button', accent: '#0ea5e9', code: createComponentCode({ component: 'SoftPillButton', title: 'Soft Pill Button', accent: '#0ea5e9', family: 'button' }) },
            { title: 'Danger Confirm Button', summary: 'A destructive-action button with clear intent.', family: 'button', accent: '#dc2626', code: createComponentCode({ component: 'DangerConfirmButton', title: 'Danger Confirm Button', accent: '#dc2626', family: 'button' }) },
            { title: 'Quiet Ghost Button', summary: 'Low-noise command button for dense tools.', family: 'button', accent: '#475569', code: createComponentCode({ component: 'QuietGhostButton', title: 'Quiet Ghost Button', accent: '#475569', family: 'button' }) },
        ],
    },
    {
        id: 'inputs',
        label: 'Inputs',
        icon: CodeSquare,
        items: [
            { title: 'Floating Label Input', summary: 'A modern text input with label and helper line.', family: 'input', accent: '#4f46e5', code: createComponentCode({ component: 'FloatingLabelInput', title: 'Floating Label Input', accent: '#4f46e5', family: 'input' }) },
            { title: 'Search Command Input', summary: 'Command-palette inspired search with shortcut hint.', family: 'input', accent: '#0f766e', code: createComponentCode({ component: 'SearchCommandInput', title: 'Search Command Input', accent: '#0f766e', family: 'input' }) },
            { title: 'Amount Input', summary: 'Currency input with unit, value, and validation state.', family: 'input', accent: '#ca8a04', code: createComponentCode({ component: 'AmountInput', title: 'Amount Input', accent: '#ca8a04', family: 'input' }) },
            { title: 'Date Range Input', summary: 'A compact paired date selector surface.', family: 'input', accent: '#db2777', code: createComponentCode({ component: 'DateRangeInput', title: 'Date Range Input', accent: '#db2777', family: 'input' }) },
            { title: 'Upload Dropzone', summary: 'Drop area for documents, images, and evidence files.', family: 'input', accent: '#2563eb', code: createComponentCode({ component: 'UploadDropzone', title: 'Upload Dropzone', accent: '#2563eb', family: 'input' }) },
        ],
    },
    {
        id: 'data-cards',
        label: 'Data Cards',
        icon: ChartSquare,
        items: [
            { title: 'Metric Stack Card', summary: 'Layered KPI card with trend and mini progress.', family: 'data', accent: '#16a34a', code: createComponentCode({ component: 'MetricStackCard', title: 'Metric Stack Card', accent: '#16a34a', family: 'data card' }) },
            { title: 'Revenue Spark Card', summary: 'Revenue total with a compact sparkline feel.', family: 'data', accent: '#7c3aed', code: createComponentCode({ component: 'RevenueSparkCard', title: 'Revenue Spark Card', accent: '#7c3aed', family: 'data card' }) },
            { title: 'Status Summary Card', summary: 'Three state summary for health, risk, and review.', family: 'data', accent: '#0891b2', code: createComponentCode({ component: 'StatusSummaryCard', title: 'Status Summary Card', accent: '#0891b2', family: 'data card' }) },
            { title: 'Progress Ring Card', summary: 'Circular progress-inspired card for completion metrics.', family: 'data', accent: '#f97316', code: createComponentCode({ component: 'ProgressRingCard', title: 'Progress Ring Card', accent: '#f97316', family: 'data card' }) },
            { title: 'Comparison Card', summary: 'Before/after value comparison with a strong delta.', family: 'data', accent: '#dc2626', code: createComponentCode({ component: 'ComparisonCard', title: 'Comparison Card', accent: '#dc2626', family: 'data card' }) },
        ],
    },
    {
        id: 'navigation',
        label: 'Navigation',
        icon: Layers,
        items: [
            { title: 'Command Tabs', summary: 'Segmented navigation for preview, code, and settings.', family: 'nav', accent: '#4f46e5', code: createComponentCode({ component: 'CommandTabs', title: 'Command Tabs', accent: '#4f46e5', family: 'navigation' }) },
            { title: 'Sidebar Rail', summary: 'Compact rail for dashboards and internal tools.', family: 'nav', accent: '#0f766e', code: createComponentCode({ component: 'SidebarRail', title: 'Sidebar Rail', accent: '#0f766e', family: 'navigation' }) },
            { title: 'Breadcrumb Strip', summary: 'Readable path strip for nested workflows.', family: 'nav', accent: '#ca8a04', code: createComponentCode({ component: 'BreadcrumbStrip', title: 'Breadcrumb Strip', accent: '#ca8a04', family: 'navigation' }) },
            { title: 'Step Navigation', summary: 'A numbered wizard path for forms and onboarding.', family: 'nav', accent: '#db2777', code: createComponentCode({ component: 'StepNavigation', title: 'Step Navigation', accent: '#db2777', family: 'navigation' }) },
            { title: 'Top App Bar', summary: 'Product header with actions, status, and account region.', family: 'nav', accent: '#2563eb', code: createComponentCode({ component: 'TopAppBar', title: 'Top App Bar', accent: '#2563eb', family: 'navigation' }) },
        ],
    },
    {
        id: 'feedback',
        label: 'Feedback',
        icon: CheckCircle,
        items: [
            { title: 'Success Toast', summary: 'Positive save confirmation with short supporting copy.', family: 'feedback', accent: '#16a34a', code: createComponentCode({ component: 'SuccessToast', title: 'Success Toast', accent: '#16a34a', family: 'feedback' }) },
            { title: 'Warning Banner', summary: 'Alert band for review states without panic.', family: 'feedback', accent: '#d97706', code: createComponentCode({ component: 'WarningBanner', title: 'Warning Banner', accent: '#d97706', family: 'feedback' }) },
            { title: 'Empty State Panel', summary: 'Helpful empty state with action and icon space.', family: 'feedback', accent: '#7c3aed', code: createComponentCode({ component: 'EmptyStatePanel', title: 'Empty State Panel', accent: '#7c3aed', family: 'feedback' }) },
            { title: 'Loading Skeleton', summary: 'Skeleton structure for cards, rows, and lists.', family: 'feedback', accent: '#64748b', code: createComponentCode({ component: 'LoadingSkeleton', title: 'Loading Skeleton', accent: '#64748b', family: 'feedback' }) },
            { title: 'Error Recovery Card', summary: 'Clear recovery path for failed requests.', family: 'feedback', accent: '#dc2626', code: createComponentCode({ component: 'ErrorRecoveryCard', title: 'Error Recovery Card', accent: '#dc2626', family: 'feedback' }) },
        ],
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
                        <span>Vincent</span>
                        <span>Luhanga</span>
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
                {expanded && (
                    <div className="mobile-subnav">
                        {route.children.map((child) => (
                            <NavButton key={child.path} route={child} currentPath={currentPath} navigate={navigate} />
                        ))}
                    </div>
                )}
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

    useEffect(() => {
        if (slides.length < 2) return undefined;

        const timer = window.setInterval(() => {
            setActiveSlide((current) => (current + 1) % slides.length);
        }, 5200);

        return () => window.clearInterval(timer);
    }, [slides.length]);

    return (
        <>
            <section className="hero-screen">
                <div className="hero-slideshow" aria-hidden="true">
                    {slides.map((slide, index) => (
                        <img
                            key={slide}
                            src={slide}
                            alt=""
                            className={index === activeSlide ? 'active' : ''}
                        />
                    ))}
                </div>
                <div className="hero-shade" aria-hidden="true" />

                <div className="container-max hero-window">
                    <div className="hero-copy">
                        <h1 className="hero-title reveal">VINCENT <span>LUHANGA</span></h1>
                        <p className="hero-label reveal font-extrabold">Software Engineer</p>
                        <p className="reveal">
                            I build full software systems: management platforms, dashboards, booking workflows,
                            database-backed tools, APIs, and React interfaces that make complex work easier to run.
                        </p>
                        <div className="hero-actions reveal">
                            <a className="action-button" href={routeHref('/projects')} onClick={(event) => handleNav(event, '/projects', navigate)}>
                                <span>View projects</span>
                                <ArrowRight size={19} weight="Bold" />
                            </a>
                            <a className="action-button secondary" href={routeHref('/capabilities')} onClick={(event) => handleNav(event, '/capabilities', navigate)}>
                                <span>View capabilities</span>
                                <ChartSquare size={19} weight="Bold" />
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
                                onClick={() => setActiveSlide(index)}
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
                        icon={Layers}
                        title="Projects"
                        copy="A closer look at the management systems, booking flows, dashboards, and data tools I have built."
                        path="/projects"
                        navigate={navigate}
                    />
                    <FeatureLink
                        icon={ChartSquare}
                        title="Capabilities"
                        copy="How I approach full-stack delivery: React, Laravel, databases, APIs, testing, and system logic."
                        path="/capabilities"
                        navigate={navigate}
                    />
                    <FeatureLink
                        icon={CalendarMark}
                        title="Experience"
                        copy="The work, training, and habits that shaped me as a software engineer."
                        path="/experience"
                        navigate={navigate}
                    />
                </div>
            </section>

            <HomeProfileSection />
            <SkillProofSection />
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

function createCanvasTexture(width, height, draw) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    draw(context, width, height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
    return texture;
}

function createDesktopTexture(nightMode = false) {
    const palette = getPcPalette(nightMode);

    return createCanvasTexture(1024, 620, (context, width, height) => {
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
        context.fillText('Management systems / APIs / Data', 70, 154);
        context.fillText('React / Laravel / MySQL', 70, 178);
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

function createFolderTexture(label, active = false, nightMode = false) {
    const palette = getPcPalette(nightMode);

    return createCanvasTexture(320, 260, (context, width, height) => {
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

function createStatusTexture(link, nightMode = false) {
    const palette = getPcPalette(nightMode);
    const label = link?.label || 'Workspace';
    const path = link?.path || 'Ready';

    return createCanvasTexture(520, 150, (context, width, height) => {
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

function createModeSwitchTexture(nightMode = false, active = false) {
    const palette = getPcPalette(nightMode);
    const nextMode = nightMode ? 'DAY' : 'NIGHT';

    return createCanvasTexture(360, 150, (context, width, height) => {
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

        const palette = getPcPalette(nightMode);
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
        const pcGroup = new THREE.Group();
        const clickable = [];
        const hoverRings = [];
        const ledKeys = [];
        const keyboardKeys = [];
        const ownedTextures = new Set();
        const raycaster = new THREE.Raycaster();
        const pointer = { x: 0, y: 0 };
        let hovered = null;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let frameId = 0;
        const trackTexture = (texture) => {
            ownedTextures.add(texture);
            return texture;
        };

        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.domElement.setAttribute('data-three-canvas', 'portfolio-model');
        renderer.domElement.style.display = 'block';
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        mount.appendChild(renderer.domElement);

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
            screen: new THREE.MeshBasicMaterial({ map: trackTexture(createDesktopTexture(nightMode)) }),
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
        statusTextures.set('ready', trackTexture(createStatusTexture(null, nightMode)));
        statusTextures.set('theme', trackTexture(createStatusTexture({
            label: 'Theme',
            path: nightMode ? 'Switch to day mode' : 'Switch to night mode',
        }, nightMode)));
        desktopLinks.forEach((link) => {
            statusTextures.set(link.path, trackTexture(createStatusTexture(link, nightMode)));
        });

        const statusMaterial = new THREE.MeshBasicMaterial({
            map: statusTextures.get('ready'),
            transparent: true,
        });
        const statusPanel = new THREE.Mesh(new THREE.PlaneGeometry(1.86, 0.52), statusMaterial);
        statusPanel.position.set(1.12, -0.48, 0.22);
        monitorGroup.add(statusPanel);

        const modeNormalMap = trackTexture(createModeSwitchTexture(nightMode, false));
        const modeActiveMap = trackTexture(createModeSwitchTexture(nightMode, true));
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
            const normalMap = trackTexture(createFolderTexture(link.label, false, nightMode));
            const activeMap = trackTexture(createFolderTexture(link.label, true, nightMode));
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
            frameId = window.requestAnimationFrame(animate);
        };

        resize();
        mount.addEventListener('pointermove', onPointerMove);
        mount.addEventListener('pointerleave', onPointerLeave);
        mount.addEventListener('click', onClick);
        window.addEventListener('resize', resize);

        if (prefersReducedMotion) {
            renderer.render(scene, camera);
        } else {
            frameId = window.requestAnimationFrame(animate);
        }

        return () => {
            window.cancelAnimationFrame(frameId);
            mount.removeEventListener('pointermove', onPointerMove);
            mount.removeEventListener('pointerleave', onPointerLeave);
            mount.removeEventListener('click', onClick);
            window.removeEventListener('resize', resize);
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
    }, [navigate, nightMode, toggleTheme]);

    return (
        <div className="three-model-stage reveal" ref={mountRef} data-mode={nightMode ? 'night' : 'day'}>
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
                    <p className="eyebrow">Why Work With Me</p>
                    <h2>I build React screens for work that needs accuracy: records, dashboards, bookings, and data checks.</h2>
                    <p>
                        I bring software engineering training, hands-on project work, and a practical eye for interfaces
                        that need to stay readable, responsive, and easy to operate.
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

            <div className="container-max profile-card-grid">
                {homeProfileCards.map((item, index) => (
                    <ProfileCard key={item.title} item={item} index={index} />
                ))}
            </div>
        </section>
    );
}

function SkillProofSection() {
    return (
        <section className="section-pad slim skill-proof-section">
            <div className="container-max section-heading reveal">
                <div>
                    <p className="eyebrow">Skill Evidence</p>
                    <h2>What I bring to a product team.</h2>
                </div>
                <p>
                    I bring a mix of React implementation, data awareness, careful debugging, and a practical eye for
                    the screens users depend on every day.
                </p>
            </div>

            <div className="container-max skill-proof-grid">
                {skillProofItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <article className="skill-proof-card reveal" key={item.title} style={staggerStyle(index)}>
                            <div className="skill-proof-card-head">
                                <Icon size={25} weight="Bold" />
                                <h3>{item.title}</h3>
                            </div>
                            <p>{item.copy}</p>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}

function ProfileCard({ item, index = 0 }) {
    const Icon = item.icon;

    return (
        <article className="profile-card reveal" style={staggerStyle(index)}>
            <div className="profile-card-head">
                <Icon size={27} weight="Bold" />
                <h3>{item.title}</h3>
            </div>
            <p>{item.copy}</p>
        </article>
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
                        Software engineering graduate building responsive web apps, dashboards,
                        database-backed workflows, and practical systems with a delivery mindset.
                    </p>
                </div>

                <nav className="footer-links" aria-label="Footer navigation">
                    <a href={routeHref('/projects')} onClick={(event) => handleNav(event, '/projects', navigate)}><Folder size={18} weight="Bold" />Projects</a>
                    <a href={routeHref('/capabilities')} onClick={(event) => handleNav(event, '/capabilities', navigate)}><ChartSquare size={18} weight="Bold" />Capabilities</a>
                    <a href={routeHref('/experience')} onClick={(event) => handleNav(event, '/experience', navigate)}><CalendarMark size={18} weight="Bold" />Experience</a>
                    <a href={routeHref('/contact')} onClick={(event) => handleNav(event, '/contact', navigate)}><Letter size={18} weight="Bold" />Contact</a>
                </nav>

                <div className="footer-contact">
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
                        <p className="eyebrow">Projects</p>
                        <h1>Management systems, dashboards, and workflow tools built for real operations.</h1>
                        <p>
                            I build software around the jobs organizations need to run: managing records, controlling
                            access, handling bookings, reading reports, and keeping data reliable.
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

            <ProjectProcessStrip />

            <section className="section-pad">
                <div className="container-max section-heading reveal">
                    <div>
                        <p className="eyebrow">Selected Projects</p>
                        <h2>Systems with clear users, clean data, and practical outcomes.</h2>
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

function ProjectProcessStrip() {
    return (
        <section className="section-pad slim">
            <div className="container-max project-process reveal">
                <div>
                    <p className="eyebrow">Project Rhythm</p>
                    <h2>I start with the workflow, then build toward a system that can be trusted.</h2>
                </div>
                <div className="process-track" aria-label="Project delivery stages">
                    {projectProcess.map((stage, index) => (
                        <div className="process-step" key={stage} style={staggerStyle(index, 80)}>
                            <span>{String(index + 1).padStart(2, '0')}</span>
                            <strong>{stage}</strong>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CapabilitiesPage() {
    return (
        <>
            <PageHeading
                eyebrow="Capabilities"
                title="Full-stack systems, data workflows, and delivery habits I can bring to your project."
                copy="I can plan the workflow, build the React surface, connect Laravel or API logic, structure the data, test awkward states, and keep the product usable on every viewport."
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
            <div className="container-max capability-detail-layout">
                <div className="capability-detail-grid reveal">
                    {capabilityDetails.map((item, index) => (
                        <article className="capability-detail-card" key={item.title} style={staggerStyle(index)}>
                            <h2>{item.title}</h2>
                            <p>{item.copy}</p>
                        </article>
                    ))}
                </div>

                <div className="capability-stack-console reveal">
                    <p className="eyebrow font-extrabold uppercase">Developer Stack</p>
                    {stackGroups.map((group, index) => (
                        <div className="stack-line" key={group.title} style={staggerStyle(index)}>
                            <strong>{group.title}</strong>
                            <span>{group.items.join(' / ')}</span>
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
                title="Software delivery shaped by accuracy, communication, and real users."
                copy="My background combines development practice, document verification, customer-facing work, and the patience needed to catch details before users do."
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

function LibraryViewTabs({ activeView, setActiveView }) {
    return (
        <div className="library-view-tabs" role="tablist" aria-label="Library view">
            {['preview', 'code'].map((view) => (
                <button
                    key={view}
                    type="button"
                    className={activeView === view ? 'active' : ''}
                    onClick={() => setActiveView(view)}
                >
                    {view}
                </button>
            ))}
        </div>
    );
}

function TemplatePreview({ template }) {
    switch (template.id) {
        case 'ops-command-center':
            return <OpsCommandPreview template={template} />;
        case 'executive-overview':
            return <ExecutiveOverviewPreview template={template} />;
        case 'product-health-board':
            return <ProductHealthPreview template={template} />;
        case 'logistics-control-room':
            return <LogisticsControlPreview template={template} />;
        case 'support-desk-dashboard':
            return <SupportDeskPreview template={template} />;
        case 'payment-command-flow':
            return <PaymentCommandPreview template={template} />;
        case 'invoice-studio':
            return <InvoiceStudioPreview template={template} />;
        case 'reconciliation-desk':
            return <ReconciliationDeskPreview template={template} />;
        case 'budget-planner':
            return <BudgetPlannerPreview template={template} />;
        case 'payout-tracker':
            return <PayoutTrackerPreview template={template} />;
        case 'saas-launch-home':
            return <SaasLaunchPreview template={template} />;
        case 'agency-sprint-home':
            return <AgencySprintPreview template={template} />;
        case 'mobile-app-home':
            return <MobileAppPreview template={template} />;
        case 'creator-hub-home':
            return <CreatorHubPreview template={template} />;
        case 'community-portal-home':
            return <CommunityPortalPreview template={template} />;
        case 'support-contact-page':
            return <SupportContactPreview template={template} />;
        case 'sales-contact-page':
            return <SalesContactPreview template={template} />;
        case 'project-brief-page':
            return <ProjectBriefPreview template={template} />;
        case 'booking-contact-page':
            return <BookingContactPreview template={template} />;
        case 'multi-channel-contact':
            return <MultiChannelContactPreview template={template} />;
        case 'studio-about-page':
            return <StudioAboutPreview template={template} />;
        case 'team-about-page':
            return <TeamAboutPreview template={template} />;
        case 'process-about-page':
            return <ProcessAboutPreview template={template} />;
        case 'values-about-page':
            return <ValuesAboutPreview template={template} />;
        case 'milestones-about-page':
            return <MilestonesAboutPreview template={template} />;
        default:
            return <FallbackTemplatePreview template={template} />;
    }
}

function SampleChrome({ label }) {
    return (
        <div className="sample-chrome">
            <span />
            <span />
            <span />
            <strong>{label}</strong>
        </div>
    );
}

function TemplateFrame({ template, className, children }) {
    const [mode, setMode] = useState('live');
    const modes = ['live', 'focus', 'detail'];
    const Icon = template.icon || Monitor;
    const fontMap = {
        dashboard: "'Inter', 'Segoe UI', Arial, sans-serif",
        finance: "'IBM Plex Sans', 'Segoe UI', Arial, sans-serif",
        home: "'Space Grotesk', 'Segoe UI', Arial, sans-serif",
        contact: "'DM Sans', 'Segoe UI', Arial, sans-serif",
        about: "'Georgia', 'Times New Roman', serif",
    };

    return (
        <div
            className={`template-preview sample-${template.family} ${className}`}
            data-demo-mode={mode}
            style={{
                '--sample-accent': template.accent,
                '--sample-soft': template.soft,
                '--template-font': fontMap[template.family] || "'Inter', 'Segoe UI', Arial, sans-serif",
            }}
        >
            <SampleChrome label={template.kicker} />
            <div className="project-demo-shell">
                <header className="project-demo-topbar">
                    <div className="project-demo-brand">
                        <span><Icon size={17} weight="Bold" /></span>
                        <strong>{template.title}</strong>
                    </div>
                    <div className="project-demo-search">
                        <CodeSquare size={15} weight="Bold" />
                        <span>Search workspace</span>
                    </div>
                    <div className="project-demo-actions">
                        <div className="sample-action-bar" role="group" aria-label={`${template.title} preview mode`}>
                            {modes.map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    className={mode === item ? 'active' : ''}
                                    onClick={() => setMode(item)}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                        <span className="project-demo-live"><i />Live</span>
                    </div>
                </header>
                <div className="project-demo-body">
                    {children}
                </div>
            </div>
        </div>
    );
}

function MiniBars({ values }) {
    return (
        <div className="mini-bars" aria-hidden="true">
            {values.map((value, index) => (
                <span key={`${value}-${index}`} style={{ '--bar-height': `${value}%`, '--bar-delay': `${index * 80}ms` }} />
            ))}
        </div>
    );
}

function MiniLine({ points }) {
    return (
        <div className="mini-line" aria-hidden="true">
            {points.map((point, index) => (
                <span key={`${point}-${index}`} style={{ '--point': `${point}%`, '--bar-delay': `${index * 80}ms` }} />
            ))}
        </div>
    );
}

function SamplePill({ children }) {
    return <span className="sample-pill">{children}</span>;
}

function OpsCommandPreview({ template }) {
    const [activeDesk, setActiveDesk] = useState('Live');
    const deskData = {
        Live: { title: '102 tasks moving with dispatch confidence.', primary: '96%', label: 'SLA coverage', chips: ['North team', '4 escalations'], stats: ['128', '94', '07'], bars: [42, 68, 51, 82, 64, 91, 73] },
        Queue: { title: 'Priority queue balanced across field and review teams.', primary: '38', label: 'urgent files', chips: ['2 lanes busy', '18 permits'], stats: ['38', '22', '04'], bars: [68, 52, 74, 46, 82, 61, 88] },
        Teams: { title: 'Team coverage is strongest around dispatch and audit.', primary: '12', label: 'active teams', chips: ['3 remote', '9 onsite'], stats: ['12', '31', '03'], bars: [34, 44, 58, 72, 61, 84, 67] },
        Reports: { title: 'Daily reports are ready for leadership review.', primary: '18', label: 'reports ready', chips: ['6 exports', '2 audits'], stats: ['18', '14', '01'], bars: [55, 63, 49, 76, 71, 82, 90] },
    };
    const desk = deskData[activeDesk];

    return (
        <TemplateFrame template={template} className="ops-command-preview">
            <div className="ops-command-shell">
                <aside className="ops-command-sidebar">
                    <strong>OPER</strong>
                    {Object.keys(deskData).map((item) => (
                        <button
                            key={item}
                            type="button"
                            className={activeDesk === item ? 'active' : ''}
                            onClick={() => setActiveDesk(item)}
                        >
                            <span>{item.slice(0, 2)}</span>
                            {item}
                        </button>
                    ))}
                </aside>
                <main className="ops-command-main">
                    <section className="ops-command-hero">
                        <div>
                            <span>{activeDesk} floor</span>
                            <h3>{desk.title}</h3>
                            <div>
                                {desk.chips.map((chip) => <SamplePill key={chip}>{chip}</SamplePill>)}
                            </div>
                        </div>
                        <article>
                            <strong>{desk.primary}</strong>
                            <span>{desk.label}</span>
                        </article>
                    </section>
                    <div className="ops-command-cards">
                        <PreviewStat label="Open Queue" value={desk.stats[0]} />
                        <PreviewStat label="Completed" value={desk.stats[1]} />
                        <PreviewStat label="Risk Holds" value={desk.stats[2]} />
                    </div>
                    <section className="ops-command-bottom">
                        <div className="ops-command-graph">
                            <strong>Workload pulse</strong>
                            <MiniBars values={desk.bars} />
                        </div>
                        <div className="ops-command-queue">
                            <PreviewRow title="Permit review lane" meta="18 files" status="Active" />
                            <PreviewRow title="Field dispatch desk" meta="6 teams" status="Live" />
                            <PreviewRow title="Compliance notes" meta="12 flags" status="Review" />
                        </div>
                    </section>
                </main>
            </div>
        </TemplateFrame>
    );
}

function ExecutiveOverviewPreview({ template }) {
    return (
        <TemplateFrame template={template} className="executive-overview-preview">
            <div className="executive-board">
                <header>
                    <div>
                        <span>Quarter focus</span>
                        <h3>Leadership signals without dashboard noise.</h3>
                    </div>
                    <strong>Q3</strong>
                </header>
                <section className="executive-grid">
                    <article className="executive-revenue">
                        <span>Revenue run-rate</span>
                        <strong>$1.42M</strong>
                        <MiniLine points={[24, 42, 35, 62, 58, 76]} />
                    </article>
                    <article className="executive-map">
                        {['North', 'East', 'South', 'West'].map((region, index) => (
                            <span key={region} className={index === 1 ? 'active' : ''}>{region}</span>
                        ))}
                    </article>
                    <div className="executive-alerts">
                        <PreviewRow title="Expansion readiness" meta="84%" status="Good" />
                        <PreviewRow title="Margin exposure" meta="2 areas" status="Watch" />
                    </div>
                </section>
            </div>
        </TemplateFrame>
    );
}

function ProductHealthPreview({ template }) {
    return (
        <TemplateFrame template={template} className="product-health-preview">
            <div className="product-health-board">
                <section className="product-health-hero">
                    <div>
                        <span>Release train</span>
                        <h3>Activation, retention, and incidents in one product room.</h3>
                    </div>
                    <button type="button">Ship check</button>
                </section>
                <div className="product-health-layout">
                    <article className="product-funnel">
                        {['Visit', 'Trial', 'Active', 'Paid'].map((step, index) => (
                            <span key={step} style={{ '--funnel-size': `${100 - index * 14}%` }}>{step}</span>
                        ))}
                    </article>
                    <div className="product-cards">
                        <PreviewStat label="Activation" value="61%" />
                        <PreviewStat label="Retention" value="42%" />
                        <PreviewStat label="Incidents" value="02" />
                    </div>
                    <div className="product-incidents">
                        <PreviewRow title="API latency" meta="p95 220ms" status="Stable" />
                        <PreviewRow title="Billing retry" meta="Patch ready" status="Ship" />
                    </div>
                </div>
            </div>
        </TemplateFrame>
    );
}

function LogisticsControlPreview({ template }) {
    return (
        <TemplateFrame template={template} className="logistics-control-preview">
            <div className="logistics-shell">
                <div className="logistics-map">
                    <span className="pin one" />
                    <span className="pin two" />
                    <span className="pin three" />
                    <i />
                    <strong>Route A7</strong>
                </div>
                <aside className="logistics-dispatch">
                    <span>Dispatch queue</span>
                    {['Truck 14 - Kitwe', 'Bike 08 - Ndola', 'Van 22 - Lusaka'].map((item) => (
                        <PreviewRow key={item} title={item} status="On route" />
                    ))}
                </aside>
                <div className="logistics-fleet">
                    <PreviewStat label="On Time" value="88%" />
                    <PreviewStat label="Fleet" value="32" />
                    <PreviewStat label="Late Risk" value="05" />
                </div>
            </div>
        </TemplateFrame>
    );
}

function SupportDeskPreview({ template }) {
    const [activeQueue, setActiveQueue] = useState('Billing');
    const queueData = {
        Billing: ['74', '213', '42m', 'Positive trend'],
        Login: ['38', '141', '18m', 'Password flow stable'],
        Mobile: ['29', '96', '31m', 'App reviews improving'],
        API: ['16', '67', '12m', 'Webhook retries clear'],
    };
    const queue = queueData[activeQueue];

    return (
        <TemplateFrame template={template} className="support-desk-preview">
            <div className="support-desk-shell">
                <aside>
                    {Object.keys(queueData).map((item) => (
                        <button
                            key={item}
                            type="button"
                            className={activeQueue === item ? 'active' : ''}
                            onClick={() => setActiveQueue(item)}
                        >
                            {item}
                        </button>
                    ))}
                </aside>
                <main>
                    <header>
                        <div>
                            <span>{activeQueue} desk</span>
                            <h3>SLA pressure, ticket quality, and sentiment.</h3>
                        </div>
                        <strong>{queue[2]}</strong>
                    </header>
                    <div className="support-ticket-grid">
                        <PreviewStat label="Open" value={queue[0]} />
                        <PreviewStat label="Solved" value={queue[1]} />
                    </div>
                    <section className="support-sentiment">
                        <div><span style={{ '--sentiment': '72%' }} /></div>
                        <strong>{queue[3]}</strong>
                    </section>
                </main>
            </div>
        </TemplateFrame>
    );
}

function PaymentCommandPreview({ template }) {
    const [activeChannel, setActiveChannel] = useState('Mobile Money');
    const channelData = {
        Card: { value: 'ZMW 34.8k', trend: [46, 64, 52, 80, 68, 74], rows: ['Visa settlement', 'Mastercard batch'] },
        'Mobile Money': { value: 'ZMW 84.2k', trend: [58, 72, 62, 86, 78, 92], rows: ['Airtel Money batch', 'MTN wallet sync'] },
        Bank: { value: 'ZMW 41.6k', trend: [34, 52, 49, 61, 77, 69], rows: ['Bank transfer set', 'Corporate deposit'] },
        Cash: { value: 'ZMW 9.4k', trend: [28, 35, 42, 39, 48, 44], rows: ['Front desk drawer', 'Kiosk handover'] },
    };
    const active = channelData[activeChannel];

    return (
        <TemplateFrame template={template} className="payment-flow-preview">
            <div className="payment-flow-shell">
                <section className="payment-flow-hero">
                    <strong>{active.value}</strong>
                    <span>{activeChannel} processed today</span>
                    <MiniBars values={active.trend} />
                </section>
                <div className="payment-lanes">
                    {Object.keys(channelData).map((lane, index) => (
                        <button
                            key={lane}
                            type="button"
                            className={activeChannel === lane ? 'active' : ''}
                            onClick={() => setActiveChannel(lane)}
                        >
                            <span>{lane}</span>
                            <strong>{[42, 31, 18, 9][index]}%</strong>
                        </button>
                    ))}
                </div>
                <div className="payment-log">
                    {active.rows.map((row, index) => (
                        <PreviewRow key={row} title={row} meta={`+ZMW ${['8,420', '21,010'][index]}`} status={index === 0 ? 'Paid' : 'Clear'} />
                    ))}
                </div>
            </div>
        </TemplateFrame>
    );
}

function InvoiceStudioPreview({ template }) {
    return (
        <TemplateFrame template={template} className="invoice-studio-preview">
            <div className="invoice-studio-shell">
                <section className="invoice-sheet">
                    <header>
                        <strong>INV-2408</strong>
                        <span>Due Aug 28</span>
                    </header>
                    {['Design system', 'Dashboard build', 'QA handoff'].map((item, index) => (
                        <PreviewRow key={item} title={item} meta={`ZMW ${[6400, 12200, 3100][index]}`} status="Ready" />
                    ))}
                </section>
                <aside className="invoice-approval">
                    <span>Total</span>
                    <strong>ZMW 21.7k</strong>
                    <button type="button">Approve</button>
                </aside>
            </div>
        </TemplateFrame>
    );
}

function ReconciliationDeskPreview({ template }) {
    return (
        <TemplateFrame template={template} className="reconciliation-preview">
            <div className="recon-shell">
                <section>
                    <span>Ledger</span>
                    <PreviewRow title="Receipt #2901" meta="Matched" status="OK" />
                    <PreviewRow title="Deposit #1120" meta="Missing proof" status="Flag" />
                    <PreviewRow title="Invoice #8812" meta="Variance 2%" status="Check" />
                </section>
                <aside>
                    <strong>Evidence</strong>
                    <i />
                    <i />
                    <button type="button">Attach proof</button>
                </aside>
            </div>
        </TemplateFrame>
    );
}

function BudgetPlannerPreview({ template }) {
    const rows = [
        ['Product', 76],
        ['People', 64],
        ['Cloud', 48],
        ['Marketing', 39],
    ];

    return (
        <TemplateFrame template={template} className="budget-planner-preview">
            <div className="budget-shell">
                <header>
                    <h3>Annual plan</h3>
                    <SamplePill>Scenario B</SamplePill>
                </header>
                <section>
                    {rows.map(([label, value]) => (
                        <div key={label} className="budget-row">
                            <span>{label}</span>
                            <i><em style={{ '--budget-width': `${value}%` }} /></i>
                            <strong>{value}%</strong>
                        </div>
                    ))}
                </section>
                <aside>
                    <PreviewStat label="Remaining" value="$42k" />
                    <PreviewStat label="Forecast" value="+8%" />
                </aside>
            </div>
        </TemplateFrame>
    );
}

function PayoutTrackerPreview({ template }) {
    return (
        <TemplateFrame template={template} className="payout-tracker-preview">
            <div className="payout-shell">
                <section className="payout-card">
                    <span>Next settlement</span>
                    <strong>Fri 09:00</strong>
                    <p>Three destination accounts ready for release.</p>
                </section>
                <div className="payout-timeline">
                    {['Queued', 'Verified', 'Released', 'Received'].map((step, index) => (
                        <span key={step} className={index < 3 ? 'done' : ''}>{step}</span>
                    ))}
                </div>
                <div className="payout-accounts">
                    <PreviewRow title="Operations wallet" meta="ZMW 9,200" status="Ready" />
                    <PreviewRow title="Partner bank" meta="ZMW 14,860" status="Queued" />
                </div>
            </div>
        </TemplateFrame>
    );
}

function SaasLaunchPreview({ template }) {
    return (
        <TemplateFrame template={template} className="saas-home-preview">
            <div className="saas-shell">
                <nav><strong>LaunchOS</strong><span>Demo</span><span>Pricing</span><button type="button">Start</button></nav>
                <section>
                    <div>
                        <p>Ship product work faster</p>
                        <h3>Plan, build, and measure software launches in one space.</h3>
                        <button type="button">Create workspace</button>
                    </div>
                    <aside>
                        <PreviewStat label="Launch Score" value="92" />
                        <MiniLine points={[28, 38, 62, 51, 80]} />
                    </aside>
                </section>
            </div>
        </TemplateFrame>
    );
}

function AgencySprintPreview({ template }) {
    return (
        <TemplateFrame template={template} className="agency-home-preview">
            <div className="agency-shell">
                <header>
                    <span>Studio sprint</span>
                    <h3>Brand, web, and product polish in focused build cycles.</h3>
                </header>
                <div className="agency-services">
                    {['Audit', 'Prototype', 'Launch'].map((item, index) => (
                        <article key={item}>
                            <small>0{index + 1}</small>
                            <strong>{item}</strong>
                        </article>
                    ))}
                </div>
                <aside>Next sprint opens Monday</aside>
            </div>
        </TemplateFrame>
    );
}

function MobileAppPreview({ template }) {
    return (
        <TemplateFrame template={template} className="mobile-app-preview">
            <div className="mobile-shell">
                <section>
                    <span>Pocket dashboard</span>
                    <h3>A mobile-first home page with lively product screens.</h3>
                    <div>
                        <SamplePill>Offline mode</SamplePill>
                        <SamplePill>Sync fast</SamplePill>
                    </div>
                </section>
                <aside className="phone-stack">
                    <div><strong>84%</strong><span>Daily focus</span></div>
                    <div><strong>12</strong><span>Tasks</span></div>
                </aside>
            </div>
        </TemplateFrame>
    );
}

function CreatorHubPreview({ template }) {
    return (
        <TemplateFrame template={template} className="creator-home-preview">
            <div className="creator-shell">
                <header>
                    <div className="creator-avatar">VL</div>
                    <div><span>Creator hub</span><h3>Publish, schedule, and measure content from one profile.</h3></div>
                </header>
                <section>
                    {['Posts', 'Revenue', 'Audience'].map((item, index) => (
                        <PreviewStat key={item} label={item} value={['18', '$4.8k', '24k'][index]} />
                    ))}
                </section>
                <div className="creator-mosaic"><span /><span /><span /><span /></div>
            </div>
        </TemplateFrame>
    );
}

function CommunityPortalPreview({ template }) {
    return (
        <TemplateFrame template={template} className="community-home-preview">
            <div className="community-shell">
                <section>
                    <strong>Community Pulse</strong>
                    <p>Events, member spotlights, and discussions shown as a living portal.</p>
                </section>
                <div className="community-calendar">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                        <span key={day} className={index === 2 ? 'active' : ''}>{day}</span>
                    ))}
                </div>
                <aside>
                    <PreviewRow title="Design circle" meta="32 members" status="Tonight" />
                    <PreviewRow title="Build review" meta="18 RSVPs" status="Fri" />
                </aside>
            </div>
        </TemplateFrame>
    );
}

function SupportContactPreview({ template }) {
    return (
        <TemplateFrame template={template} className="support-contact-preview">
            <div className="support-contact-shell">
                <section>
                    <h3>How can support help?</h3>
                    <div>
                        {['Bug', 'Account', 'Billing'].map((item) => <button key={item} type="button">{item}</button>)}
                    </div>
                </section>
                <form>
                    <span />
                    <span />
                    <span className="large" />
                    <button type="button">Open ticket</button>
                </form>
            </div>
        </TemplateFrame>
    );
}

function SalesContactPreview({ template }) {
    return (
        <TemplateFrame template={template} className="sales-contact-preview">
            <div className="sales-contact-shell">
                <aside>
                    <span>Lead score</span>
                    <strong>87</strong>
                    <p>Company size, urgency, and budget are summarized before handoff.</p>
                </aside>
                <section>
                    {['Company', 'Team size', 'Budget', 'Timeline'].map((field) => <i key={field}>{field}</i>)}
                    <button type="button">Book sales call</button>
                </section>
            </div>
        </TemplateFrame>
    );
}

function ProjectBriefPreview({ template }) {
    return (
        <TemplateFrame template={template} className="project-brief-preview">
            <div className="brief-shell">
                <header><h3>Project brief</h3><SamplePill>4 steps</SamplePill></header>
                <section>
                    {['Scope', 'Users', 'Timeline', 'Files'].map((item, index) => (
                        <article key={item} className={index === 0 ? 'active' : ''}>
                            <small>0{index + 1}</small>
                            <strong>{item}</strong>
                        </article>
                    ))}
                </section>
                <div className="brief-upload">Drop sketches or docs</div>
            </div>
        </TemplateFrame>
    );
}

function BookingContactPreview({ template }) {
    const [selectedDay, setSelectedDay] = useState(7);
    const slotMap = {
        3: ['08:00', 'Planning'],
        7: ['09:30', 'Discovery'],
        10: ['14:00', 'Demo'],
    };
    const activeSlot = slotMap[selectedDay] || ['11:00', 'Consultation'];

    return (
        <TemplateFrame template={template} className="booking-contact-preview">
            <div className="booking-shell">
                <section className="booking-calendar">
                    {Array.from({ length: 12 }, (_, index) => (
                        <button
                            key={index}
                            type="button"
                            className={selectedDay === index + 1 ? 'active' : ''}
                            onClick={() => setSelectedDay(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </section>
                <aside>
                    <strong>Available slots</strong>
                    <PreviewRow title={activeSlot[0]} meta={activeSlot[1]} status="Open" />
                    <PreviewRow title="16:30" meta="Follow-up" status="Open" />
                </aside>
            </div>
        </TemplateFrame>
    );
}

function MultiChannelContactPreview({ template }) {
    return (
        <TemplateFrame template={template} className="multi-contact-preview">
            <div className="multi-contact-shell">
                {['Email', 'Phone', 'Chat', 'Office'].map((channel, index) => (
                    <article key={channel} className={index === 3 ? 'wide' : ''}>
                        <span>{channel}</span>
                        <strong>{['hello@site.io', '+260 700 000', '2m avg', 'Ndola'][index]}</strong>
                    </article>
                ))}
            </div>
        </TemplateFrame>
    );
}

function StudioAboutPreview({ template }) {
    return (
        <TemplateFrame template={template} className="studio-about-preview">
            <div className="studio-about-shell">
                <section>
                    <span>Studio story</span>
                    <h3>Small team, clear craft, measurable software outcomes.</h3>
                </section>
                <aside>
                    <PreviewStat label="Projects" value="32" />
                    <PreviewStat label="Repeat clients" value="71%" />
                </aside>
                <div>{['Useful', 'Reliable', 'Calm'].map((item) => <SamplePill key={item}>{item}</SamplePill>)}</div>
            </div>
        </TemplateFrame>
    );
}

function TeamAboutPreview({ template }) {
    return (
        <TemplateFrame template={template} className="team-about-preview">
            <div className="team-about-shell">
                {['Product Lead', 'Engineer', 'Designer'].map((role, index) => (
                    <article key={role}>
                        <div>{['PL', 'SE', 'UX'][index]}</div>
                        <strong>{role}</strong>
                        <span>{['Strategy', 'Systems', 'Interfaces'][index]}</span>
                    </article>
                ))}
                <section>Principles before process.</section>
            </div>
        </TemplateFrame>
    );
}

function ProcessAboutPreview({ template }) {
    return (
        <TemplateFrame template={template} className="process-about-preview">
            <div className="process-about-shell">
                <header><h3>Discovery to delivery</h3></header>
                {['Discover', 'Prototype', 'Build', 'Verify'].map((step, index) => (
                    <article key={step}>
                        <small>0{index + 1}</small>
                        <strong>{step}</strong>
                        <span />
                    </article>
                ))}
            </div>
        </TemplateFrame>
    );
}

function ValuesAboutPreview({ template }) {
    return (
        <TemplateFrame template={template} className="values-about-preview">
            <div className="values-about-shell">
                <aside>
                    <span>Operating values</span>
                    <h3>Decisions that keep the work useful.</h3>
                </aside>
                <section>
                    {['Clarity', 'Care', 'Evidence', 'Momentum'].map((value) => <article key={value}>{value}</article>)}
                </section>
            </div>
        </TemplateFrame>
    );
}

function MilestonesAboutPreview({ template }) {
    return (
        <TemplateFrame template={template} className="milestones-about-preview">
            <div className="milestones-shell">
                <header><h3>Milestones</h3><SamplePill>Timeline</SamplePill></header>
                <section>
                    {['2019', '2022', '2024', '2026'].map((year, index) => (
                        <article key={year} className={index === 3 ? 'active' : ''}>
                            <strong>{year}</strong>
                            <span>{['Foundation', 'Client work', 'Systems', 'Library'][index]}</span>
                        </article>
                    ))}
                </section>
            </div>
        </TemplateFrame>
    );
}

function FallbackTemplatePreview({ template }) {
    return (
        <TemplateFrame template={template} className="fallback-preview">
            <div className="team-board-preview">
                {['Ready', 'In progress', 'Review'].map((lane) => (
                    <section key={lane}>
                        <h3>{lane}</h3>
                        <article>{template.title}</article>
                        <article>{template.kicker} notes</article>
                    </section>
                ))}
            </div>
        </TemplateFrame>
    );
}

function PreviewStat({ label, value }) {
    return (
        <article>
            <span>{label}</span>
            <strong>{value}</strong>
        </article>
    );
}

function PreviewRow({ title, meta, status }) {
    return (
        <div className="preview-row">
            <strong>{title}</strong>
            {meta && <span>{meta}</span>}
            <em>{status}</em>
        </div>
    );
}

function ComponentDoc({ item }) {
    return (
        <article className="component-doc reveal">
            <header>
                <h2>{item.title}</h2>
            </header>
            <div className="component-split">
                <div className="component-preview">
                    <ComponentPreview item={item} />
                </div>
                <CodeBlock code={item.code} id={`component-${item.title}`} small />
            </div>
        </article>
    );
}

function ComponentPreview({ item }) {
    const style = { '--component-accent': item.accent };
    const key = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const [activeIndex, setActiveIndex] = useState(0);
    const [pressed, setPressed] = useState(false);
    const [fieldValue, setFieldValue] = useState('Client portal redesign');

    switch (key) {
        case 'glow-cta-button':
            return (
                <div className="kit-preview component-action-card component-glow-showcase" style={style}>
                    <div>
                        <span>Launch campaign</span>
                        <strong>{pressed ? 'Workspace created' : 'Ready to publish'}</strong>
                        <p>Hero CTA with hover lift, click feedback, and a polished conversion context.</p>
                    </div>
                    <button type="button" className={pressed ? 'active' : ''} onClick={() => setPressed((value) => !value)}>
                        <Stars size={18} weight="Bold" />
                        {pressed ? 'Launched' : 'Start building'}
                        <ArrowRight size={18} weight="Bold" />
                    </button>
                </div>
            );
        case 'split-action-button':
            return (
                <div className="kit-preview component-action-card component-deploy-showcase" style={style}>
                    <header>
                        <span>Production deploy</span>
                        <strong>Template package</strong>
                    </header>
                    <div className="component-split-action">
                        <button type="button" onClick={() => setPressed(true)}>{pressed ? 'Deploying...' : 'Deploy template'}</button>
                        <button type="button" aria-label="Open actions" onClick={() => setPressed((value) => !value)}><AltArrowDown size={18} weight="Bold" /></button>
                    </div>
                    {pressed && <div className="component-menu-pop"><span>Preview build</span><span>Schedule deploy</span><span>Rollback</span></div>}
                </div>
            );
        case 'soft-pill-button':
            return (
                <div className="kit-preview component-action-card component-pill-showcase" style={style}>
                    <strong>Draft controls</strong>
                    <button className="component-soft-pill" type="button" onClick={() => setPressed((value) => !value)}>
                        <span />
                        {pressed ? 'Draft saved' : 'Save draft'}
                    </button>
                    <small>Quiet product action with friendly motion.</small>
                </div>
            );
        case 'danger-confirm-button':
            return (
                <div className="kit-preview component-danger-confirm" style={style}>
                    <span>Danger zone</span>
                    <strong>{pressed ? 'Deletion armed' : 'Delete record?'}</strong>
                    <p>This pattern slows destructive work down with visible intent.</p>
                    <button type="button" onClick={() => setPressed((value) => !value)}>{pressed ? 'Cancel' : 'Confirm delete'}</button>
                </div>
            );
        case 'quiet-ghost-button':
            return (
                <div className="kit-preview component-action-card component-code-showcase" style={style}>
                    <div className="code-lines"><span /><span /><span /></div>
                    <button className="component-quiet-ghost" type="button" onClick={() => setPressed((value) => !value)}>
                        <Code size={18} weight="Bold" />
                        {pressed ? 'Source open' : 'View source'}
                    </button>
                </div>
            );
        case 'floating-label-input':
            return (
                <label className="kit-preview component-floating-input" style={style}>
                    <span>Project name</span>
                    <input value={fieldValue} onChange={(event) => setFieldValue(event.target.value)} />
                    <small>{fieldValue.length} characters captured in state.</small>
                </label>
            );
        case 'search-command-input':
            return (
                <div className="kit-preview component-command-input" style={style}>
                    <CodeSquare size={19} weight="Bold" />
                    <input value={fieldValue} onChange={(event) => setFieldValue(event.target.value)} aria-label="Search components" />
                    <em>Ctrl K</em>
                </div>
            );
        case 'amount-input':
            return (
                <div className="kit-preview component-amount-input" style={style}>
                    <span>ZMW</span>
                    <strong>12,450.00</strong>
                    <small>Available</small>
                </div>
            );
        case 'date-range-input':
            return (
                <div className="kit-preview component-date-input" style={style}>
                    <CalendarMark size={22} weight="Bold" />
                    <span>Aug 12</span>
                    <i />
                    <span>Aug 28</span>
                </div>
            );
        case 'upload-dropzone':
            return (
                <button className={`kit-preview component-upload-zone ${pressed ? 'active' : ''}`} type="button" style={style} onClick={() => setPressed((value) => !value)}>
                    <Download size={26} weight="Bold" />
                    <strong>{pressed ? '3 files staged' : 'Drop files here'}</strong>
                    <span>PDF, PNG, DOCX up to 20MB</span>
                </button>
            );
        case 'metric-stack-card':
            return (
                <article className="kit-preview component-metric-stack" style={style}>
                    <span>Conversion</span>
                    <strong>64.8%</strong>
                    <MiniBars values={[42, 56, 48, 72, 64]} />
                    <p>+9.2% this week</p>
                </article>
            );
        case 'revenue-spark-card':
            return (
                <article className="kit-preview component-revenue-spark" style={style}>
                    <span>Revenue</span>
                    <strong>$48.2k</strong>
                    <MiniLine points={[22, 38, 30, 52, 49, 74]} />
                </article>
            );
        case 'status-summary-card':
            return (
                <article className="kit-preview component-status-summary" style={style}>
                    {['Healthy', 'Risk', 'Review'].map((label, index) => (
                        <div key={label}>
                            <span>{label}</span>
                            <strong>{[18, 4, 9][index]}</strong>
                        </div>
                    ))}
                </article>
            );
        case 'progress-ring-card':
            return (
                <article className="kit-preview component-progress-ring" style={style}>
                    <div><strong>78%</strong></div>
                    <span>Profile complete</span>
                </article>
            );
        case 'comparison-card':
            return (
                <article className="kit-preview component-comparison-card" style={style}>
                    <div><span>Before</span><strong>38%</strong></div>
                    <ArrowRight size={20} weight="Bold" />
                    <div><span>After</span><strong>71%</strong></div>
                </article>
            );
        case 'command-tabs':
            return (
                <div className="kit-preview component-command-tabs" style={style}>
                    {['Preview', 'Code', 'Settings'].map((label, index) => (
                        <button key={label} type="button" className={activeIndex === index ? 'active' : ''} onClick={() => setActiveIndex(index)}>{label}</button>
                    ))}
                </div>
            );
        case 'sidebar-rail':
            return (
                <aside className="kit-preview component-sidebar-rail" style={style}>
                    {[Monitor, ChartSquare, Folder, Database].map((Icon, index) => (
                        <button key={index} type="button" className={activeIndex === index ? 'active' : ''} onClick={() => setActiveIndex(index)}>
                            <Icon size={18} weight="Bold" />
                        </button>
                    ))}
                </aside>
            );
        case 'breadcrumb-strip':
            return (
                <div className="kit-preview component-breadcrumb-strip" style={style}>
                    {['Portfolio', 'Projects', 'Dashboard'].map((label, index) => (
                        <span key={label} className={index === 2 ? 'active' : ''}>{label}</span>
                    ))}
                </div>
            );
        case 'step-navigation':
            return (
                <div className="kit-preview component-step-nav" style={style}>
                    {['Brief', 'Design', 'Build', 'Launch'].map((label, index) => (
                        <button key={label} type="button" className={index <= activeIndex ? 'done' : ''} onClick={() => setActiveIndex(index)}>{index + 1}<strong>{label}</strong></button>
                    ))}
                </div>
            );
        case 'top-app-bar':
            return (
                <header className="kit-preview component-top-app-bar" style={style}>
                    <strong>Atlas</strong>
                    <nav><span>Live</span><span>Reports</span></nav>
                    <button type="button">VL</button>
                </header>
            );
        case 'success-toast':
            return (
                <button className={`kit-preview component-success-toast ${pressed ? 'dismissed' : ''}`} type="button" style={style} onClick={() => setPressed((value) => !value)}>
                    <CheckCircle size={24} weight="Bold" />
                    <div><strong>{pressed ? 'Dismissed' : 'Saved'}</strong><span>{pressed ? 'Click again to restore.' : 'Your changes are live.'}</span></div>
                </button>
            );
        case 'warning-banner':
            return (
                <div className="kit-preview component-warning-banner" style={style}>
                    <strong>Review required</strong>
                    <span>Three records need attention before export.</span>
                    <button type="button" onClick={() => setPressed((value) => !value)}>{pressed ? 'Reviewing' : 'Review'}</button>
                </div>
            );
        case 'empty-state-panel':
            return (
                <div className="kit-preview component-empty-panel" style={style}>
                    <Folder size={32} weight="Bold" />
                    <strong>{pressed ? 'Template created' : 'No templates yet'}</strong>
                    <button type="button" onClick={() => setPressed((value) => !value)}>{pressed ? 'Undo' : 'Create one'}</button>
                </div>
            );
        case 'loading-skeleton':
            return (
                <div className="kit-preview component-loading-skeleton" style={style}>
                    <span />
                    <i />
                    <i />
                    <i className="short" />
                </div>
            );
        case 'error-recovery-card':
            return (
                <div className="kit-preview component-error-card" style={style}>
                    <CloseSquare size={24} weight="Bold" />
                    <div><strong>{pressed ? 'Reconnected' : 'Sync failed'}</strong><span>{pressed ? 'Connection restored.' : 'Reconnect and try again.'}</span></div>
                    <button type="button" onClick={() => setPressed((value) => !value)}>{pressed ? 'Done' : 'Retry'}</button>
                </div>
            );
        default:
            return (
                <button className="kit-preview kit-button" type="button" style={style}>
                    <span>{item.title}</span>
                    <ArrowRight size={18} weight="Bold" />
                </button>
            );
    }
}

function CodeBlock({ code, id, small = false }) {
    const [copied, setCopied] = useState(false);

    const copyCode = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1400);
        } catch {
            setCopied(false);
        }
    };

    return (
        <div className={`code-card ${small ? 'small' : ''}`}>
            <div className="code-card-top">
                <span>{id}.jsx</span>
                <button type="button" onClick={copyCode} aria-label={`Copy ${id} code`}>
                    {copied ? <CheckCircle size={17} weight="Bold" /> : <Copy size={17} weight="Bold" />}
                </button>
            </div>
            <pre><code>{code}</code></pre>
        </div>
    );
}

function BuildMethodSection() {
    return (
        <section className="section-pad">
            <div className="container-max method-layout compact-method">
                <div className="method-intro reveal">
                    <p className="eyebrow">How I Build</p>
                    <h2>Workflows, data, and handoffs guide the system.</h2>
                    <p>
                        I keep the process direct: understand the real task, model the data, build the surface, then
                        connect the application logic carefully.
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
                title="Tell me what you want to build, improve, or launch."
                copy="I am open to management systems, dashboard builds, workflow tools, Laravel-backed applications, React frontends, and full-stack collaboration."
            />
            <section className="section-pad">
                <div className="container-max frame-card inner reveal">
                    <div className="contact-layout">
                        <div>
                            <p className="eyebrow">Direct Lines</p>
                            <h2>Let's start with a clear message.</h2>
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
        <article className="project-detail image-card reveal" style={{ ...cardBackgroundStyle(project.image), ...staggerStyle(index) }}>
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
