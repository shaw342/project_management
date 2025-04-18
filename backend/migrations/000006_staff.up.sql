CREATE TABLE IF NOT EXISTS staff(
    staff_id VARCHAR(100) PRIMARY KEY NOT NULL,
    user_id UUID NOT NULL,
    team_id UUID NOT NULL,
    CONSTRAINT fk_user
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_team
    FOREIGN KEY (team_id) REFERENCES team(team_id)
);