# Welcome to NC news readme file! Exciting!
This is a repo for the final block 3 project for Northcoders!

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites
html5
Node environment
mongo 
mongoose

Dependencies:
mongoose ^5.1.6
express ^4.16.3
body-parser ^1.18.3
ejs ^2.6.1

Dev dependencies:
mocha ^5.2.0
chai ^4.1.2
nodemon ^1.17.4
supertest ^3.1.0

All packages can be installed using: npm install <name of package>; dev dependencies can be installed with npm install -D <name of package>

### Config
You will need to create a file called 'config.js' in a folder called 'config'.
The file should export the value of DB_URL depending on the process.env.NODE_ENV. For testing this should be set to localhost mongodb with standart port bd name nc_news_test. For development, it should be set to localhost mongodb standard port and db name nc_news. For production, it should be set to the mlab link provided on request. The default running environment should be the development one.

### To seed the database
Run 'npm run seed:dev' to seed the development database


### Testing
When testing, the index.spec.js file will automatically set NODE_ENV to test, and will re-seed the database before each test. 

To run the test suite run 'mongod' to connect to the mongo and 'npm t' in a new terminal.

The tests are created to test each end point. They are organised in the following way:
Topics
Articles
Comments
Users

'Happy path' and errors for an end point have been tested in the same describe block.
Individual tests can be run using '.only' after 'describe' or after 'it'.

## Deployment
This database has been deployed on heroku and can be found here: https://antariess-ncnews.herokuapp.com/

## Authors

Myself, Vel Georgieva, aka antariess

