<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DodavanjeSpoljnogKljučaUAudioFiles extends Migration
{
    public function up()
    {
        Schema::table('audio_files', function (Blueprint $table) {
            $table->foreignId('lesson_id')->constrained('lessons')->onDelete('cascade'); 
        });
    }
    
    public function down()
    {
        Schema::table('audio_files', function (Blueprint $table) {
            $table->dropForeign(['lesson_id']);
        });
    }
}
