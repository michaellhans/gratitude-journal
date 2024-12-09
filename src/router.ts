import * as express from 'express'
import Gratitude from './services/gratitude';
import cors from 'cors'

class Router {

    private gratitude: Gratitude;

    constructor(server: express.Express) {
        this.gratitude = new Gratitude();
        const router = express.Router()

        // Get all gratitude entries
        router.get('/gratitude', cors(), async (req: express.Request, res: express.Response) => {
            const { startDate, endDate, date } = req.query;
            while(!this.gratitude.isDataLoaded()) {
                await await this.gratitude.init();
            }

            if (date) {
                res.json({
                    gratitude: this.gratitude.getGratitudeData(date, date)
                });
            } else {
                res.json({
                    gratitude: this.gratitude.getGratitudeData(startDate, endDate)
                });
            }
        });

        // Get top 10 people
        router.get('/gratitude/top-people', cors(), async (req: express.Request, res: express.Response) => {
            const { startDate, endDate } = req.query;
            while(!this.gratitude.isDataLoaded()) {
                await this.gratitude.init();
            }

            res.json({
                people: this.gratitude.getTopPeople(startDate, endDate)
            });
        });

        // Get good habits sorted by frequency
        router.get('/gratitude/good-habits', cors(), async (req: express.Request, res: express.Response) => {
            const { startDate, endDate } = req.query;
            while(!this.gratitude.isDataLoaded()) {
                await this.gratitude.init();
            }

            res.json({
                good_habits: this.gratitude.getGoodHabits(startDate, endDate)
            });
        });

        // Get bad habits sorted by frequency
        router.get('/gratitude/bad-habits', cors(), async (req: express.Request, res: express.Response) => {
            const { startDate, endDate } = req.query;
            while(!this.gratitude.isDataLoaded()) {
                await this.gratitude.init();
            }

            res.json({
                bad_habits: this.gratitude.getBadHabits(startDate, endDate)
            });
        });

        // Get KPI Dashboard
        router.get('/gratitude/kpi-dashboard', cors(), async (req: express.Request, res: express.Response) => {
            const { startDate, endDate } = req.query;
            while(!this.gratitude.isDataLoaded()) {
                await this.gratitude.init();
            }

            res.json({
                statistics: {
                    total_entries: this.gratitude.countEntries(),
                    total_entries_mtd: this.gratitude.countEntriesBetweenDates(startDate, endDate),
                    total_grateful_things: this.gratitude.getTotalGratefulThings(startDate, endDate),
                    total_mistakes: this.gratitude.getTotalMistakes(startDate, endDate),
                    total_unique_people: this.gratitude.countUniquePeople(startDate, endDate)
                },
                chart: {
                    top_people: this.gratitude.getTopPeople(startDate, endDate),
                    good_habits: this.gratitude.getGoodHabits(startDate, endDate),
                    bad_habits: this.gratitude.getBadHabits(startDate, endDate),
                    most_grateful_days: this.gratitude.getMostGratefulDays(startDate, endDate),
                    most_mistake_days: this.gratitude.getMostRegrettableDays(startDate, endDate),
                }
            });
        });

        router.get('/', (req: express.Request, res: express.Response) => {
            res.json({
                message: `Nothing to see here, [url]/gratitude instead.`
            })
        })

        router.options('*', cors());

        server.use('/api/', router)
    }
}

export default Router;