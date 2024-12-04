<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class TranslationController extends Controller
{

    public function translate(Request $request)
    {
        $request->validate([
            'text' => 'required|string',
            'source' => 'required|string|size:2', // ISO 639-1 kod jezika (npr. 'en', 'fr')
            'target' => 'required|string|size:2', // isto i ovde
        ]);

        $url = "https://lingva.ml/api/v1/" . $request->input('source') . "/" . $request->input('target') . "/" . urlencode($request->input('text'));

        $response = Http::get($url);

        if ($response->successful()) {
            $translatedText = str_replace('+', ' ', $response->json()['translation']);
        
            return response()->json([
                'translated_text' => $translatedText,
            ]);
        }

        return response()->json([
            'error' => 'Translation failed. Please try again later.',
        ], $response->status());
    }
}
