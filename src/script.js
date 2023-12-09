import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import * as Stats from 'stats.js'
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
// import { SSRPass } from 'three/examples/jsm/postprocessing/SSRPass.js';
// import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
// import { ReflectorForSSRPass } from 'three/examples/jsm/objects/ReflectorForSSRPass.js';
// import MeshReflectorMaterial from './helper/MeshReflectorMaterial'
// import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { Reflector } from './helper/reflect.js';

import nVertex from "./shaders/noise/vertex.glsl";
import nFragment from "./shaders/noise/fragment.glsl";
import mVertex from "./shaders/mirror/vertex.glsl";
import mFragment from "./shaders/mirror/fragment.glsl";

import { Water } from 'three/examples/jsm/objects/Water.js'


const stats = new Stats();
document.body.appendChild(stats.dom);

// Canvas and scene
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
scene.background = new THREE.Color(
    0x000000
    // 0x443333
    )
// scene.fog = new THREE.Fog( 0x443333, 1, 4 );

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
// Reflector.ReflectorShader.uniforms.tDudv.value = {value: dudvMap};


// const dudvMap = new THREE.TextureLoader().load( '/waterdudv.jpg', function () {

//     animate();

// } );

// dudvMap.wrapS = dudvMap.wrapT = THREE.RepeatWrapping;
// reflector.material.uniforms.tDudv.value = dudvMap;


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

const point = new THREE.PointLight( 0xDC143C, 1 );
point.position.set(1,0,0)

// const pointb = point.clone() 
// point.color= new THREE.Color(0xc341ff);
// pointb.position.set(14,0,1)

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
    cursorLight, 
    ambient
    // ,point
    )


// ****Geometry****

// *****materials**** //

const TextMat = new THREE.MeshStandardMaterial({
    color: "#ffffff",
  emissive: "#ffffff",
//   emissiveIntensity:0.4
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
glassMat.transmission = 1.0
glassMat.roughness = 0.2
glassMat.metalness = 0
glassMat.clearcoat = 1
glassMat.clearcoatRoughness = 0.25
glassMat.color = new THREE.Color(0xffffff)
glassMat.ior = 2
glassMat.thickness = 1.5
// glassMat.envMap= hdrEquirect,
// glassMat.envMapIntensity= 1.5,

// *****Meshh and model****



// const bakedMaterial = new THREE.MeshnoiseMaterial({
//     map: bakedTexture,
// })


//model


gltfLoader.load(
    '/grumbsStudio.glb',
    (gltf) => {
        const strobeLeft = gltf.scene.children.find(child => child.name === 'strobeLeft')
        const strobeRight = gltf.scene.children.find(child => child.name === 'strobeRight')
        const X = gltf.scene.children.find(child => child.name === 'X')
        const grumbs = gltf.scene.children.find(child => child.name === 'grumbs')

        // grumbs = grumbs
        scene.add(gltf.scene);


        strobeLeft.material = TextMat;
        strobeRight.material = TextMat;
        X.material = TextMat;
        // text.scale.set(1.5, 1.5, 1.5)
        // text.position.y = 1.5
        // text.castShadow = true

        grumbs.material = noiseMat;
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


let camera;

// ****mouse movement****

// Create a variable to keep track of mouse position and touch position
const pointer = new THREE.Vector2();

noiseMat.uniforms.u_mouse.value = pointer;

// A function to be called every time the pointer (mouse or touch) moves
function onUpdatePointer(event) {
    event.preventDefault();

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    updateCursorLight();
}

// Function to update cursor light position based on pointer (mouse or touch)
function updateCursorLight() {
    const vector = new THREE.Vector3(pointer.x, pointer.y, 1);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const pos = camera.position.clone().add(dir.multiplyScalar(distance));
    cursorLight.position.x = pos.x;
    cursorLight.position.y = pos.y;
    cursorLight.position.z = 1;
}

// Add a listener for the pointermove event
canvas.addEventListener("pointermove", onUpdatePointer, false);


// modelG.rotation.y = THREE.MathUtils.lerp(modelG.rotation.y, (pointer.x * Math.PI) / 20, 0.05)
//     modelG.rotation.x = THREE.MathUtils.lerp(modelG.rotation.x, (pointer.y * Math.PI) / 20, 0.05)




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

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

/**
 * Camera
 */

// Camera group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
let camZ = 3;
camera = new THREE.PerspectiveCamera(
    45,
    sizes.width / sizes.height,
    0.1,
    100
);
camera.position.set(5, 3, camZ);
camera.lookAt(0, 0, 0);
cameraGroup.add(camera);

// ******Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = true
controls.enableRotate = true
controls.enableZoom = true
controls.update();

//Reflective Ground//////
const planegeo = new THREE.PlaneGeometry(10, 10)

const PlaneMat = new THREE.MeshStandardMaterial({
    color: 0x000000,
    emissive:0x000000,
    roughness: 0,
    metalness:1,
    transparent:true,
    opacity:0.9,

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

const groundMirror = new Reflector( planegeo, {
    clipBias: 0.003,
    textureWidth: window.innerWidth ,
    textureHeight: window.innerHeight ,
    color: 0x000000,
    shader: mirrorShader
} );
groundMirror.position.y = 0;
groundMirror.rotateX( - Math.PI / 2 );

// Reflector.ReflectorShader.uniforms.time.value = {value: 0};
groundMirror.material.uniforms.tDudv.value = dudvMap;

scene.add( groundMirror );

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

// const ssrPass = new SSRPass({
//     renderer,
//     scene,
//     camera,
//     width: innerWidth,
//     height: innerHeight,
//     groundReflector: groundReflector,
//     selects:  null
// });
// ssrPass.thickness = 0.018;
// ssrPass.infiniteThick = true

// composer.addPass(ssrPass);
// composer.addPass(new OutputPass());

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
    } else {
        camera.position.z = camZ;
    }
    camera.updateProjectionMatrix()

    bloomPass.resolution.set(sizes.width, sizes.height);

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    composer.setSize(window.innerWidth, window.innerHeight);

    // groundReflector.getRenderTarget().setSize(window.innerWidth, window.innerHeight);
    // groundReflector.resolution.set(window.innerWidth, window.innerHeight);

    groundMirror.getRenderTarget().setSize(
        window.innerWidth,
        window.innerHeight
    );

})

//***** */mobile responsiveness******
if (sizes.width < sizes.height) {
    camera.position.z = camZ + 5;
} else {
    camera.position.z = camZ;
}
camera.updateProjectionMatrix()
//  planeMesh.material.update()
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    //update shader
    groundMirror.material.uniforms.time.value = elapsedTime
    
    // const parallaxX = pointer.x  * 0.5
    // const parallaxY = -pointer.y * 0.5

    // grumbs.rotation.x += (parallaxX - grumbs.rotation.x) * 0.5 
    // grumbs.rotation.y += (parallaxY - grumbs.rotation.y) * 0.5 

    controls.update();
   

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