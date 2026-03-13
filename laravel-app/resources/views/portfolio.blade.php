<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Portfolio of Vincent Luhanga — front-end developer building accessible, performant web experiences with Tailwind CSS and Laravel." />
        <title>Portfolio</title>

        <script src="https://cdn.tailwindcss.com"></script>
        <!-- Alpine.js for interactive components -->
        <script src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js" defer></script>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@300;400;600;700&display=swap" rel="stylesheet">
        
        <style>
            :root {
                --font-sans: 'Barlow Semi Condensed', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
                --accent: #06b6d4; /* teal-400 */
                --muted: #6b7280; /* gray-500 */
            }

            body {
                font-family: var(--font-sans);
            }

            .container-max {
                max-width: 1100px;
                margin-left: auto;
                margin-right: auto;
                padding-left: 1rem;
                padding-right: 1rem;
            }

            .card-shadow {
                box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
            }

            .accent-btn {
                background: linear-gradient(90deg, var(--accent), #0ea5a3);
            }

            .project-img {
                height: 160px;
                object-fit: cover;
                width: 100%;
            }
        </style>
    </head>
    <body class="min-h-screen bg-white text-gray-900">
        <header class="bg-white shadow relative">
            <div class="py-4 flex items-center justify-between p-4 md:p-3 lg:px-9">
                <a href="/" class="text-xl font-semibold">Vincent <span class="text-teal-500">Luhanga</span></a>

                <!-- mobile hamburger -->
                <button id="nav-toggle" aria-controls="mobile-menu" aria-expanded="false" class="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-300">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <span class="sr-only">Open menu</span>
                </button>

                <!-- desktop nav -->
                <nav class="hidden md:flex space-x-4 text-md md:text-sm text-gray-600 py-3" aria-label="Primary">
                    <a href="#projects" class="relative inline-block px-6 py-2 font-semibold text-white bg-teal-500 rounded-sm border border-gray-600 overflow-hidden group">
                        <span class="relative z-10 transition-transform duration-300 group-hover:translate-x-2">Projects</span>
                        <span class="absolute inset-0 bg-teal-600 transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0"></span>
                    </a>
                    <a href="#about" class="relative inline-block px-6 py-2 font-semibold text-white bg-teal-500 rounded-sm border border-gray-600 overflow-hidden group">
                        <span class="relative z-10 transition-transform duration-300 group-hover:translate-x-2">About</span>
                        <span class="absolute inset-0 bg-teal-600 transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0"></span>
                    </a>
                    <a href="#contact" class="relative inline-block px-6 py-2 font-semibold text-white bg-teal-500 rounded-sm border border-gray-600 overflow-hidden group">
                        <span class="relative z-10 transition-transform duration-300 group-hover:translate-x-2">Contact</span>
                        <span class="absolute inset-0 bg-teal-600 transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0"></span>
                    </a>
                </nav>
            </div>

            <!-- mobile menu -->
            <div id="mobile-menu" class="md:hidden hidden absolute top-full left-0 right-0 z-50 border-t border-gray-100 bg-white shadow-lg">
                <div class="px-4 py-4 space-y-2">
                    <a href="#projects" class="block px-4 py-2 rounded font-semibold text-gray-700 hover:bg-gray-50">Projects</a>
                    <a href="#about" class="block px-4 py-2 rounded font-semibold text-gray-700 hover:bg-gray-50">About</a>
                    <a href="#contact" class="block px-4 py-2 rounded font-semibold text-gray-700 hover:bg-gray-50">Contact</a>
                </div>
            </div>
        </header>

        <main class="p-6 sm:p-12">
            <!-- Hero -->
            <section id="hero" class="grid md:grid-cols-2 gap-8 items-center mb-12 p-6 sm:p-12 bg-gray-100 bg-cover bg-top rounded card-shadow min-h-[28rem] md:min-h-[36rem]">
                <div data-animate="hero-text" class="transition-all duration-700 ease-out opacity-0 translate-y-6">
                    <h1 data-animate-item class="text-4xl md:text-5xl font-bold mb-4 opacity-0 translate-y-4">Hi, I'm <span class="text-teal-500">Vincent Luhanga</span></h1>
                    <p data-animate-item class="text-gray-700 mb-6 opacity-0 translate-y-4">I'm a front-end developer focused on building accessible, performant, and beautiful web experiences using modern tools like Tailwind CSS and Laravel.</p>
                    <div class="flex gap-3" data-animate-item>
                        <a href="#projects" class="px-5 py-3 rounded text-white accent-btn card-shadow transform hover:scale-105 transition">See my work</a>
                        <a href="#contact" class="px-5 py-3 rounded border border-gray-200 text-gray-700 hover:bg-gray-50 transform hover:scale-105 transition">Get in touch</a>
                    </div>
                </div>
                @php
                    // cover.jpg (face) is always first, image.jpg second
                    $slideCandidates = ['cover.jpg', 'image.jpg'];
                    $slides = [];
                    foreach ($slideCandidates as $s) {
                        $path = public_path($s);
                        clearstatcache(true, $path); // force PHP to re-read disk, ignoring cached stat
                        if (file_exists($path)) {
                            $slides[] = asset($s) . '?v=' . filemtime($path);
                        }
                    }
                @endphp

                <div class="relative rounded card-shadow overflow-hidden" style="height: 480px;" data-animate="hero-media">
                    @if(count($slides) > 0)
                        <div class="relative w-full h-full">
                            @foreach($slides as $i => $src)
                                <img src="{{ $src }}"
                                     data-slide-index="{{ $i }}"
                                     class="slide absolute inset-0 w-full h-full object-cover {{ $i === 0 ? 'object-top' : 'object-center' }}"
                                     style="opacity: {{ $i === 0 ? '1' : '0' }}; transition: opacity 1s ease-in-out;"
                                     alt="Slide {{ $i + 1 }}" />
                            @endforeach
                        </div>
                    @else
                        <img src="{{ asset('cover.jpg') }}" alt="Preview" class="w-full h-full object-cover" />
                    @endif
                </div>
            </section>

            <!-- Projects -->
            <section id="projects" class="mb-12">
                <h2 class="text-2xl font-semibold mb-6">Selected Projects</h2>
                <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <article class="bg-white rounded overflow-hidden card-shadow">
                        <img src="https://placehold.co/400x160/06b6d4/ffffff?text=Project+One" alt="Project One" class="project-img" />
                        <div class="p-4">
                            <h3 class="font-semibold">Project One</h3>
                            <p class="text-sm text-gray-600 mt-2">A short description of this project and the technologies used.</p>
                            <div class="mt-3 flex items-center justify-between text-sm">
                                <span class="text-teal-500 font-medium">Live</span>
                                <div class="space-x-2 flex items-center">
                                    <a href="#" class="text-gray-500 hover:text-gray-800">Demo</a>
                                    <a href="#" class="text-gray-500 hover:text-gray-800">Code</a>
                                </div>
                            </div>
                        </div>
                    </article>
                    
                    <article class="bg-white rounded overflow-hidden card-shadow">
                        <img src="https://placehold.co/400x160/0ea5a3/ffffff?text=Project+Two" alt="Project Two" class="project-img" />
                        <div class="p-4">
                            <h3 class="font-semibold">Project Two</h3>
                            <p class="text-sm text-gray-600 mt-2">Description of project two. Focus on impact and tools.</p>
                            <div class="mt-3 flex items-center justify-between text-sm">
                                <span class="text-gray-500">Archived</span>
                                <div class="space-x-2 flex items-center">
                                    <a href="#" class="text-gray-500 hover:text-gray-800">Demo</a>
                                    <a href="#" class="text-gray-500 hover:text-gray-800">Code</a>
                                </div>
                            </div>
                        </div>
                    </article>
                    
                    <article class="bg-white rounded overflow-hidden card-shadow">
                        <img src="https://placehold.co/400x160/14b8a6/ffffff?text=Project+Three" alt="Project Three" class="project-img" />
                        <div class="p-4">
                            <h3 class="font-semibold">Project Three</h3>
                            <p class="text-sm text-gray-600 mt-2">A quick note about this project and the challenge solved.</p>
                            <div class="mt-3 flex items-center justify-between text-sm">
                                <span class="text-teal-500 font-medium">Open</span>
                                <div class="space-x-2 flex items-center">
                                    <a href="#" class="text-gray-500 hover:text-gray-800">Demo</a>
                                    <a href="#" class="text-gray-500 hover:text-gray-800">Code</a>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </section>

            <!-- About -->
            <section id="about" class="mb-12 bg-white p-6 rounded card-shadow">
                <h2 class="text-2xl font-semibold mb-4">About Me</h2>
                <p class="text-gray-700">I'm a developer who enjoys turning ideas into delightful interfaces. I focus on writing maintainable code, creating accessible experiences, and shipping quality products.</p>
            </section>

            <!-- Contact -->
            <section id="contact" class="mb-24">
                <div class="bg-white p-6 rounded card-shadow">
                    <h2 class="text-2xl font-semibold mb-4">Contact</h2>
                    <p class="text-gray-600 mb-4">Want to work together? Send a message and I'll get back to you.</p>
                    @if(session('status'))
                        <p class="mb-4 p-3 rounded bg-teal-50 border border-teal-200 text-teal-700 font-medium">{{ session('status') }}</p>
                    @endif

                    <!-- Credentials dropdown (placed inside Contact section) -->
                    <div class="mb-4">
                        <x-credential-dropdown />
                    </div>

                    <form action="{{ route('contact') }}" method="POST" class="grid sm:grid-cols-2 gap-4" x-data="{ dropdownOpen: true }" x-init="window.addEventListener('credential-dropdown:toggle', e => dropdownOpen = e.detail.isOpen)">
                        @csrf
  
                        <div class="sm:col-span-2">
                            <label for="contact-message" class="sr-only">Message</label>
                            <textarea id="contact-message" name="message" placeholder="Message" required class="w-full border rounded @error('message') border-red-400 @enderror" style="height:12rem; transition:height 250ms ease; padding:0.75rem; overflow:auto;" :style="dropdownOpen ? 'height:6.5rem; transition:height 250ms ease; padding:0.75rem; overflow:auto;' : 'height:12rem; transition:height 250ms ease; padding:0.75rem; overflow:auto;'">{{ old('message') }}</textarea>
                            @error('message')<p class="mt-1 text-sm text-red-600">{{ $message }}</p>@enderror
                        </div>
                        <div class="sm:col-span-2">
                            <button type="submit" class="px-5 py-3 rounded text-white accent-btn card-shadow transform hover:scale-105 transition">Send message</button>
                        </div>
                    </form>
                </div>
            </section>
        </main>

        <footer class="py-6 bg-white">
            <div class="container-max text-center text-sm text-gray-500">© {{ date('Y') }} Vincent Luhanga — Built with Laravel & Tailwind</div>
        </footer>

        <script>
        (function(){
            function onReady(fn){ if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

            onReady(function(){
                // --- mobile nav toggle (accessible)
                var navToggle = document.getElementById('nav-toggle');
                var mobileMenu = document.getElementById('mobile-menu');
                if (navToggle && mobileMenu) {
                    navToggle.addEventListener('click', function(){
                        var expanded = navToggle.getAttribute('aria-expanded') === 'true';
                        navToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
                        mobileMenu.classList.toggle('hidden');
                        if (!expanded) {
                            var first = mobileMenu.querySelector('a');
                            if (first) first.focus();
                            mobileMenu.querySelectorAll('a').forEach(function(el,i){ el.classList.add('opacity-0','translate-y-2'); setTimeout(function(){ el.classList.remove('opacity-0','translate-y-2'); }, i * 80); });
                        }
                    });
                    document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) { mobileMenu.classList.add('hidden'); navToggle.setAttribute('aria-expanded','false'); navToggle.focus(); } });
                    document.addEventListener('click', function(e){ if (!mobileMenu.contains(e.target) && !navToggle.contains(e.target) && !mobileMenu.classList.contains('hidden')) { mobileMenu.classList.add('hidden'); navToggle.setAttribute('aria-expanded','false'); } });
                }

                // --- Slideshow (runs immediately, no scroll dependency)
                var mediaContainer = document.querySelector('[data-animate="hero-media"]');
                var slides = mediaContainer ? Array.from(mediaContainer.querySelectorAll('.slide')) : [];

                if (slides.length > 1) {
                    var activeIdx = 0;
                    var INTERVAL = 5000;
                    var timer = null;

                    // Ensure clean initial state
                    slides.forEach(function(el, idx) {
                        el.style.transition = 'opacity 1s ease-in-out';
                        el.style.opacity = idx === 0 ? '1' : '0';
                    });

                    function goTo(newIdx) {
                        slides[activeIdx].style.opacity = '0';
                        activeIdx = (newIdx + slides.length) % slides.length;
                        slides[activeIdx].style.opacity = '1';
                    }

                    function play() {
                        clearInterval(timer);
                        timer = setInterval(function() { goTo(activeIdx + 1); }, INTERVAL);
                    }

                    function pause() { clearInterval(timer); }

                    play();

                    // Pause on hover (desktop) and touch (mobile)
                    mediaContainer.addEventListener('mouseenter', pause);
                    mediaContainer.addEventListener('mouseleave', play);
                    mediaContainer.addEventListener('touchstart', function() { pause(); setTimeout(play, 3000); }, { passive: true });
                }

                // --- Hero text animation (IntersectionObserver for scroll reveal)
                var hero = document.getElementById('hero');
                if (!hero) return;

                var io = new IntersectionObserver(function(entries, obs){
                    entries.forEach(function(entry){
                        if (!entry.isIntersecting) return;
                        var text = hero.querySelector('[data-animate="hero-text"]');
                        if (text) {
                            text.classList.remove('opacity-0','translate-y-6');
                            text.classList.add('opacity-100','translate-y-0');
                            text.querySelectorAll('[data-animate-item]').forEach(function(el, i){
                                setTimeout(function(){ el.classList.remove('opacity-0','translate-y-4'); el.classList.add('opacity-100','translate-y-0'); }, i * 120);
                            });
                        }
                        obs.unobserve(entry.target);
                    });
                }, { threshold: 0.1 });

                io.observe(hero);
            });
        })();
        </script>
    </body>
</html>