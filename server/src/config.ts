const SERVER_PORT = 4000;
const SERVER_IP = '127.0.0.1'; // localhost
const ORIGIN = '*' // middleware

const SERVER = {
    port: SERVER_PORT,
    ip: SERVER_IP,
    origin: ORIGIN
}

const config = {
    server: SERVER
}

export default config;