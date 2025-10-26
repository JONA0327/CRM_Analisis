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
        Schema::create('medical_analysis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('medical_report_id')->constrained()->onDelete('cascade');
            $table->string('system'); // Sistema (ej: Cardiovascular y Cerebrovascular)
            $table->string('analyzed_object'); // Objeto Analizado
            $table->string('normal_range')->nullable(); // Rango Normal
            $table->string('obtained_value'); // Valor Obtenido
            $table->text('expert_advice')->nullable(); // Consejos de Experto
            $table->enum('status', ['normal', 'abnormal', 'critical'])->default('normal');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_analysis');
    }
};
