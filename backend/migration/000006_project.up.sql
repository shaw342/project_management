CREATE TABLE IF NOT EXISTS project (
    id INT NOT NULL,
    project_id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description VARCHAR(100) NOT NULL,
    owner_id UUID NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    CONSTRAINT fk_owner
    FOREIGN KEY (owner_id) REFERENCES owner(owner_id),
    teams VARCHAR(100)
);