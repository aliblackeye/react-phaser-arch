import { GameObjects, Scene } from "phaser";

/* import { EventBus } from "../EventBus"; */

export class MainMenuScene extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    playButton: GameObjects.Text;
    settingsButton: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;
    socket: any;

    constructor() {
        super("MainMenu");
    }

    init() {}

    create() {
        /* this.background = this.add.image(0, 0, "menuBg").setOrigin(0); */

        this.title = this.add
            .text(400, 200, "Alikay Yollarda", {
                fontFamily: "Arial Black",
                fontSize: 44,
                color: "#ffff00",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5);

        this.playButton = this.add
            .text(400, 300, "Play", {
                fontFamily: "Arial Black",
                fontSize: 32,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setInteractive()
            .on("pointerover", () => {
                this.playButton.setColor("#ff0000");
            })
            .on("pointerout", () => {
                this.playButton.setColor("#ffffff");
            })
            .on("pointerdown", () => {
                this.scene.start("Game");
            });

        this.settingsButton = this.add
            .text(400, 360, "Settings", {
                fontFamily: "Arial Black",
                fontSize: 32,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setInteractive()
            .on("pointerover", () => {
                this.settingsButton.setColor("#ff0000");
            })
            .on("pointerout", () => {
                this.settingsButton.setColor("#ffffff");
            })
            .on("pointerdown", () => {
                // this.scene.start("Settings");
            });

        // EventBus.emit("current-scene-ready", this);
    }

    update() {}
}

