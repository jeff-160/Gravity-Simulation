let SELECTED_PLANET = null;
let DRAGGED_PLANET = null;

let ADDING_BODY = false;

function addEvents() {
    SCREEN.addEventListener("pointermove", () => {
        const pickInfo = SCENE.pick(SCENE.pointerX, SCENE.pointerY, _ => true, false, CAMERA);

        SELECTED_PLANET = pickInfo.hit ? SYSTEM.planets.find(planet => planet.model == pickInfo.pickedMesh) : null;

        // drag planet relative to camera
        if (DRAGGED_PLANET) {
            const dragPlane = BABYLON.Plane.FromPositionAndNormal(DRAGGED_PLANET.model.position, CAMERA.getForwardRay().direction);

            const ray = SCENE.createPickingRay(SCENE.pointerX, SCENE.pointerY, BABYLON.Matrix.Identity(), CAMERA);
            const hitDist = ray.intersectsPlane(dragPlane);
            
            if (hitDist != null) {
                const hitPoint = ray.origin.add(ray.direction.scale(hitDist));
                
                DRAGGED_PLANET.position.copyFrom(hitPoint);

                DRAGGED_PLANET.model.position.copyFrom(DRAGGED_PLANET.position);
            }
        }
    });

    // scale planet size
    SCREEN.addEventListener("wheel", e => {
        if (!SELECTED_PLANET) {
            return;
        }

        const scaleIncrement = 0.1;
        const scaleFactor = 1 + scaleIncrement * (e.deltaY < 0 ? 1 : -1);

        SELECTED_PLANET.model.scaling.scaleInPlace(scaleFactor);
        SELECTED_PLANET.mass *= Math.pow(scaleFactor, 3);
    });
    
    SCENE.onPointerDown = () => {
        DRAGGED_PLANET = SELECTED_PLANET;
    }

    SCENE.onPointerUp = () => {
        if (ADDING_BODY) {
            addBody();
            toggleAddBody();

            return;
        }

        DRAGGED_PLANET = null;
    }
}

function addBody() {
    const ray = SCENE.createPickingRay(SCENE.pointerX, SCENE.pointerY, BABYLON.Matrix.Identity(), CAMERA);
    const plane = new BABYLON.Plane(0, 0, 1, 0);

    const hitDist = ray.intersectsPlane(plane);

    if (hitDist != null) {
        const hitPoint = ray.origin.add(ray.direction.scale(hitDist));
        
        const body = new Planet(
            1,
            hitPoint,
            BABYLON.Vector3.Zero(),
            new BABYLON.Color3.Red()
        );

        SYSTEM.planets.push(body);
    }
}

function toggleAddBody() {
    ADDING_BODY = !ADDING_BODY;

    const elem = document.querySelector("#add-body");
    elem.style.color = elem.style.borderColor = ADDING_BODY ? "red" : "white";
    
    document.body.style.cursor = ADDING_BODY ? "pointer" : "auto";
}