#freeCodeCamp Backend Certificate API Project - URL Shortener Microservice

##Objective 

Build a full stack JavaScript app that is functionally similar to this: https://little-url.herokuapp.com/ and deploy it to Heroku. Note that for each
project, you should create a new GitHub repository and a new Heroku project.
If you can't remember how to do this, revisit https://freecodecamp.com/challenges/get-set-for-our-api-development-projects.

Checkout this wiki article for tips on integrating MongoDB on Heroku.
https://github.com/FreeCodeCamp/FreeCodeCamp/wiki/Using-MongoDB-And-Deploying-To-Heroku

##User Stories

Implement the following users stories in this exercise.

1. User Story:  I can pass a URL as a parameter and I will receive a shortened
URL in the JSON response.
2. User Story: If I pass an invalid URL that doesn't follow the valid
http://www.example.com format, the JSON response will contain an error instead.
3. User Story: When I visit that shortened URL, it will redirect me to my
original link.

##Example creation usage:
```
https://little-url.herokuapp.com/new/https://www.google.com
https://little-url.herokuapp.com/new/http://foo.com:80
```

##Example creation output:
```
{ "original_url":"http://foo.com:80", "short_url":"https://little-url.herokuapp.com/8170" }
```

##Usage:
The URL ```https://little-url.herokuapp.com/2871``` will redirect to ```https://www.google.com/```

##Project Dependencies

- Express
- MongoDB
- Mongoose
- NodeJS
