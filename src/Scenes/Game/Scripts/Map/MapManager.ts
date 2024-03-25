import { Scene } from "phaser";

export class MapManager {
    private readonly scene: Scene;

    // Constants
    private readonly MAP_WIDTH: number = 1920;
    private readonly MAP_HEIGHT: number = 1080;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    public initMap() {
        this.setBackgroundTilesprite();
    }

    private setBackgroundTilesprite() {
        // tüm haritayı kaplayacak şekilde tilesprite ekliyoruz
        this.scene.add.tileSprite(
            0,
            0,
            this.MAP_WIDTH * 4,
            this.MAP_HEIGHT * 4,
            "background"
        );
    }
}

