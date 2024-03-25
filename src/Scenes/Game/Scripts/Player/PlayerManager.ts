import { Scene } from "phaser";

export class PlayerManager {
    private readonly scene: Scene;

    // Variables
    static player: Phaser.Physics.Arcade.Sprite;
    static playerId: string;

    constructor(scene: Scene) {
        this.scene = scene;
    }
}

