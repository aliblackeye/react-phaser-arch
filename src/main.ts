import { Boot } from "./scenes/boot";
import { GameOverScene } from "./scenes/game-over/game-over-scene";
import { GameScene } from "./scenes/game/game-scene";
import { MainMenuScene } from "./scenes/main-menu/main-menu-scene";
import Phaser from "phaser";
import { Preloader } from "./scenes/preloader";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO, // Otomatik olarak WebGL veya Canvas kullanarak oyunu başlatır
    backgroundColor: "#028af8",
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
            gravity: { y: 0, x: 0 },
        },
    },
    scale: {
        mode: Phaser.Scale.FIT,
        parent: "game-container",
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600,
    },
    scene: [Boot, Preloader, MainMenuScene, GameScene, GameOverScene],
};

const StartGame = (parent: string) => {
    return new Phaser.Game({ ...config, parent });
};

export default StartGame;

