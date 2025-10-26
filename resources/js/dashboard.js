document.addEventListener('DOMContentLoaded', function() {
    initSidebar();
    initFileUpload();
    initNavigation();
});

function initSidebar() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', function() {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        }
    });
}

function initFileUpload() {
    const uploadBtn = document.querySelector('.btn-upload');
    const fileInput = document.getElementById('file-input');

    if (uploadBtn && fileInput) {
        uploadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            fileInput.click();
        });

        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.type === 'application/pdf') {
                    handlePdfUpload(file);
                } else {
                    showNotification('Por favor selecciona un archivo PDF válido', 'error');
                }
            }
        });
    }
}

function handlePdfUpload(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('_token', document.querySelector('meta[name="csrf-token"]').getAttribute('content'));

    // Mostrar indicador de carga
    showLoadingIndicator('Procesando PDF médico...');

    fetch('/upload-pdf', {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }
    })
    .then(response => response.json())
    .then(data => {
        hideLoadingIndicator();
        
        if (data.success) {
            showNotification(
                `PDF procesado exitosamente. Paciente: ${data.patient_info.name || 'N/A'}. ${data.analysis_count} análisis encontrados.`,
                'success'
            );
            
            // Mostrar los datos extraídos
            displayMedicalReport(data);
            
            // Actualizar la tabla de expedientes
            loadMedicalReports();
        } else {
            showNotification('Error al procesar el PDF: ' + (data.message || 'Error desconocido'), 'error');
        }
    })
    .catch(error => {
        hideLoadingIndicator();
        console.error('Error:', error);
        showNotification('Error al subir el archivo: ' + error.message, 'error');
    });
}

function handleFileUpload(file) {
    const uploadBtn = document.querySelector('.btn-upload');
    const originalContent = uploadBtn.innerHTML;

    uploadBtn.innerHTML = `
        <div class="upload-icon">
            <svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" stroke-width="3" stroke-opacity="0.25"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke-width="3" stroke-linecap="round"/>
            </svg>
        </div>
        <span>Cargando...</span>
    `;
    uploadBtn.disabled = true;

    setTimeout(() => {
        showNotification(`Archivo "${file.name}" cargado exitosamente`, 'success');
        uploadBtn.innerHTML = originalContent;
        uploadBtn.disabled = false;
        document.getElementById('file-input').value = '';
    }, 2000);
}



function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const currentPath = window.location.pathname;

    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPath) {
            item.classList.add('active');
        }

        item.addEventListener('click', function(e) {
            if (this.getAttribute('data-section')) {
                e.preventDefault();
                const section = this.getAttribute('data-section');
                loadSection(section);

                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');

                if (window.innerWidth <= 768) {
                    document.querySelector('.sidebar').classList.remove('active');
                    document.querySelector('.overlay').classList.remove('active');
                }
            }
        });
    });
}

function loadSection(section) {
    const contentArea = document.querySelector('.content-area');
    const topbarTitle = document.querySelector('.topbar-title');

    const sections = {
        expedientes: {
            title: 'Expedientes',
            content: `
                <div class="welcome-section">
                    <div class="welcome-icon">📋</div>
                    <h2>Expedientes</h2>
                    <p>Gestiona y consulta los expedientes médicos de manera eficiente y segura.</p>
                </div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">📁</div>
                        <div class="stat-label">Total de Expedientes</div>
                        <div class="stat-value">0</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">📝</div>
                        <div class="stat-label">Nuevos este mes</div>
                        <div class="stat-value">0</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🔍</div>
                        <div class="stat-label">Actualizados</div>
                        <div class="stat-value">0</div>
                    </div>
                </div>
            `
        },
        pacientes: {
            title: 'Pacientes',
            content: `
                <div class="welcome-section">
                    <div class="welcome-icon">👥</div>
                    <h2>Pacientes</h2>
                    <p>Administra la información de tus pacientes de forma organizada.</p>
                </div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">👤</div>
                        <div class="stat-label">Total de Pacientes</div>
                        <div class="stat-value">0</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">➕</div>
                        <div class="stat-label">Nuevos este mes</div>
                        <div class="stat-value">0</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">✅</div>
                        <div class="stat-label">Activos</div>
                        <div class="stat-value">0</div>
                    </div>
                </div>
            `
        },
        productos: {
            title: 'Productos',
            content: `
                <div class="welcome-section">
                    <div class="welcome-icon">📦</div>
                    <h2>Productos</h2>
                    <p>Controla el inventario de productos médicos y suministros.</p>
                </div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">🏷️</div>
                        <div class="stat-label">Total de Productos</div>
                        <div class="stat-value">0</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">📊</div>
                        <div class="stat-label">En Stock</div>
                        <div class="stat-value">0</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">⚠️</div>
                        <div class="stat-label">Stock Bajo</div>
                        <div class="stat-value">0</div>
                    </div>
                </div>
            `
        }
    };

    if (sections[section]) {
        topbarTitle.textContent = sections[section].title;
        contentArea.innerHTML = sections[section].content;

        contentArea.style.opacity = '0';
        contentArea.style.transform = 'translateY(20px)';

        setTimeout(() => {
            contentArea.style.transition = 'all 0.3s ease';
            contentArea.style.opacity = '1';
            contentArea.style.transform = 'translateY(0)';
        }, 10);
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .animate-spin {
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

document.addEventListener('livewire:navigated', function() {
    initSidebar();
    initFileUpload();
    initNavigation();
});

// Funciones para el procesamiento de PDFs médicos
function showLoadingIndicator(message = 'Cargando...') {
    const existingLoader = document.querySelector('.medical-loader');
    if (existingLoader) {
        existingLoader.remove();
    }

    const loader = document.createElement('div');
    loader.className = 'medical-loader';
    loader.innerHTML = `
        <div class="loader-overlay">
            <div class="loader-content">
                <div class="medical-spinner">
                    <div class="pulse-ring"></div>
                    <div class="pulse-ring"></div>
                    <div class="pulse-ring"></div>
                </div>
                <p class="loader-text">${message}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(loader);
}

function hideLoadingIndicator() {
    const loader = document.querySelector('.medical-loader');
    if (loader) {
        loader.remove();
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `medical-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
            </div>
            <div class="notification-message">${message}</div>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

function displayMedicalReport(data) {
    const contentArea = document.querySelector('.content-area');
    if (!contentArea) return;

    const reportHtml = `
        <div class="medical-report-container">
            <div class="report-header">
                <h2>📋 Informe Médico Procesado</h2>
                <div class="patient-info-card">
                    <h3>👤 Información del Paciente</h3>
                    <div class="patient-details">
                        <div class="detail-item">
                            <strong>Nombre:</strong> ${data.patient_info.name || 'No especificado'}
                        </div>
                        <div class="detail-item">
                            <strong>Sexo:</strong> ${data.patient_info.gender || 'No especificado'}
                        </div>
                        <div class="detail-item">
                            <strong>Edad:</strong> ${data.patient_info.age || 'No especificado'}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="analysis-summary">
                <div class="summary-stats">
                    <div class="stat-card success">
                        <div class="stat-number">${data.analysis_count}</div>
                        <div class="stat-label">Análisis Procesados</div>
                    </div>
                    <div class="stat-card info">
                        <div class="stat-number">${data.report_id}</div>
                        <div class="stat-label">ID del Reporte</div>
                    </div>
                </div>
            </div>
            
            <div class="action-buttons">
                <button class="btn-primary" onclick="viewFullReport(${data.report_id})">
                    Ver Reporte Completo
                </button>
                <button class="btn-secondary" onclick="loadMedicalReports()">
                    Ver Todos los Expedientes
                </button>
            </div>
        </div>
    `;
    
    contentArea.innerHTML = reportHtml;
}

function loadMedicalReports() {
    showLoadingIndicator('Cargando expedientes médicos...');
    
    fetch('/medical-reports', {
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        hideLoadingIndicator();
        
        if (data.success) {
            displayMedicalReportsTable(data);
            showNotification(data.message, 'success');
        } else {
            showNotification(data.message || 'Error al cargar expedientes', 'error');
        }
    })
    .catch(error => {
        hideLoadingIndicator();
        console.error('Error:', error);
        showNotification('Error de conexión al cargar los expedientes', 'error');
    });
}

function displayMedicalReportsTable(data) {
    const contentArea = document.querySelector('.content-area');
    if (!contentArea) return;

    let tableRows = '';
    if (data.data && data.data.length > 0) {
        tableRows = data.data.map(report => `
            <tr class="table-row" onclick="viewFullReport(${report.id})">
                <td class="patient-cell">
                    <div class="patient-avatar">
                        ${report.patient_name.charAt(0).toUpperCase()}
                    </div>
                    <div class="patient-info">
                        <div class="patient-name">${report.patient_name}</div>
                        <div class="patient-meta">${report.patient_gender || 'N/A'} • ${report.patient_age || 'N/A'} años</div>
                    </div>
                </td>
                <td class="date-cell">
                    <div class="analysis-date">${new Date(report.analysis_date).toLocaleDateString()}</div>
                    <div class="upload-date">Subido: ${new Date(report.created_at).toLocaleDateString()}</div>
                </td>
                <td class="analysis-cell">
                    <div class="analysis-count">${report.medical_analysis_count || 0} análisis</div>
                </td>
                <td class="status-cell">
                    <span class="status-badge normal">Procesado</span>
                </td>
                <td class="actions-cell">
                    <button class="btn-view" onclick="event.stopPropagation(); viewFullReport(${report.id})">
                        👁️ Ver
                    </button>
                </td>
            </tr>
        `).join('');
    } else {
        tableRows = `
            <tr>
                <td colspan="5" class="empty-state">
                    <div class="empty-message">
                        <div class="empty-icon">📋</div>
                        <h3>No hay expedientes médicos</h3>
                        <p>Sube tu primer archivo PDF para comenzar</p>
                    </div>
                </td>
            </tr>
        `;
    }

    const tableHtml = `
        <div class="expedientes-container">
            <div class="expedientes-header">
                <h2>📋 Expedientes Médicos</h2>
                <div class="header-actions">
                    <button class="btn-upload" onclick="document.getElementById('file-input').click()">
                        📄 Subir PDF
                    </button>
                </div>
            </div>
            
            <div class="expedientes-table-container">
                <table class="expedientes-table">
                    <thead>
                        <tr>
                            <th>Paciente</th>
                            <th>Fecha de Análisis</th>
                            <th>Análisis</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    contentArea.innerHTML = tableHtml;
}

function viewFullReport(reportId) {
    showLoadingIndicator('Cargando reporte detallado...');
    
    fetch(`/medical-reports/${reportId}`, {
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        hideLoadingIndicator();
        
        if (data.success && data.data) {
            displayDetailedReport(data.data);
            showNotification(data.message, 'success');
        } else {
            showNotification(data.message || 'Error al cargar el reporte', 'error');
        }
    })
    .catch(error => {
        hideLoadingIndicator();
        console.error('Error:', error);
        showNotification('Error de conexión al cargar el reporte detallado', 'error');
    });
}

function displayDetailedReport(report) {
    const contentArea = document.querySelector('.content-area');
    if (!contentArea) return;

    const analysisRows = report.medical_analysis.map(analysis => `
        <tr class="analysis-row ${analysis.status}">
            <td class="system-cell">${analysis.system}</td>
            <td class="object-cell">${analysis.analyzed_object}</td>
            <td class="range-cell">${analysis.normal_range || 'N/A'}</td>
            <td class="value-cell">
                <span class="value-badge ${analysis.status}">${analysis.obtained_value || 'N/A'}</span>
            </td>
            <td class="advice-cell">${analysis.expert_advice || 'Sin consejos específicos'}</td>
            <td class="status-cell">
                <span class="status-indicator ${analysis.status}">
                    ${analysis.status === 'normal' ? '✅' : analysis.status === 'abnormal' ? '⚠️' : '🚨'}
                </span>
            </td>
        </tr>
    `).join('');

    const detailHtml = `
        <div class="detailed-report-container">
            <div class="report-header">
                <button class="btn-back" onclick="loadMedicalReports()">
                    ← Volver a Expedientes
                </button>
                <h2>📋 Reporte Médico Detallado</h2>
            </div>
            
            <div class="patient-summary-card">
                <div class="patient-header">
                    <div class="patient-avatar-large">
                        ${report.patient_name.charAt(0).toUpperCase()}
                    </div>
                    <div class="patient-details">
                        <h3>${report.patient_name}</h3>
                        <div class="patient-meta">
                            <span>👤 ${report.patient_gender || 'N/A'}</span>
                            <span>🎂 ${report.patient_age || 'N/A'} años</span>
                            <span>📅 ${new Date(report.analysis_date).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="analysis-table-container">
                <h3>🧪 Resultados de Análisis</h3>
                <table class="analysis-table">
                    <thead>
                        <tr>
                            <th>Sistema</th>
                            <th>Objeto Analizado</th>
                            <th>Rango Normal</th>
                            <th>Valor Obtenido</th>
                            <th>Consejos de Experto</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${analysisRows}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    contentArea.innerHTML = detailHtml;
}

// Exponer funciones al ámbito global para que sean accesibles desde onclick
window.loadMedicalReports = loadMedicalReports;
window.displayDetailedReport = displayDetailedReport;
window.handlePdfUpload = handlePdfUpload;
window.viewFullReport = viewFullReport;
