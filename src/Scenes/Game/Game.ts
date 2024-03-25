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
import { GameUIManager } from "./Scripts/UI/GameUIManager";
import { PlayerSpawner } from "./Scripts/Player/PlayerSpawner";

export class Game extends Scene {
    // Scripts
    private mapManager: MapManager;
    private playerMovement: PlayerMovement;
    private playerAnimations: PlayerAnimations;
    private networkManager: NetworkManager;
    private cameraManager: CameraManager;
    private gameUIManager: GameUIManager;
    private playerSpawner: PlayerSpawner;

    constructor() {
        super("Game");
    }

    init() {
        this.mapManager = new MapManager(this);

        this.cameraManager = new CameraManager(this);
        this.cameraManager.setCameraBounds();

        this.playerAnimations = new PlayerAnimations(this);
        this.playerAnimations.createAnimations();

        this.playerSpawner = new PlayerSpawner(this);

        this.networkManager = new NetworkManager(this);
        this.networkManager.listen();

        this.gameUIManager = new GameUIManager(this);
        this.gameUIManager.create();

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

