<x-app-layout>
    <div class="medical-dashboard">
        <div class="dashboard-header">
            <div class="header-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 12l2 2 4-4"/>
                    <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                    <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                    <path d="M3 21h18l-9-9-9 9z"/>
                </svg>
            </div>
            <h1>📋 Informe Médico Procesado</h1>
        </div>

        <div id="patient-info-section" class="patient-info-section" style="display: none;">
            <div class="section-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                </svg>
                <h3>👤 Información del Paciente</h3>
            </div>
            <div id="patient-details" class="patient-details">
                <!-- Se llenará dinámicamente -->
            </div>
        </div>

        <div class="dashboard-stats">
            <div class="stat-card success">
                <div class="stat-number" id="processed-analyses">0</div>
                <div class="stat-label">Análisis Procesados</div>
                <div class="stat-icon">✅</div>
            </div>
            <div class="stat-card primary">
                <div class="stat-number" id="report-id">1</div>
                <div class="stat-label">ID del Reporte</div>
                <div class="stat-icon">📄</div>
            </div>
        </div>

        <div class="action-buttons">
            <button class="btn-primary" onclick="loadMedicalReports()">Ver Reporte Completo</button>
            <button class="btn-secondary" onclick="loadMedicalReports()">Ver Todos los Expedientes</button>
        </div>

        <div id="medical-reports-section" class="medical-reports-section">
            <div class="loading-indicator" id="loading-indicator" style="display: none;">
                <div class="medical-spinner"></div>
                <p>Procesando análisis médico...</p>
            </div>
            
            <div id="reports-content" class="reports-content">
                <!-- El contenido se cargará dinámicamente aquí -->
            </div>
        </div>
    </div>
</x-app-layout>
