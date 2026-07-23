<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="description" content="Portfolio web application for Vincent Luhanga, focused on React, Laravel, responsive dashboards, database-backed systems, and professional software delivery.">
        <title>Vincent Luhanga - Portfolio</title>

        <script>
            window.portfolioConfig = {
                csrfToken: @json(csrf_token()),
                cvUrl: @json(route('cv')),
                contactAction: @json(route('contact.submit')),
                flashStatus: @json(session('status')),
                old: @json(old()),
                errors: @json($errors->toArray()),
                assets: {
                    cover: @json(asset('cover.jpg')),
                    image: @json(asset('image.jpg')),
                    professional: @json(asset('2024-05-13 190155.jpg')),
                    profile: @json(asset('profile-2024-01-09-195208.jpg')),
                },
            };
        </script>

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    </head>
    <body>
        <div id="portfolio-root"></div>
    </body>
</html>
