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

        /*         this.playerAnimations = new PlayerAnimations(this);
        this.playerAnimations.createAnimations(); */

        this.playerMovement = new PlayerMovement(this);

        GlobalSocket.socket.emit("joinGame", PlayerManager.getPlayerName());
    }

    preload() {}

    create() {
        this.mapManager.initMap();

        // Yürüme ve idle animasyonlarını ekledik
        this.anims.create({
            key: "idle_down",
            /* frames: this.anims.generateFrameNumbers("player", {
                frames: [0, 1, 2, 3, 4, 5],
            }), */
            frames: this.anims.generateFrameNumbers("player", {
                first: 0,
                end: 5,
            }),
            frameRate: 5,
            repeat: -1,
        });

        this.anims.create({
            key: "idle_right",
            frames: this.anims.generateFrameNumbers("player", {
                start: 6,
                end: 11,
            }),
            frameRate: 5,
            repeat: -1,
        });

        this.anims.create({
            key: "idle_up",
            frames: this.anims.generateFrameNumbers("player", {
                start: 12,
                end: 17,
            }),
            frameRate: 5,
            repeat: -1,
        });

        this.anims.create({
            key: "idle_left",
            frames: this.anims.generateFrameNumbers("player", {
                start: 6,
                end: 11,
            }),
            frameRate: 5,
            repeat: -1,
        });

        this.anims.create({
            key: "walk_down",
            frames: this.anims.generateFrameNumbers("player", {
                start: 18,
                end: 23,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "walk_left",
            frames: this.anims.generateFrameNumbers("player", {
                start: 24,
                end: 29,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "walk_right",
            frames: this.anims.generateFrameNumbers("player", {
                start: 24,
                end: 29,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "walk_up",
            frames: this.anims.generateFrameNumbers("player", {
                start: 30,
                end: 35,
            }),
            frameRate: 10,
            repeat: -1,
        });
    }

    update() {
        this.playerMovement.playerMovement();
    }
}

