<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\LessonResource;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LessonController extends Controller
{
    /**
     * Prikaz svih lekcija
     */
    public function index()
    {
        $lessons = Lesson::with('jezik', 'audioFajlovi')->get();
        return LessonResource::collection($lessons);
    }

    /**
     * Prikaz jedne lekcije
     */
    public function show($id)
    {
        $lesson = Lesson::with('jezik', 'audioFajlovi')->findOrFail($id);
        return new LessonResource($lesson);
    }

    /**
     * Kreiranje nove lekcije
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'naziv' => 'required|string|max:255',
            'tekst' => 'nullable|string',
            'predjena' => 'required|boolean',
            'language_id' => 'required|exists:languages,id',
            'slike' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $lesson = Lesson::create($request->all());

        return response()->json([
            'message' => 'Lesson created successfully.',
            'lesson' => new LessonResource($lesson),
        ], 201);
    }

    /**
     * Ažuriranje postojeće lekcije
     */
    public function update(Request $request, $id)
    {
        $lesson = Lesson::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'naziv' => 'required|string|max:255',
            'tekst' => 'nullable|string',
            'predjena' => 'required|boolean',
            'language_id' => 'required|exists:languages,id',
            'slike' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $lesson->update($request->all());

        return response()->json([
            'message' => 'Lesson updated successfully.',
            'lesson' => new LessonResource($lesson),
        ]);
    }

    /**
     * Brisanje lekcije
     */
    public function destroy($id)
    {
        $lesson = Lesson::findOrFail($id);
        $lesson->delete();

        return response()->json(['message' => 'Lesson deleted successfully.']);
    }
}

