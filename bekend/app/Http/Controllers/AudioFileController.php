<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\AudioFileResource;
use App\Models\AudioFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AudioFileController extends Controller
{
    /**
     * Prikaz svih audio fajlova.
     */
    public function index()
    {
        $audioFiles = AudioFile::with('lekcija')->get();
        return AudioFileResource::collection($audioFiles);
    }

    /**
     * Prikaz jednog audio fajla.
     */
    public function show($id)
    {
        $audioFile = AudioFile::with('lekcija')->findOrFail($id);
        return new AudioFileResource($audioFile);
    }

    /**
     * Kreiranje novog audio fajla.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'naziv' => 'required|string|max:255',
            'putanja' => 'required|string|max:255',
            'lesson_id' => 'required|exists:lessons,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $audioFile = AudioFile::create($request->all());

        return response()->json([
            'message' => 'Audio file created successfully.',
            'audio_file' => new AudioFileResource($audioFile),
        ], 201);
    }

    /**
     * Ažuriranje postojećeg audio fajla.
     */
    public function update(Request $request, $id)
    {
        $audioFile = AudioFile::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'naziv' => 'required|string|max:255',
            'putanja' => 'required|string|max:255',
            'lesson_id' => 'required|exists:lessons,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $audioFile->update($request->all());

        return response()->json([
            'message' => 'Audio file updated successfully.',
            'audio_file' => new AudioFileResource($audioFile),
        ]);
    }

    /**
     * Brisanje audio fajla.
     */
    public function destroy($id)
    {
        $audioFile = AudioFile::findOrFail($id);
        $audioFile->delete();

        return response()->json(['message' => 'Audio file deleted successfully.']);
    }
}
