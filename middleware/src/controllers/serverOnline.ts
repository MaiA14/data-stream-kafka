import * as express from "express";
import { TypedRequestBody } from "../..";
import { singleton } from "../decorators/singleton";


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
}
