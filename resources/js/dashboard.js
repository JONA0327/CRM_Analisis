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
                handleFileUpload(file);
            }
        });
    }
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

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    const styles = {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        background: type === 'success' ? '#10B981' : '#DC2626',
        color: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        zIndex: '10000',
        animation: 'slideInRight 0.3s ease-out',
        maxWidth: '400px',
        fontSize: '0.95rem',
        fontWeight: '600'
    };

    Object.assign(notification.style, styles);
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
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
