<?php

namespace App\Http\Controllers;

use App\Models\UserLanguage;
use Illuminate\Http\Request;

class UserLanguageController extends Controller
{
    /**
     * Prikazuje sve korisničke jezike.
     */
    public function index()
    {
        $userLanguages = UserLanguage::with(['user', 'language'])->get();
        return response()->json($userLanguages);
    }

    /**
     * Čuva novi unos.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'language_id' => 'required|exists:languages,id',
            'level' => 'required|string|max:10',
        ]);

        $userLanguage = UserLanguage::create($validated);
        return response()->json($userLanguage, 201);
    }

    /**
     * Prikazuje određeni unos.
     */
    public function show($id)
    {
        $userLanguage = UserLanguage::with(['user', 'language'])->findOrFail($id);
        return response()->json($userLanguage);
    }

    /**
     * Briše određeni unos.
     */
    public function destroy($id)
    {
        $userLanguage = UserLanguage::findOrFail($id);
        $userLanguage->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
