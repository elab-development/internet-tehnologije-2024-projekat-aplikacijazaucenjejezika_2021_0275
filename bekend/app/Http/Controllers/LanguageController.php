<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\LanguageResource;
use App\Models\Language;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class LanguageController extends Controller
{
    
    // Prikaz jezika za trenutnog korisnika
    public function index()
    {
        $user = Auth::user();

        // Keš ključ specifičan za korisnika
        $cacheKey = 'user_languages_' . $user->id;

        // Dohvati jezike iz keša ili iz baze ako nisu u kešu
        $languages = Cache::remember($cacheKey, 60 * 30, function () use ($user) {
            return DB::table('user_language')
                ->join('languages', 'user_language.language_id', '=', 'languages.id')
                ->where('user_language.user_id', $user->id)
                ->select('languages.id', 'languages.naziv', 'languages.skraceni_naziv')
                ->get();
        });

        return response()->json($languages);
    }

    public function addLanguage(Request $request)
    {
        $user = Auth::user();

        // Proverite da li korisnik ima ulogu profesora
        if ($user->role !== 'profesor') {
            return response()->json([
                'message' => 'Nemate dozvolu za dodavanje jezika.',
            ], 403);
        }

        $validated = $request->all(); // Uklonite validaciju samo za test

        // Kreiranje novog jezika
        $language = DB::table('languages')->insertGetId([
            'naziv' => $validated['naziv'],
            'skraceni_naziv' => $validated['skraceni_naziv'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Povezivanje jezika sa profesorom u pivot tabeli
        DB::table('user_language')->insert([
            'user_id' => $user->id,
            'language_id' => $language,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Brisanje keša ako ga koristite
        $cacheKey = 'user_languages_' . $user->id;
        Cache::forget($cacheKey);

        // Vraćanje odgovora
        return response()->json([
            'message' => 'Jezik uspešno dodat i povezan sa profesorom.',
            'language' => [
                'id' => $language,
                'naziv' => $validated['naziv'],
                'skraceni_naziv' => $validated['skraceni_naziv'],
            ],
        ]);
    }

    /**
     * Prikaz jednog jezika.
     */
    public function show($id)
    {
        $language = Language::findOrFail($id);
        return new LanguageResource($language);
    }

    /**
     * Kreiranje novog jezika.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'naziv' => 'required|string|max:255',
            'skraceni_naziv' => 'required|string|max:10',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $language = Language::create($request->all());

        $user = Auth::user();
        $cacheKey = 'user_languages_' . $user->id;
        Cache::forget($cacheKey);

        return response()->json([
            'message' => 'Language created successfully.',
            'language' => new LanguageResource($language),
        ], 201);
    }

    /**
     * Ažuriranje postojećeg jezika.
     */
    public function update(Request $request, $id)
    {
        $language = Language::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'naziv' => 'required|string|max:255',
            'skraceni_naziv' => 'required|string|max:10',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $language->update($request->all());

        $user = Auth::user();
        $cacheKey = 'user_languages_' . $user->id;
        Cache::forget($cacheKey);

        return response()->json([
            'message' => 'Language updated successfully.',
            'language' => new LanguageResource($language),
        ]);
    }

    /**
     * Brisanje jezika.
     */
    public function destroy($id)
    {
        $language = Language::findOrFail($id);
        $language->delete();

        $user = Auth::user();
        $cacheKey = 'user_languages_' . $user->id;
        Cache::forget($cacheKey);

        return response()->json(['message' => 'Language deleted successfully.']);
    }
}
