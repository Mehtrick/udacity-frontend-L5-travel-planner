# My Travel App - Loona

# Table of contents
- [Features](#features)
- [How to run](#how-to-run)
- [Client development](#client-development)
- [Dependencies](#dependencies)
- [License & Copyright](#license--copyright)



## Features

[(Back to top)](#table-of-contents)

Loona allows you to search for destinations at a desired date. Just enter an destination and date on the start of the page. 

You will then get a preview of the upcoming day, containing the expected weather and an image.

Then you can decide if you want to add the trip to your upcoming trips by saving it. If you don't want to add the trip, just cancel it or search for another destination.

Trips added to your upcoming locations can be deleted.

Trips are only saved temporarily in the server-cache. If you restart the server all trips will be gone.

## How to run 

[(Back to top)](#table-of-contents)

The project is build on node `18.12.1`. You should use at least a node 18 for the app to run correctly

Please put a `.env` file in the root of the project containing the following entries:

````dotenv
APP_WEATHER_API_KEY=<weatherbit-api-key>
APP_PIXABAY_API_KEY=<pixaby-api-key>
APP_GEONAMES_API_KEY=<geonames-api-key>
````

After that you need to run the follow commands

```npm
npm i
npm run build-prod
npm run serve-server
```

This will start an instance of the loona-app running on http://localhost:8081 .

## Client development

[(Back to top)](#table-of-contents)

You can also run the client in a dev-server to get automatic hot swapping of the updated files. Therefore just run:

````npm
npm run serve-client
````

**Note:** Doing this you will create an error in the web-console that the `service-worker.js` cannot be found. This is intentional and okay because the Workboxplugin used to generate the server-worker does not work well with an webpack-dev-server. Therefore it is only running when building for production. See [this issue](https://github.com/GoogleChrome/workbox/issues/1790) for further information: 


## Testing

[(Back to top)](#table-of-contents)

Tests are found under
* __tests__/client/
* __tests__/server/

and can be executed by calling
```npm
npm run test
```

## Dependencies

[(Back to top)](#table-of-contents)

* Node 18.12.1

# License & Copyright
[(Back to top)](#table-of-contents)

The project is based on the udacity frontend developer nano degree. 