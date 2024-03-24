import Phaser from "phaser";

import { Socket } from "socket.io-client";

export class PlayerMovement {
    private player: Phaser.Physics.Arcade.Sprite | undefined;
    private keys: any;
    private speed: number = 180;
    private socket: Socket;
    private direction: "left" | "right" | "idle" | "up" | "down" = "idle";

    constructor(socket: Socket) {
        this.socket = socket;
    }

    public setPlayer(player: Phaser.Physics.Arcade.Sprite, keys: any) {
        this.player = player;
        this.keys = keys;
    }

    public movementController() {
        if (!this.player || !this.keys) return;

        const { keys } = this;
        const { left, right, up, down, w, a, s, d } = keys;
        const speed = this.speed;

        const velocity = { x: 0, y: 0 };

        // Yatay hareket
        if (left.isDown || a.isDown) {
            velocity.x = -speed;
            this.direction = "left";
        } else if (right.isDown || d.isDown) {
            velocity.x = speed;
            this.direction = "right";
        }

        // Dikey hareket
        if (up.isDown || w.isDown) {
            velocity.y = -speed;
            this.direction = "up";
        } else if (down.isDown || s.isDown) {
            velocity.y = speed;
            this.direction = "down";
        }

        this.setPlayerVelocity(velocity.x, velocity.y);
        this.playPlayerAnimation(velocity);
        this.updatePlayerPosition();
    }

    private setPlayerVelocity(velocityX: number, velocityY: number) {
        if (this.player) {
            this.player.setVelocity(velocityX, velocityY);
        }
    }

    private playPlayerAnimation(velocity: { x: number; y: number }) {
        const player = this.player;
        if (!player) return;

        const { x, y } = velocity;
        let animationKey = "";

        if (x !== 0 || y !== 0) {
            animationKey =
                x !== 0
                    ? x > 0
                        ? "walk_right"
                        : "walk_left"
                    : y > 0
                    ? "walk_down"
                    : "walk_up";
        } else {
            if (this.direction === "right" || this.direction === "left") {
                animationKey = `idle_${this.direction}`;
            } else {
                animationKey =
                    this.direction === "up" ? "idle_up" : "idle_down";
            }
        }

        player.anims.play(animationKey, true);

        if (x > 0) player.setFlipX(false);
        else if (x < 0) player.setFlipX(true);
    }

    private updatePlayerPosition() {
        const player = this.player;
        if (!player) return;

        const { x, y } = player;

        const oldPosition = player.getData("oldPosition");
        if (oldPosition && (x !== oldPosition.x || y !== oldPosition.y)) {
            this.socket.emit("playerMovement", { x, y });
        }

        player.setData("oldPosition", { x, y });
    }
}

