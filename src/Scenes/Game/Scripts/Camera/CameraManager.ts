import { Scene } from "phaser";

export class CameraManager {
    // Constants
    private readonly MAP_WIDTH: number = 1920;
    private readonly MAP_HEIGHT: number = 1080;

    constructor(private readonly scene: Scene) {}

    setCameraBounds() {
        //  Set the camera and physics bounds to be the size of 2x2 bg images
        this.scene.cameras.main.setBounds(
            0,
            0,
            this.MAP_WIDTH * 2,
            this.MAP_HEIGHT * 2
        );
    }
}

