<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class LanguageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'naziv' => $this->faker->languageCode,
            'skraceni_naziv' => strtoupper($this->faker->lexify('??')),
        ];
    }
}
