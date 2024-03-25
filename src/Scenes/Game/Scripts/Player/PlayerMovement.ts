import Phaser, { Scene } from "phaser";

import { PlayerManager } from "./PlayerManager";
import { GlobalSocket } from "@/GlobalSocket";

export class PlayerMovement {
    private scene: Scene;

    // Movement
    private speed: number = 180;
    private keys: any;
    private direction: "left" | "right" | "idle" | "up" | "down" = "idle";

    constructor(scene: Scene) {
        this.scene = scene;
        this.setKeys();
    }

    playerMovement() {
        if (!PlayerManager.getPlayer()) return;

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
        const player = PlayerManager.getPlayer();
        if (player) {
            player.setVelocity(velocityX, velocityY);
        }
    }

    private playPlayerAnimation(velocity: { x: number; y: number }) {
        const player = PlayerManager.getPlayer();
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
        const player = PlayerManager.getPlayer();
        if (!player) return;

        const { x, y } = player;

        const oldPosition = player.getData("oldPosition");
        if (oldPosition && (x !== oldPosition.x || y !== oldPosition.y)) {
            GlobalSocket.socket.emit("playerMovement", { x, y });
        }

        player.setData("oldPosition", { x, y });
    }

    private setKeys() {
        this.keys = this.scene.input.keyboard!.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            w: Phaser.Input.Keyboard.KeyCodes.W,
            a: Phaser.Input.Keyboard.KeyCodes.A,
            s: Phaser.Input.Keyboard.KeyCodes.S,
            d: Phaser.Input.Keyboard.KeyCodes.D,
        });
    }
}

