import { GameObjects, Scene } from "phaser";
import { Socket, io } from "socket.io-client";
import { MenuUIManager } from "./Scripts/UI/MenuUIManager";

export class MainMenu extends Scene {
    // Socket
    socket: Socket;

    // Assets
    background: GameObjects.Image;

    // UI Manager
    menuUIManager: MenuUIManager;

    // Variables
    serverOnline: boolean = false;

    constructor() {
        super("MainMenu");
    }

    init(data: any) {
        console.log("init", data);
    }

    create() {
        const socket = io(import.meta.env.VITE_SOCKET_URL as string);
        this.socket = socket;

        this.menuUIManager = new MenuUIManager(this);
        this.menuUIManager.createUI();

        // EventBus.emit("current-scene-ready", this);
    }

    update() {
        this.updateUIVisibility();
    }

    private updateUIVisibility() {
        if (this.socket.connected) {
            this.serverOnline = true;
            this.menuUIManager.showOnlineUI();
        } else {
            this.serverOnline = false;
            this.menuUIManager.showOfflineUI();
        }
    }
}

