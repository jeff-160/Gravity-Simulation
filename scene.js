function loadScene() {
    SYSTEM.planets = [
        ...stableOrbit(), 
    ];

    SYSTEM.createGravityGrid();
}

function stableOrbit() {
    const M = 100;
    const m = 5;
    const r = 20;

    // circular motion: mv^2/r = GMm/r^2
    const v = Math.sqrt(SYSTEM.G * M / r);

    return [
        new Planet(
            M,
            new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Color3(...rgbNorm(255, 244, 214))
        ),
        new Planet(
            m,
            new BABYLON.Vector3(r, 0, 0),
            new BABYLON.Vector3(0, 0, v)
        ),
    ];
}

// normalise rgb values for babylonjs
// just for convenience
function rgbNorm(r, g, b) {
    return [r, g, b].map(c => c / 255);
}