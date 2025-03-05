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
            'file' => 'required|file|mimes:mp3,wav,ogg|max:10240',
            'lesson_id' => 'required|exists:lessons,id',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
    
        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('audio_files', 'public');
    
            $audioFile = AudioFile::create([
                'naziv' => $request->naziv,
                'putanja' => $path,
                'lesson_id' => $request->lesson_id,
            ]);
    
            return response()->json([
                'message' => 'Audio file uploaded successfully.',
                'audio_file' => new AudioFileResource($audioFile),
            ], 201);
        }
    
        return response()->json(['message' => 'File upload failed.'], 500);
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
