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

- Install <a href="https://nodejs.org/en/">Node.Js</a> on machine where application is being run(minimum version 12)
- You'll also need .env file which should be placed at the root level of the application. Please contact the recruiter or email me at anjith.p@gmail.com for the file

Once the above steps are done, navigate to the root level of the application and run the below command:

```bash
$ npm install
```

## Running the app

Note: Please make sure you have .env file(see above) and it is placed at the app root directory before running the below command

```bash
$ npm run start
```

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
