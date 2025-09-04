<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\LessonResource;
use App\Models\Lesson;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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

    public function enrollUser(Request $request)
    {
        $user = Auth::user();

        // Proveri da li je trenutni korisnik profesor
        if ($user->role !== 'profesor') {
            return response()->json(['message' => 'Nemate dozvolu za upis učenika.'], 403);
        }

        // Validacija unosa
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'language_id' => 'required|exists:languages,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $student = User::find($request->user_id);

        // Proveri da li korisnik ima ulogu "user"
        if ($student->role !== 'user') {
            return response()->json(['message' => 'Samo učenici sa rolom "user" mogu biti upisani.'], 403);
        }

        // Proveri da li je korisnik već upisan na kurs
        $exists = DB::table('user_language')
            ->where('user_id', $request->user_id)
            ->where('language_id', $request->language_id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Korisnik je već upisan na ovaj kurs.'], 409);
        }

        // Upisivanje korisnika na kurs
        DB::table('user_language')->insert([
            'user_id' => $request->user_id,
            'language_id' => $request->language_id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Korisnik je uspešno upisan na kurs.'], 201);
    }
}

