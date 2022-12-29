// https://www.weatherbit.io/api

import * as dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const weatherbitApiURL = "https://api.weatherbit.io/v2.0/";
const weatherbitApiKey = process.env.APP_WEATHER_API_KEY;


async function getWeather(destination, date) {
    const searchDate = new Date(date);
    const today = new Date();
    const maxForecastDate = today.setDate(today.getDate() + 16);

    if (searchDate.getTime() > maxForecastDate || searchDate.getTime()<  new Date().getTime()) {
        return getAverageWeather(destination, date);
    } else {
        return getWeatherForecast(destination, date);
    }
}


async function getWeatherForecast(destination, date) {
    return await fetch(`${weatherbitApiURL}//forecast/daily?lat=${destination.lat}&lon=${destination.lng}&key=${weatherbitApiKey}`)
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
                    type: "forecast"
                };
            }
        ).catch(error => {
            console.log("error:",error);
            return {
                err: "Something went wrong. Contact administrator.",
                status: 500
            };
        });
}


async function getAverageWeather(destination, date) {
    const jsDate = new Date(date);
    let month = (1 + jsDate.getMonth()).toString();
    month = month.length > 1 ? month : "0" + month;
    let dayOfMonth = jsDate.getDate().toString();
    dayOfMonth = dayOfMonth.length > 1 ? dayOfMonth : "0" + dayOfMonth;
    const day = `${month}-${dayOfMonth}`;
    return await fetch(`${weatherbitApiURL}/normals?lat=${destination.lat}&lon=${destination.lng}&start_day=${day}&end_day=${day}&key=${weatherbitApiKey}`)
        .then(res => res.json())
        .then(j => {
            const data = j.data[0];
            return {
                temp: data.temp,
                precip: data.precip,
                min_temp: data.min_temp,
                max_temp: data.max_temp,
                snow: data.snow,
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