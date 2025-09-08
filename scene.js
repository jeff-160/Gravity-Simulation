function loadScene() {
    SYSTEM.planets = stableOrbit();

    SYSTEM.createGravityGrid();
}

// should be pretty stable i think
function stableOrbit() {
    const M = 50;
    const m = 5;

    const radii = [10, 20];

    const colors = [
        [200, 100, 100],
        [100, 100, 200]
    ].map(c => rgbNorm(...c));

    const planets = [
        // central sun
        new Planet(
            M,
            new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Color3(...rgbNorm(255, 244, 214))
        )
    ];

    radii.forEach((r, i) => {
        // angular offset so they dont collide with each other (hopefully)
        const theta = (i / radii.length) * 2 * Math.PI;

        // circular motion = gravitational force
        // mv^2/r = GMm/r^2
        const v = Math.sqrt(SYSTEM.G * M / r);

        planets.push(
            new Planet(
                m,
                new BABYLON.Vector3(r * Math.cos(theta), 0, r * Math.sin(theta)),
                new BABYLON.Vector3(-v * Math.sin(theta), 0, v * Math.cos(theta)),
                new BABYLON.Color3(...colors[i])
            )
        );
    });

    return planets;
}

// normalise rgb values for babylonjs
// just for convenience
function rgbNorm(r, g, b) {
    return [r, g, b].map(c => c / 255);
}