import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0"
const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision

let faceLandmarker
let runningMode = "VIDEO"
let webcamRunning = false
const video = document.getElementById("webcam")
let jawOpen = false

import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
let camera, scene, renderer, clock, model, upperBeak, lowerBeak, gui
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import * as dat from "dat.gui"

init()
animate()

function init() {
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.01,
    10
  )
  camera.position.set(0, -1, 5)

  clock = new THREE.Clock()
  gui = new dat.GUI()
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff)

  const light = new THREE.HemisphereLight(0xbbbbff, 0x444422)
  light.position.set(0, 1, 0)
  scene.add(light)

  const sphereGeometry = new THREE.SphereGeometry(0.1, 6, 4)
  const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 })
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  scene.add(sphere)

  const geometry = new THREE.CylinderGeometry(0.1, 0.2, 1, 6)
  const material = new THREE.MeshStandardMaterial({ color: "yellow" })
  const cylinder = new THREE.Mesh(geometry, material)
  scene.add(cylinder)
  //   model
  const loader = new GLTFLoader()
  loader.load("./bird.glb", function (gltf) {
    model = gltf.scene

    model.traverse((o) => {
      if (o.isMesh) o.material = material
    })
    upperBeak = model.getObjectByName("upper-beak")
    // upperBeak.rotation.z = -0.05
    gui.add(upperBeak.rotation, "z", 0, 1).name("upper-beak-rotation")
    lowerBeak = model.getObjectByName("lower-beak")
    gui.add(lowerBeak.rotation, "z", -1, 0).name("lower-beak-rotation")

    scene.add(model)
  })

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  //   renderer.outputEncoding = THREE.sRGBEncoding
  document.body.appendChild(renderer.domElement)

  window.addEventListener("resize", onWindowResize, false)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, 1, 0)
  controls.update()
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate() {
  requestAnimationFrame(animate)

  const t = clock.getElapsedTime()

  if (upperBeak) {
    // upperBeak.rotation.z += Math.sin( t ) * 0.005;
  }
  if (model) {
    if (jawOpen) {
      upperBeak.rotation.z = 0.3
      lowerBeak.rotation.z = -0.3
    } else {
      upperBeak.rotation.z = 0
      lowerBeak.rotation.z = 0
    }
  }

  renderer.render(scene, camera)
}

async function initLandmarkDetection() {
  // Read more `CopyWebpackPlugin`, copy wasm set from "https://cdn.skypack.dev/node_modules" to `/wasm`
  const filesetResolver = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
  )
  faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
      delegate: "GPU",
    },
    outputFaceBlendshapes: true,
    runningMode,
    numFaces: 1,
  })
}
initLandmarkDetection()

function enableCam() {
  console.log("model loaded", faceLandmarker)
  const constraints = { video: true }
  // Activate the webcam stream.
  navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
    video.srcObject = stream
    console.log("enabled webcam")
    video.addEventListener("loadeddata", predictWebcam)
  })
}

// executeWhenTrue(!Boolean(faceLandmarker),enableCam)
setTimeout(() => {
  enableCam()
}, 3000)

let lastVideoTime = -1
let results = undefined
async function predictWebcam() {
  console.log("predicting webcam")
  // Now let's start detecting the stream.

  // await faceLandmarker.setOptions({ runningMode: "VIDEO" });
  let nowInMs = Date.now()
  if (lastVideoTime !== video.currentTime) {
    lastVideoTime = video.currentTime
    results = faceLandmarker.detectForVideo(video, nowInMs)
    console.log("results", results)
    // .find(o => o.categories === 'jawOpen')
    console.log(
      "results",
      results.faceBlendshapes[0]?.categories.find(
        (o) => o.categoryName === "jawOpen"
      )
    )
    if (
      results.faceBlendshapes[0]?.categories.find(
        (o) => o.categoryName === "jawOpen"
      )?.score > 0.1
    ) {
      jawOpen = true
    } else {
      jawOpen = false
    }
    results = undefined
  }
  // Call this function again to keep predicting when the browser is ready.
  window.requestAnimationFrame(predictWebcam)
}
