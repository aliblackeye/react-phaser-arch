import { Scene } from "phaser";

// Assets

export class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }

    init() {
        // Boot Scene'de bu resmi yüklediğimiz için burada görüntüleyebiliriz
        this.add.image(400, 300, "menuBg");
    }

    preload() {
        //  Oyun için varlıkları yükleyin - Kendi varlıklarınızla değiştirin
    }

    create() {
        //  Tüm varlıklar yüklendiğinde, genellikle oyunun geri kalanının kullanabileceği genel nesneler oluşturmak faydalı olur.

        //  Örneğin, burada global animasyonları tanımlayabilirsiniz, böylece diğer sahnelerde kullanabiliriz.

        //  MainMenu'a geçin. Ayrıca, bu işlemi bir Kamera Solması gibi bir Sahne Geçişi ile değiştirebilirsiniz.
        this.scene.start("MainMenu");
    }
}

