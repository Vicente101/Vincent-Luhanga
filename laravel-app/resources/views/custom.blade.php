<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Portfolio</title>

        <script src="https://cdn.tailwindcss.com"></script>
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
    <body class="min-h-screen bg-gray-100 text-gray-900">
        <header class="bg-white shadow">
            <div class="py-4 flex items-center justify-between p-12 sm:justify-between">
                <a href="/" class="text-xl font-semibold">Vincent Luhanga</a>
                <nav class="space-x-4 text-sm text-gray-600 py-3">
                    <a href="#projects" class="hover:text-gray-900 font-bold hover:text-teal-500">Projects</a>
                    <a href="#about" class="hover:text-gray-900 font-bold hover:text-teal-500">About</a>
                    <a href="#contact" class="hover:text-gray-900 font-bold hover:text-teal-500">Contact</a>
                </nav>
            </div>
        </header>

        <main class="p-12 sm:p-3">
            <!-- Hero -->
            <section class="grid md:grid-cols-2 gap-8 items-center mb-12 p-12 sm:p-3">
                <div>
                    <h1 class="text-4xl md:text-5xl font-bold mb-4">Hi, I'm <span class="text-teal-500">Vincent Luhanga</span></h1>
                    <p class="text-gray-700 mb-6">I'm a front-end developer focused on building accessible, performant, and beautiful web experiences using modern tools like Tailwind CSS and Laravel.</p>
                    <div class="flex gap-3">
                        <a href="#projects" class="px-5 py-3 rounded text-white accent-btn card-shadow">See my work</a>
                        <a href="#contact" class="px-5 py-3 rounded border border-gray-200 text-gray-700 hover:bg-gray-50">Get in touch</a>
                    </div>
                </div>
                <div class="p-6 bg-white rounded card-shadow">
                    <img src="https://via.placeholder.com/600x360.png?text=Project+Preview" alt="Preview" class="rounded w-full project-img">
                </div>
            </section>

            <!-- Projects -->
            <section id="projects" class="mb-12">
                <h2 class="text-2xl font-semibold mb-6">Selected Projects</h2>
                <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <article class="bg-white rounded overflow-hidden card-shadow">
                        <img src="https://via.placeholder.com/400x160/06b6d4/ffffff?text=Project+One" alt="Project One" class="project-img" />
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
                        <img src="https://via.placeholder.com/400x160/0ea5a3/ffffff?text=Project+Two" alt="Project Two" class="project-img" />
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
                        <img src="https://via.placeholder.com/400x160/14b8a6/ffffff?text=Project+Three" alt="Project Three" class="project-img" />
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
                    <form action="/" method="POST" class="grid sm:grid-cols-2 gap-4">
                        <input type="text" name="name" placeholder="Your name" class="p-3 border rounded" />
                        <input type="email" name="email" placeholder="Email" class="p-3 border rounded" />
                        <textarea name="message" placeholder="Message" class="p-3 border rounded sm:col-span-2" rows="5"></textarea>
                        <div class="sm:col-span-2">
                            <button type="submit" class="px-4 py-2 rounded text-white accent-btn">Send message</button>
                        </div>
                    </form>
                </div>
            </section>
        </main>

        <footer class="py-6 bg-white">
            <div class="container-max text-center text-sm text-gray-500">© {{ date('Y') }} Vincent Luhanga — Built with Laravel & Tailwind</div>
        </footer>
    </body>
</html>
