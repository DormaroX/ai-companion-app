#!/bin/bash

# Konfiguration
BACKUP_DIR="backups"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="backup_${TIMESTAMP}"

# Erstelle Backup-Verzeichnis, falls es nicht existiert
mkdir -p "${PROJECT_DIR}/${BACKUP_DIR}"

# Git Status prüfen
cd "${PROJECT_DIR}"
if [[ $(git status --porcelain) ]]; then
    echo "Ungesicherte Änderungen gefunden. Erstelle Commit..."
    git add .
    git commit -m "Automatischer Backup-Commit ${TIMESTAMP}"
fi

# Aktuelle Branch und Commit-Hash speichern
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
CURRENT_COMMIT=$(git rev-parse HEAD)

# Erstelle Backup-Archiv
tar -czf "${PROJECT_DIR}/${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" \
    --exclude="node_modules" \
    --exclude=".git" \
    --exclude="backups" \
    -C "${PROJECT_DIR}" .

# Erstelle Backup-Metadaten
cat > "${PROJECT_DIR}/${BACKUP_DIR}/${BACKUP_NAME}.meta.json" << EOF
{
    "timestamp": "$(date -Iseconds)",
    "branch": "${CURRENT_BRANCH}",
    "commit": "${CURRENT_COMMIT}",
    "files": $(find . -type f -not -path "./node_modules/*" -not -path "./.git/*" -not -path "./backups/*" | wc -l),
    "size": "$(du -sh "${PROJECT_DIR}/${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" | cut -f1)"
}
EOF

echo "Backup erstellt: ${BACKUP_NAME}"
echo "Metadaten:"
cat "${PROJECT_DIR}/${BACKUP_DIR}/${BACKUP_NAME}.meta.json"
