import path from "path";
import express from "express";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import {searchLocationByName} from "./geonames.service.js";
import {getWeather} from "./weatherbit.service.js";
import {searchImageByDestination} from "./pixabay.service.js";

dotenv.config();
const app = express();
const port = process.env.APP_PORT ? process.env.APP_PORT : 8081;


var corsOptions = {
    //Used for local development
    origin: ["http://localhost:8080","http://localhost:8081"],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.static("dist"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.listen(port, () => {
    console.log(`Travel App listening on port ${port}`);
});

//Storage for all the trips
const tripDB = [];

app.get("/", function (req, res) {
    res.sendFile(path.resolve("dist/index.html"));
});

/**
 * Used to search a trip. This function collects all the desired data for a trip like the location, weather and an image for it
 * Expects 2 query params: destination and date.
 *
 * The destination is a string containing the name of the desired destination
 * The date is considered the date of the trip
 */
app.get("/trip/search", async function (req, res) {
    //get the exact location with geo-dates
    const foundLocation = await searchLocationByName(req.query.destination).then();
    if (foundLocation.err) {
        res.statusMessage = foundLocation.err;
        res.status(foundLocation.status).end();
        return;
    }
    //now get the weather of the location at the desired date
    const weather = await getWeather(foundLocation, req.query.date);
    if (weather.err) {
        res.statusMessage = weather.err;
        res.status(weather.status).end();
        return;
    }
    foundLocation.weather = weather;
    //at the end find an image for the location
    foundLocation.image = await searchImageByDestination(foundLocation);
    foundLocation.date = req.query.date;
    res.send(foundLocation);
});

/**
 * Saves a trip to the tripDB and assigns an id to the object
 */
app.post("/trip",  function (req, res) {
    req.body.id = randomId();
    tripDB.push(req.body);
    //Sorts the database so that the next trip is the first
    tripDB.sort(function (a,b) {
        return new Date(b.date) - new Date(a.date);
    }).reverse();
    res.send(req.body);
});

/**
 * Deletes an trip by its id
 */
app.delete("/trip",  function (req, res) {
    const id = req.query.id;
    const elementToDelete = tripDB.find(x => x.id === id);
    const index = tripDB.indexOf(elementToDelete);
    if (index > -1) {
        tripDB.splice(index, 1);
    }
    res.send();
});

function randomId(){
    return Math.random().toString(36).substring(2,10);
}

/**
 * loads all the trips
 */
app.get("/trip", function (req, res) {
    res.send(tripDB);
});