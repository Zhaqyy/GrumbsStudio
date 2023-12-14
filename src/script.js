import * as dat from 'lil-gui'
import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import * as Stats from 'stats.js'
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { Reflector } from './helper/reflect.js';

import nVertex from "./shaders/noise/vertex.glsl";
import nFragment from "./shaders/noise/fragment.glsl";
import mVertex from "./shaders/mirror/vertex.glsl";
import mFragment from "./shaders/mirror/fragment.glsl";



const stats = new Stats();
document.body.appendChild(stats.dom);

const basecolor =
    // 0x463d40
    // 0x352F36
    0x28282B
    // 0x454545
    ;

// Canvas and scene
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
scene.background = new THREE.Color(
    basecolor
    // 0x443333
)
scene.fog = new THREE.Fog(basecolor, 1, 15);

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


/**
 * Loaders
 */

// Texture loader

// const textureLoader = new THREE.TextureLoader()

const dudvMap = new THREE.TextureLoader().load('/waterdudv.jpg')

dudvMap.wrapS = dudvMap.wrapT = THREE.RepeatWrapping;

// Draco loader
// const dracoLoader = new DRACOLoader()
// dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
// gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Object
 */



//lightssss******************

const ambient = new THREE.AmbientLight(0xffffff, 1);

// const point = new THREE.PointLight(0xff0000, 2.5);
// point.position.set(1, 0, 0)

const cursorLight = new THREE.SpotLight(0xffffff, 2);

cursorLight.target.position.set(0, 2, 0)
cursorLight.angle = 0.7;
cursorLight.penumbra = 0.5;
cursorLight.decay = 0;
cursorLight.distance = 25;
// cursorLight.map = textures[ 'disturb.jpg' ];

cursorLight.castShadow = true;
cursorLight.shadow.mapSize.width = 1024;
cursorLight.shadow.mapSize.height = 1024;
cursorLight.shadow.camera.near = 1;
cursorLight.shadow.camera.far = 20;
cursorLight.shadow.focus = 1;
cursorLight.shadow.bias = - 0.0002;
cursorLight.shadow.radius = 4;


scene.add(
    // cursorLight, 
    ambient
)


// ****Geometry****

// *****materials**** //

const TextMat = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    emissive: "#ffffff",
    //   emissiveIntensity:0.4
})
const GMat = new THREE.MeshPhongMaterial({
    color: "#ff0000",
    emissive: "#ff0000",
    emissiveIntensity: 2
})


const noiseMat = new THREE.ShaderMaterial({
    uniforms: {
        u_mouse: { value: new THREE.Vector2() },
        u_time: { value: 0 },
        noise_speed: { value: 0.2 },
        metaball: { value: 0.5 },
        discard_threshold: { value: 0.5 },
        antialias_threshold: { value: 0.05 },
        noise_height: { value: 0.5 },
        noise_scale: { value: 10 },
    },
    vertexShader: nVertex,
    fragmentShader: nFragment,
    transparent: true,

})

const glassMat = new THREE.MeshPhysicalMaterial({})
glassMat.reflectivity = 0.5
// glassMat.transmission = 1.0
glassMat.roughness = 0.2
glassMat.metalness = 0
// glassMat.clearcoat = 1
// glassMat.clearcoatRoughness = 0.25
glassMat.color = new THREE.Color(0x6f2f6f)
glassMat.ior = 2
glassMat.thickness = 1.5
glassMat.transparent = true
// glassMat.alphaHash = true
// glassMat.opacity = 0.9
// glassMat.opacity = 0.7
// glassMat.envMap= hdrEquirect,
// glassMat.envMapIntensity= 1.5,

// *****Meshh and model****

//sphere light
const lSphere = new THREE.SphereGeometry(0.1, 16, 8);

let point = new THREE.PointLight(0x4169e1, 0.5);
point.add(new THREE.Mesh(lSphere, GMat));
scene.add(point);


//model
var strobeLeft
var strobeRight
var grumbs
var gltf

gltfLoader.load(
    '/grumbsStudio.glb',
    (gltf) => {
      
        strobeLeft = gltf.scene.children.find(child => child.name === 'strobeLeft')
        strobeRight = gltf.scene.children.find(child => child.name === 'strobeRight')
         grumbs = gltf.scene.children.find(child => child.name === 'grumbs')

        // grumbs = grumbs?
        scene.add(gltf.scene);


        strobeLeft.material = TextMat;
        strobeRight.material = TextMat;
        // X.material = noiseMat;
        // text.scale.set(1.5, 1.5, 1.5)
        // text.position.y = 1.5
        // text.castShadow = true

        grumbs.material = noiseMat;
        grumbs.scale.set(1.5, 1.5, 1.5)
        grumbs.position.set(0, -0.5, 0)
        strobeLeft.scale.set(1.5, 1.5, 1)
        strobeRight.scale.set(1.5, 1.5, 1)
        gltf.scene.scale.set(2.5, 2.5, 2.5)
        // gltf.scene.rotation.set(0, 0, 0)



        // grumbs.castShadow = true
        // grumbs.scale.set(10, 10, 10)
        // grumbs.position.x = 0
        // grumbs.position.y = -2
        // grumbs.position.z = 1

        // function init() {
        //     const parallaxX = pointer.x  * 0.5
        //    const parallaxY = -pointer.y * 0.5

        //    grumbs.rotation.x += (parallaxX - grumbs.rotation.x) * 0.5 
        //    grumbs.rotation.y += (parallaxY - grumbs.rotation.y) * 0.5 
        // }
        // init()

        // copy the geometry from the loaded model
        // const sLgeometry = strobeLeft.geometry.clone();
        // const sRgeometry = strobeRight.geometry.clone();
        // const Xgeometry = X.geometry.clone();
        // const Ggeometry = grumbs.geometry.clone();

        // // Create a new mesh and place it in the scene

        // const sLmesh = new THREE.Mesh(sLgeometry, TextMat);
        // // sLmesh.rotation.x = Math.PI / 2;
        // // sLmesh.position.set(0, 1.5, 0);
        // // sLmesh.scale.set(2, 2, 2);
        // sLmesh.castShadow = true


        // const sRmesh = new THREE.Mesh(sRgeometry, TextMat);
        // // sRmesh.rotation.x = Math.PI / 2;
        // // sRmesh.position.set(0, 1.5, 0);
        // // sRmesh.scale.set(2, 2, 2);
        // sRmesh.castShadow = true


        // const Xmesh = new THREE.Mesh(Xgeometry, TextMat);
        // Xmesh.rotation.x = Math.PI / 2;
        // // Xmesh.position.set(0, 1.5, 0);
        // // Xmesh.scale.set(2, 2, 2);
        // Xmesh.castShadow = true


        // const Gmesh = new THREE.Mesh(Ggeometry, noiseMat);
        // // Gmesh.scale.set(2, 2, 2);
        // Gmesh.position.set(0, -1, 1);
        // // Gmesh.castShadow = true

        // scene.add(Xmesh, sLmesh, sRmesh, Gmesh);


        // // Discard the loaded model
        // gltf.scene.children.forEach((child) => {
        //   child.geometry.dispose();
        //   child.material.dispose();
        // });
    }
)

//text loader
var text;

const loader = new FontLoader();
loader.load( '/fluid.json', function ( font ) {

    const color = 0x6350af;

    const matLite = new THREE.MeshBasicMaterial( {
        color: color,
    } );

    const message = 'GRUMBS';

    const shapes = font.generateShapes( message, 1 );

    const geometry = new THREE.ShapeGeometry( shapes );

    geometry.computeBoundingBox();

    const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );

    geometry.translate( xMid, 0, 0 );

    // make shape ( N.B. edge view not visible )

    text = new THREE.Mesh( geometry, matLite );
    text.position.set(0,1.4,0);
    scene.add( text );

  

    // renderer();

} ); //end load function


let camera;

// ****mouse movement****

// Create a variable to keep track of mouse position and touch position
const pointer = new THREE.Vector2();

let chaseDelay = 0; // Delay time in milliseconds (adjust as needed)
let isChasing = false;

// Store the target position for lerping
const targetPosition = new THREE.Vector3();

function onUpdatePointer(event) {
    event.preventDefault();

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    if (!isChasing) {
        isChasing = true;
        setTimeout(() => {
            setTargetPosition();
            isChasing = false;
        }, chaseDelay);
    }
}

// Function to set the target position for lerping
function setTargetPosition() {
    const vector = new THREE.Vector3(pointer.x, pointer.y, 1);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const pos = camera.position.clone().add(dir.multiplyScalar(distance));
    targetPosition.copy(pos);
}

const REVOLVE_DISTANCE = 0.25; // Adjust this distance as needed
const SMOOTHNESS = 0.01; // Adjust the smoothness of the transition
const MAX_OFFSET = -0.1; // Maximum allowed offset
let chaseSpeed = 0.005; // point chase Speed

function updateCursor() {
    const distanceToCursor = point.position.distanceTo(targetPosition);

    if (distanceToCursor < REVOLVE_DISTANCE) {
        const angle = Date.now() * 0.001; // Adjust the speed of revolution

        let offsetX = Math.cos(angle) * REVOLVE_DISTANCE;
        let offsetY = Math.sin(angle) * REVOLVE_DISTANCE;

        // Limit the maximum offset
        const offsetMagnitude = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
        if (offsetMagnitude > MAX_OFFSET) {
            const scale = MAX_OFFSET / offsetMagnitude;
            offsetX *= scale;
            offsetY *= scale;
        }
        // Calculate the target position for the sphere within the revolution range
        const targetX = targetPosition.x + offsetX;
        const targetY = targetPosition.y + offsetY;

        // Smoothly transition the sphere towards the target position
        point.position.x += (targetX - point.position.x) * SMOOTHNESS;
        point.position.y += (targetY - point.position.y) * SMOOTHNESS;

    } else {
        point.position.lerp(targetPosition, chaseSpeed); // Smoothly move towards the cursor
    }

    // Prevent the sphere from going below 0 on the y-axis
    if (point.position.y < 0) {
        point.position.y = 0;
    }
}

// Function to handle touch events
function onTouchUpdate(event) {
    event.preventDefault();

    const touch = event.touches[0];

    pointer.x = (touch.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(touch.clientY / window.innerHeight) * 2 + 1;

    if (!isChasing) {
        isChasing = true;
        setTimeout(() => {
            setTargetPosition();
            isChasing = false;
        }, chaseDelay);
    }
}

// Add listeners for both pointermove and touchmove events
canvas.addEventListener("pointermove", onUpdatePointer, false);
canvas.addEventListener("touchmove", onTouchUpdate, false);



/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.outputColorSpace = THREE.SRGBColorSpace

// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

/**
 * Camera
 */

// Camera group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
let camZ = 8;
camera = new THREE.PerspectiveCamera(
    45,
    sizes.width / sizes.height,
    0.1,
    100
);
camera.position.set(0, 1, camZ);
camera.lookAt(0, 0, 0);
cameraGroup.add(camera);

// ******Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true
// controls.enablePan = false
// controls.enableRotate = false
// controls.enableZoom = false
// controls.update();

//Reflective Ground//////
const planegeo = new THREE.PlaneGeometry(15, 20)

const PlaneMat = new THREE.MeshStandardMaterial({
    color: 0x000000,
    emissive: 0x000000,
    roughness: 0,
    metalness: 1,
    transparent: true,
    opacity: 0.9,

})

const planeMesh = new THREE.Mesh(planegeo, PlaneMat)
planeMesh.receiveShadow = true
planeMesh.rotation.x = -Math.PI / 2;
planeMesh.position.x = 0
planeMesh.position.y = - 0.0001;
planeMesh.position.z = 0
// scene.add( planeMesh );


const mirrorShader = Reflector.ReflectorShader
mirrorShader.fragmentShader = mFragment
mirrorShader.vertexShader = mVertex

const groundMirror = new Reflector(planegeo, {
    clipBias: 0.003,
    textureWidth: window.innerWidth,
    textureHeight: window.innerHeight,
    color: basecolor,
    shader: mirrorShader
});
groundMirror.position.y = 0;
groundMirror.rotateX(- Math.PI / 2);

groundMirror.material.uniforms.tDudv.value = dudvMap;
groundMirror.material.uniforms.mouse.value = pointer;

scene.add(groundMirror);

//*****post processing****

const renderPass = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(sizes.width, sizes.height),
    0.3,
    0,
    0.1
);
bloomPass.resolution.set(sizes.width, sizes.height);

const composer = new EffectComposer(renderer);

composer.addPass(renderPass);
composer.addPass(bloomPass);


//Resize 
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height

  //mobile responsiveness
  if (sizes.width < sizes.height) {
    camera.position.z = camZ + 5;
    scene.fog = new THREE.Fog(basecolor, 1, 30);
    // planeMesh.scale.set(5,5,5)
    // grumbs.scale.set(1, 1, 1)
    // // strobeLeft.scale.set(1, 1, 1)
    // strobes.scale.set(1, 1, 1)
    // gltf.scene.scale.set(1, 1, 1)
} else {
    camera.position.z = camZ;
}

    camera.updateProjectionMatrix()

    bloomPass.resolution.set(sizes.width, sizes.height);

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    composer.setSize(window.innerWidth, window.innerHeight);

    groundMirror.getRenderTarget().setSize(
        window.innerWidth,
        window.innerHeight
    );

})

  //mobile responsiveness
  if (sizes.width < sizes.height) {
    camera.position.z = camZ + 5;
    scene.fog = new THREE.Fog(basecolor, 1, 30);
    planeMesh.scale.z = 1.5
    chaseSpeed = 0.05
    // if (text) {
    //     text.scale.set(0.7,0.7,0.7);
    //     console.log("uyayyy");   
    // }
    // if (gltf) {
    //     grumbs.scale.set(1, 1, 1)
    //     strobeLeft.scale.set(1, 1, 1)
    //     strobeLeft.scale.set(1, 1, 1)
    // }
    //
    // gltf.scene.scale.set(1, 1, 1)
} else {
    camera.position.z = camZ;
}

camera.updateProjectionMatrix()

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    //update shader
    groundMirror.material.uniforms.time.value = elapsedTime
    noiseMat.uniforms.u_time.value = elapsedTime

    if (cameraGroup) {

        cameraGroup.rotation.y = THREE.MathUtils.lerp(cameraGroup.rotation.y, (pointer.x * Math.PI) / 30, 0.008)
        cameraGroup.rotation.x = THREE.MathUtils.lerp(cameraGroup.rotation.x, ((-pointer.y - 0.5) * Math.PI) / 25, 0.004)

    }
    updateCursor();

    // controls.update();


    // Render
    stats.begin()
    // renderer.render(scene, camera)

    composer.render();
    // init()
    stats.end()
    stats.update()
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()