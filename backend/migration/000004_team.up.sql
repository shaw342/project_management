CREATE TABLE IF NOT EXISTS team(
    id VARCHAR(100) NOT NULL,
    team_id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    owner_id UUID NOT NULL,
    CONSTRAINT fk_owner 
    FOREIGN KEY (owner_id) REFERENCES owner(owner_id)
);