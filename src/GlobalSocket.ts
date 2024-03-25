import { io, Socket } from "socket.io-client";

export class GlobalSocket {
    static socket: Socket;

    static connect(url: string) {
        this.socket = io(url);
    }
}

