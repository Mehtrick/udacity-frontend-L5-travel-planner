import path from "path";
import express from "express";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import {searchByName} from "./geonames.service.js";
import {getWeather} from "./weatherbit.service.js";
import {searchImageByDestination} from "./pixabay.service.js";

dotenv.config();
const app = express();
const port = process.env.APP_PORT ? process.env.APP_PORT : 3000;


var corsOptions = {
    origin: ["http://localhost:8080", "http://192.168.178.23:8080"],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.static("dist"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.listen(port, () => {
    console.log(`Travel App listening on port ${port}`);
});

const tripDB = [];

app.get("/", function (req, res) {
    res.sendFile(path.resolve("dist/index.html"));
});
app.get("/trip/search", async function (req, res) {
    const foundDestination = await searchByName(req.query.destination).then();
    if (foundDestination.err) {
        res.statusMessage = foundDestination.err;
        res.status(foundDestination.status).end();
        return;
    }
    const weather = await getWeather(foundDestination, req.query.date);
    if (weather.err) {
        res.statusMessage = weather.err;
        res.status(weather.status).end();
        return;
    }
    foundDestination.weather = weather;
    foundDestination.image = await searchImageByDestination(foundDestination);
    foundDestination.date = req.query.date;
    res.send(foundDestination);
});

app.post("/trip",  function (req, res) {
    req.body.id = randomId();
    tripDB.push(req.body);
    tripDB.sort(function (a,b) {
        return new Date(b.date) - new Date(a.date);
    }).reverse();
    res.send(req.body);
});

app.delete("/trip",  function (req, res) {
    const id = req.query.id;
    const elementToDelete = tripDB.find(x => x.id === id);
    const index = tripDB.indexOf(elementToDelete);
    if (index > -1) { // only splice array when item is found
        tripDB.splice(index, 1); // 2nd parameter means remove one item only
    }
    res.send();
});

function randomId(){
    return Math.random().toString(36).substring(2,10);
}


app.get("/trip", function (req, res) {
    res.send(tripDB);
});