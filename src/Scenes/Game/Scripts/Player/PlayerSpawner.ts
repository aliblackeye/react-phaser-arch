import { Scene } from "phaser";

export class PlayerSpawner {
    private scene: Scene;
    otherPlayers: Phaser.Physics.Arcade.Group;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.otherPlayers = this.scene.physics.add.group();
    }

    spawnPlayer(player: any) {
        const localPlayer = this.scene.physics.add.sprite(
            player.x,
            player.y,
            "player"
        );

        this.configurePlayer(localPlayer);
    }

    spawnOtherPlayer(player: any) {
        const otherPlayer = this.otherPlayers.create(
            player.x,
            player.y,
            "player"
        );
        this.configurePlayer(otherPlayer);
    }

    private configurePlayer(player: Phaser.Physics.Arcade.Sprite) {
        player.setCollideWorldBounds(true);
        player.setSize(48, 64);
        player.setOffset(24, 32); // Collider offset
    }
}

