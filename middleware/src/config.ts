const SERVER_PORT = 6000;
const SERVER_HTTP_PORT = 80;
const SERVER_IP = '127.0.0.1'; // localhost
const ORIGIN = '*';
const SOCKET = "http://localhost:8080";

const SERVER = {
    port: SERVER_PORT,
    httpPort: SERVER_HTTP_PORT,
    ip: SERVER_IP,
    origin: ORIGIN,
}

const config = {
    server: SERVER,
    socketUrl: SOCKET
}




export default config;