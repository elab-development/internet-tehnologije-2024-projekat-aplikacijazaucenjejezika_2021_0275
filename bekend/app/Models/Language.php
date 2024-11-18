<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Language extends Model
{
    use HasFactory;

    protected $fillable = [
        'naziv',
        'skraceni_naziv',
    ];

    /**
     * Relacija sa modelom `Lesson`
     */
    public function lekcije()
    {
        return $this->hasMany(Lesson::class, 'language_id');
    }
}
