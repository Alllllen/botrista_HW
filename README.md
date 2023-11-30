## Set Up

-     git clone
-     docker-compose up

## Technology Stack

- **Node.js**, **Express.js**: Backend server framework.
- **MongoDB**, **Mongoose**: Database management and ODM (Object-Document Mapper) for MongoDB.
- **JWT (JSON Web Tokens)**: Used for implementing authentication.
- **Docker**: Containerization for both the web application and MongoDB.

## API Endpoints

### User Authentication

- **POST** `/api/v1/users/login`: Allows users (managers and customers) to log in.
- **GET** `/api/v1/users/logOut`: Logs out the user.
- **POST** `/api/v1/users/register`: Registers a new user.

### Product Management

- **GET** `/api/v1/products`: Retrieves a list of products with optional filtering by price or stock.
- **POST** `/api/v1/products`: Allows managers to create a new product.
- **PATCH** `/api/v1/products/{product}`: Allows managers to edit the details of a specific product.
- **DELETE** `/api/v1/products/{product}`: Allows managers to delete a product if it has not been ordered by any customer.

#### Filtering and Sorting:

- To filter by stock or price, use query parameters like `?stock=gte:15` or `?price=gte:15`.
- To sort, use the `sort` parameter, for example, `?sort=stock` or `?sort=price`.

#### Example:

- List all products with stock greater than or equal to 15 and sorted by stock: `/api/v1/products/?stock=gte:15&sort=stock`.
- List all products with price greater than or equal to 15 and sorted by price: `/api/v1/products/?price=gte:15&sort=price`.

### Order Management

- **GET** `/api/v1/orders`: Retrieves a list of orders. Customers can only view their own orders, while managers can view all orders.
- **POST** `/api/v1/orders`: Allows customers to create an order, specifying multiple products. Checks if products are in stock before creating the order.
