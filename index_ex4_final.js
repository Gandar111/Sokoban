import * as THREE from './modules/three.module.js';
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/OBJLoader.js';

main();

function main() {
    // create context
    const canvas = document.querySelector("#c");
    const gl = new THREE.WebGLRenderer({
        canvas,
        antialias: true
    });
    gl.setSize(window.innerWidth, window.innerHeight);

    // create camera
    const camera = new THREE.PerspectiveCamera(
        55, window.innerWidth / window.innerHeight, 0.1, 100
    );
    camera.position.set(0, 8, 30);

    // create controls
    const controls = new OrbitControls(camera, gl.domElement);
    controls.target.set(0, 5, 0);
    controls.update();

    // create the scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0.3, 0.5, 0.8);
    scene.fog = new THREE.Fog("grey", 1, 90);

    // Load the Teapot
    const loader = new OBJLoader();
    loader.load(
        'textures/teapot.obj',
        function (mesh) {
            const textureLoader = new THREE.TextureLoader();
            const texture = textureLoader.load('textures/stone.jpg'); // Pfade entsprechend anpassen
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;

            const material = new THREE.MeshPhongMaterial({ map: texture });

            mesh.children.forEach(function (child) {
                child.material = material;
                child.castShadow = true;
            });

            mesh.position.set(-15, 2, 0);
            mesh.rotation.set(-Math.PI / 2, 0, 0);
            mesh.scale.set(0.005, 0.005, 0.005);

            scene.add(mesh);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.log('An error happened');
        }
    );

    // Add lights and other elements (like previous examples)

    // DRAW
    function draw(time) {
        time *= 0.001;  // convert time to seconds

        if (resizeGLToDisplaySize(gl)) {
            const canvas = gl.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        gl.render(scene, camera);
        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
}

// UPDATE RESIZE
function resizeGLToDisplaySize(gl) {
    const canvas = gl.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        gl.setSize(width, height, false);
    }
    return needResize;
}
