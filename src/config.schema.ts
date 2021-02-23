import * as Joi from 'joi';

/**
 * Define Schema for environment variables to ensure application does not
 * start without mandatory environment variables.
 */
const schema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().default(3000),
  GCP_PROJECT_ID: Joi.string().required(),
  GOOGLE_APPLICATION_CREDENTIALS: Joi.string().default('credentials.json'),
  GCP_PUBSUB_SUBSCRIPTION_ID: Joi.string().default('email-outbox-sub'),
  GCP_PUBSUB_TOPIC_ID: Joi.string().default('email-outbox'),
  SENDGRID_BASE_URL: Joi.string().default('https://api.sendgrid.com/v3'),
  SENDGRID_API_KEY: Joi.string().required(),
  MAILJET_BASE_URL: Joi.string().default('https://api.mailjet.com/v3'),
  MAILJET_API_KEY: Joi.string().required(),
});

export default schema;
