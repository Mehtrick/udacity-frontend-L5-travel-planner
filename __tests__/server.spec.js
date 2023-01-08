import { searchImageByDestination } from "../src/server/pixabay.service";
import { getWeather } from "../src/server/weatherbit.service";
import {searchLocationByName} from "../src/server/geonames.service";
describe("Test Methods are available", () => {
    test("Test pixaby function", async () => {
        expect(searchImageByDestination).toBeDefined();
    });
    test("Test weatherbit function", async () => {
        expect(getWeather).toBeDefined();
    });
    test("Test geonames function", async () => {
        expect(searchLocationByName).toBeDefined();
    });
});