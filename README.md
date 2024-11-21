# Online Book Store API

Book store API made using Node.js, Express.js, and MongoDB

### API Features:

1. **Books**
   - Show a list of books to buy
   - In book list, only show books which are in stock
   - Show individual book details
2. **Purchase**
   - Books can be purchased only by logged in user
   - Purchase is allowed only if the book is in stock
   - Book's stock decrease/increase based on how many purchases have been made or canceled respectively
   - Users can see their respective purchase list or individual purchase
   - User can cancel their purchase (or order)
3. **User**
   - User signup / login feature available
   - User has 2 roles
     - Normal user
     - Admin user
   - A normal user can signup by _Name_, _Email_ and _Password_
   - For login, _Email_ and _Password_ is required
   - To register/signup as an **ADMIN**, an extra **admin-signup-key** is required which is not public
   - Authentication is done by JWT tokens
   - A normal user can see and purchase books but he/she can not add/modify a book
   - A norma user can also cancel a purchase
4. **Admin features**
   - Only Admin can add/delete a book
   - Admin can increase or decrease a book's stock
   - Admin can update a book's data, such as title, description

### Guide to local setup

1. Clone this repository
   ```bash
   git clone https://github.com/Sahiljain0/BookSTore.git
   ```
2. Install node packages (from root directory)
   ```bash
   npm install
   ```
3. Setup a database on [MongoDB cloud database](https://www.mongodb.com/cloud) and get a _"Connection String"_
4. Add the _"Connection String"_ to **mongoURI** key in `default.json` file which is in `config` folder
5. Add **"jwtSecret"** and **"admin-signup-key"** key's value of your choice in `default.json`
6. Run development server
   ```bash
   npm run server
   ```
7. Use the API in Postman or any other API testing tool


## API Documentation and Testing

This project includes detailed API documentation for easy integration and testing. Below are the available options for testing the APIs:

### 1. API Documentation (APIDoc.md)

All API endpoints are documented in the `APIDoc.md` file located in the project root. This file contains:
- Descriptions of each API endpoint.
- Request methods (GET, POST, PUT, PATCH, DELETE).
- Sample request/response bodies.
- Error handling details.

### 2. Testing with Postman

The APIs can be easily tested using [Postman](http://localhost:4000/). To get started:
- Import the `APIDoc.md` file into Postman or manually configure the endpoints as described in the documentation.
- Set up the required headers, parameters, and request bodies as mentioned in the documentation.

### 3. Swagger UI

For an interactive API testing experience, Swagger UI is integrated into the project. It allows you to explore and test all the endpoints directly from the browser.

#### Steps to Use Swagger UI:
1. Start the project by running:
   ```bash
   npm run server
  
  ( http://localhost:4000/api-docs/)
  
2. Use the interactive interface to test endpoints. Swagger UI provides:
- Endpoint details (e.g., HTTP method, path, and required parameters).
- Input fields for testing the API.
- Real-time response visualization.

### 4. Getting Started with the APIs

- Ensure the server is running before testing the APIs.
- Use either Postman or Swagger UI to test various endpoints.
- Refer to the `APIDoc.md` file for any additional details or examples.

