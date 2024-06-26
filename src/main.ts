import Phaser from "phaser";

// Scenes
import { Boot } from "@/Scenes/Boot";
import { Preloader } from "@/Scenes/Preloader";
import { MainMenu } from "@/Scenes/MainMenu/MainMenu";
import { Game } from "@/Scenes/Game/Game";
import { GameOver } from "@/Scenes/GameOver/GameOver";

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
    dom: {
        createContainer: true,
    },
    scale: {
        mode: Phaser.Scale.FIT,
        parent: "game-container",
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080,
    },
    scene: [Boot, Preloader, MainMenu, Game, GameOver],
};

const StartGame = (parent: string) => {
    return new Phaser.Game({ ...config, parent });
};

export default StartGame;

