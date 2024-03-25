import { Scene } from "phaser";

export class PlayerManager {
    private readonly scene: Scene;

    // Variables
    protected static player: Phaser.Physics.Arcade.Sprite;
    protected static playerName: string;
    protected static playerId: string;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    static setPlayer(
        player: Phaser.Physics.Arcade.Sprite,
        playerId: string,
        playerName: string
    ) {
        PlayerManager.player = player;
        PlayerManager.playerId = playerId;
        PlayerManager.playerName = playerName;
    }

    static getPlayer() {
        return PlayerManager.player;
    }

    static getPlayerId() {
        return PlayerManager.playerId;
    }

    static getPlayerName() {
        return PlayerManager.playerName;
    }

    static setPlayerName(name: string) {
        PlayerManager.playerName = name;
    }

    static setPlayerId(id: string) {
        PlayerManager.playerId = id;
    }

    static setPlayerPosition(x: number, y: number) {
        PlayerManager.player?.setPosition(x, y);
    }
}

