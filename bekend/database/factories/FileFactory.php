<?php

namespace Database\Factories;

use App\Models\Lesson;
use Illuminate\Database\Eloquent\Factories\Factory;

class FileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->word . '.' . $this->faker->fileExtension,
            'path' => 'uploads/lessons/' . $this->faker->uuid . '.' . $this->faker->fileExtension,
            'lesson_id' => Lesson::factory(), 
        ];
    }
}
