<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('medical_reports', function (Blueprint $table) {
            $table->id();
            $table->string('patient_name');
            $table->string('patient_gender')->nullable();
            $table->integer('patient_age')->nullable();
            $table->string('completion_type')->nullable();
            $table->datetime('analysis_date')->nullable();
            $table->string('original_filename');
            $table->string('file_path');
            $table->text('extracted_text')->nullable();
            $table->json('analysis_data')->nullable(); // Para guardar los datos de la tabla de análisis
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_reports');
    }
};
