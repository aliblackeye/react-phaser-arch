/* import { EventBus } from "../EventBus"; */
import { Scene } from "phaser";
import { Socket, io } from "socket.io-client";

// Assets
import background from "@/assets/map.png";
import player from "@/assets/characters/player.png";
import { PlayerMovement } from "./scripts/player/player-movement";

export class GameScene extends Scene {
    // Scripts
    private playerMovement: PlayerMovement;

    // Socket
    socket: Socket;

    // Variables
    width: number = 1920;
    height: number = 1080;

    playerId: string;
    speed: number = 100;

    // Assets
    background: Phaser.GameObjects.Image;

    // Inputs
    keys: any;

    // Players
    player: Phaser.Physics.Arcade.Sprite;
    otherPlayers: Phaser.Physics.Arcade.Group;

    constructor() {
        super("Game");
    }

    preload() {
        this.load.image("background", background);
        this.load.spritesheet("player", player, {
            frameWidth: 192,
            frameHeight: 192,
        });
    }

    create() {
        this.socket = io(import.meta.env.VITE_SOCKET_URL as string);
        this.otherPlayers = this.physics.add.group();

        this.socket.on("currentPlayers", (players) => {
            players.forEach((p: any) => {
                if (p.playerId === this.socket.id) {
                    this.addPlayer(p);

                    //  Set the camera and physics bounds to be the size of 4x4 bg images
                    this.cameras.main.setBounds(0, 0, 1920 * 2, 1080 * 2);
                    this.physics.world.setBounds(0, 0, 1920 * 2, 1080 * 2);
                    this.cameras.main.startFollow(this.player, true);
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

        this.player.setSize(48, 64);

        this.player.setOffset(
            this.player.width / 2 - 24, // x
            this.player.height / 2 + 4 // y
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

            child.setSize(48, 64);

            child.setOffset(
                child.width / 2 - 24, // x
                child.height / 2 + 4 // y
            ); // Oyuncunun collider konumunu ayarlayın

            child.playerId = player.playerId;

            return child;
        });
    }

    gameScript() {
        // tüm haritayı kaplayacak şekilde tilesprite ekliyoruz
        this.add.tileSprite(0, 0, 1920 * 4, 1080 * 4, "background");

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

