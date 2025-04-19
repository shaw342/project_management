CREATE TABLE IF NOT EXISTS project (
    project_id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description VARCHAR(100) NOT NULL,
    owner_id UUID NOT NULL,
    CONSTRAINT fk_owner
    FOREIGN KEY (owner_id) REFERENCES owner(owner_id),
    teams VARCHAR(100),
    startDate DATE NOT NULL
);