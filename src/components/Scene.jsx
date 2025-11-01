import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Sparkles } from '@react-three/drei'
import { gsap } from 'gsap'
import * as THREE from 'three'

const defaultPhase = {
  background: '#040414',
  accent: '#3c48a6',
  leftPosition: [-8, 1.2, -6],
  rightPosition: [8, -1.2, -6],
  lightIntensity: 0.9,
  ambientIntensity: 0.25,
  glow: 0.8,
  halo: 0.4,
  starSpeed: 0.05,
  bloom: 0.7,
}

const Scene = ({ phase = defaultPhase }) => {
  const { scene } = useThree()
  const leftGroupRef = useRef()
  const rightGroupRef = useRef()
  const leftMoonRef = useRef()
  const rightMoonRef = useRef()
  const leftHaloRef = useRef()
  const rightHaloRef = useRef()
  const leftLightRef = useRef()
  const rightLightRef = useRef()
  const ambientRef = useRef()
  const starsRef = useRef()
  const bloomEffectRef = useRef()
  const hasInitialised = useRef(false)
  const starSpeedRef = useRef(phase.starSpeed)
  const starTargetRef = useRef(phase.starSpeed)
  const bloomTargetRef = useRef(phase.bloom)
  const backgroundColorRef = useRef(new THREE.Color(phase.background))

  const starPositions = useMemo(() => {
    const count = 2200
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i += 1) {
      const radius = THREE.MathUtils.randFloat(40, 180)
      const theta = THREE.MathUtils.degToRad(THREE.MathUtils.randFloatSpread(360))
      const phi = THREE.MathUtils.degToRad(THREE.MathUtils.randFloatSpread(120))
      const x = radius * Math.cos(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi)
      const z = radius * Math.cos(phi) * Math.sin(theta)
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
    }
    return positions
  }, [])

  useEffect(() => {
    if (!scene.background) {
      scene.background = backgroundColorRef.current.clone()
    }
    if (!scene.fog) {
      scene.fog = new THREE.Fog(backgroundColorRef.current.getHex(), 70, 180)
    }
  }, [scene])

  useEffect(() => {
    const targetColor = new THREE.Color(phase.background)
    const startColor = backgroundColorRef.current.clone()
    const proxy = { r: startColor.r, g: startColor.g, b: startColor.b }

    const tween = gsap.to(proxy, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration: 2.8,
      ease: 'power2.inOut',
      onUpdate: () => {
        backgroundColorRef.current.setRGB(proxy.r, proxy.g, proxy.b)
        scene.background = backgroundColorRef.current
        if (scene.fog) {
          scene.fog.color.copy(backgroundColorRef.current)
        }
      },
    })

    return () => tween.kill()
  }, [phase.background, scene])

  useEffect(() => {
    if (hasInitialised.current) {
      return
    }

    if (
      !leftGroupRef.current ||
      !rightGroupRef.current ||
      !leftMoonRef.current ||
      !rightMoonRef.current ||
      !leftHaloRef.current ||
      !rightHaloRef.current ||
      !leftLightRef.current ||
      !rightLightRef.current ||
      !ambientRef.current
    ) {
      return
    }

    leftGroupRef.current.position.set(...phase.leftPosition)
    rightGroupRef.current.position.set(...phase.rightPosition)

    const accent = new THREE.Color(phase.accent)
    const moonTint = accent.clone().lerp(new THREE.Color('#f5f6ff'), 0.35)

    leftMoonRef.current.material.color.copy(moonTint)
    rightMoonRef.current.material.color.copy(moonTint)
    leftMoonRef.current.material.emissive.copy(moonTint)
    rightMoonRef.current.material.emissive.copy(moonTint)
    leftMoonRef.current.material.emissiveIntensity = phase.glow
    rightMoonRef.current.material.emissiveIntensity = phase.glow

    leftHaloRef.current.material.opacity = phase.halo
    rightHaloRef.current.material.opacity = phase.halo

    leftLightRef.current.intensity = phase.lightIntensity
    rightLightRef.current.intensity = phase.lightIntensity
    leftLightRef.current.color.copy(accent)
    rightLightRef.current.color.copy(accent)
    ambientRef.current.intensity = phase.ambientIntensity
  ambientRef.current.color.copy(accent)

    hasInitialised.current = true
  }, [phase])

  useEffect(() => {
    if (
      !leftGroupRef.current ||
      !rightGroupRef.current ||
      !leftMoonRef.current ||
      !rightMoonRef.current ||
      !leftHaloRef.current ||
      !rightHaloRef.current ||
      !leftLightRef.current ||
      !rightLightRef.current ||
      !ambientRef.current
    ) {
      return undefined
    }

    starTargetRef.current = phase.starSpeed
    bloomTargetRef.current = phase.bloom

    const accent = new THREE.Color(phase.accent)
    const moonTint = accent.clone().lerp(new THREE.Color('#f5f6ff'), 0.35)
    const lightTint = accent.clone().lerp(new THREE.Color('#ffffff'), 0.25)

    const timeline = gsap.timeline({ defaults: { duration: 2.6, ease: 'power2.inOut' } })

    timeline.to(leftGroupRef.current.position, {
      x: phase.leftPosition[0],
      y: phase.leftPosition[1],
      z: phase.leftPosition[2],
    }, 0)

    timeline.to(rightGroupRef.current.position, {
      x: phase.rightPosition[0],
      y: phase.rightPosition[1],
      z: phase.rightPosition[2],
    }, 0)

    timeline.to(leftMoonRef.current.material.color, {
      r: moonTint.r,
      g: moonTint.g,
      b: moonTint.b,
    }, 0)

    timeline.to(rightMoonRef.current.material.color, {
      r: moonTint.r,
      g: moonTint.g,
      b: moonTint.b,
    }, 0)

    timeline.to(leftMoonRef.current.material.emissive, {
      r: moonTint.r,
      g: moonTint.g,
      b: moonTint.b,
    }, 0)

    timeline.to(rightMoonRef.current.material.emissive, {
      r: moonTint.r,
      g: moonTint.g,
      b: moonTint.b,
    }, 0)

    timeline.to(leftMoonRef.current.material, { emissiveIntensity: phase.glow }, 0)
    timeline.to(rightMoonRef.current.material, { emissiveIntensity: phase.glow }, 0)

    timeline.to(leftHaloRef.current.material, { opacity: phase.halo }, 0)
    timeline.to(rightHaloRef.current.material, { opacity: phase.halo }, 0)

    timeline.to(leftLightRef.current, { intensity: phase.lightIntensity }, 0)
    timeline.to(rightLightRef.current, { intensity: phase.lightIntensity }, 0)

    timeline.to(leftLightRef.current.color, {
      r: lightTint.r,
      g: lightTint.g,
      b: lightTint.b,
    }, 0)

    timeline.to(rightLightRef.current.color, {
      r: lightTint.r,
      g: lightTint.g,
      b: lightTint.b,
    }, 0)

    timeline.to(ambientRef.current, { intensity: phase.ambientIntensity }, 0)
    timeline.to(ambientRef.current.color, {
      r: accent.r,
      g: accent.g,
      b: accent.b,
    }, 0)

    return () => timeline.kill()
  }, [phase])

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()

    if (leftMoonRef.current) {
      leftMoonRef.current.rotation.y += delta * 0.12
      leftMoonRef.current.rotation.x = Math.sin(time * 0.15) * 0.08
    }

    if (rightMoonRef.current) {
      rightMoonRef.current.rotation.y -= delta * 0.1
      rightMoonRef.current.rotation.x = Math.sin(time * 0.18) * 0.06
    }

    if (leftGroupRef.current) {
      leftGroupRef.current.position.y += Math.sin(time * 0.6) * delta * 0.25
    }

    if (rightGroupRef.current) {
      rightGroupRef.current.position.y += Math.cos(time * 0.6) * delta * 0.25
    }

    if (starsRef.current) {
      starSpeedRef.current += (starTargetRef.current - starSpeedRef.current) * Math.min(1, delta * 2)
      starsRef.current.rotation.y += starSpeedRef.current * delta
      starsRef.current.rotation.x += starSpeedRef.current * delta * 0.35
    }

    if (bloomEffectRef.current) {
      const current = bloomEffectRef.current.intensity
      const target = bloomTargetRef.current
      bloomEffectRef.current.intensity = THREE.MathUtils.lerp(current, target, Math.min(1, delta * 1.8))
    }
  })

  return (
    <group>
      <ambientLight ref={ambientRef} intensity={phase.ambientIntensity} color={phase.accent} />

      <points ref={starsRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={starPositions} count={starPositions.length / 3} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          color="#d9dcff"
          size={0.6}
          sizeAttenuation
          transparent
          opacity={0.75}
          depthWrite={false}
        />
      </points>

      <Sparkles
        count={120}
        size={1.6}
        scale={[16, 8, 16]}
        speed={0.12}
        color={phase.accent}
        noise={0.6}
        opacity={0.18}
      />

      <group ref={leftGroupRef}>
        <mesh ref={leftMoonRef} castShadow receiveShadow>
          <sphereGeometry args={[1.9, 96, 96]} />
          <meshStandardMaterial
            color="#f5f6ff"
            metalness={0.1}
            roughness={0.2}
            emissive="#f5f6ff"
            emissiveIntensity={phase.glow}
          />
        </mesh>
        <mesh ref={leftHaloRef} scale={2.7}>
          <sphereGeometry args={[1, 48, 48]} />
          <meshBasicMaterial color={phase.accent} transparent opacity={phase.halo} blending={THREE.AdditiveBlending} />
        </mesh>
        <pointLight ref={leftLightRef} color={phase.accent} intensity={phase.lightIntensity} distance={18} decay={1.5} />
      </group>

      <group ref={rightGroupRef}>
        <mesh ref={rightMoonRef} castShadow receiveShadow>
          <sphereGeometry args={[1.9, 96, 96]} />
          <meshStandardMaterial
            color="#f5f6ff"
            metalness={0.1}
            roughness={0.25}
            emissive="#f5f6ff"
            emissiveIntensity={phase.glow}
          />
        </mesh>
        <mesh ref={rightHaloRef} scale={2.7}>
          <sphereGeometry args={[1, 48, 48]} />
          <meshBasicMaterial color={phase.accent} transparent opacity={phase.halo} blending={THREE.AdditiveBlending} />
        </mesh>
        <pointLight ref={rightLightRef} color={phase.accent} intensity={phase.lightIntensity} distance={18} decay={1.5} />
      </group>

      <EffectComposer multisampling={0}>
        <Bloom
          ref={bloomEffectRef}
          intensity={phase.bloom}
          mipmapBlur
          luminanceThreshold={0.05}
          luminanceSmoothing={0.9}
          radius={0.85}
        />
      </EffectComposer>
    </group>
  )
}

export default Scene
