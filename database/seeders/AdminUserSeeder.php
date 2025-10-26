<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Verificar si el usuario ya existe para evitar duplicados
        $existingUser = User::where('email', 'jona03278@gmail.com')->first();
        
        if ($existingUser) {
            $this->command->info('El usuario administrador ya existe.');
            $this->command->info('Email: jona03278@gmail.com');
            return;
        }

        // Crear usuario administrador
        $adminUser = User::create([
            'name' => 'Jonathan Administrador',
            'email' => 'jona03278@gmail.com',
            'password' => Hash::make('Jona@03278'),
            'email_verified_at' => now(),
        ]);

        $this->command->info('✅ Usuario administrador creado exitosamente:');
        $this->command->info('👤 Nombre: ' . $adminUser->name);
        $this->command->info('📧 Email: ' . $adminUser->email);
        $this->command->info('🔑 Password: Jona@03278');
        $this->command->info('🕐 Verificado: ' . $adminUser->email_verified_at->format('Y-m-d H:i:s'));
    }
}
