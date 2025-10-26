<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/css/dashboard.css', 'resources/js/app.js', 'resources/js/dashboard.js'])
    </head>
    <body class="dashboard-body">
        <div class="overlay"></div>

        <div class="dashboard-container">
            <aside class="sidebar">
                <div class="sidebar-header">
                    <div class="sidebar-logo">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                        </svg>
                    </div>
                    <h1 class="sidebar-title">MediSys</h1>
                </div>

                <nav class="sidebar-nav">
                    <a href="#" class="nav-item active" data-section="expedientes">
                        <span class="nav-icon">📋</span>
                        <span class="nav-text">Expedientes</span>
                    </a>
                    <a href="#" class="nav-item" data-section="pacientes">
                        <span class="nav-icon">👥</span>
                        <span class="nav-text">Pacientes</span>
                    </a>
                    <a href="#" class="nav-item" data-section="productos">
                        <span class="nav-icon">📦</span>
                        <span class="nav-text">Productos</span>
                    </a>
                </nav>

                <div class="sidebar-footer">
                    <div class="user-profile">
                        <div class="user-avatar">
                            {{ strtoupper(substr(Auth::user()->name, 0, 1)) }}
                        </div>
                        <div class="user-info">
                            <p class="user-name">{{ Auth::user()->name }}</p>
                            <p class="user-role">Administrador</p>
                        </div>
                    </div>
                    <form method="POST" action="{{ route('logout') }}" style="margin-top: 1rem;">
                        @csrf
                        <button type="submit" class="logout-btn" style="width: 100%; justify-content: center;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                <polyline points="16 17 21 12 16 7"/>
                                <line x1="21" y1="12" x2="9" y2="12"/>
                            </svg>
                            <span>Cerrar Sesión</span>
                        </button>
                    </form>
                </div>
            </aside>

            <main class="main-content">
                <div class="topbar">
                    <div class="topbar-left">
                        <button class="menu-toggle">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="3" y1="12" x2="21" y2="12"/>
                                <line x1="3" y1="6" x2="21" y2="6"/>
                                <line x1="3" y1="18" x2="21" y2="18"/>
                            </svg>
                        </button>
                        <h2 class="topbar-title">Dashboard</h2>
                    </div>
                    <div class="topbar-actions">
                        <button class="btn-upload">
                            <span class="upload-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                    <polyline points="17 8 12 3 7 8"/>
                                    <line x1="12" y1="3" x2="12" y2="15"/>
                                </svg>
                            </span>
                            <span>Cargar Archivo</span>
                        </button>
                        <input type="file" id="file-input" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png">
                    </div>
                </div>

                <div class="content-area">
                    {{ $slot }}
                </div>
            </main>
        </div>
    </body>
</html>
