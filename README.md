# Streams

## Prerequisites
The following technologies should be installed globally
* Node 
* Docker

In this project I combined socket.io & Kafka in order to stream messages from server to client

![Image of design](https://res.cloudinary.com/dtwqtpteb/image/upload/v1672091211/vk9u56i5ttam4ll5ytfg.png)


## Running

This bash script will build the image of the project

```
sh run.sh
```


## Assumptions
* Since the messages order seems to be non issue, I didn't relate to it.
* Middleware layer works as bridge between main server and client. Middleware listens to Kafka messages that are published by main server.
* Client supports sort, filter & pagination of messages.


![Image of design](https://i.ibb.co/WfJ7Qj4/6.png)
