## Project Name 

### Storefront Backend Project

### Installing Dependencies

project requires having node installed https://nodejs.org/en/download/

run ```npm install``` to install the dependencies

### Project Technologies

- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- jasmine from npm for testing

## Project Description

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.



## Database structure

> create database with name cart 

> CMD command `caretedb cart`
> or using SQL query `CREATE DATABASE cart;`
> database port number : 5432
> The database has four tables
>> 1st table : 'users' that have columns of (id,firstname,lastname,password,role)
>>> role values must be either 'admin' or 'user'
>> 2nd table : 'products' that have columns of (id,name,price)
>>3rd table : 'orders' that have columns of (id,user_id,status)
>>> status value must be 'ordered','ready','delivered', or 'cancelled'
>> 4th table : 'order_products' that have columns of (id,quantity,product_id,order_id)


## Testing

* Testing is done using jasmine

* To run the tests, run

> `npm run test`


## migration

> To run the migration

> `npm run devUp`

## Server starting

> To start the server, run

> `npm start`

### Error Handeling

> Return 400 for 'bad request'

> Return 404 for 'not found'

> Return 403 for 'forbidden'

## References:

* Udacity classroom

* Express Documentation [https://www.npmjs.com/package/express]

* Jasmine Documentation [https://jasmine.github.io/]

* Postgres documnetation [https://www.postgresql.org/]

* Json web token [https://jwt.io/]

* youtube channel [https://www.youtube.com/c/MohammedElzanatyAcademy]




## Author

**Mohamed Mohsen**







# Storefront-Backend
