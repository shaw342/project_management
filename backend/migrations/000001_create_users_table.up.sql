CREATE TABLE users(
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password TEXT NOT NULL,
    status VARCHAR(100) NOT NULL,
    createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);