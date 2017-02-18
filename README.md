#freeCodeCamp Backend Certificate API Project - URL Shortener Microservice

##Objective  

Build a full stack JavaScript app that is functionally similar to this: https://little-url.herokuapp.com/ and deploy it to Heroku. Note that for each
project, you should create a new GitHub repository and a new Heroku project.
If you can't remember how to do this, revisit https://freecodecamp.com/challenges/get-set-for-our-api-development-projects.

Checkout this wiki article for tips on integrating MongoDB on Heroku.
https://github.com/FreeCodeCamp/FreeCodeCamp/wiki/Using-MongoDB-And-Deploying-To-Heroku

##User Stories

Implement the following users stories in this exercise.

1. I can pass a URL as a parameter and I will receive a shortened
  URL in the JSON response.

  **Usage:** ```https://aurlshortener.herokuapp.com/new/https://www.google.com```

  **Output:** ```{"_id":"58a8c8d015d41800111d733d","url":"http://www.google.com","short_code":"Sk_ROHIYx"}```

2. If I pass an invalid URL that doesn't follow the valid
  http://www.example.com format, the JSON response will contain an
  error instead.

  **Usage:** ```https://aurlshortener.herokuapp.com/new/blahblahblah```

  **Output:** ```{"error":"Incorrect URL format. Ensure that your URL has a valid protocol and format. blahblahblah"}```
3. When I visit that shortened URL, it will redirect me to my
  original link.

  **Usage:** ```https://aurlshortener.herokuapp.com/Sk_ROHIYx```

  **Output:** ```https://www.google.com/```
4. When I pass the 'urls' keyword in the url, all the URLs in the
  database will be displayed in JSON format.

  **Usage:** ```https://aurlshortener.herokuapp.com/urls```

  **Output:** ```{"urls":[{"_id":"58a860775d711608d7c607fc","url":"http://www.google.com","short_code":"rylKxkIYg"}]}```
5. When I pass the 'delete' keyword in the url along with either a
  parameter containing the URL or its shortcode, that URL will be
  deleted from the database.

  **Usage (w/URL):** ```https://aurlshortener.herokuapp.com/delete/www.google.com```

  **Output:** ```{"entry_deleted": [{"_id":"58a860775d711608d7c607fc","url":"http://www.google.com","short_code":"rylKxkIYg"}]}```

  **Usage (w/short code):** ```https://aurlshortener.herokuapp.com/delete/rylKxkIYg```

  **Output:** ```{"entry_deleted": [{"_id":"58a860775d711608d7c607fc","url":"http://www.google.com","short_code":"rylKxkIYg"}]}```

##Project Dependencies

- Express
- MongoDB
- NodeJS
- Valid-Url

##Project Creation

1. mkdir urlshortener
2. cd urlshortener
3. express
  - Build the application scaffolding using the express generator.
4. npm init
  - Create and initialize the package.json file
5. echo node_modules > .gitignore
  - Exclude files in the node_modules directory from being managed by git.

##Project Runtimes (Local)

1. mongodb
  - Start the MongoDB server
2. nodemon app
  - Start the application
