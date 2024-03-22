import { useRef } from "react";
import { IRefPhaserGame, PhaserGame } from "./PhaserGame";

function App() {
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    // Event emitted from the PhaserGame component
    /* const currentScene = (scene: Phaser.Scene) => {
        console.log("Current Scene: ", scene);
    }; */

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} /* currentActiveScene={} */ />
        </div>
    );
}

export default App;

