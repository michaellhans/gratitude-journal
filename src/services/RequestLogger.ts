import { Request, Response, NextFunction } from 'express';

class RequestLogger {
    static logRequests() {
        return (req: Request, res: Response, next: NextFunction) => {
            const start = process.hrtime();
            console.log(`Received ${req.method} request on ${req.path}`);

            res.on('finish', () => {
                const durationInMilliseconds = RequestLogger.getDurationInMilliseconds(start);
                console.log(`${req.method} ${req.path} ${res.statusCode} - ${durationInMilliseconds.toLocaleString()} ms`);
            });

            next();
        };
    }

    private static getDurationInMilliseconds(start: [number, number]) {
        const NS_PER_SEC = 1e9; // Convert from nanoseconds to seconds
        const NS_TO_MS = 1e6; // Convert from nanoseconds to milliseconds
        const diff = process.hrtime(start);

        return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
    }
}

export default RequestLogger;