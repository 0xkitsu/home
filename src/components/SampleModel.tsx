import React, { Suspense } from 'react'
import VRMAsset from '../utils/VRMAsset'

export default function SampleModel() {
  return (
    <Suspense fallback={null}>
      <VRMAsset position={[0,0,0]} url='./models/kuda.vrm' />
    </Suspense>
  )
}