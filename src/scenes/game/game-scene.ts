/* import { EventBus } from "../EventBus"; */
import { Scene } from "phaser";
import { Socket, io } from "socket.io-client";

// Assets
import background from "@/assets/sky.png";
import platform from "@/assets/platform.png";
import player from "@/assets/characters/player.png";
import { PlayerMovement } from "./scripts/player/player-movement";

export class GameScene extends Scene {
    // Scripts
    private playerMovement: PlayerMovement;

    // Socket
    socket: Socket;

    // Variables
    playerId: string;
    speed: number = 100;

    // Assets
    background: Phaser.GameObjects.Image;

    // Statics
    platforms: Phaser.Physics.Arcade.StaticGroup;

    keys: any;

    // Players
    player: Phaser.Physics.Arcade.Sprite;
    otherPlayers: Phaser.Physics.Arcade.Group;

    constructor() {
        super("Game");
    }

    preload() {
        this.load.image("background", background);
        this.load.image("platform", platform);
        this.load.spritesheet("player", player, {
            frameWidth: 96,
            frameHeight: 96,
            spacing: 0,
        });
    }

    create() {
        this.socket = io(import.meta.env.VITE_SOCKET_URL as string);
        this.otherPlayers = this.physics.add.group();

        this.socket.on("currentPlayers", (players) => {
            players.forEach((p: any) => {
                if (p.playerId === this.socket.id) {
                    this.addPlayer(p);
                } else {
                    this.addOtherPlayer(p);
                }
            });
        });

        this.socket.on("newPlayer", (player: any) => {
            this.addOtherPlayer(player);
        });

        this.socket.on("playerMovement", (player: any) => {
            this.otherPlayers.getChildren().forEach((otherPlayer: any) => {
                if (otherPlayer.playerId === player.playerId) {
                    otherPlayer.setPosition(player.x, player.y);
                }
            });
        });

        this.socket.on("playerLeft", (playerId: string) => {
            console.log("Player disconnected: ", playerId);
            this.otherPlayers.getChildren().forEach((otherPlayer: any) => {
                if (playerId === otherPlayer.playerId) {
                    otherPlayer.destroy();
                }
            });
        });

        this.gameScript();

        this.playerMovement = new PlayerMovement(this.socket);
    }

    update() {
        this.playerMovement.movementController();
    }

    addPlayer(player: any) {
        // Oyuncu oluşturulduktan sonra bir dikdörtgen ekleyin
        this.player = this.physics.add.sprite(player.x, player.y, "player");

        // Oyuncu dünyanın sınırlarına çarpsın ve düşmesin diye ekledik
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.platforms);

        this.player.setSize(24, 32);

        this.player.setOffset(
            this.player.width / 2 - 12, // x
            this.player.height / 2 + 2 // y
        ); // Oyuncunun collider konumunu ayarlayın

        this.playerId = player.playerId;

        this.playerMovement.setPlayer(this.player, this.keys);
    }

    addOtherPlayer(player: any) {
        this.otherPlayers.create(player.x, player.y, "player");

        // Oyuncunun yere düşünce zıplamasını sağladık
        this.otherPlayers.children.iterate((child: any) => {
            // Oyuncu dünyanın sınırlarına çarpsın ve düşmesin diye ekledik
            child.setCollideWorldBounds(true);
            this.physics.add.collider(child, this.platforms);

            child.setSize(24, 32);

            child.setOffset(
                child.width / 2 - 12, // x
                child.height / 2 + 2 // y
            ); // Oyuncunun collider konumunu ayarlayın

            child.playerId = player.playerId;

            return child;
        });
    }

    gameScript() {
        // Arka plan resmini ekledik
        this.background = this.add.image(400, 300, "background");

        // Zeminleri tutan statik bir fizik grubu oluşturduk
        this.platforms = this.physics.add.staticGroup();

        // Zeminleri oluşturduk
        this.platforms.create(400, 568, "platform").setScale(2).refreshBody();
        this.platforms.create(600, 400, "platform");
        this.platforms.create(50, 250, "platform");
        this.platforms.create(750, 220, "platform");

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

        // add arrows and wasd keys
        this.keys = this.input.keyboard!.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            w: Phaser.Input.Keyboard.KeyCodes.W,
            a: Phaser.Input.Keyboard.KeyCodes.A,
            s: Phaser.Input.Keyboard.KeyCodes.S,
            d: Phaser.Input.Keyboard.KeyCodes.D,
        });

        // player.body.setGravityY(300);
    }
}

