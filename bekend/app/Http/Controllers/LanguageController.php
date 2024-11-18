<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\LanguageResource;
use App\Models\Language;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LanguageController extends Controller
{
    /**
     * Prikaz svih jezika.
     */
    public function index()
    {
        $languages = Language::all();
        return LanguageResource::collection($languages);
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

        return response()->json(['message' => 'Language deleted successfully.']);
    }
}
