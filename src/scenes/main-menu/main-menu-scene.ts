import { GameObjects, Scene } from "phaser";

/* import { EventBus } from "../EventBus"; */

export class MainMenuScene extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    playButton: GameObjects.Text;
    settingsButton: GameObjects.Text;

    constructor() {
        super("MainMenu");
    }

    init() {}

    create() {
        // tüm haritayı kaplayacak şekilde tilesprite ekliyoruz
        this.add.tileSprite(0, 0, 1920 * 4, 1080 * 4, "menuBg");
        this.title = this.add
            .text(960, 350, "Alikay Yollarda", {
                fontFamily: "Arial Black",
                fontSize: 60,
                color: "#F7DB6A",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5);

        this.playButton = this.add
            .text(960, 500, "Play", {
                fontFamily: "Arial Black",
                fontSize: 48,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setInteractive()
            .on("pointerover", () => {
                this.playButton.setColor("#D24545");
            })
            .on("pointerout", () => {
                this.playButton.setColor("#ffffff");
            })
            .on("pointerdown", () => {
                this.scene.start("GameScene");
            });

        this.settingsButton = this.add
            .text(960, 580, "Settings", {
                fontFamily: "Arial Black",
                fontSize: 48,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setInteractive()
            .on("pointerover", () => {
                this.settingsButton.setColor("#D24545");
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

