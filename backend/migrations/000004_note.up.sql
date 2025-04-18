CREATE TABLE IF NOT EXISTS note (
    id VARCHAR(100) PRIMARY KEY NOT NULL,
    note_id UUID NOT NULL,
    user_id UUID NOT NULL,
    task_id VARCHAR(100) NOT NULL,
    CONSTRAINT fk_user
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_task
    FOREIGN KEY (task_id) REFERENCES task(task_id)
);
