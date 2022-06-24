import React, { useState, useEffect, createRef } from 'react'
import { VRM, VRMExpressionPresetName, VRMLoaderPlugin, VRMLookAtLoaderPlugin, VRMSpringBoneLoaderPlugin, VRMUtils } from '@pixiv/three-vrm'
import { Scene, Group, BufferGeometry, Material, Mesh, MeshPhongMaterial, MeshBasicMaterial, Vector3, MeshStandardMaterial, AnimationObjectGroup } from 'three'
import { useFrame, useLoader } from '@react-three/fiber'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import * as THREE from 'three';
import { loadMixamoAnimation } from './loadMixamoAnimation';

interface Props {
    url: string
    forceShadows?: boolean
    position: number[]
}
interface Anims {
    name: string
    action: THREE.AnimationAction
}

export default function VRMAsset({ url, forceShadows, position }: Props) {
    const [scene, setScene] = useState<Scene | Group | null>(null)
    const [vrm, setVrm] = useState<VRM | null>(null)
    const [animationMixer, setAnimationMixer] = useState<THREE.AnimationMixer | null>(null)

    const [walking, setWalking] = useState(false);
    const gltf = useLoader(GLTFLoader, url)
  let baseActions: Anims[] = [];
  let additiveActions: Anims[] = [];



  useEffect(() => {

    const _dracoLoader = new DRACOLoader();
        _dracoLoader.setDecoderPath( './draco/' );
    const _loader: GLTFLoader = new GLTFLoader();
        _loader.setDRACOLoader( _dracoLoader );
        _loader.register( ( parser ) => new VRMLoaderPlugin( parser, {
            // lookAtPlugin: new VRMLookAtLoaderPlugin( parser, {
            //   helperRoot: this._lookAtHelperRoot,
            // } ),
            // springBonePlugin: new VRMSpringBoneLoaderPlugin( parser, {
            //   jointHelperRoot: this._springBoneJointHelperRoot,
            //   colliderHelperRoot: this._springBoneColliderHelperRoot,
            // } ),
          } ) );
          _loader.crossOrigin = 'anonymous';
  

          
        _loader.load(
          url,
          ( gltf ) => { 

            VRMUtils.removeUnnecessaryJoints(gltf.scene)
            VRMUtils.removeUnnecessaryVertices( gltf.scene );
            
            const vrm = gltf.userData.vrm;

            vrm.scene.traverse( ( object: Mesh<BufferGeometry, Material | Material[]> ) => {

                object.castShadow = true;

                
                // if ( ! object.isMesh ) return;
                
                // if(forceShadows)
                // if(Array.isArray(object.material)){
                    
                //     object.material = object.material.map((m:any) => {
                //             // console.log(m);
                //         return new MeshStandardMaterial({color: m.color, map: m.map, transparent: m.transparent, opacity: m.opacity, depthWrite: m.depthWrite, depthFunc: m.depthFunc, depthTest: m.depthTest, alphaTest: m.alphaTest, alphaMap: m.alphaMap})
                //     })
                // }
                // else{
                // var m:any = object.material;
                // object.material = new MeshStandardMaterial({color: m.color, map: m.map, transparent: m.transparent, opacity: m.opacity, depthWrite: m.depthWrite, depthFunc: m.depthFunc, depthTest: m.depthTest, alphaTest: m.alphaTest, alphaMap: m.alphaMap});
                // }

                // if ( 'isMesh' in object ) {
                //   forEachMeshMaterials( object as THREE.Mesh, async ( material ) => {
                //     if ( 'isMeshStandardMaterial' in material ) {
                //       console.log(material);
                //     }
                //   } );
                // }
              } );
              gltf.scene.position.set(position[0], position[1], position[2]);
            
            VRMUtils.rotateVRM0( vrm );
              let animMixer = new THREE.AnimationMixer( vrm.scene );
            let loadingAnimations = [];
            for(let a of ['idle']){
        
                loadingAnimations.push(loadMixamoAnimation( `./motions/${a}.fbx`, vrm )
                .then( ( clip ) => {
                  if ( clip ) {
                    baseActions.push({
                        name: a, 
                        action: animMixer.clipAction(clip)
                    });
                  }
                } ));
        
    }

             setAnimationMixer(animMixer);
            setScene(vrm.scene)      
            setVrm(vrm);      
            Promise.allSettled(loadingAnimations).then(([result]) => {
                baseActions[0].action.play();
                
              setTimeout(()=>{document.getElementById("loader")?.classList.add("minimized");}, 200);
                  
             });

        },
        //   ( progress ) => { this._emit( 'progress', progress ); },
        //   ( error ) => { this._emit( 'error', error ); reject( error ); }
        );

  }, [gltf, setScene])

  let [nextBlink, setNextBlink] = useState<number>(0);
  let [nextWink, setNextWink] = useState<number>(0);

  
  
  useFrame((state, delta) => {

    setNextBlink(nextBlink - delta);
    if(nextBlink <= 0){
      setNextBlink(2+Math.random()*7);
      vrm?.expressionManager?.setValue( VRMExpressionPresetName.Blink, 1 );
      setTimeout(()=>{vrm?.expressionManager?.setValue( VRMExpressionPresetName.Blink, 0 )}, 400)
    }

    setNextWink(nextWink - delta);
    if(nextWink <= 0){
      setNextWink(10+Math.random()*70);
      vrm?.expressionManager?.setValue( VRMExpressionPresetName.BlinkLeft, 1 );
      setTimeout(()=>{vrm?.expressionManager?.setValue( VRMExpressionPresetName.BlinkLeft, 0 )}, 400)
    }
    
    if(animationMixer){
        if(vrm)
        vrm.update(delta)
        // console.log("updating")
        animationMixer.update(delta)
    }
  })

  if (scene === null) {
    return null
  }

  return <primitive object={scene} dispose={null} />
}

/**
 * `mesh.material` can be either `Material` or `Material[]`.
 * It absorbs the difference and executes a function for each materials the mesh has.
 * @param mesh The mesh you want to use
 * @param callback The callback executed for each materials
 */
 export function forEachMeshMaterials(
    mesh: THREE.Mesh,
    callback: ( material: THREE.Material ) => void,
  ): void {
    const set = new Set<THREE.Material>();
  
    const materialOrMaterials = mesh.material;
    if ( Array.isArray( materialOrMaterials ) ) {
      const materials = materialOrMaterials as THREE.Material[];
      materials.forEach( ( material ) => {
        set.add( material );
      } );
    } else {
      const material = materialOrMaterials as THREE.Material;
      set.add( material );
    }
  
    // for ( const material of set ) {
    //   callback( material );
    // }
    set.forEach(i => callback(i))
  }
  