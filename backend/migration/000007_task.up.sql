CREATE TABLE IF NOT EXISTS task (
    task_id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    content VARCHAR(100) NOT NULL,
    staff_id UUID NOT NULL,
    manager_id UUID NOT NULL,
    state VARCHAR(100) NOT NULL,
    CONSTRAINT fk_manager
    FOREIGN KEY (manager_id) REFERENCES manager(manager_id),
    CONSTRAINT fk_staff
    FOREIGN KEY (staff_id) REFERENCES  staff(staff_id),
    creatAt VARCHAR(100) NOT NULL
);