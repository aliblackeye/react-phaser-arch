import { useEffect, useRef } from "react";
import { IRefPhaserGame, PhaserGame } from "./PhaserGame";

function App() {
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    // Event emitted from the PhaserGame component
    /* const currentScene = (scene: Phaser.Scene) => {
        console.log("Current Scene: ", scene);
    }; */

    // server açıkta durması için 5 dakikada bir istek atıyoruz
    useEffect(() => {
        setInterval(() => {
            fetch("https://react-phaser-arch-server.onrender.com/")
                .then((res) => res.json())
                .then((data) => console.log(data));
        }, 10000);
    }, []);

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} /* currentActiveScene={} */ />
        </div>
    );
}

export default App;

