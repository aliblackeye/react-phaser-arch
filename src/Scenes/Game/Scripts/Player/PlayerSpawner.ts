import { Scene } from "phaser";
import { PlayerManager } from "./PlayerManager";

export class PlayerSpawner {
    private scene: Scene;
    otherPlayers: Phaser.Physics.Arcade.Group;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.otherPlayers = this.scene.physics.add.group();
    }

    spawnPlayer(p: any) {
        const localPlayer = this.scene.physics.add.sprite(p.x, p.y, "player");
        this.configurePlayer(localPlayer);

        // Set the player id
        PlayerManager.setPlayer(localPlayer, p.id, p.name);
    }

    spawnOtherPlayer(p: any) {
        const otherPlayer = this.otherPlayers.create(p.x, p.y, "player");
        otherPlayer.playerId = p.id;
        this.configurePlayer(otherPlayer);
    }

    private configurePlayer(player: Phaser.Physics.Arcade.Sprite) {
        player.setCollideWorldBounds(true);
        player.setSize(48, 64);
        player.setOffset(
            player.width / 2 - 24, // x
            player.height / 2 + 4 // y
        ); // y); // Collider offset
    }
}

