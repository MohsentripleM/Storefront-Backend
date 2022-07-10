CREATE TABLE order_products(
id SERIAL PRIMARY KEY,
quantity INTEGER NOT NULL,
product_id INTEGER REFERENCES products(id)  ON DELETE CASCADE,
order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
UNIQUE(product_id,order_id)
);