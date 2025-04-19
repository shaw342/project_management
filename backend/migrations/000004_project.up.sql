CREATE TABLE IF NOT EXISTS project (
    project_id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description VARCHAR(100) NOT NULL,
    owner VARCHAR(100) NOT NULL,
    teams VARCHAR(100),
    startDate DATE NOT NULL
);
