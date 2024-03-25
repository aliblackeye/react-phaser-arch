import { Scene } from "phaser";

export class PlayerAnimations {
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    createAnimations() {
        const animations = [
            { key: "idle_down", frames: [0, 1, 2, 3, 4, 5] },
            { key: "idle_right", frames: [6, 7, 8, 9, 10, 11] },
            { key: "idle_up", frames: [12, 13, 14, 15, 16, 17] },
            { key: "idle_left", frames: [6, 7, 8, 9, 10, 11] },
            { key: "walk_down", frames: [18, 19, 20, 21, 22, 23] },
            { key: "walk_left", frames: [24, 25, 26, 27, 28, 29] },
            { key: "walk_right", frames: [24, 25, 26, 27, 28, 29] },
            { key: "walk_up", frames: [30, 31, 32, 33, 34, 35] },
        ];

        animations.forEach((animation) => {
            this.createAnimation(animation.key, animation.frames);
        });
    }

    private createAnimation(key: string, frames: number[]) {
        this.scene.anims.create({
            key: key,
            frames: this.scene.anims.generateFrameNumbers("player", {
                frames: frames,
            }),
            frameRate: key.includes("idle") ? 5 : 10,
            repeat: -1,
        });
    }
}

