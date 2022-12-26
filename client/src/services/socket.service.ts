import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io } from "socket.io-client";
import { SOCKET_URL } from 'src/app/env';

@Injectable()
export class SocketService {
  private socket: any;

  constructor() { }

  connect(): Subject<MessageEvent> {
    this.socket = io(SOCKET_URL, {
      transports: ["websocket"] // use webSocket only
    });

    // define our observable which will observe any incoming messages of assignment
    // from our socket.io server.
    let observable = new Observable(observer => {
      this.socket.on('new message', (data: any) => {
        observer.next(typeof data == "object" ? data : JSON.parse(data)); // acknowledge is sent as json, no need to parse it
      })
      return () => {
        this.socket.disconnect();
      }
    });

    // define Observer which will listen to messages
    // from components and send messages back to our
    // socket server whenever the `next()` method is called.
    let observer = {
      next: (data: Object) => {
      },
    };
    return Subject.create(observer, observable);
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}
