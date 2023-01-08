import * as dotenv from "dotenv";
import fetch from "node-fetch";

const pixabayApiUrl = "https://pixabay.com/api/";
const pixabayApiKey = process.env.APP_PIXABAY_API_KEY;

dotenv.config();

/**
 * This function searches an image by the name of the trip. If no images are found for the name of the trip,
 * the function will try to find an image for the country of the trip
 * @param trip - Object containing a name and a country property
 */
async function searchImageByDestination(trip) {
    let nameSearchResult = await searchImageByName(trip.name);
    //When no images is found for the name of the trip then search by country
    if (!nameSearchResult) {
        nameSearchResult = await searchImageByName(trip.country);
    }
    return nameSearchResult.webformatURL;
}


async function searchImageByName(name) {
    const encodedName = encodeURIComponent(name);
    return await fetch(`${pixabayApiUrl}?q=${encodedName}&orientation=horizontal&per_page=3&key=${pixabayApiKey}`)
        .then(res => {
            return res.json();
        })
        .then(j => {
            //Get the most relevant
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