<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MedicalAnalysis extends Model
{
    protected $table = 'medical_analysis';

    protected $fillable = [
        'medical_report_id',
        'system',
        'analyzed_object',
        'normal_range',
        'obtained_value',
        'expert_advice',
        'status'
    ];

    public function medicalReport(): BelongsTo
    {
        return $this->belongsTo(MedicalReport::class);
    }
}
