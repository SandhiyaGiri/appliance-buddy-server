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
