import { PlayerSpawner } from "../Player/PlayerSpawner";
import { GameObjects, Scene } from "phaser";
import { PlayerManager } from "../Player/PlayerManager";
import { GlobalSocket } from "@/GlobalSocket";

export class NetworkManager {
    private scene: Scene;
    private playerSpawner: PlayerSpawner;

    constructor(scene: Scene) {
        this.scene = scene;
        this.playerSpawner = new PlayerSpawner(scene);
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
            players.forEach((p: any) => {
                if (p.id === GlobalSocket.socket.id) {
                    this.playerSpawner.spawnPlayer(p);
                    this.scene.cameras.main.startFollow(
                        PlayerManager.getPlayer(),
                        true
                    );
                } else {
                    this.playerSpawner.spawnOtherPlayer(p);
                }
            });
        });
    }

    private onPlayerJoined() {
        GlobalSocket.socket.on("newPlayer", (player: any) => {
            this.playerSpawner.spawnOtherPlayer(player);
        });
    }

    private onPlayerLeft() {
        GlobalSocket.socket.on("playerLeft", (playerId: string) => {
            const playerToRemove = this.playerSpawner.otherPlayers
                .getChildren()
                .find((otherPlayer: any) => {
                    return otherPlayer.playerId === playerId;
                });
            playerToRemove?.destroy();
        });
    }

    private onPlayerMoved() {
        GlobalSocket.socket.on("playerMovement", (player: any) => {
            const otherPlayer = this.playerSpawner.otherPlayers
                .getChildren()
                .find(
                    (p: any) => p.playerId === player.id
                ) as GameObjects.Sprite;

            if (otherPlayer) {
                otherPlayer?.setPosition(player.x, player.y);
            }
        });
    }
}

