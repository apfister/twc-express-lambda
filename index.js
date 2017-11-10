const config = require('config');
const express = require('express');
const app = express();
const rpn = require('request-promise-native');
const schedule = require('node-schedule');

let seriesInfo;

const updateTimeSlices = (apiKey) => {
  const uri = `https://api.weather.com/v3/TileServer/series/productSet/PPAcore?apiKey=${apiKey}`;

  const params = {
    uri,
    json: true
  };

  return rpn(params)
    .then(body => {
      seriesInfo = body.seriesInfo;
      return seriesInfo;
    })
    .catch(error => {
      throw new Error(error);
    });
};

app.use('/:layerId/:level/:row/:col/:apiKey', (req, res, next) => {
  if (!seriesInfo) {
    console.log('initializing seriesInfo');

    const apiKey = req.params.apiKey;

    updateTimeSlices(apiKey)
      .then(() => {
        const everyFiveMinutes = '*/5 * * * *';

        schedule.scheduleJob(everyFiveMinutes, () => {
          updateTimeSlices(apiKey);
        });
        next();
      });
  } else {
    next();
  }
});

app.use('/:layerId/:level/:row/:col/:apiKey', (req, res) => {
  const layerId = req.params.layerId;
  const apiKey = req.params.apiKey;

  const level = req.params.level;
  const row = req.params.row;
  const col = req.params.col;

  const timeSlice = seriesInfo[layerId].series[0].ts;

  let requestUrl = `https://api.weather.com/v3/TileServer/tile/${layerId}?ts=${timeSlice}&xyz=${col}:${row}:${level}&apiKey=${apiKey}`;

  if (seriesInfo[layerId].series[0].fts) {
    const fts = seriesInfo[layerId].series[0].fts[0];
    requestUrl = `${requestUrl}&fts=${fts}`;
  }

  // request
  //   .get(requestUrl)
  //   .pipe(res);

  // lambda can't hang with sending images back; only json. so just do some redirects (?)
  res.redirect(302, requestUrl);
});

app.use('/layers', (req, res) => {
  if (!req.query.apiKey) {
    return res.send('you must provide the apiKey as a parameter in your URL. ex: ?apiKey=12345678910');
  }

  updateTimeSlices(req.query.apiKey)
    .then(seriesInfo => {
      const originUrl = `${req.protocol}://${req.get('host')}`;
      const layers = Object.keys(seriesInfo).map(key => {
        return {
          layerId: key,
          webTileLayerTemplateUrl: `${originUrl}/${key}/{level}/{row}/{col}/${req.query.apiKey}`
        };
      });

      res
        .status(200)
        .json(layers);
    })
    .catch(err => {
      return res.send(`error getting seriesInfo: ${err.message}`);
    });
});

if (process.env.DEPLOY === 'export') {
  module.exports = app;
} else {
  // Start listening for HTTP traffic

  // Set port for configuration or fall back to default
  const port = config.port || 8080;
  app.listen(port, () => {
    const message = `

    now listening on ${port}

    Try it out in your browser: http://localhost:${port}/layers
    Or on the command line: curl --silent http://localhost:${port}/layers

    Press control + c to exit
    `;
    console.log(message);
  });
}
