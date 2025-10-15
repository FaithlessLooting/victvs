<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Locations table
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('country');
            $table->decimal('latitude', 10, 6);
            $table->decimal('longitude', 10, 6);
            $table->timestamps();
        });

        // Exams table
        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('status');
            $table->dateTime('datetime');
            $table->string('language');
            $table->foreignId('location_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });

        // Candidates table
        Schema::create('candidates', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        // Many to Many exams/candiates
        Schema::create('candidate_exam', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained()->cascadeOnDelete();
            $table->foreignId('candidate_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('candidate_exam');
        Schema::dropIfExists('candidates');
        Schema::dropIfExists('exams');
        Schema::dropIfExists('locations');
    }
};