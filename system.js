class System {
    constructor(G) {
        this.G = G;
        this.planets = [];

        this.gravity_grid = null;
    }

    accelerate() {
        let accelerations = this.planets.map(() => BABYLON.Vector3.Zero());

        // newtons law of gravitation
        for (let i = 0 ; i < this.planets.length ; i++) {
            for (let j = i + 1 ; j < this.planets.length ; j++) {
                const r = this.planets[j].position.subtract(this.planets[i].position);

                const t = this.G / (r.length() ** 3);

                accelerations[i].addInPlace(r.scale(t * this.planets[j].mass));
                accelerations[j].addInPlace(r.scale(-t * this.planets[i].mass));
            }
        }

        return accelerations;
    }

    // leapfrog integration
    gravitate(dt) {
        let accelerations = this.accelerate();
        
        for (let i = 0 ; i < this.planets.length ; i++) {
            this.planets[i].velocity.addInPlace(accelerations[i].scale(0.5 * dt));
            
            this.planets[i].position.addInPlace(this.planets[i].velocity.scale(dt));
            this.planets[i].model.position.copyFrom(this.planets[i].position);
        }
        
        accelerations = this.accelerate();

        for (let i = 0 ; i < this.planets.length ; i++) {
            this.planets[i].velocity.addInPlace(accelerations[i].scale(0.5 * dt));
        }
    }

    createGravityGrid(size=100, subdivisions=50) {
        const plane = BABYLON.MeshBuilder.CreateGround("", {
            width: size,
            height: size,
            subdivisions: subdivisions,
            updatable: true
        }, SCENE);

        const material = new BABYLON.GridMaterial("", SCENE);
        material.majorUnitFrequency = 1;
        material.gridRatio = size / subdivisions;
        material.lineColor = new BABYLON.Color3(1, 1, 1);
        material.backFaceCulling = false;

        plane.material = material;

        this.gravity_grid = plane;
    }

    updateGravityGrid() {
        if (!this.gravity_grid) {
            return;
        }
        
        const vertices = this.gravity_grid.getVerticesData(BABYLON.VertexBuffer.PositionKind);

        // accumulate total gravitational potential to create gravity wells
        for (let i = 0 ; i < vertices.length ; i += 3) {
            const [x, z] = [vertices[i], vertices[i + 2]];

            let phi = 0;
            
            for (const planet of this.planets) {
                const epsilon = 10; // round the bottom of the well

                const r = Math.sqrt((x - planet.position.x) ** 2 + planet.position.y ** 2 + (z - planet.position.z) ** 2 + epsilon ** 2)
                
                phi += (-this.G * planet.mass) / Math.max(r, 0.01);
            }

            vertices[i + 1] = phi;
        }

        this.gravity_grid.updateVerticesData(BABYLON.VertexBuffer.PositionKind, vertices);
    }
}