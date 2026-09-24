 ; ==============================
; SETUP
; ==============================
[Setup]
AppName=Servidor9Tech
AppVersion=1.0.1
DefaultDirName={commonappdata}\Servidor9Tech
DefaultGroupName=Servidor9Tech
OutputDir=output
OutputBaseFilename=Instalador_Servidor9Tech
Compression=lzma
SolidCompression=yes
PrivilegesRequired=admin
ArchitecturesInstallIn64BitMode=x64

; ==============================
; FILES
; ==============================
[Files]
Source: "nssm.exe"; DestDir: "{app}"
Source: "instaladores\node.msi"; DestDir: "{tmp}\instaladores"
Source: "instaladores\cloudflared.exe"; DestDir: "{tmp}\instaladores"
Source: "..\package.json"; DestDir: "{app}"
Source: "backend\*"; DestDir: "{app}"; Flags: recursesubdirs 
Source: "..\.env"; DestDir: "{app}"; Flags: ignoreversion

; ==============================
; DIRECTORIOS
; ==============================
[Dirs]
Name: "{app}\logs"

; ==============================
; INSTALAR NODE SILENCIOSO
; ==============================
[Run]
;Instalar Node JS
Filename: "msiexec.exe"; Parameters: "/i ""{tmp}\instaladores\node.msi"" /qn"; StatusMsg: "Instalando Node.js..."; Flags: waituntilterminated

;Instalar dependencias
Filename: "cmd.exe"; Parameters: "/C ""{pf}\nodejs\npm.cmd"" install --omit=dev"; WorkingDir: "{app}"; StatusMsg: "Instalando dependencias..."; Flags: waituntilterminated

;Instalar cloudflared
Filename: "{tmp}\instaladores\cloudflared.exe"; \
Parameters: "service install eyJhIjoiN2RjOGMzN2YzN2UyMDQ3MjE4ZGIxYWJmNmNhMDA1N2UiLCJ0IjoiMTA5NWUyZTgtMmJjMy00ZGY4LWEzOTEtNzJmYTgxMDg1OTBhIiwicyI6Ik1USXdZVGRsTjJZdE1XVTJaQzAwWldZMUxXRmlNV010TnprNE1XSXlaVEZoT0RnMiJ9"; \
StatusMsg: "Instalando cloudflared..."; \
Flags: runhidden waituntilterminated

; Configurar inicio automático
Filename: "sc.exe"; \
Parameters: "config cloudflared start= delayed-auto"; \
Flags: runhidden waituntilterminated

;Instalar servicio con NSSM
Filename: "{app}\nssm.exe"; \
Parameters: "install servidorMovil ""C:\Program Files\nodejs\node.exe"" ""{app}\dist\server.js"""; \
Flags: runhidden waituntilterminated

;Directorio de trabajo
Filename: "{app}\nssm.exe"; \
Parameters: "set servidorMovil AppDirectory ""{app}"""; \
Flags: runhidden waituntilterminated

;Logs
Filename: "{app}\nssm.exe"; \
Parameters: "set servidorMovil AppStdout ""{app}\logs\output.log"""; \
Flags: runhidden waituntilterminated

Filename: "{app}\nssm.exe"; \
Parameters: "set servidorMovil AppStderr ""{app}\logs\error.log"""; \
Flags: runhidden waituntilterminated

; Inicio automatico
Filename: "{app}\nssm.exe"; Parameters: "set servidorMovil Start SERVICE_AUTO_START"; Flags: runhidden waituntilterminated

; Iniciar servicio
Filename: "{app}\nssm.exe"; Parameters: "start servidorMovil"; Flags: runhidden waituntilterminated

; ==============================
; DESINSTALAR
; ==============================
[UninstallRun]
Filename: "{app}\nssm.exe"; Parameters: "stop servidorMovil"; Flags: runhidden waituntilterminated
Filename: "{app}\nssm.exe"; Parameters: "remove servidorMovil confirm"; Flags: runhidden waituntilterminated

; Detener servicio si existe
Filename: "sc.exe"; \
Parameters: "stop Cloudflared"; \
Flags: runhidden waituntilterminated

; Eliminar servicio
Filename: "sc.exe"; \
Parameters: "delete Cloudflared"; \
Flags: runhidden waituntilterminated

; Eliminar claves de registro residuales
Filename: "cmd.exe"; \
Parameters: "/C reg delete ""HKLM\SYSTEM\CurrentControlSet\Services\EventLog\Application\Cloudflared"" /f >nul 2>&1"; \
Flags: runhidden waituntilterminated

Filename: "cmd.exe"; \
Parameters: "/C reg delete ""HKLM\SYSTEM\CurrentControlSet\Services\Cloudflared"" /f >nul 2>&1"; \
Flags: runhidden waituntilterminated

