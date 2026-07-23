<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PortfolioController extends Controller
{
    public function index()
    {
        return view('portfolio');
    }

    public function work()
    {
        return view('portfolio');
    }

    public function projects()
    {
        return view('portfolio');
    }

    public function capabilities()
    {
        return view('portfolio');
    }

    public function experience()
    {
        return view('portfolio');
    }

    public function templates()
    {
        return view('portfolio');
    }

    public function components()
    {
        return view('portfolio');
    }

    public function contactPage()
    {
        return view('portfolio');
    }

    public function cv()
    {
        $path = base_path('VINCENT LUHANGA-CV.pdf');

        abort_unless(file_exists($path), 404);

        return response()->download($path, 'Vincent-Luhanga-CV.pdf');
    }

    public function contact(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'message' => 'required|string',
        ]);

        \Log::info('Contact message received', $data);

        return redirect()->route('contact')->with('status', 'Thanks, your message was sent.');
    }
}
