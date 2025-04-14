CREATE TABLE project (
    project_id VARCHAR(100) PRIMARY KEY NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(100) NOT NULL,
    owner VARCHAR(100) NOT NULL,
    teams VARCHAR(100),
    startDate DATE NOT NULL
);
