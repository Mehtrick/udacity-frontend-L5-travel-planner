import fetch from "node-fetch";
import * as dotenv from "dotenv";
dotenv.config();
const geonamesApiUrl = "http://api.geonames.org";

const geonamesApiKey = process.env.APP_GEONAMES_API_KEY;



/**
 * This function searches a location by a name and gets the most relevant result from a list of results.
 *
 * @param name - the searchname of the location
 */
async function searchLocationByName(name) {
    const encodedName = encodeURIComponent(name);
    return await fetch(`${geonamesApiUrl}/searchJSON?q=${encodedName}&maxRows=1&username=${geonamesApiKey}`)
        .then(res => res.json())
        .then(j => {
            console.log(geonamesApiKey);
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
                countryCode: e.countryCode,
                country: e.countryName
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
    searchLocationByName
};