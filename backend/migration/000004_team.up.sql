CREATE TABLE IF NOT EXISTS team(
    id INT NOT NULL,
    team_id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    manager_id UUID NOT NULL,
    CONSTRAINT fk_manager 
    FOREIGN KEY (manager_id) REFERENCES manager(manager_id)
);