<?php

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

use function Livewire\Volt\layout;
use function Livewire\Volt\rules;
use function Livewire\Volt\state;

layout('layouts.guest');

state([
    'name' => '',
    'email' => '',
    'password' => '',
    'password_confirmation' => ''
]);

rules([
    'name' => ['required', 'string', 'max:255'],
    'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
    'password' => ['required', 'string', 'confirmed', Rules\Password::defaults()],
]);

$register = function () {
    $validated = $this->validate();

    $validated['password'] = Hash::make($validated['password']);

    event(new Registered($user = User::create($validated)));

    Auth::login($user);

    $this->redirect(route('dashboard', absolute: false), navigate: true);
};

?>

<div>
    <div class="auth-header">
        <div class="auth-logo">
            <!-- Icono médico usando emoji -->
        </div>
        <h2 class="auth-title">Crear Cuenta</h2>
        <p class="auth-subtitle">Únete a nosotros, completa tus datos para comenzar</p>
    </div>

    <form wire:submit="register">
        <div class="form-group">
            <label for="name" class="form-label">Nombre Completo</label>
            <input wire:model="name" id="name" class="form-input" type="text" name="name" required autofocus autocomplete="name" placeholder="Juan Pérez" />
            @error('name')
                <span class="error-message">{{ $message }}</span>
            @enderror
        </div>

        <div class="form-group">
            <label for="email" class="form-label">Correo Electrónico</label>
            <input wire:model="email" id="email" class="form-input" type="email" name="email" required autocomplete="username" placeholder="tu@email.com" />
            @error('email')
                <span class="error-message">{{ $message }}</span>
            @enderror
        </div>

        <div class="form-group">
            <label for="password" class="form-label">Contraseña</label>
            <input wire:model="password" id="password" class="form-input" type="password" name="password" required autocomplete="new-password" placeholder="••••••••" />
            @error('password')
                <span class="error-message">{{ $message }}</span>
            @enderror
        </div>

        <div class="form-group">
            <label for="password_confirmation" class="form-label">Confirmar Contraseña</label>
            <input wire:model="password_confirmation" id="password_confirmation" class="form-input" type="password" name="password_confirmation" required autocomplete="new-password" placeholder="••••••••" />
            @error('password_confirmation')
                <span class="error-message">{{ $message }}</span>
            @enderror
        </div>

        <button type="submit" class="btn-primary">
            Registrarse
        </button>

        <div class="form-footer form-footer-center">
            <a class="form-link" href="{{ route('login') }}" wire:navigate>
                ¿Ya tienes una cuenta? Inicia sesión
            </a>
        </div>
    </form>
</div>
