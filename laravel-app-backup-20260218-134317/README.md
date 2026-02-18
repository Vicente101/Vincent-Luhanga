Setup (local) — quick steps

1. Install PHP & Composer, Node.js & npm
2. From `laravel-app` run:
   - `composer install`
   - `cp .env.example .env` and set app config
   - `php artisan key:generate`
   - `npm install`
   - `npm run dev`
   - `php artisan serve`

What I added
- `routes/web.php` + `app/Http/Controllers/PortfolioController.php`
- `resources/views/custom.blade.php` (your view updated to use Vite)
- Vite + Tailwind config: `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `resources/css/app.css`, `resources/js/app.js`

Notes
- After you run `composer install` the app will be a full Laravel project.
- I left a simple contact handler (logs the message). Replace with Mail/DB as needed.
