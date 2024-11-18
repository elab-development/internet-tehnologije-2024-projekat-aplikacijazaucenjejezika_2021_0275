<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'naziv',
        'tekst',
        'predjena',
        'language_id',
        'slike',
    ];

    protected $casts = [
        'predjena' => 'boolean',
        'slike' => 'array', // Automatski dekodira JSON u array
    ];

    /**
     * Relacija sa modelom `Language` (Jezik).
     */
    public function jezik()
    {
        return $this->belongsTo(Language::class, 'language_id');
    }

    /**
     * Relacija sa modelom `AudioFile` (Audio fajlovi).
     */
    public function audioFajlovi()
    {
        return $this->hasMany(AudioFile::class, 'lesson_id');
    }
}
