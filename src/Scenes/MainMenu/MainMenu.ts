import Phaser, { Scene } from "phaser";
import { MenuUIManager } from "./Scripts/UI/MenuUIManager";
import { GlobalSocket } from "@/GlobalSocket";

export class MainMenu extends Scene {
    // Assets
    background: Phaser.GameObjects.Image;

    // UI Manager
    menuUIManager: MenuUIManager;

    // Variables
    serverOnline: boolean = false;

    constructor() {
        super("MainMenu");
    }

    init() {
        GlobalSocket.connect(import.meta.env.VITE_SOCKET_URL as string);
    }

    create() {
        this.menuUIManager = new MenuUIManager(this);
        this.menuUIManager.createUI();

        // EventBus.emit("current-scene-ready", this);
    }

    update() {
        this.updateUIVisibility();
    }

    private updateUIVisibility() {
        if (GlobalSocket.socket.connected) {
            this.serverOnline = true;
            this.menuUIManager.showOnlineUI();
        } else {
            this.serverOnline = false;
            this.menuUIManager.showOfflineUI();
        }
    }
}

