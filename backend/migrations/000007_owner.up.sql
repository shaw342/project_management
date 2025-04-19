CREATE TABLE IF NOT EXISTS owner(
    owner_id UUID PRIMARY KEY NOT NULL,
    user_id UUID NOT NULL,
    CONSTRAINT fk_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);