<?php

namespace Database\Factories;

use App\Models\Language;
use Illuminate\Database\Eloquent\Factories\Factory;

class LessonFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'naziv' => $this->faker->sentence,
            'tekst' => $this->faker->paragraph,
            'predjena' => $this->faker->boolean,
            'language_id' => Language::factory(), 
            'slike' => json_encode([$this->faker->imageUrl(), $this->faker->imageUrl()]),
        ];
    }
}
