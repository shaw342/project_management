CREATE TABLE IF NOT EXISTS note(
    id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    content VARCHAR(300) NOT NULL,
    level VARCHAR(150) NOT NULL,
    note_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    task_id UUID NOT NULL,
    CONSTRAINT fk_user
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_task
    FOREIGN KEY (task_id) REFERENCES task(task_id)
);