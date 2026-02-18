<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PortfolioController extends Controller
{
    public function index()
    {
        return view('portfolio');
    }

    public function contact(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'message' => 'required|string',
        ]);

        // Temporary handling: log the message. Replace with Mail/DB as needed.
        \Log::info('Contact message received', $data);

        return back()->with('status', 'Thanks — your message was sent.');
    }
}
