import { PlayerManager } from "@/Scenes/Game/Scripts/Player/PlayerManager";
import Phaser, { GameObjects, Scene } from "phaser";

export class MenuUIManager {
    scene: Scene;

    // Variables
    playerName: string = "";

    // UI elements
    playerNameInput: Phaser.GameObjects.DOMElement;
    playButton: GameObjects.Text;
    title: GameObjects.Text;
    settingsButton: GameObjects.Text;
    offlineTitle: GameObjects.Text;
    offlineText: GameObjects.Text;

    // Constants
    static readonly UI_COLOR = "#ffffff";
    static readonly HOVER_COLOR = "#D24545";
    private readonly MAP_WIDTH: number = 1920;
    private readonly MAP_HEIGHT: number = 1080;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    createUI() {
        this.createBackground();
        this.createTitle();
        this.createPlayerNameInput();
        this.createPlayButton();
        this.createSettingsButton();
        this.createOfflineStatus();
    }

    showOnlineUI() {
        this.offlineTitle.setVisible(false);
        this.offlineText.setVisible(false);

        this.playerNameInput.setVisible(true);
        this.playButton.setVisible(true);
        this.settingsButton.setVisible(true);
    }

    showOfflineUI() {
        this.offlineTitle.setVisible(true);
        this.offlineText.setVisible(true);

        this.playerNameInput.setVisible(false);
        this.playButton.setVisible(false);
        this.settingsButton.setVisible(false);
    }

    private createBackground() {
        this.scene.add.tileSprite(
            0,
            0,
            this.MAP_WIDTH * 4,
            this.MAP_HEIGHT * 4,
            "grass"
        );
    }

    private createTitle() {
        this.title = this.scene.add
            .text(960, 350, "alikay.io", {
                fontFamily: "Arial Black",
                fontSize: 80,
                color: "#F7DB6A",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5);
    }

    private createPlayerNameInput() {
        this.playerNameInput = this.scene.add
            .dom(960, 460)
            .createFromHTML(
                '<input type="text" id="playerNameInput" placeholder="Enter your nickname..." autocomplete="off" style="max-height: 40px; font-size: 24px; border: 0; outline:0; border-radius: 4px; max-width: 300px; padding: 30px 12px; box-sizing: border-box;">'
            );

        const inputElement = document.getElementById(
            "playerNameInput"
        ) as HTMLInputElement;
        inputElement.addEventListener("input", (event) => {
            const value = (event.target as HTMLInputElement).value.trim();
            PlayerManager.setPlayerName(value);
        });
    }

    private createPlayButton() {
        this.playButton = this.createButton(960, 550, "Play", () => {
            if (PlayerManager.getPlayerName().length > 0) {
                this.scene.scene.start("Game");
            } else {
                alert("Please enter a nickname to play!");
            }
        });
    }

    private createSettingsButton() {
        this.settingsButton = this.createButton(960, 630, "Settings", () => {
            alert("Coming soon!");
        });
    }

    private createButton(
        x: number,
        y: number,
        text: string,
        onClick: () => void
    ): GameObjects.Text {
        const button = this.scene.add
            .text(x, y, text, {
                fontFamily: "Arial Black",
                fontSize: 48,
                color: MenuUIManager.UI_COLOR,
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setInteractive()
            .on("pointerover", () => {
                button.setStyle({ color: MenuUIManager.HOVER_COLOR });
            })
            .on("pointerout", () => {
                button.setStyle({ color: MenuUIManager.UI_COLOR });
            })
            .on("pointerdown", onClick);

        return button;
    }

    private createOfflineStatus() {
        this.offlineTitle = this.scene.add
            .text(960, 450, "Server is offline", {
                fontFamily: "Arial Black",
                fontSize: 30,
                color: "#ff6a53",
                stroke: "#000000",
                strokeThickness: 4,
                align: "center",
            })
            .setOrigin(0.5);

        this.offlineText = this.scene.add
            .text(960, 480, "Please try again later.", {
                fontFamily: "Arial Black",
                fontSize: 14,
                color: "#ff6a53",
                stroke: "#000000",
                strokeThickness: 4,
                align: "center",
            })
            .setOrigin(0.5);
    }
}

