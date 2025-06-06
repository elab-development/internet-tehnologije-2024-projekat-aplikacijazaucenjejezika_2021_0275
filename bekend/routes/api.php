<?php

use App\Http\Controllers\AudioFileController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\TranslationController;
use App\Http\Controllers\UserLanguageController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;
use App\Mail\TestMail;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/users', [AuthController::class, 'index'])->middleware('role:admin');
    Route::patch('/users/{user}/role', [AuthController::class, 'updateRole'])->middleware('role:admin');
    Route::get('/professors', [AuthController::class, 'allProfessors']);

});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/forgot-password', [AuthController::class, 'sendResetLinkEmail']);

Route::get('/reset-password/{token}', function ($token) {
    return view('reset-password', ['token' => $token]);
})->name('password.reset');

Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->get('/students', function (Request $request) {
    if ($request->user()->role === 'user') {
        return response()->json(['message' => 'Forbidden'], 403);
    }

    $students = User::where('role', 'user')->get();
    return response()->json($students);
});

Route::get('/lessons/{id}', [LessonController::class, 'show'])->middleware('auth:sanctum');
Route::get('/lessons', [LessonController::class, 'index'])->middleware('auth:sanctum');

Route::middleware(['auth:sanctum', 'role:admin,profesor'])->group(function () {
    Route::post('/lessons', [LessonController::class, 'store']);
    Route::put('/lessons/{id}', [LessonController::class, 'update']);
    Route::delete('/lessons/{id}', [LessonController::class, 'destroy']);
    Route::post('/lessons/enroll', [LessonController::class, 'enrollUser'])->middleware('role:profesor');
    Route::post('/lessons/{lessonId}/upload', [LessonController::class, 'uploadFile']);
    Route::post('/lessons/{lessonId}/audio', [AudioFileController::class, 'store']);
    Route::get('/lessons/{lessonId}/export-pdf', [LessonController::class, 'exportToPDF']);
});

Route::middleware(['auth:sanctum', 'role:admin,user,profesor'])->group(function () {
    Route::get('/languages', [LanguageController::class, 'index']);
    Route::get('/allLanguages', [LanguageController::class, 'allLanguages']);
    Route::get('/languages/{id}', [LanguageController::class, 'show']);
    Route::get('/students-per-language', [LanguageController::class, 'studentsPerLanguage']);
    Route::post('/languages/add', [LanguageController::class, 'addLanguage']);
    Route::post('/languages', [LanguageController::class, 'store']);
    Route::put('/languages/{id}', [LanguageController::class, 'update']);
    Route::delete('/languages/{id}', [LanguageController::class, 'destroy']);
});

Route::get('user-languages', [UserLanguageController::class, 'index']);
Route::post('user-languages', [UserLanguageController::class, 'store']);
Route::get('user-languages/{id}', [UserLanguageController::class, 'show']);
Route::delete('user-languages/{id}', [UserLanguageController::class, 'destroy']);

Route::middleware('auth:sanctum')->group(function () {
    Route::resource('audio-files', AudioFileController::class);
});

Route::post('/translate', [TranslationController::class, 'translate']);


