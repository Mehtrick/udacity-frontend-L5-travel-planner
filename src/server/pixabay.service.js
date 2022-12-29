// https://www.weatherbit.io/api

import * as dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();


const pixabayApiUrl = "https://pixabay.com/api/";
const pixabayApiKey =  process.env.APP_PIXABAY_API_KEY;

async function searchImageByName(name) {
    const encodedName = encodeURIComponent(name);
    return await fetch(`${pixabayApiUrl}searchJSON?q=${encodedName}&key=${pixabayApiKey}`)
        .then(res => res.json())
        .then(j => {
            if (j.geonames.length === 0) {
                return {
                    err: "Destination not found. Try another.",
                    status: 404
                };
            }
            const e = j.geonames[0];
            return {
                name: e.name,
                lat: e.lat,
                lng: e.lng,
                countryCode: e.countryCode
            };
        }).catch(error => {
            console.log(error);
            return {
                err: "Something went wrong. Contact administrator.",
                status: 500
            };
        });
}

export {
    searchByName
};