// Description: This file contains the Gratitude class that is responsible for fetching data from the Google Sheets API.
import axios from "axios";
import GratitudeEntry from "./models/GratitudeEntry";
import FrequencyEntry from "./models/FrequencyEntry";
import { get } from "http";

class Gratitude {
    private GOOGLE_URL = "https://script.google.com/macros/s/AKfycbyBmNoAZuzmefqe0As2a9F-nznKx6Dc_hqhE9caaqRD1TQVRbfO6FK3IFMzE8EygijZBA/exec";
    private data: GratitudeEntry[];

    constructor() {
        this.init();
    }

    async init() {
        try {
            const response = await axios.get(this.GOOGLE_URL);
            this.data = response.data.data;
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }

    // Get data from start date to end date
    public getDataFromRange(startDate, endDate): GratitudeEntry[] {
        if (startDate === undefined || endDate === undefined) {
            console.log('No date range provided');
            return this.data;
        }
        return this.data.filter(entry => entry.date >= startDate && entry.date <= endDate);
    }

    // Return the number of entries
    public countEntries(): number {
        return this.data.length;
    }

    // Check if the data is loaded]
    public isDataLoaded(): boolean {
        return this.data !== undefined;
    }

    // Get top 10 most mentioned people
    public getTopPeople(startDate, endDate): FrequencyEntry[] {
        const filteredData = this.getDataFromRange(startDate, endDate);
        let people = filteredData.map(entry => entry.people).flat();
        let peopleCount = {};
        people.forEach(person => {
            if (peopleCount[person]) {
                peopleCount[person]++;
            } else {
                peopleCount[person] = 1;
            }
        });
        return Object.keys(peopleCount).sort((a, b) => peopleCount[b] - peopleCount[a]).slice(0, 10).map(person => ({ key: person, value: peopleCount[person] }));
    }
    
    // Get good habits sorted by frequency
    public getGoodHabits(startDate, endDate): FrequencyEntry[] {
        const filteredData = this.getDataFromRange(startDate, endDate);
        let habits = filteredData.map(entry => entry.good_habit).flat();
        let habitCount = {};
        habits.forEach(habit => {
            if (habitCount[habit]) {
                habitCount[habit]++;
            } else {
                habitCount[habit] = 1;
            }
        });
        return Object.keys(habitCount).sort((a, b) => habitCount[b] - habitCount[a]).map(habit => ({ key: habit, value: habitCount[habit] }));
    }

    // Get bad habits sorted by frequency
    public getBadHabits(startDate, endDate): FrequencyEntry[] {
        const filteredData = this.getDataFromRange(startDate, endDate);
        let habits = filteredData.map(entry => entry.bad_habit).flat();
        let habitCount = {};
        habits.forEach(habit => {
            if (habitCount[habit]) {
                habitCount[habit]++;
            } else {
                habitCount[habit] = 1;
            }
        });
        return Object.keys(habitCount).sort((a, b) => habitCount[b] - habitCount[a]).map(habit => ({ key: habit, value: habitCount[habit] }));
    }
}

export default Gratitude;
