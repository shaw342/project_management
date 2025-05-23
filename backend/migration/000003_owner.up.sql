CREATE TABLE IF NOT EXISTS owner(
    owner_id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    manager_id UUID NOT NULL,
    CONSTRAINT fk_manager
    FOREIGN KEY (manager_id) REFERENCES manager(manager_id),
    CONSTRAINT fk_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);