/* import { EventBus } from "../EventBus"; */
import { Scene } from "phaser";

// Scripts
import { PlayerMovement } from "./Scripts/Player/PlayerMovement";
import { MapManager } from "./Scripts/Map/MapManager";
import { PlayerAnimations } from "./Scripts/Player/PlayerAnimations";
import { GlobalSocket } from "@/GlobalSocket";
import { NetworkManager } from "./Scripts/Network/NetworkManager";
import { PlayerManager } from "./Scripts/Player/PlayerManager";
import { CameraManager } from "./Scripts/Camera/CameraManager";

export class Game extends Scene {
    // Scripts
    private mapManager: MapManager;
    private playerMovement: PlayerMovement;
    private playerAnimations: PlayerAnimations;
    private networkManager: NetworkManager;
    private cameraManager: CameraManager;

    constructor() {
        super("Game");
    }

    init() {
        this.mapManager = new MapManager(this);

        this.cameraManager = new CameraManager(this);
        this.cameraManager.setCameraBounds();

        this.networkManager = new NetworkManager(this);
        this.networkManager.listen();

        this.playerAnimations = new PlayerAnimations(this);
        this.playerAnimations.createAnimations();

        this.playerMovement = new PlayerMovement(this);

        GlobalSocket.socket.emit("joinGame", PlayerManager.getPlayerName());
    }

    preload() {}

    create() {
        this.mapManager.initMap();
    }

    update() {
        this.playerMovement.playerMovement();
    }
}

