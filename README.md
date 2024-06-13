# E-Commerce Fashion User CMS

Welcome to the E-Commerce Fashion API project! This API provides a comprehensive backend service for managing an e-commerce store. It includes functionalities for user authentication, product management, category management, and order processing. This is the api server of [Front-End repository](https://github.com/GauravShreenet/Store-User-CMS-client).

## Features

- **CRUD User Profile**: Create, read, update, and delete your own user profile.
- **Product Browsing**: Browse through available products.
- **Cart Management**: Manage items in your shopping cart.
- **Order Tracking**: Track the status of your orders.

## Technologies Used

- **Node.js**: JavaScript runtime for server-side programming.
- **Express**: Web framework for building the API.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: ODM for MongoDB.
- **Nodemailer**: For sending emails.

## Getting Started

To get started with this project, follow these steps:

1. **Clone the repository:** `git clone https://github.com/GauravShreenet/Store-User-CMS-api`
2. **Navigate to the project directory:** `cd Store-User-CMS-api`
3. **Install dependencies:** `npm install`
4. **Configure environment variables:** Rename `.env.sample` to `.env` and provide the necessary values.
5. **Start the development server:** `npm run dev`
6. The server should be running at [`http://localhost:8000`](http://localhost:8000).

## Available APIs
All the API endpoints are prefixed with `http://localhost:8000/api/v1`.

### User API
User api will follow the following parttern `http://localhost:8000/api/v1/users`

| #   | PATH                    | METHODS | PRIVATE | DESCRIPTION                                                                                             |
| --- | ----------------------- | ------- | ------- | ------------------------------------------------------------------------------------------------------- |
| 1.  | `/`                | `POST`  | False   | Creates a new user in the database                                   |
| 2.  | `/verify-email`   | `POST`  | False   | Verifies user's email via verification link                  |
| 3.  | `/sign-in`        | `POST`  | False   | Authenticates user and returns JWT tokens                                    |
| 4.  | `/`                | `GET`   | True    | Retrieves user data for authenticated user                                                        |
| 5.  | `/get-accessjwt`  | `GET`   | True    | Refreshes and returns a new access JWT                                                                  |
| 6.  | `/logout`         | `POST`  | True    | Logs out user and invalidates session                                                           |
| 7.  | `/request-otp`    | `POST`  | False   | Sends OTP to user's email for password reset                                                     |
| 8.  | `/`                | `PATCH` | True   | Resets user's password using provided OTP                                                       |
| 9.  | `/password`       | `PATCH` | True    | Updates authenticated user's password                                                               |
| 10. | `/user-profile`   | `PATCH` | True    | Updates authenticated user's profile information                                                    |

### Product API

Product api will follow the following parttern `http://localhost:8000/api/v1/products`

| #   | PATH                    | METHODS | PRIVATE | DESCRIPTION                                                                                             |
| --- | ----------------------- | ------- | ------- | ------------------------------------------------------------------------------------------------------- |
| 1.  | `/`             | `GET`   | False   | Returns a list of all products or a specific product if an ID is provided                               |
| 2.  | `/:slug?`             | `GET`   | False   | Retrieves a specific product by slug or all active products if no slug is provided                               |
| 3.  | `/new-arrival`  | `GET`   | False   | Retrieves latest arrivals (up to 12 products)                              |

### Cart API

Cart api will follow the following parttern `http://localhost:8000/api/v1/cartItems`

| #   | PATH          | METHODS | PRIVATE | DESCRIPTION                                                                      |
| --- | ------------- | ------- | ------- | -------------------------------------------------------------------------------- |
| 1   | `/`           | `POST`  | True    | Adds a new item to the user's shopping cart. Requires authentication.            |
| 2   | `/`           | `PATCH` | True    | Updates the quantity of an item in the user's shopping cart. Requires authentication. |
| 3   | `/`           | `DELETE`| True    | Deletes an item from the user's shopping cart. Requires authentication.          |
| 4   | `/deleteAll`  | `DELETE`| True    | Deletes all items from the user's shopping cart. Requires authentication.         |
| 5   | `/`           | `GET`   | True    | Retrieves all items in the user's shopping cart. Requires authentication.         |

### Order API

Order api will follow the following parttern `http://localhost:8000/api/v1/orders`
This API manages orders and payments.

| #   | PATH               | METHODS | PRIVATE | DESCRIPTION                                                                                             |
| --- | ------------------ | ------- | ------- | ------------------------------------------------------------------------------------------------------- |
| 1   | `/`                | `POST`  | True    | Creates a new order with payment processing. Requires authentication.                                   |
| 2   | `/create-order`    | `POST`  | True    | Validates and creates a new order based on provided cart items and user details. Requires authentication.|
| 3   | `/:_id?`           | `GET`   | True    | Retrieves all orders for the authenticated user if no ID is provided, or a specific order by ID. Requires authentication. |

### Category API

Category api will follow the following parttern `http://localhost:8000/api/v1/categories`

| #   | PATH          | METHODS | PRIVATE | DESCRIPTION                                                                       |
| --- | ------------- | ------- | ------- | --------------------------------------------------------------------------------- |
| 1   | `/:slug?`     | `GET`   | False   | Retrieves all categories if no slug is provided. Retrieves products for a specific category if a slug is provided. |

## License
This project is licensed under the MIT License.

## Acknowledgements
This project was inspired by the need for a robust and efficient user management system in an e-commerce store. Special thanks to the Node.js, Express, and MongoDB communities for their valuable contributions.
