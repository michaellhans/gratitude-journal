import * as express from 'express'
import Gratitude from './services/gratitude';
import cors from 'cors'

class Router {

    private gratitude: Gratitude;

    constructor(server: express.Express) {
        this.gratitude = new Gratitude();
        const router = express.Router()

        // Get all gratitude entries
        router.get('/gratitude', cors(), (req: express.Request, res: express.Response) => {
            const { startDate, endDate, date } = req.query;
            while(!this.gratitude.isDataLoaded()) {
                this.gratitude.init();
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
        router.get('/gratitude/top-people', cors(), (req: express.Request, res: express.Response) => {
            const { startDate, endDate } = req.query;
            while(!this.gratitude.isDataLoaded()) {
                this.gratitude.init();
            }

            res.json({
                people: this.gratitude.getTopPeople(startDate, endDate)
            });
        });

        // Get good habits sorted by frequency
        router.get('/gratitude/good-habits', cors(), (req: express.Request, res: express.Response) => {
            const { startDate, endDate } = req.query;
            while(!this.gratitude.isDataLoaded()) {
                this.gratitude.init();
            }

            res.json({
                good_habits: this.gratitude.getGoodHabits(startDate, endDate)
            });
        });

        // Get bad habits sorted by frequency
        router.get('/gratitude/bad-habits', cors(), (req: express.Request, res: express.Response) => {
            const { startDate, endDate } = req.query;
            while(!this.gratitude.isDataLoaded()) {
                this.gratitude.init();
            }

            res.json({
                bad_habits: this.gratitude.getBadHabits(startDate, endDate)
            });
        });

        router.get('/', (req: express.Request, res: express.Response) => {
            res.json({
                message: `Nothing to see here, [url]/gratitude instead.`
            })
        })

        router.options('*', cors());

        server.use('/', router)
    }
}

export default Router;