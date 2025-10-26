<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class ListUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:list';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'List all users in the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $users = User::all();
        
        if ($users->isEmpty()) {
            $this->info('No hay usuarios en la base de datos.');
            return;
        }

        $this->info('=== USUARIOS EN LA BASE DE DATOS ===');
        $this->newLine();

        foreach ($users as $user) {
            $this->info("🆔 ID: {$user->id}");
            $this->info("👤 Nombre: {$user->name}");
            $this->info("📧 Email: {$user->email}");
            $this->info("🕐 Creado: {$user->created_at}");
            $this->info("✅ Verificado: " . ($user->email_verified_at ? 'Sí' : 'No'));
            $this->newLine();
        }
        
        $this->info("Total de usuarios: {$users->count()}");
    }
}
