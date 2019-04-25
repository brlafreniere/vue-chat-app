CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nickname VARCHAR(100) NOT NULL,
    email_address VARCHAR(255),
    password VARCHAR(60)
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    text VARCHAR(255),
    nickname VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    user_id INTEGER REFERENCES users
);
