DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nickname VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL,
    client_token VARCHAR(60) UNIQUE,
    email_address VARCHAR(255),
    registered BOOLEAN NOT NULL DEFAULT FALSE,
    online_status BOOLEAN NOT NULL DEFAULT FALSE,
    primary_room_id INTEGER REFERENCES rooms NOT NULL,
    password VARCHAR(60)
);

DROP TABLE IF EXISTS rooms CASCADE;
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL
);

DROP TABLE IF EXISTS room_users CASCADE;
CREATE TABLE room_users (
    room_id INTEGER REFERENCES rooms NOT NULL,
    user_id INTEGER REFERENCES users NOT NULL,
    UNIQUE(room_id, user_id)
);

DROP TABLE IF EXISTS messages CASCADE;
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    text VARCHAR(255),
    nickname VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    user_id INTEGER REFERENCES users,
    room_id INTEGER REFERENCES rooms NOT NULL
);

INSERT INTO rooms (name, created_at) VALUES ('general', NOW());
