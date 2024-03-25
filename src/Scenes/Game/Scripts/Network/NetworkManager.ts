import { PlayerSpawner } from "../Player/PlayerSpawner";
import { Scene } from "phaser";
import { PlayerManager } from "../Player/PlayerManager";
import { GlobalSocket } from "@/GlobalSocket";

export class NetworkManager {
    private scene: Scene;

    constructor(scene: Scene, private playerSpawner: PlayerSpawner) {
        this.scene = scene;
    }

    listen() {
        this.onCurrentPlayersChanged();
        this.onPlayerJoined();
        this.onPlayerLeft();
        this.onPlayerMoved();
    }

    private onCurrentPlayersChanged() {
        GlobalSocket.socket.on("currentPlayers", (players: any[]) => {
            console.log("Current players: ", players);
            players.forEach((player: any) => {
                if (player.playerId === GlobalSocket.socket.id) {
                    this.playerSpawner.spawnPlayer(player);

                    //  Set the camera and physics bounds to be the size of 4x4 bg images
                    this.scene.cameras.main.setBounds(0, 0, 1920 * 2, 1080 * 2);
                    this.scene.physics.world.setBounds(
                        0,
                        0,
                        1920 * 2,
                        1080 * 2
                    );
                    this.scene.cameras.main.startFollow(
                        PlayerManager.player,
                        true
                    );
                } else {
                    this.playerSpawner.spawnOtherPlayer(player);
                }
            });
        });
    }

    private onPlayerJoined() {
        GlobalSocket.socket.on("newPlayer", (player: any) => {
            console.log(player);
            this.playerSpawner.spawnOtherPlayer(player);
        });
    }

    private onPlayerLeft() {
        GlobalSocket.socket.on("playerLeft", (playerId: string) => {
            console.log("Player disconnected: ", playerId);
            this.playerSpawner.otherPlayers
                .getChildren()
                .forEach((otherPlayer: any) => {
                    if (playerId === otherPlayer.playerId) {
                        otherPlayer.destroy();
                    }
                });
        });
    }

    private onPlayerMoved() {
        GlobalSocket.socket.on("playerMovement", (player: any) => {
            this.playerSpawner.otherPlayers
                .getChildren()
                .forEach((otherPlayer: any) => {
                    if (otherPlayer.playerId === player.playerId) {
                        otherPlayer.setPosition(player.x, player.y);
                    }
                });
        });
    }
}

