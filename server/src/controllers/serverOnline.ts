import * as express from "express";
import { TypedRequestBody } from "../..";
import { singleton } from "../decorators/singleton";
import { StreamService } from "../services/stream";
import { MessageBrokerService } from "../services/messageBroker/messageBroker";


@singleton
export default class ServerOnlineController {
    public static controllerName = 'server-online';
    public middleware: any;
    public path = `/api/${ServerOnlineController.controllerName}`;
    public router: any = express.Router();

    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.get(
            this.path + '/',
            this.heartbeat
        );
        this.router.post(
            this.path + '/readNotifications',
            this.readNotifications
        );
    }

    private async heartbeat(req: TypedRequestBody<{}>, res: express.Response): Promise<void> {
        console.log('heartbeat');
        try {
            res.status(200).send('server is online');
        } catch (heartbeatError: any) {
            res.status(500).send('server is down');
            return;
        }
    }

    private async readNotifications(req: TypedRequestBody<{ filePath: string, fileName: string, brokerTopic: string }>, res: express.Response): Promise<void> {
        console.log('readNotifications ');
        if (!req.body.filePath || !req.body.fileName) {
            res.status(404).send({ message: 'could not process read notifications due to missing paramters' });
            return;
        }

        try {
            const readStream: any = await new StreamService().readStreamFromGCP(req.body.filePath, req.body.fileName);
            let buffer = ''
            readStream
                .on('data', data => {
                    buffer += data;
                })
                .on('end', () => { // converts bytes to string
                    const data = JSON.parse(buffer);
                    data.forEach(async element => { // publish each event to message broker 
                        await new MessageBrokerService().publish(process.env.TOPIC, { value: JSON.stringify(element) });
                    });

                });
            res.status(200).send({ message: 'notified' });
        } catch (readStreamError) {
            console.error('readStreamError ', readStreamError.stack);
        }
    }
}
