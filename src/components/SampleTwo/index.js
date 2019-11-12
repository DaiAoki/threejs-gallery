import React from 'react'
import Canvas from 'components/shared/Canvas'
import StatsOutput from 'components/shared/StatsOutput'
import THREE from 'utils/THREE'
import Stats from 'stats.js'
import * as dat from 'dat.gui'

function init() {

  var stats = initStats();
  const canvas = document.querySelector('#canvas')

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xffffff, 0.015);
  //scene.fog = new THREE.Fog(0xffffff, 0.015, 100);

  // create a camera, which defines where we're looking at.
  var camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  scene.add(camera);

  // create a render and set the size
  var renderer = new THREE.WebGLRenderer();

  renderer.setClearColor(new THREE.Color(0xEEEEEE));
  renderer.setSize( canvas.clientWidth, canvas.clientHeight );
  renderer.shadowMap.enabled = true;

  // create the ground plane
  var planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
  var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;

  // rotate and position the plane
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.x = 0;
  plane.position.y = 0;
  plane.position.z = 0;

  // add the plane to the scene
  scene.add(plane);

  // position and point the camera to the center of the scene
  camera.position.x = -30;
  camera.position.y = 40;
  camera.position.z = 30;
  camera.lookAt(scene.position);

  // add subtle ambient lighting
  var ambientLight = new THREE.AmbientLight(0x0c0c0c);
  scene.add(ambientLight);

  // add spotlight for the shadows
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-20, 30, -5);
  spotLight.castShadow = true;
  scene.add(spotLight);

  // add the output of the renderer to the html element
  canvas.appendChild( renderer.domElement );

  // call the render function
  var step = 0;

  var controls = new function () {
    this.rotationSpeed = 0.02;
    this.numberOfObjects = scene.children.length;

    this.removeCube = function () {
      var allChildren = scene.children;
      var lastObject = allChildren[allChildren.length - 1];
      if (lastObject instanceof THREE.Mesh) {
        scene.remove(lastObject);
        this.numberOfObjects = scene.children.length;
      }
    };

    this.addCube = function () {

      var cubeSize = Math.ceil((Math.random() * 3));
      var cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      var cubeMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff});
      var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.castShadow = true;
      cube.name = "cube-" + scene.children.length;


      // position the cube randomly in the scene

      cube.position.x = -30 + Math.round((Math.random() * planeGeometry.parameters.width));
      cube.position.y = Math.round((Math.random() * 5));
      cube.position.z = -20 + Math.round((Math.random() * planeGeometry.parameters.height));

      // add the cube to the scene
      scene.add(cube);
      this.numberOfObjects = scene.children.length;
    };

    this.outputObjects = function () {
      console.log(scene.children);
    }
  };

  var gui = new dat.GUI();
  gui.add(controls, 'rotationSpeed', 0, 0.5);
  gui.add(controls, 'addCube');
  gui.add(controls, 'removeCube');
  gui.add(controls, 'outputObjects');
  gui.add(controls, 'numberOfObjects').listen();

  render();

  function render() {
    stats.update();

    // rotate the cubes around its axes
    scene.traverse(function (obj) {
      if (obj instanceof THREE.Mesh && obj != plane) {
        obj.rotation.x += controls.rotationSpeed;
        obj.rotation.y += controls.rotationSpeed;
        obj.rotation.z += controls.rotationSpeed;
      }
    });

    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  function initStats() {

    var stats = new Stats();

    stats.setMode(0); // 0: fps, 1: ms

    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    document.getElementById("Stats-output").appendChild(stats.domElement);

    return stats;
  }
}

class SampleTwo extends React.Component {

  componentDidMount() {
    init()
  }

  render() {
    return (
      <React.Fragment>
        <StatsOutput/>
        <Canvas/>
      </React.Fragment>
    )
  }
}

export default SampleTwo
