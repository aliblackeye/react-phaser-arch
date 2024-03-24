// Scenes
import { Boot } from "@/game/Scenes/Boot";
import { Preloader } from "@/game/Scenes/Preloader";
import { MainMenu } from "@/game/Scenes/MainMenu/MainMenu";
import { Game } from "@/game/Scenes/Game/Game";
import { GameOver } from "@/game/Scenes/GameOver/GameOver";

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

