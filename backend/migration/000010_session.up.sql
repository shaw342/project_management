CREATE TABLE sessions (
    session_id UUID PRIMARY KEY uuid_generate_v4(),
    user_id INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);