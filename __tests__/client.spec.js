import {deleteTravelBookEntry, getTripEntries, saveTrip, searchTrip} from "../src/client/js/api";
import {calculateDaysUntilTrip} from "../src/client/js/tripentry";

describe("Test Methods are available", () => {
    test("Test api call functions are available", () => {
        expect(deleteTravelBookEntry).toBeDefined();
        expect(getTripEntries).toBeDefined();
        expect(searchTrip).toBeDefined();
        expect(saveTrip).toBeDefined();
    });
});

describe("Test days until functions", () => {
    test("Days Until with today",  () => {
        expect(calculateDaysUntilTrip(new Date().toISOString())).toBe(0);
    });

    test("Days Until with next week",  () => {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        expect(calculateDaysUntilTrip(date.toISOString())).toBe(7);
    });

});