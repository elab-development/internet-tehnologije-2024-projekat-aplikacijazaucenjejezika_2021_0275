<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLessonsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->string('naziv');
            $table->text('tekst')->nullable(); 
            $table->boolean('predjena')->default(false); // Oznaka da li je lekcija pređena
            $table->foreignId('language_id')->constrained('languages')->onDelete('cascade'); // ID jezika
            $table->json('slike')->nullable(); // Niz slika u JSON formatu
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('lessons');
    }
}
