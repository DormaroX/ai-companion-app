#!/bin/bash

# Konfiguration
BACKUP_DIR="backups"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Funktion zum Anzeigen der verfügbaren Backups
list_backups() {
    echo "Verfügbare Backups:"
    for meta in "${PROJECT_DIR}/${BACKUP_DIR}"/*.meta.json; do
        if [ -f "$meta" ]; then
            echo "----------------------------------------"
            cat "$meta"
        fi
    done
}

# Funktion zur Wiederherstellung eines Backups
restore_backup() {
    local backup_name=$1
    local backup_file="${PROJECT_DIR}/${BACKUP_DIR}/${backup_name}.tar.gz"
    local meta_file="${PROJECT_DIR}/${BACKUP_DIR}/${backup_name}.meta.json"

    if [ ! -f "$backup_file" ] || [ ! -f "$meta_file" ]; then
        echo "Backup nicht gefunden: ${backup_name}"
        exit 1
    fi

    echo "Stelle Backup wieder her: ${backup_name}"
    echo "Metadaten:"
    cat "$meta_file"

    # Sichere aktuelle Änderungen
    if [[ $(git status --porcelain) ]]; then
        echo "Sichere aktuelle Änderungen..."
        current_timestamp=$(date +"%Y%m%d_%H%M%S")
        git add .
        git commit -m "Pre-restore Backup ${current_timestamp}"
    fi

    # Erstelle temporäres Verzeichnis für die Wiederherstellung
    local temp_dir=$(mktemp -d)
    
    # Entpacke Backup
    tar -xzf "$backup_file" -C "$temp_dir"

    # Kopiere Dateien zurück (außer .git und node_modules)
    rsync -av --exclude='.git' --exclude='node_modules' --exclude='backups' \
        "${temp_dir}/" "${PROJECT_DIR}/"

    # Aufräumen
    rm -rf "$temp_dir"

    echo "Backup wurde wiederhergestellt"
    echo "Bitte führen Sie 'npm install' aus, um node_modules zu aktualisieren"
}

# Hauptprogramm
if [ "$1" == "list" ]; then
    list_backups
elif [ "$1" == "restore" ] && [ -n "$2" ]; then
    restore_backup "$2"
else
    echo "Verwendung:"
    echo "  $0 list              - Zeigt verfügbare Backups an"
    echo "  $0 restore [name]    - Stellt ein Backup wieder her"
fi
