# API Dokumentation

## ToDo System Endpoints

### Übersicht
| Methode | Endpoint                  | Beschreibung                |
|---------|---------------------------|----------------------------|
| GET     | `/api/todos`             | Alle ToDos abrufen         |
| POST    | `/api/todos`             | Neues ToDo erstellen       |
| PUT     | `/api/todos/:id`         | ToDo aktualisieren         |
| POST    | `/api/todos/:id/follow-up`| Follow-up hinzufügen      |
| GET     | `/api/todos/:id/history` | Versionshistorie abrufen   |

### Detaillierte Beschreibung

#### GET `/api/todos`
Ruft alle ToDos ab.
```bash
curl http://localhost:3000/api/todos
```

#### POST `/api/todos`
Erstellt ein neues ToDo.
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Beispiel ToDo",
    "description": "Beschreibung",
    "dueDate": "2025-04-01",
    "priority": "high"
  }'
```

#### PUT `/api/todos/:id`
Aktualisiert ein bestehendes ToDo.
```bash
curl -X PUT http://localhost:3000/api/todos/123 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "description": "Neue Beschreibung"
  }'
```

#### POST `/api/todos/:id/follow-up`
Fügt einem ToDo ein Follow-up hinzu.
```bash
curl -X POST http://localhost:3000/api/todos/123/follow-up \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Follow-up Notiz"
  }'
```

#### GET `/api/todos/:id/history`
Ruft die Versionshistorie eines ToDos ab.
```bash
curl http://localhost:3000/api/todos/123/history
```

## Datenstrukturen

### ToDo Objekt
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "dueDate": "string (ISO date)",
  "priority": "low|medium|high",
  "status": "pending|completed",
  "created": "string (ISO datetime)",
  "modified": "string (ISO datetime)",
  "version": "number",
  "history": [
    {
      "version": "number",
      "timestamp": "string (ISO datetime)",
      "action": "string",
      "changes": "object"
    }
  ],
  "followUps": [
    {
      "id": "uuid",
      "text": "string",
      "timestamp": "string (ISO datetime)",
      "status": "pending|completed"
    }
  ]
}
```
