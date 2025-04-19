CREATE TABLE IF NOT EXISTS staff(
    staff_id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    team_id UUID NOT NULL,
    CONSTRAINT fk_user
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_team
    FOREIGN KEY (team_id) REFERENCES team(team_id)
);