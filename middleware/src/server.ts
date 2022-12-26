import App from "./app";
import config from "./config";
import ServerOnlineController from "./controllers/serverOnline";
import { MessageBrokerService } from "./services/messageBroker/messageBroker";
import { SocketService } from "./services/socket";

const controllers =
{
    [ServerOnlineController.controllerName]: new ServerOnlineController() // default middleware for express
};


const app = new App(controllers, config.server.port);
let socket: SocketService = null;
app.listen(async (expressApp) => {
    try {
        socket = new SocketService();
        socket.connect(expressApp);
        await new MessageBrokerService().subscribe(process.env.TOPIC, (msg) => {
           socket.sendMsg(msg);
        });

    } catch (subscribeErrorOnListen) {
        console.log('subscribeErrorOnListen ', subscribeErrorOnListen.stack);
    }
});


// handle disconnect 
function notifyExit() {
    return new Promise(async function (resolve, reject) {
        try {
            resolve('EXIT ');
            await new MessageBrokerService().disconnect();
            await new socket.disconnect();
        } catch (notifyExitError: any) {
            console.log(notifyExitError.stack);
            reject();
        }
    });
}

process.on("uncaughtException", async function (err: any) {
    console.log("uncaughtException...", err.stack);
    if (err.code != "EADDRNOTAVAIL" && err.code != "EADDRINUSE") {
        try {
            await new MessageBrokerService().disconnect();
            await new socket.disconnect();
        } catch (e) {
            console.log(e);
        }
    }
});

process.on('SIGINT', function () {
    console.log("SIGINT...");
    notifyExit()
        .then(function () {
            process.exit(1);
        })
        .catch(function () {
            process.exit(1);
        });
});

process.on('SIGTERM', function () {
    console.log("SIGTERM...");
    notifyExit()
        .then(function () {
            process.exit(1);
        })
        .catch(function () {
            process.exit(1);
        });
});

process.on('SIGQUIT', function () {
    console.log("SIGQUIT...");
    notifyExit()
        .then(function () {
            process.exit(1);
        })
        .catch(function () {
            process.exit(1);
        });
});

process.on('exit', function (code) {
    console.log("exit...", code);
});