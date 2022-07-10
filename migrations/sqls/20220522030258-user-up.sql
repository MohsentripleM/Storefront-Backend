CREATE TYPE user_role AS ENUM('user','admin');
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    firstname VARCHAR NOT NULL,
    lastname VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    role user_role DEFAULT 'user',
    UNIQUE(firstname,lastname)
);