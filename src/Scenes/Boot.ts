import { Scene } from "phaser";

export class Boot extends Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        // Boot Scene genellikle, bir oyun logosu veya arka plan gibi Preloader için gereken varlıkları yüklemek için kullanılır.
        // Varlıkların dosya boyutu ne kadar küçük olursa, Boot Sahnesi'nin kendisinin bir ön yükleyicisi olmadığı için o kadar iyi olur.
    }

    create() {
        // Preloader Sahnesi'ne geçiş yap
        this.scene.start("Preloader");
    }
}

