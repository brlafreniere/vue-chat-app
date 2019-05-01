CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nickname VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL,
    client_string VARCHAR(60) UNIQUE,
    email_address VARCHAR(255),
    registered BOOLEAN NOT NULL DEFAULT FALSE,
    password VARCHAR(60)
);

CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE room_users (
    room_id INTEGER REFERENCES rooms NOT NULL,
    user_id INTEGER REFERENCES users NOT NULL,
    PRIMARY KEY(room_id, user_id)
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    text VARCHAR(255),
    nickname VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    user_id INTEGER REFERENCES users,
    room_id INTEGER REFERENCES rooms NOT NULL
);

INSERT INTO rooms (name, created_at) VALUES ('general', NOW());
