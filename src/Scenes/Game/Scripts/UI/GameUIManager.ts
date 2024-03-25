import { Scene } from "phaser";

export class GameUIManager {
    constructor(private scene: Scene) {}

    create() {
        // this.createChatBox();
    }

    private createChatBox() {
        const chatBox = this.scene.add
            .dom(this.scene.scale.width, this.scene.scale.height)
            .createFromHTML(
                `
                <div style="width: 300px; height: 200px; background-color: #000; overflow-y: scroll; padding: 10px;">
                    <div id="chatBox" style="color: #fff;"></div>
                </div>
                <input id="chatInput" type="text" style="width: 300px;"/>
                `
            );
    }

    private sendMessage(message: string) {
        if (!message) return;
        this.scene.events.emit("sendMessage", message);
    }

    private createPlayerName(
        player: Phaser.Physics.Arcade.Sprite,
        playerDetails: any
    ) {
        // Oyuncu isminin oluşturulması ve harita nesnesiyle eşleştirilmesi
        const playerName = this.scene.add.text(
            player.x - 40,
            player.y - 40,
            playerDetails.name,
            {
                fontFamily: "Arial Black",
                align: "center",
                fontSize: 24,
                stroke: "#000000",
                strokeThickness: 8,
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                padding: {
                    x: 4,
                    y: 2,
                },
            }
        );
    }
}

