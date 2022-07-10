## Welcome to Bela's games app

- This is an api with reviews of games and comments that belong to certain reviews.

- The client can request reviews by ID, do queries to sort reviews by a specified column, arrange sort order, and filter by category.

- Client is able to increment/ decrement votes for certain reviews.

- Comments can be added and deleted at reviews specified.

# How to use the app:

- First clone the app from my Github repo using the following link: https://github.com/B7Bprog/belas-games.git

- Next you will need to create two .env files for your project: .env.test and .env.development. Into each, add PGDATABASE=<database_name_here>, with the correct database name for that environment (see /db/setup.sql for the database names). Double check that these .env files are .gitignored.

- The minimum version for Node.js is v18.4.0 and for Postgres is 14.3.

- In the app's folder run 'npm install' to install all dependencies.

- Make sure your psql server is running and you are logged in.

- Type 'npm run setup-dbs' into terminal

- To seed the database type the following command into the terminal: 'npm run seed'

- To start the app on localhost, run the 'node listen.js' command in terminal

- This is gonna be your local url: localhost:9090

# Using the hosted version

- You can reach the deployed app at this address: https://belas-games.herokuapp.com/

- To get a description of all the endpoints, use the following URL: https://belas-games.herokuapp.com/api
