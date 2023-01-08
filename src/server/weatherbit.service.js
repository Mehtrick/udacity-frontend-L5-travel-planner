// https://www.weatherbit.io/api

import * as dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config();
const weatherbitApiURL = "https://api.weatherbit.io/v2.0/";
const weatherbitApiKey = process.env.APP_WEATHER_API_KEY;


/**
 * Get the weather of a destination on a specific date. If the date is within 16 days in the future, it will return the forecast of this date.
 * Else it will load the average weather of the last years to make a prediction.
 * @param destination - the destination containing and lat and lon.
 * @param date
 */
async function getWeather(destination, date) {
    const searchDate = new Date(date);
    const today = new Date();
    //The weatherbit api can generate a forecast for the next 16 days but no more.
    const maxForecastDate = today.setDate(today.getDate() + 16);

    if (searchDate.getTime() > maxForecastDate || searchDate.getTime() < new Date().getTime()) {
        return getAverageWeather(destination, date);
    } else {
        return getWeatherForecast(destination, date);
    }
}


/**
 * Calls the weatherbit api to get a forecast of the next 16 days.
 * Returns the weather of the passed date
 * @param trip
 * @param date
 */
async function getWeatherForecast(trip, date) {
    return await fetch(`${weatherbitApiURL}/forecast/daily?lat=${trip.lat}&lon=${trip.lng}&key=${weatherbitApiKey}`)
        .then(res => res.json())
        .then(j => {
                const weatherOfDate = j.data.filter(f => f.datetime === date)[0];
                return {
                    temp: weatherOfDate.temp,
                    min_temp: weatherOfDate.min_temp,
                    max_temp: weatherOfDate.max_temp,
                    precip: weatherOfDate.precip,
                    snow: weatherOfDate.snow,
                    icon: weatherOfDate.weather,
                    pop: weatherOfDate.pop,
                    //The type is here to know if the date information are based on a forecast or if they are taken from historical data
                    type: "forecast"
                };
            }
        ).catch(error => {
            console.log("error:", error);
            return {
                err: "Something went wrong. Contact administrator.",
                status: 500
            };
        });
}

// Parses a date object to the format MM-DD. This is required for the weatherbit-api
function formatDate(date) {
    const jsDate = new Date(date);
    let month = (1 + jsDate.getMonth()).toString();
    month = month.length > 1 ? month : "0" + month;
    let dayOfMonth = jsDate.getDate().toString();
    dayOfMonth = dayOfMonth.length > 1 ? dayOfMonth : "0" + dayOfMonth;
    return `${month}-${dayOfMonth}`;

}

/**
 * Calls the weatherbit api to get the weather normals of a day
 * Returns the weather of the passed date
 * @param trip
 * @param date
 */
async function getAverageWeather(trip, date) {
    const day = formatDate(date);
    return await fetch(`${weatherbitApiURL}/normals?lat=${trip.lat}&lon=${trip.lng}&start_day=${day}&end_day=${day}&key=${weatherbitApiKey}`)
        .then(res => res.json())
        .then(j => {
            const data = j.data[0];
            return {
                temp: data.temp,
                precip: data.precip,
                min_temp: data.min_temp,
                max_temp: data.max_temp,
                snow: data.snow,
                pop: data.pop,
                icon: {icon: "c02d"},
                //The type is here to know if the date information are based on a forecast or if they are taken from historical data
                type: "historical"
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
    getWeather
};