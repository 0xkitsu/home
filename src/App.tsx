import React, { useEffect, useRef, useState } from 'react'
import './App.css';
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { CameraControls } from './utils/camera-controls';
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";
import SampleModel from './components/SampleModel';
import { PerspectiveCamera, Plane, softShadows, SpotLight, useHelper } from "@react-three/drei"
import SampleModel2 from './components/SampleModel2';
import { useControls } from 'leva';
import AudioPlayer from './components/AudioPlayer';

function Box(props: JSX.IntrinsicElements['mesh']) {
  
  const ref = useRef<THREE.Mesh>(null!)
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  useFrame((state, delta) => {
    ref.current.rotation.x += 0.01
    ref.current.rotation.y += 0.01
  })
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
      castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'white'} />
      
    </mesh>
  )
}
function Sphere(props: JSX.IntrinsicElements['mesh']) {
  const ref = useRef<THREE.Mesh>(null!)
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  useFrame((state, delta) => {
    ref.current.rotation.x += 0.01
    ref.current.rotation.y += 0.01
  })
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
      castShadow>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial color={hovered ? 'red' : 'orange'} />
    </mesh>
  )
}

function ToonSphere(props: JSX.IntrinsicElements['mesh']) {
  const ref = useRef<THREE.Mesh>(null!)
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  useFrame((state, delta) => {
    ref.current.rotation.x += 0.01
    ref.current.rotation.y += 0.01
  })
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
      castShadow>
      <sphereGeometry args={[1, 64, 64]} />
      <meshToonMaterial color={hovered ? 'red' : 'orange'} />
    </mesh>
  )
}

function KeyLight(props: JSX.IntrinsicElements['light']) {
  const ref = useRef<THREE.Light>(null!)
  return (
    <light
      {...props}
      ref={ref}>    
      
      <rectAreaLight
        width={3}
        height={3}
        intensity={props.intensity}
        color={props.color}
        position={[-2, 0, 5]}
      />

    </light>
  )
}

function FillLight(props: JSX.IntrinsicElements['light']) {
  const ref = useRef<THREE.Light>(null!)
  return (
    <light
      {...props}
      ref={ref}>    
      
    <rectAreaLight
      width={3}
      height={3}
      intensity={props.intensity}
      color={props.color}
      position={[2, 1, 4]}
    />
    </light>
  );
}

function RimLight(props: JSX.IntrinsicElements['spotLight']) {
  const ref = useRef<THREE.SpotLight>(null!)

  useHelper(ref, THREE.SpotLightHelper, 'cyan')

  return (
      
   <spotLight
      {...props}
      ref={ref}
    />
    
  );
}

function DirLight(props: JSX.IntrinsicElements['directionalLight']) {
  const ref = useRef<THREE.DirectionalLight>(null!)
const {camera} = useThree();
  // useHelper(ref, THREE.DirectionalLightHelper, 2, "cyan")
  // useFrame((state, delta) => {
  //   ref.current.target.copy(camera.position);
  // })


  return (
      
   <directionalLight
      {...props}
      ref={ref}
      // target={camera}
    />
    
  );
}
// Geometry
function GroundPlane() {
  return (
    <mesh receiveShadow castShadow rotation={[5, 0, 0]} position={[0, -5, 0]}>
      <planeBufferGeometry attach="geometry" args={[500, 500]} />
      <meshStandardMaterial attach="material" color="white" />
    </mesh>
  );
}
function BackDrop() {
  return (
    <mesh receiveShadow castShadow position={[0, -1, -5]}>
      <planeBufferGeometry attach="geometry" args={[500, 500]} />
      <meshStandardMaterial attach="material" color="white" />
    </mesh>
  );
}
function App() {
  // const { name, aNumber } = useControls({ name: 'World', aNumber: 0 })

  // const { position, boxSize } = useControls({
  //   position: { x: 1, y: 1, z: 1 },
  //   cameraPosition: { x: 0, y: 0, z: 0},
  //   boxSize: [10, 20],
  // })

  softShadows()

	const cameraControls = useRef<CameraControls | null>(null);
  return (   <>
    <Canvas shadows>   
    

    <PerspectiveCamera args={[      30.0,
      window.innerWidth / window.innerHeight,
      0.1,
      500.0]} position={[0.2, 2.0, 1.0 ]} makeDefault
   />

    <gridHelper />
    
    <CameraControls ref={cameraControls}  />
    
    <SampleModel />

    {/* <Box position={[-2.4, 1, 0]} />
    <Sphere position={[2.4, 1, 0]} />
    <ToonSphere position={[2.4, 3, 0]} />
 */}


      <DirLight
        intensity={1}
        position={[-5, 1, 1]} 
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        castShadow
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      {/* <RimLight
        intensity={1}
        position={[0, 4, 4]}
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        castShadow
      /> */}
  </Canvas> 
  
  <div id="loader" className="loader w-[100vw] h-[100vh] absolute top-0 left-0 bg-[#000000] flex duration-1000">
        <span className="inline-block align-middle m-auto text-3xl drop-shadow-[0_0_12px_rgba(255,0,0)]">loading...
        </span>
      </div>
  <AudioPlayer audio="./audio/Fleeting Frozen Heart.mp3"></AudioPlayer>
      <h1 className="absolute top-[25px] left-[25px] text-white text-5xl drop-shadow-[0_0_12px_rgba(255,0,0)]">Kuda Kitsune</h1>
      <h2 className="absolute top-[90px] left-[25px] text-white text-2xl drop-shadow-[0_0_12px_rgba(255,0,0)]">exploring the metaverse</h2>
      <a href="https://twitter.com/0xkitsu" target="_blank" className="w-[50px] h-[50px] absolute bottom-[25px] translate-x-[-275%] text-5xl drop-shadow-[0_0_12px_rgba(255,0,0)]">
        <i className="fa-brands fa-twitter"></i>
      </a>
      <a href="https://github.com/0xkitsu" target="_blank" className="w-[50px] h-[50px] absolute bottom-[25px] translate-x-[-125%] text-5xl drop-shadow-[0_0_12px_rgba(255,0,0)]">
        <i className="fa-brands fa-github"></i>
      </a>
      <a href="https://codepen.io/0xkitsu" target="_blank" className="w-[50px] h-[50px] absolute bottom-[25px] translate-x-[25%] text-5xl drop-shadow-[0_0_12px_rgba(255,0,0)]">
        <i className="fa-brands fa-codepen"></i>
      </a>
      <a href="https://www.freecodecamp.org/0xkitsu" target="_blank" className="w-[50px] h-[50px] absolute bottom-[25px] translate-x-[175%] text-5xl drop-shadow-[0_0_12px_rgba(255,0,0)]">
        <i className="fa-brands fa-free-code-camp"></i>
      </a>
      </>
  );
}

export default App;
