CREATE TABLE IF NOT EXISTS sessions (
    session_id UUID PRIMARY KEY  DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);