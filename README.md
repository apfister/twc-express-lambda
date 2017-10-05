## twc-express-lambda
If you have an API key for The Weather Company, you can use this nodejs express based server in the ArcGIS Online Webmap viewer and other apps.

### Test it out
- `git clone`
- `npm install`
- `npm start`

To get a listing of available `layerIds`, you can use this call:

`http://localhost:8080/layers?apiKey=12345678910`

You can add a URL to ArcGIS Online as a [Tile Layer](http://doc.arcgis.com/en/arcgis-online/create-maps/add-layers.htm#ESRI_SECTION2_2C913FF2022B4DD29BF9DA6CB6014EDB). You will need to subsititute the `layerId` for the layer you wish to use as well as provide your own `apiKey`. Leave the `level`, `row`, and `col` params formatted with curly braces.

Example:

`http://localhost:8080/<layerId>/{level}/{row}/{col}/<apiKey>`

### Deploy to AWS Lambda

This service can be quickly deployed and scaled with AWS Lambda using ClaudiaJS. [Get Started setting up ClaudiaJS in your environment](https://claudiajs.com/tutorials/serverless-express.html).

To create the service:

- `npm run lambda-create`

To deploy code updates

- `npm run lambda-update`

### AWS Lambda configuration

By default, AWS Lambda has a 3 second timeout and only 128MB memory. Consider changing the AWS Lambda timeout to a higher time limit (e.g. 60 seconds) as well as add more memory (e.g. 512MB) if needed.
