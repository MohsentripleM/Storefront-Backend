# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## Data Shapes
#### Product
-  id
- name
- price


#### User
- id
- firstName
- lastName
- password
- role (admin, user)

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (ordered, ready, delivered , canceled)


## API Endpoints

#### Products
- Index 
- Show    
- Create  [ admin token required]
- Update  [ admin token required]
- Delete  [ admin token required]

#### Users
- Index   [ admin token required]
- Show    [ admin token required]
- Create
- Update  [ admin token required]
- Delete  [ admin token required]

#### Orders
- index   [ admin token required]
- show    [ admin token required]
- Create Order by user (args: user id)   [ user token required]
- Update  [ admin token required]
- Add product   [ user token required]
- Delete  [ admin token required]





### End points

### Get/

> localhost:3000

> Return message "Hello world!"

### Get/users

> localhost:3000/users

> Returns array of all users with their details

> this route is only allowed to admin

### Get/users/:id

>localhost:3000/users/:id

> show one user details

> this route is only allowed to admin

### Post/users

> localhost:3000/users

> add new user to the database and return its data

>this route is allowed to anyone

### Post/Authentication

> localhost:3000/authentication

> this authenticate users and return their token 

> this route is allowed to anyone

### Patch/users

> localhost:3000/users/:id

> update user names and role 

> this route is only allowed to admins

### Delete/users

> localhost:3000/users/:id

> delete users

> this route is only allowed to admins


### Get/product

>localhost:3000/products

> Returns all products

> this route is allowed to anyone

### GET/products/:id

> localhost:3000/products/:id

> show one product details

>this route is open to all

### Post/products

> localhost:3000/products

> add new product to the database

> this route is only allowed to admins

### Patch/products

> localhost:3000/products/:id

> update product name and price 

> this route is only allowed to admins

### Delete/products

> localhost:3000/products/:id

> delete product

> this route is only allowed to admins


### Get/orders

>localhost:3000/orders

> Returns all orders

> this route is only allowed to admins

### GET/orders/:id

> localhost:3000/products/:id

> show one order details

> this route is allowed to admins only

### Post/orders

> localhost:3000/orders

> add new order to the database

> this route is only allowed to users


### Post/orders/:id/products

> localhost:3000/orders/:id/products

> add new product to an order

> this route is only allowed to users

### Patch/orders

> localhost:3000/products/:id

> update order status and user id 

> this route is only allowed to admins

### Delete/orders

> localhost:3000/orders/:id

> delete order

> this route is only allowed to admins

