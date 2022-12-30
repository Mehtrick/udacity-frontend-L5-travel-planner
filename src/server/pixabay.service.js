// https://www.weatherbit.io/api

import * as dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();


const pixabayApiUrl = "https://pixabay.com/api/";
const pixabayApiKey = process.env.APP_PIXABAY_API_KEY;


async function searchImageByDestination(trip) {
    let nameSearchResult = await searchImageByName(trip.name);
    if(!nameSearchResult){
        nameSearchResult = await searchImageByName(trip.country);
    }
    return nameSearchResult.webformatURL;
}


async function searchImageByName(name) {
    const encodedName = encodeURIComponent(name);
    console.log("search", encodedName);
    return await fetch(`${pixabayApiUrl}?q=${encodedName}&orientation=horizontal&per_page=3&key=${pixabayApiKey}`)
        .then(res => {
            return res.json();
        })
        .then(j => {
            return j.hits[0];
        }).catch(error => {
            console.log(error);
            return {
                err: "Something went wrong. Contact administrator.",
                status: 500
            };
        });
}

export {
    searchImageByDestination
};