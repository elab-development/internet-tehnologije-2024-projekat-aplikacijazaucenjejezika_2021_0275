<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\LessonResource;
use App\Models\Lesson;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LessonController extends Controller
{
    public function index(Request $request)
    {
        $query = Lesson::query();
    
        if ($request->has('naziv')) {
            $query->where('naziv', 'like', '%' . $request->naziv . '%'); 
        }
    
        if ($request->has('language_id')) {
            $query->where('language_id', $request->language_id); 
        }
    
        if ($request->has('predjena')) {
            $query->where('predjena', filter_var($request->predjena, FILTER_VALIDATE_BOOLEAN)); 
        }
    
        $lessons = $query->paginate($request->get('per_page', 10)); 
    
        return response()->json($lessons);
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
            'predjena' => 'boolean',
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
            'predjena' => 'boolean',
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

    public function uploadFile(Request $request, $lessonId)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png,gif,pdf,doc,docx|max:2048', // Maksimalna veličina: 2MB
        ]);

        $lesson = \App\Models\Lesson::findOrFail($lessonId);

        $path = $request->file('file')->store('uploads/lessons/' . $lesson->id, 'public');

        $lesson->files()->create([
            'name' => $request->file('file')->getClientOriginalName(),
            'path' => $path,
        ]);

        return response()->json([
            'message' => 'File uploaded successfully',
            'path' => $path,
        ]);
    }

    public function exportToPDF($lessonId)
    {
        $lesson = \App\Models\Lesson::findOrFail($lessonId);

        $pdf = Pdf::loadView('pdf.lesson', compact('lesson'));

        return $pdf->download('lesson-' . $lesson->id . '.pdf');
    }
}

