# Introduction
This reposity is a server to provide a RESTful API for the JoyHub app.

# How to run
1. Install [Node.js](https://nodejs.org/en/)
2. Run `npm install` to install all dependencies
3. Run `npm run start` to start the server

# File Structure
```
.
├── dist
|-- src
|   |-- controllers
|   |-- routes
|   |-- services
|   |-- config
|-- functions
```

- **dist**: The folder that will be deployed to the server
- **functions**: The folder that contains the compiled code from src
- **src**: The folder that contains the source code
- **src/controllers**: The folder that contains the controllers which handle the requests
- **src/routes**: The folder that contains the routes which define the endpoints
- **src/services**: The folder that contains the services which handle the business logic
