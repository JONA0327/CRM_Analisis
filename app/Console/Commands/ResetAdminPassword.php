<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class ResetAdminPassword extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:reset-password {email?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reset admin user password';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email') ?? 'jona03278@gmail.com';
        
        $user = User::where('email', $email)->first();
        
        if (!$user) {
            $this->error("❌ Usuario con email {$email} no encontrado.");
            return;
        }

        // Resetear a la contraseña por defecto
        $user->update([
            'password' => Hash::make('Jona@03278')
        ]);

        $this->info("✅ Contraseña reseteada exitosamente para:");
        $this->info("👤 Usuario: {$user->name}");
        $this->info("📧 Email: {$user->email}");
        $this->info("🔑 Nueva contraseña: Jona@03278");
        
        $this->newLine();
        $this->warn("⚠️  Asegúrate de cambiar esta contraseña después del primer login.");
    }
}
