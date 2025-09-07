class Planet {
    constructor(mass, position, velocity, color=null) {
        this.mass = mass;
        this.position = position;
        this.velocity = velocity;

        this.model = BABYLON.MeshBuilder.CreateSphere("", {diameter: Math.cbrt(mass)}, SCENE);

        if (color) {
            this.model.material = new BABYLON.StandardMaterial("", SCENE)
            this.model.material.diffuseColor = color;
        }
        
        this.model.position.copyFrom(this.position);
    }
}