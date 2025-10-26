<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MedicalReport;
use App\Models\MedicalAnalysis;
use Smalot\PdfParser\Parser;
use Illuminate\Support\Facades\Storage;

class PdfAnalysisController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:pdf|max:10240' // Max 10MB
        ]);

        $file = $request->file('file');
        $filename = time() . '_' . $file->getClientOriginalName();
        $filePath = $file->storeAs('medical_reports', $filename, 'public');

        // Extraer texto del PDF
        $parser = new Parser();
        $pdf = $parser->parseFile($file->getPathname());
        $text = $pdf->getText();

        // Procesar la información del paciente
        $patientInfo = $this->extractPatientInfo($text);
        
        // Procesar la tabla de análisis
        $analysisData = $this->extractAnalysisData($text);

        // Guardar en la base de datos
        $report = MedicalReport::create([
            'patient_name' => $patientInfo['name'] ?? 'No especificado',
            'patient_gender' => $patientInfo['gender'] ?? null,
            'patient_age' => $patientInfo['age'] ?? null,
            'completion_type' => $patientInfo['completion'] ?? null,
            'analysis_date' => $patientInfo['date'] ?? now(),
            'original_filename' => $file->getClientOriginalName(),
            'file_path' => $filePath,
            'extracted_text' => $text,
            'analysis_data' => $analysisData
        ]);

        // Guardar cada análisis individual
        foreach ($analysisData as $analysis) {
            if (isset($analysis['system']) && isset($analysis['analyzed_object'])) {
                MedicalAnalysis::create([
                    'medical_report_id' => $report->id,
                    'system' => $analysis['system'],
                    'analyzed_object' => $analysis['analyzed_object'],
                    'normal_range' => $analysis['normal_range'] ?? null,
                    'obtained_value' => $analysis['obtained_value'] ?? null,
                    'expert_advice' => $analysis['expert_advice'] ?? null,
                    'status' => $this->determineStatus($analysis)
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'report_id' => $report->id,
            'patient_info' => $patientInfo,
            'analysis_count' => count($analysisData),
            'message' => 'PDF procesado exitosamente'
        ]);
    }

    private function extractPatientInfo($text)
    {
        $info = [];
        
        // Extraer nombre - múltiples patrones
        if (preg_match('/Nombre:\s*([^\n\r:]+?)(?:\s+Sexo:|$)/i', $text, $matches)) {
            $info['name'] = trim($matches[1]);
        } elseif (preg_match('/Nombre:\s*([^\n\r]+)/i', $text, $matches)) {
            $info['name'] = trim($matches[1]);
        }
        
        // Extraer sexo - múltiples patrones
        if (preg_match('/Sexo:\s*([^\n\r:]+?)(?:\s+Edad:|$)/i', $text, $matches)) {
            $info['gender'] = trim($matches[1]);
        } elseif (preg_match('/Sexo:\s*(Masculino|Femenino|M|F)/i', $text, $matches)) {
            $info['gender'] = trim($matches[1]);
        }
        
        // Extraer edad - múltiples patrones
        if (preg_match('/Edad:\s*(\d+)/i', $text, $matches)) {
            $info['age'] = intval($matches[1]);
        }
        
        // Extraer tipo de completado/complexión
        if (preg_match('/Complexi[oó]n:\s*([^\n\r]+)/i', $text, $matches)) {
            $info['completion'] = trim($matches[1]);
        } elseif (preg_match('/Completaci[oó]n:\s*([^\n\r]+)/i', $text, $matches)) {
            $info['completion'] = trim($matches[1]);
        }
        
        // Extraer fecha y hora del análisis - múltiples formatos
        if (preg_match('/Fecha y Hora del Análisis:\s*([^\n\r]+)/i', $text, $matches)) {
            $dateStr = trim($matches[1]);
            try {
                // Intentar diferentes formatos de fecha
                if (preg_match('/(\d{4})\/(\d{2})\/(\d{2})\s+(\d{2}):(\d{2})/', $dateStr, $dateMatches)) {
                    $info['date'] = \Carbon\Carbon::create($dateMatches[1], $dateMatches[2], $dateMatches[3], $dateMatches[4], $dateMatches[5]);
                } else {
                    $info['date'] = \Carbon\Carbon::createFromFormat('Y/m/d H:i', $dateStr);
                }
            } catch (\Exception $e) {
                $info['date'] = now();
            }
        }
        
        // Limpieza adicional de datos extraídos
        if (isset($info['name'])) {
            // Remover datos extra que puedan haber sido capturados
            $info['name'] = preg_replace('/\s*(Sexo|Edad|Complexión):.*$/i', '', $info['name']);
            $info['name'] = trim($info['name']);
        }
        
        if (isset($info['gender'])) {
            $info['gender'] = preg_replace('/\s*(Edad|Complexión):.*$/i', '', $info['gender']);
            $info['gender'] = trim($info['gender']);
        }
        
        return $info;
    }

    private function extractAnalysisData($text)
    {
        $analysisData = [];
        
        // Buscar secciones que contengan "problemas de salud" o análisis
        $lines = explode("\n", $text);
        $currentSystem = 'General';
        $inAnalysisSection = false;

        foreach ($lines as $line) {
            $line = trim($line);
            
            if (empty($line)) continue;
            
            // Detectar inicio de sección de análisis
            if (preg_match('/(Acerca de los problemas|problemas de salud|tendencias|Análisis|Sistema)/i', $line)) {
                $inAnalysisSection = true;
                $currentSystem = $line;
                continue;
            }
            
            // Detectar sistemas principales de análisis médico
            if (preg_match('/^(Cardiovascular|Nervio Central|Densidad Mineral|Enfermedad|Oligoelementos|Piel|Sistema|Vitamina|Aminoácidos|Ojo|Metales|Alergias|Coenzimas|Meridianos|Inmunidad|Función|Ácido|Respiratorio|Digestivo|Endocrino|Músculo|Esquelético|Neurológico|Hematológico)/i', $line)) {
                $currentSystem = $line;
                $inAnalysisSection = true;
                continue;
            }
            
            // Si estamos en una sección de análisis, intentar extraer datos
            if ($inAnalysisSection) {
                // Patrón para líneas con datos separados por espacios o tabulaciones
                // Formato típico: "Objeto_analizado    Rango_normal    Valor_obtenido    Consejo_experto"
                if (preg_match('/^([A-Za-zÀ-ÿ\s\(\)\/\-\.]+?)\s{2,}([\d.,\s\-]+)\s{2,}([\d.,]+)\s{2,}(.+)$/', $line, $matches)) {
                    if (count($matches) >= 5) {
                        $analysisData[] = [
                            'system' => $currentSystem,
                            'analyzed_object' => trim($matches[1]),
                            'normal_range' => trim($matches[2]),
                            'obtained_value' => trim($matches[3]),
                            'expert_advice' => trim($matches[4])
                        ];
                    }
                }
                // Patrón alternativo para separadores |
                elseif (preg_match('/([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)/', $line, $matches)) {
                    if (count($matches) >= 5) {
                        $analysisData[] = [
                            'system' => $currentSystem,
                            'analyzed_object' => trim($matches[1]),
                            'normal_range' => trim($matches[2]),
                            'obtained_value' => trim($matches[3]),
                            'expert_advice' => trim($matches[4])
                        ];
                    }
                }
                // Patrón para líneas simples con al menos un objeto y valor
                elseif (preg_match('/^([A-Za-zÀ-ÿ\s\(\)\/\-\.]+?)\s+([\d.,]+)/', $line, $matches)) {
                    if (strlen(trim($matches[1])) > 3) { // Evitar coincidencias muy cortas
                        $analysisData[] = [
                            'system' => $currentSystem,
                            'analyzed_object' => trim($matches[1]),
                            'normal_range' => 'No especificado',
                            'obtained_value' => trim($matches[2]),
                            'expert_advice' => 'Consultar con especialista'
                        ];
                    }
                }
            }
        }

        // Si no se encontraron datos estructurados, intentar extracción más flexible
        if (empty($analysisData)) {
            // Buscar cualquier línea que contenga números y texto
            foreach ($lines as $line) {
                if (preg_match('/([A-Za-zÀ-ÿ\s]+).*?([\d.,]+)/', $line, $matches)) {
                    $object = trim($matches[1]);
                    $value = trim($matches[2]);
                    
                    if (strlen($object) > 5 && is_numeric(str_replace(',', '.', $value))) {
                        $analysisData[] = [
                            'system' => 'Análisis General',
                            'analyzed_object' => $object,
                            'normal_range' => 'Por determinar',
                            'obtained_value' => $value,
                            'expert_advice' => 'Requiere evaluación médica'
                        ];
                    }
                }
            }
        }

        return $analysisData;
    }

    private function determineStatus($analysis)
    {
        // Lógica para determinar el estado basado en rangos normales
        if (!isset($analysis['normal_range']) || !isset($analysis['obtained_value'])) {
            return 'normal';
        }

        $normalRange = $analysis['normal_range'];
        $obtainedValue = floatval(str_replace(',', '.', $analysis['obtained_value']));

        // Extraer rango mínimo y máximo
        if (preg_match('/([\d.,]+)\s*-\s*([\d.,]+)/', $normalRange, $matches)) {
            $min = floatval(str_replace(',', '.', $matches[1]));
            $max = floatval(str_replace(',', '.', $matches[2]));

            if ($obtainedValue < $min || $obtainedValue > $max) {
                // Determinar si es crítico (muy fuera del rango)
                $deviation = max(abs($obtainedValue - $min) / $min, abs($obtainedValue - $max) / $max);
                return $deviation > 0.5 ? 'critical' : 'abnormal';
            }
        }

        return 'normal';
    }

    public function index()
    {
        try {
            $reports = MedicalReport::with('medicalAnalysis')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $reports,
                'count' => $reports->count(),
                'message' => $reports->count() > 0 ? 'Reportes cargados exitosamente' : 'No se encontraron reportes médicos'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cargar reportes: ' . $e->getMessage(),
                'data' => []
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $report = MedicalReport::with('medicalAnalysis')->findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $report,
                'message' => 'Reporte cargado exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cargar el reporte: ' . $e->getMessage(),
                'data' => null
            ], 404);
        }
    }
}
