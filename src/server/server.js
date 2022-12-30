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

const destinationDB = [];

app.get("/", function (req, res) {
    res.sendFile(path.resolve("dist/index.html"));
});
app.get("/destination/search", async function (req, res) {
    console.log("info: search destinations", req.query);

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

app.post("/destination",  function (req, res) {
    req.body.id = (Math.random() + 1).toString(36);
    destinationDB.push(req.body);
    console.log("size of db",destinationDB.length);
    res.send(req.body);
});

app.get("/destination", function (req, res) {
    console.log("info: get destination");
    res.send(destinationDB);
});