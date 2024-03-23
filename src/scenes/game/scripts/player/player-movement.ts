import { Socket } from "socket.io-client";

export class PlayerMovement {
    private player: Phaser.Physics.Arcade.Sprite | undefined;
    private keys: any;
    private speed: number = 100;
    private socket: Socket;

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
        const { left, right, up, down } = keys;
        const speed = this.speed;

        const velocity = { x: 0, y: 0 };

        // Yatay hareket
        if (left.isDown) velocity.x = -speed;
        else if (right.isDown) velocity.x = speed;

        // Dikey hareket
        if (up.isDown) velocity.y = -speed;
        else if (down.isDown) velocity.y = speed;

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

        if (x !== 0 || y !== 0) {
            if (x > 0) player.anims.play("walk_right", true);
            else if (x < 0) player.anims.play("walk_left", true);
            else if (y > 0) player.anims.play("walk_down", true);
            else player.anims.play("walk_up", true);
        } else {
            if (player.flipX) player.anims.play("idle_left", true);
            else player.anims.play("idle_right", true);
        }

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

