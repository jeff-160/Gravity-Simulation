let ENGINE, SCENE, CAMERA, SCREEN
let ENTITIES = []
const SYSTEM = new System(1);

window.onload = () => {
    loadComponents();

    loadScene();

    window.requestAnimationFrame(updateFPS);
}

function loadComponents() {
    SCREEN = document.querySelector("#game-screen");

    ENGINE = new BABYLON.Engine(SCREEN, true);

    SCENE = new BABYLON.Scene(ENGINE);
    SCENE.clearColor = new BABYLON.Color3.Black();
    SCENE.autoClearDepthAndStencil = false;
    SCENE.blockMaterialDirtyMechanism = true;

    
    CAMERA = new BABYLON.FreeCamera("", new BABYLON.Vector3(0, 0, -20), SCENE);
    
    CAMERA.keysUp = [87];
    CAMERA.keysDown = [83];
    CAMERA.keysLeft = [65];
    CAMERA.keysRight = [68];
    
    CAMERA.speed = 5;
    CAMERA.inertia = 0.1;
    CAMERA.angularSensibility = 800;

    CAMERA.attachControl(SCREEN, true);

    const light = new BABYLON.HemisphericLight("", CAMERA.position, SCENE);

    addEvents()

    ENGINE.runRenderLoop(gameLoop);
}

function gameLoop() {
    document.querySelector("#entity-counter").innerHTML = `Bodies: ${SYSTEM.planets.length}`

    // unfocusing the tab fucks it up for some reason so capping is necessary
    const dt = Math.min(ENGINE.getDeltaTime() / 1000, 0.05); 

    SYSTEM.gravitate(dt);
    SYSTEM.updateGravityGrid();
    
    SCENE.render();
}

const FPS = {
    count: 1,
    times: []
}

function updateFPS(timestamp) {
    while (FPS.times.length > 0 && FPS.times[0] <= timestamp - 1000) {
        FPS.times.shift();
    }

    FPS.times.push(timestamp);
    FPS.count = FPS.times.length;

    document.querySelector("#fps-counter").innerHTML = `FPS: ${FPS.count}`;

    window.requestAnimationFrame(updateFPS);
}