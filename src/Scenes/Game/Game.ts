/* import { EventBus } from "../EventBus"; */
import { Scene } from "phaser";
import { Socket } from "socket.io-client";

// Assets
import grass from "@/assets/Backgrounds/Grass.png";
import player from "@/assets/Characters/Player.png";

// Scripts
import { PlayerMovement } from "./Scripts/Player/PlayerMovement";
import { MapManager } from "./Scripts/Map/MapManager";
import { NetworkManager } from "./Scripts/Network/NetworkManager";
import { PlayerSpawner } from "./Scripts/Player/PlayerSpawner";
import { PlayerAnimations } from "./Scripts/Player/PlayerAnimations";
import { PlayerManager } from "./Scripts/Player/PlayerManager";
import { GlobalSocket } from "@/GlobalSocket";

export class Game extends Scene {
    // Scripts
    private mapManager: MapManager;
    private networkManager: NetworkManager;
    private playerMovement: PlayerMovement;
    private playerSpawner: PlayerSpawner;
    private playerAnimations: PlayerAnimations;

    constructor() {
        super("Game");
    }

    init() {
        this.mapManager = new MapManager(this);
        this.playerSpawner = new PlayerSpawner(this);
        this.playerMovement = new PlayerMovement(this);
        this.playerAnimations = new PlayerAnimations(this);
        this.networkManager = new NetworkManager(this, this.playerSpawner);
    }

    preload() {
        this.load.image("background", grass);
        this.load.spritesheet("player", player, {
            frameWidth: 192,
            frameHeight: 192,
        });
    }

    create() {
        this.mapManager.initMap();
        this.playerAnimations.createAnimations();
        this.networkManager.listen();
    }

    update() {
        this.playerMovement.playerMovement();
    }
}

