## twc-express-lambda
If you have an API key for The Weather Company, you can use this nodejs express based server in the ArcGIS Online Webmap viewer and other apps.

### Test it out
- `git clone`
- `npm install`
- `npm start`

### Deploy to AWS Lambda

This service can be quickly deployed and scaled with AWS Lambda using ClaudiaJS. [Get Started setting up ClaudiaJS in your environment](https://claudiajs.com/tutorials/serverless-express.html).

To create the service:

- `npm run lambda-create`

To deploy code updates

- `npm run lambda-update`

### AWS Lambda configuration

By default, AWS Lambda has a 3 second timeout and only 128MB memory. Consider changing the AWS Lambda timeout to a higher time limit (e.g. 60 seconds) as well as add more memory (e.g. 512MB) if needed.
