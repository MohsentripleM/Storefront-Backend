CREATE TYPE order_status AS ENUM('ordered','ready','delivered','canceled');
CREATE TABLE orders(
    id SERIAL PRIMARY KEY,
    status order_status DEFAULT 'ordered',
    user_id INTEGER REFERENCES users(id)  ON DELETE CASCADE

);