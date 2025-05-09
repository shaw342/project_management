CREATE TABLE IF NOT EXISTS manager(
    manager_id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    CONSTRAINT fk_owner
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);