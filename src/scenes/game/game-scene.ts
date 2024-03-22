/* import { EventBus } from "../EventBus"; */
import { Scene } from "phaser";
import { Socket, io } from "socket.io-client";

// Assets
import background from "@/assets/sky.png";
import platform from "@/assets/platform.png";
import player from "@/assets/characters/player.png";

export class GameScene extends Scene {
    // Socket
    socket: Socket;

    // Variables
    playerId: string;

    // Assets
    background: Phaser.GameObjects.Image;

    // Statics
    platforms: Phaser.Physics.Arcade.StaticGroup;

    // Input
    direction: "left" | "right" | "idle" | "up" | "down";
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
        this.socket = io("http://localhost:5000");
        this.otherPlayers = this.physics.add.group();

        this.socket.on("currentPlayers", (players) => {
            console.log("Players: ", players);
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
    }

    update() {
        this.movementController();
    }

    movementController() {
        if (this.player == undefined) {
            return;
        }

        const speed = 100;

        if (this.keys.up.isDown || this.keys.w.isDown) {
            this.player.setVelocityY(-speed);
            this.player.anims.play("walk_up", true);
            this.direction = "up";
        } else if (this.keys.down.isDown || this.keys.s.isDown) {
            this.player.setVelocityY(speed);
            this.player.anims.play("walk_down", true);
            this.direction = "down";
        } else if (this.keys.left.isDown || this.keys.a.isDown) {
            this.player.setFlipX(true);
            this.player.setVelocityX(-speed);
            this.player.anims.play("walk_left", true);
            this.direction = "left";
        } else if (this.keys.right.isDown || this.keys.d.isDown) {
            this.player.setFlipX(false);
            this.player.setVelocityX(speed);
            this.player.anims.play("walk_right", true);
            this.direction = "right";
        } else {
            this.player.setVelocity(0, 0);
            console.log(this.direction);
            switch (this.direction) {
                case "left":
                    this.player.anims.play("idle_left", true);
                    break;
                case "right":
                    this.player.anims.play("idle_right", true);
                    break;
                case "up":
                    this.player.anims.play("idle_up", true);
                    break;
                case "down":
                    this.player.anims.play("idle_down", true);
                    break;
            }
        }

        const x = this.player.x;
        const y = this.player.y;

        const oldPosition = this.player.getData("oldPosition");

        if (oldPosition && (x !== oldPosition.x || y !== oldPosition.y)) {
            this.socket.emit("playerMovement", {
                x,
                y,
            });
        }

        this.player.data.set("oldPosition", {
            x: this.player.x,
            y: this.player.y,
        });
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

