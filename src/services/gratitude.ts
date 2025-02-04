// Description: This file contains the Gratitude class that is responsible for fetching data from the Google Sheets API.
import axios from "axios";
import GratitudeEntry from "../models/GratitudeEntry";
import FrequencyEntry from "../models/FrequencyEntry";

class Gratitude {
    private GOOGLE_URL = "https://script.google.com/macros/s/AKfycbw45zhS8dT--VGQo0VUgwt5-veI1DDzRuwABIx2lUTIuGmm9FN2lvf6gHorcwPNITwcqQ/exec";
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
    public getGratitudeData(startDate, endDate): GratitudeEntry[] {
        if (startDate === undefined || endDate === undefined) {
            return this.data;
        }
        return this.data.filter(entry => entry.date >= startDate && entry.date <= endDate);
    }

    // Return the number of entries
    public countEntries(): number {
        return this.data.length;
    }

    // Get MTD (Month to Date) number of entries
    public countEntriesBetweenDates(startDate, endDate): number {
        return this.getGratitudeData(startDate, endDate).length;
    }

    // Check if the data is loaded]
    public isDataLoaded(): boolean {
        return this.data !== undefined;
    }

    // Get top 10 most mentioned people
    public getTopPeople(startDate, endDate): FrequencyEntry[] {
        const filteredData = this.getGratitudeData(startDate, endDate);
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
        const filteredData = this.getGratitudeData(startDate, endDate);
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
        const filteredData = this.getGratitudeData(startDate, endDate);
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
    
    // Get the total of grateful things
    public getTotalGratefulThings(startDate, endDate): number {
        const filteredData = this.getGratitudeData(startDate, endDate);
        return filteredData.map(entry => entry.grateful).flat().length;
    }

    // Get the total of mistakes
    public getTotalMistakes(startDate, endDate): number {
        const filteredData = this.getGratitudeData(startDate, endDate);
        return filteredData.map(entry => entry.mistake).flat().length;
    }

    // Get the total of unique people
    public countUniquePeople(startDate, endDate): number {
        const filteredData = this.getGratitudeData(startDate, endDate);
        return new Set(filteredData.map(entry => entry.people).flat()).size;
    }

    // Get top 10 date with most grateful things based on total characters written in grateful
    public getMostGratefulDays(startDate, endDate): FrequencyEntry[] {
        const filteredData = this.getGratitudeData(startDate, endDate);
        let dates = filteredData.map(entry => entry.date);
        let dateCount = {};
        dates.forEach(date => {
            const gratefulLength = filteredData.filter(entry => entry.date === date).map(entry => entry.grateful).flat().join('').length;
            if (dateCount[date.toString()]) {
                dateCount[date.toString()] += gratefulLength;
            } else {
                dateCount[date.toString()] = gratefulLength;
            }
        });
        return Object.keys(dateCount).sort((a, b) => dateCount[b] - dateCount[a]).slice(0, 10).map(date => ({ key: date, value: dateCount[date] }));
    }

    // Get top 10 date with most mistakes
    public getMostRegrettableDays(startDate, endDate): FrequencyEntry[] {
        const filteredData = this.getGratitudeData(startDate, endDate);
        let dates = filteredData.map(entry => entry.date);
        let dateCount = {};
        dates.forEach(date => {
            const currentMistakes = filteredData.filter(entry => entry.date === date).map(entry => entry.mistake).flat().join('').length;
            if (dateCount[date.toString()]) {
                dateCount[date.toString()] += currentMistakes;
            } else {
                dateCount[date.toString()] = currentMistakes;
            }
        });
        return Object.keys(dateCount).sort((a, b) => dateCount[b] - dateCount[a]).slice(0, 10).map(date => ({ key: date, value: dateCount[date] }));
    }

}

export default Gratitude;
