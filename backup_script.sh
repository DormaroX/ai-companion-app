#!/bin/bash

# Verzeichnis für Backups
BACKUP_DIR="/home/aov/CascadeProjects/ai-companion-hub/backups"
mkdir -p "$BACKUP_DIR"

# Dateiname mit Datum und Uhrzeit
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.tar.gz"

# Erstelle das Backup
tar -czvf "$BACKUP_FILE" /home/aov/CascadeProjects/ai-companion-hub

# Git-Commit und Push
cd /home/aov/CascadeProjects/ai-companion-hub
git add .
git commit -m "Backup and update: $DATE"
git push origin master

echo "Backup and Git update completed: $DATE"
