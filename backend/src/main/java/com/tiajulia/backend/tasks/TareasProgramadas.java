package com.tiajulia.backend.tasks;

import com.tiajulia.backend.security.repository.VerificacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class TareasProgramadas {

    @Autowired
    private VerificacionRepository verificacionRepository;

    //Backup automático semanal
    @Scheduled(cron = "0 0 4 * * SUN")
    public void ejecutarBackupAutomatico() {
        try {
            System.out.println("💾 Iniciando proceso de backup automático...");

            // Detectar sistema operativo para elegir el script correcto
            String os = System.getProperty("os.name").toLowerCase();
            ProcessBuilder processBuilder = new ProcessBuilder();

            if (os.contains("win")) {
                processBuilder.command("cmd.exe", "/c", "scripts\\backup.bat");
            } else {
                processBuilder.command("bash", "scripts/backup.sh");
            }

            Process process = processBuilder.start();
            int exitCode = process.waitFor();

            if (exitCode == 0) {
                System.out.println("✅ Backup realizado con éxito.");
            } else {
                System.err.println("❌ Error al realizar el backup. Código: " + exitCode);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}