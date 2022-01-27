import axios from "axios";
import { Power1, TweenMax } from "gsap";
import React, { useEffect, useRef, useState } from "react";
import { useTitle } from 'react-use';
import Terminal from "terminal-in-react";
import * as THREE from 'three';
import { v4 as uuidv4 } from 'uuid';

let senderName = "Guest_" + uuidv4().substring(0, 8);

function App() {
  useTitle("The Nexus")

  const [agentName, setAgentName] = useState("Heart_Node_8942");
  const terminalRef = useRef();

  const msgRef = useRef();

  useEffect(() => {
    document.getElementsByClassName("terminal-base")[0].firstChild.firstChild.style.overflow = "hidden"
  }, []);

  const handleCommand = (input, print) => {
    if (input[0].includes("/nick")) {
      terminalRef.current.
        senderName = input[1];
      print("SYSTEM" + "> " + "Set NICK to " + input[1])
      return;
    }
    // TODO: Handle sender
    const body = { sender: senderName, command: input.join(" ") };
    axios.post(`${process.env.VITE_SERVER_CONNECTION_URL}/execute`, body).then(res => {
      console.log("response is", res);
      console.log(agentName + "> " + res.data.result);
      print(agentName + "> " + res.data.result)
    });
  };

  useEffect(() => {

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.needsUpdate = true;

    renderer.domElement.style.position = "fixed";

    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    var camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 500);

    camera.position.set(0, 2, 14);

    var scene = new THREE.Scene();
    var city = new THREE.Object3D();
    var smoke = new THREE.Object3D();
    var town = new THREE.Object3D();

    var createCarPos = true;
    var uSpeed = 0.001;

    var setcolor = 0xCCCCCC;

    scene.background = new THREE.Color(setcolor);
    scene.fog = new THREE.Fog(setcolor, 10, 16);


    function mathRandom(num = 8) {
      var numValue = - Math.random() * num + Math.random() * num;
      return numValue;
    };

    var setTintNum = true;
    function setTintColor() {
      if (setTintNum) {
        setTintNum = false;
        var setColor = 0x1F1F1F;
      } else {
        setTintNum = true;
        var setColor = 0x1F1F1F;
      };
      return setColor;
    };

    function init() {
      var segments = 2;
      for (var i = 1; i < 100; i++) {
        var geometry = new THREE.BoxGeometry(1, Math.random() * 2, 1, segments, segments, segments);
        var material = new THREE.MeshStandardMaterial({
          color: setTintColor(),
          wireframe: false,
          shading: THREE.SmoothShading,
          side: THREE.DoubleSide
        });
        var wmaterial = new THREE.MeshLambertMaterial({
          color: 0xFFFFFF,
          wireframe: false,
          transparent: true,
          opacity: 0.03,
          side: THREE.DoubleSide
        });

        var cube = new THREE.Mesh(geometry, material);
        var wire = new THREE.Mesh(geometry, wmaterial);
        var floor = new THREE.Mesh(geometry, material);
        var wfloor = new THREE.Mesh(geometry, wmaterial);

        cube.add(wfloor);
        cube.castShadow = true;
        cube.receiveShadow = true;
        cube.rotationValue = 0.1 + Math.abs(mathRandom(8));

        floor.scale.y = 0.05;//+mathRandom(0.5);
        cube.scale.y = 0.1 + Math.abs(mathRandom(8));

        var cubeWidth = 0.9;
        cube.scale.x = cube.scale.z = cubeWidth + mathRandom(1 - cubeWidth);
        cube.position.x = Math.round(mathRandom());
        cube.position.z = Math.round(mathRandom());

        floor.position.set(cube.position.x, 0/*floor.scale.y / 2*/, cube.position.z)

        town.add(floor);
        town.add(cube);
      };

      var gmaterial = new THREE.MeshToonMaterial({ color: 0x999999, side: THREE.DoubleSide });
      var gparticular = new THREE.CircleGeometry(0.01, 3);
      var aparticular = 5;

      for (var h = 1; h < 300; h++) {
        var particular = new THREE.Mesh(gparticular, gmaterial);
        particular.position.set(mathRandom(aparticular), mathRandom(aparticular), mathRandom(aparticular));
        particular.rotation.set(mathRandom(), mathRandom(), mathRandom());
        smoke.add(particular);
      };

      var pmaterial = new THREE.MeshPhongMaterial({
        color: 0xAAAAAA,
        side: THREE.DoubleSide,
        roughness: 10,
        metalness: 0.6,
        opacity: 0.9,
        transparent: true
      });
      var pgeometry = new THREE.PlaneGeometry(60, 60);
      var pelement = new THREE.Mesh(pgeometry, pmaterial);
      pelement.rotation.x = -90 * Math.PI / 180;
      pelement.position.y = -0.001;
      pelement.receiveShadow = true;
      city.add(pelement);
    };

    var mouse = new THREE.Vector2();

    function onMouseMove(event) {
      event.preventDefault();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    function onDocumentTouchStart(event) {
      if (event.touches.length == 1) {
        event.preventDefault();
        mouse.x = event.touches[0].pageX - window.innerWidth / 2;
        mouse.y = event.touches[0].pageY - window.innerHeight / 2;
      };
    };
    function onDocumentTouchMove(event) {
      if (event.touches.length == 1) {
        event.preventDefault();
        mouse.x = event.touches[0].pageX - window.innerWidth / 2;
        mouse.y = event.touches[0].pageY - window.innerHeight / 2;
      }
    }
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('touchstart', onDocumentTouchStart, false);
    window.addEventListener('touchmove', onDocumentTouchMove, false);

    var ambientLight = new THREE.AmbientLight(0xFFFFFF, 4);
    var lightFront = new THREE.SpotLight(0xFFFFFF, 20, 10);
    var lightBack = new THREE.PointLight(0xFFFFFF, 0.5);

    lightFront.rotation.x = 45 * Math.PI / 180;
    lightFront.rotation.z = -45 * Math.PI / 180;
    lightFront.position.set(5, 5, 5);
    lightFront.castShadow = true;
    lightFront.shadow.mapSize.width = 6000;
    lightFront.shadow.mapSize.height = lightFront.shadow.mapSize.width;
    lightFront.penumbra = 0.1;
    lightBack.position.set(0, 6, 0);

    smoke.position.y = 2;

    scene.add(ambientLight);
    city.add(lightFront);
    scene.add(lightBack);
    scene.add(city);
    city.add(smoke);
    city.add(town);

    var gridHelper = new THREE.GridHelper(60, 120, 0xCCCCCC, 0xCCCCCC);
    city.add(gridHelper);

    var createCars = function (cScale = 2, cPos = 20, cColor = 0xFFFFFF) {
      var cMat = new THREE.MeshToonMaterial({ color: cColor, side: THREE.DoubleSide });
      var cGeo = new THREE.BoxGeometry(1, cScale / 40, cScale / 40);
      var cElem = new THREE.Mesh(cGeo, cMat);
      var cAmp = 3;

      if (createCarPos) {
        createCarPos = false;
        cElem.position.x = -cPos;
        cElem.position.z = (mathRandom(cAmp));

        TweenMax.to(cElem.position, 3, { x: cPos, repeat: -1, yoyo: true, delay: mathRandom(3) });
      } else {
        createCarPos = true;
        cElem.position.x = (mathRandom(cAmp));
        cElem.position.z = -cPos;
        cElem.rotation.y = 90 * Math.PI / 180;

        TweenMax.to(cElem.position, 5, { z: cPos, repeat: -1, yoyo: true, delay: mathRandom(3), ease: Power1.easeInOut });
      };
      cElem.receiveShadow = true;
      cElem.castShadow = true;
      cElem.position.y = Math.abs(mathRandom(5));
      city.add(cElem);
    };

    var generateLines = function () {
      for (var i = 0; i < 60; i++) {
        createCars(0.1, 20);
      };
    };


    var animate = function () {
      var time = Date.now() * 0.00005;
      requestAnimationFrame(animate);

      city.rotation.y -= ((mouse.x * 8) - camera.rotation.y) * uSpeed;
      city.rotation.x -= (-(mouse.y * 2) - camera.rotation.x) * uSpeed;
      if (city.rotation.x < -0.05) city.rotation.x = -0.05;
      else if (city.rotation.x > 1) city.rotation.x = 1;

      smoke.rotation.y += 0.01;
      smoke.rotation.x += 0.01;

      camera.lookAt(city.position);
      renderer.render(scene, camera);
    }

    //----------------------------------------------------------------- START functions
    generateLines();
    init();
    animate();

    printInTerminal(agentName + " > " + "Welcome to The Nexus. Let me know how I can be of assistance to you.")

  }, [])


  const printInTerminal = (content) => {
    console.log("terminalRef.current", terminalRef.current)
    terminalRef.current.state.instances[0].instance.updater.enqueueSetState(
      terminalRef.current.state.instances[0].instance,
      {
        summary: [
          ...terminalRef.current.state.instances[0].instance.state.summary,
          ...(Array.isArray(content) ? content.map((c) => [c]) : [content]),
        ],
      }
    );
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        position: "absolute",
        backgroundColor: "#ffffffcc",
        margin: "auto",
        zIndex: 1000
      }}
    >
      <Terminal
        ref={terminalRef}
        startState="maximised"
        color="#999"
        outputColor="#999"
        prompt="#999"
        hideTopBar={true}
        allowTabs={false}
        promptSymbol={">"}
        backgroundColor="rgba(0,0,0,0)"
        barColor="black"
        style={{ position: "fixed", backgroundColor: "white", left: "25%", margin: "auto", borderRadius: "1em", color: "orange", marginTop: "10%", minWidth: "300px", width: "50%", overflow: "hidden", minHeight: "200px", height: "50%", fontWeight: "bold", fontSize: "1em", zIndex: "1000" }}
        commands={{
        }}
        description={{
        }}
        msg={"Established connection with The Nexus, Heart Node 98712"}
        commandPassThrough={handleCommand}
      />


    </div>
  );
}

export default App
