<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AudioFile extends Model
{
    use HasFactory;

    protected $fillable = [
        'naziv',
        'putanja',
        'lesson_id',
    ];

    /**
     * Relacija sa modelom `Lesson`
     */
    public function lekcija()
    {
        return $this->belongsTo(Lesson::class, 'lesson_id');
    }
}
