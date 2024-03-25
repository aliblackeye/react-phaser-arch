import Phaser, { Scene } from "phaser";
import { MenuUIManager } from "./Scripts/UI/MenuUIManager";
import { GlobalSocket } from "@/GlobalSocket";

// Assets
import grass from "@/assets/grass.png";
import player from "@/assets/player.png";

// Scripts
import { NetworkManager } from "../Game/Scripts/Network/NetworkManager";

export class MainMenu extends Scene {
    // Scripts
    networkManager: NetworkManager;

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

        this.menuUIManager = new MenuUIManager(this);
    }

    preload() {
        this.load.spritesheet("player", player, {
            frameWidth: 192,
            frameHeight: 192,
        });
    }

    create() {
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

