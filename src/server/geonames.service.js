import fetch from "node-fetch";

const geonamesApiUrl = "http://api.geonames.org";
const geonamesApiKey = "mehtrick";

async function searchByName(name) {
    const encodedName = encodeURIComponent(name);
    return await fetch(`${geonamesApiUrl}/searchJSON?q=${encodedName}&maxRows=1&username=${geonamesApiKey}`)
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