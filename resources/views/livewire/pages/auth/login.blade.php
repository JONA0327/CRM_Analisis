<?php

use App\Livewire\Forms\LoginForm;
use Illuminate\Support\Facades\Session;

use function Livewire\Volt\form;
use function Livewire\Volt\layout;

layout('layouts.guest');

form(LoginForm::class);

$login = function () {
    $this->validate();

    $this->form->authenticate();

    Session::regenerate();

    $this->redirectIntended(default: route('dashboard', absolute: false), navigate: true);
};

?>

<div>
    <div class="auth-header">
        <div class="auth-logo">
            <!-- Icono médico usando emoji -->
        </div>
        <h2 class="auth-title">Iniciar Sesión</h2>
        <p class="auth-subtitle">Bienvenido de vuelta, ingresa tus credenciales</p>
    </div>

    @if (session('status'))
        <div class="status-message">
            {{ session('status') }}
        </div>
    @endif

    <form wire:submit="login">
        <div class="form-group">
            <label for="email" class="form-label">Correo Electrónico</label>
            <input wire:model="form.email" id="email" class="form-input" type="email" name="email" required autofocus autocomplete="username" placeholder="tu@email.com" />
            @error('form.email')
                <span class="error-message">{{ $message }}</span>
            @enderror
        </div>

        <div class="form-group">
            <label for="password" class="form-label">Contraseña</label>
            <input wire:model="form.password" id="password" class="form-input" type="password" name="password" required autocomplete="current-password" placeholder="••••••••" />
            @error('form.password')
                <span class="error-message">{{ $message }}</span>
            @enderror
        </div>

        <div class="form-checkbox-group">
            <input wire:model="form.remember" id="remember" type="checkbox" class="form-checkbox" name="remember">
            <label for="remember" class="form-checkbox-label">Recordarme</label>
        </div>

        <button type="submit" class="btn-primary">
            Iniciar Sesión
        </button>

        <div class="form-footer form-footer-center">
            @if (Route::has('password.request'))
                <a class="form-link" href="{{ route('password.request') }}" wire:navigate>
                    ¿Olvidaste tu contraseña?
                </a>
            @endif
            @if (Route::has('register'))
                <span style="margin: 0 0.5rem; color: #D1D5DB;">•</span>
                <a class="form-link" href="{{ route('register') }}" wire:navigate>
                    Crear cuenta nueva
                </a>
            @endif
        </div>
    </form>
</div>
