```mermaid
sequenceDiagram
    participant F as Frontend (React)
    participant B as Backend (Express)
    participant S as Supabase Auth
    participant D as Supabase DB

    Note over F,D: Authentication Flow
    F->>B: POST /api/auth/signin {email, password}
    B->>S: supabase.auth.signInWithPassword()
    S-->>B: {user, session}
    B-->>F: {user, session: {access_token, refresh_token}}
    F->>F: Store token in localStorage

    Note over F,D: Data Operations
    F->>B: GET /api/appliances (with Bearer token)
    B->>S: supabase.auth.getUser(token)
    S-->>B: {user}
    B->>D: SELECT * FROM appliances WHERE user_id = ?
    D-->>B: [appliances data]
    B-->>F: JSON response

```mermaid
erDiagram
    users {
        uuid id PK
        varchar email UK
        varchar name
        timestamp created_at
        timestamp updated_at
    }
    
    appliances {
        uuid id PK
        uuid user_id FK
        varchar name
        varchar brand
        varchar model
        timestamp purchase_date
        integer warranty_duration_months
        varchar serial_number
        varchar purchase_location
        text notes
        timestamp created_at
        timestamp updated_at
    }
    
    support_contacts {
        uuid id PK
        uuid appliance_id FK
        varchar name
        varchar company
        varchar phone
        varchar email
        varchar website
        text notes
        timestamp created_at
        timestamp updated_at
    }
    
    maintenance_tasks {
        uuid id PK
        uuid appliance_id FK
        varchar task_name
        timestamp scheduled_date
        varchar frequency
        json service_provider
        text notes
        varchar status
        timestamp completed_date
        timestamp created_at
        timestamp updated_at
    }
    
    linked_documents {
        uuid id PK
        uuid appliance_id FK
        varchar title
        varchar url
        timestamp created_at
        timestamp updated_at
    }
    
    users ||--o{ appliances : owns
    appliances ||--o{ support_contacts : has
    appliances ||--o{ maintenance_tasks : has
    appliances ||--o{ linked_documents : has
