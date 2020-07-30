<h1 align="center">
  <img alt="Gobarber logo" src=".github/logo.svg" width="5%" align="center"/> </br>
  GoBarber API
</h1>

<p align="center">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/diazevedo/gobarber">

  <a href="https://www.linkedin.com/in/diazevedo" target="_blank" >
    <img alt="Made by Di Azevedo" src="https://img.shields.io/badge/made%20by-DiAzevedo-%2325b0e6">
  </a>

  <img alt="License" src="https://img.shields.io/badge/license-MIT-%2304D361">
</p>

### Description

This is the API that serves the mobile and web version of this application.
Clients can select professionals to and professional can check their agenda. This project was built during the [Rockeseat Bootcamp](https://rocketseat.com.br/gostack).

It has the [frontend](https://github.com/diazevedo/gobarber-web) and [mobile](https://github.com/diazevedo/gobarber-mobile).

### Features

- Authentication with JWT
- Schedule management
- Photos upload
- Email alerts
- Booking appointments

### Technologies / Libraries

- [JSON Web Token](https://github.com/auth0/node-jsonwebtoken)
- [Sucrase](https://github.com/alangpierce/sucrase)
- [Nodemon](https://nodemon.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Nodemailer](https://nodemailer.com/about/)
- [Yup](https://github.com/jquense/yup)
- [date-fns](https://date-fns.org/)
- [bee-queue](https://github.com/bee-queue/bee-queue)
- [multer](https://github.com/expressjs/multer)

```bash
# Clone the repository
$ git clone git@github.com:diazevedo/gobarber.git

# Go to the repository folder
$ cd gobarber

# Install dependencies
$ yarn install

# It is optional but I use Docker.
# If you do not have yet you can follow these steps https://docs.docker.com/get-started/

# Create images of each database used
# Redis
docker run --name redis -p 6379:6379 -d -t redis:alpine

# Postgres
docker run --name gobarber -e POSTGRES_PASSWORD=gobarber -p 5432:5432 -d postgres
* In this case, both user and password are gobarber

# Mongo
docker run --name mongo -p 27017:27017 -d -t

# Starting databases
docker start redis mongo postgres

```

I suggest you have a look at the `.env.example` file and set up some variables.

Now we need to create our database structure into Postgres.

```bash
# Running migrations
yarn sequelize db:migrate

# Starting the application
yarn dev

# Email queue
yarn queue
```

:bulb: Feel free to make changes or suggest changes. Feedback is more than welcome. :smiley:
