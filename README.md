## Description

EmailSender app sends emails and gives delivery guarantee once the request has been accepted. Following technologies
are used for implementation:

<ul>
<li><a href="https://nestjs.com/">NestJS</a>(Typescript based Webserver framework built on top of Node.js)</li>
<li><a href="https://cloud.google.com/pubsub/">GCP pubsub</a>(Used for persistence)</li>
<li><a href="https://sendgrid.com/">Sendgrid</a>(Email provider)</li>
<li><a href="https://mailjet/">Mailjet</a>(Email provider)</li>
</ul>

## Installation

Prerequisites:

- Install <a href="https://nodejs.org/en/">Node.Js</a> on machine where application is being run(minimum supported version 12)
- You'll also need .env file and credentials.json file which should be placed at the root level of the application. Please contact the recruiter or email me at anjith.p@gmail.com for the files

Once the above steps are done, navigate to the root level of the application and run the below command:

```bash
$ npm install
```

## Running the app

Note: Please make sure you have .env and credentials.json files(see above) and they are placed at the app root directory before running the below command

```bash
$ npm run start
```

Once the application is up and running you can open the Swagger UI in the browser to test the API call: http://localhost:8080/api/. If port 8080 is already taken by some other process on your machine, then you can change PORT property in .env file and restart the server(for example change port to 3000): Swagger UI URL needs to be changed accordingly.

## Logging

I'm using NestJS built-in logging for this demo which by defualt prints logs to console. But in production we could use something like <a href="https://github.com/winstonjs/winston">winston</a> to do custom config like printing to files, log roll-over etc.

## Test

Run following command to run tests. For this demo, I've added unit tests for important classes. Integration tests
are skipped. They can be easily done with a framework like <a href="https://www.npmjs.com/package/supertest">supertest</a>

```bash
# unit tests
$ npm run test
```

## Stay in touch

- Author - [Anjith Paila](anjith.p@gmail.com)

## License

[MIT licensed](LICENSE).
