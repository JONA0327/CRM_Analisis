<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MedicalReport extends Model
{
    protected $fillable = [
        'patient_name',
        'patient_gender',
        'patient_age',
        'completion_type',
        'analysis_date',
        'original_filename',
        'file_path',
        'extracted_text',
        'analysis_data'
    ];

    protected $casts = [
        'analysis_date' => 'datetime',
        'analysis_data' => 'array'
    ];

    public function medicalAnalysis(): HasMany
    {
        return $this->hasMany(MedicalAnalysis::class);
    }
}
