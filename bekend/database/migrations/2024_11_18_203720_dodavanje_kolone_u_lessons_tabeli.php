<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DodavanjeKoloneULessonsTabeli extends Migration
{
    public function up()
    {
        Schema::table('lessons', function (Blueprint $table) {
            $table->string('tip_lekcije')->nullable()->after('tekst'); 
        });
    }
    
    public function down()
    {
        Schema::table('lessons', function (Blueprint $table) {
            $table->dropColumn('tip_lekcije'); 
        });
    }
}
