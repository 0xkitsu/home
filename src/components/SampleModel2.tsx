import React, { Suspense } from 'react'
import VRMAsset from '../utils/VRMAsset'

export default function SampleModel2() {
  return (
    <Suspense fallback={null}>
      <VRMAsset position={[1,0,1]} forceShadows url='./models/kuda.vrm' />
    </Suspense>
  )
}