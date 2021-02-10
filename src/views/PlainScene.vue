<template>
<div>
</div>
</template>

<script>
import { Engine } from 'babylonjs'
import * as BABYLON from 'babylonjs'

const createScene = (canvas, engine) => {
  const scene = new BABYLON.Scene(engine)
  const camera = new BABYLON.ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2.5, 3, new BABYLON.Vector3(0, 0, 0), scene)
  camera.attachControl(canvas, true)
  const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene)
  const box = BABYLON.MeshBuilder.CreateBox('box', {}, scene)
  console.log(light)
  console.log(box)
  return scene
}

export default {
  name: 'Donate',
  components: {
  },
  data () {
    return {
    }
  },
  mounted () {
    const canvas = document.getElementById('scene2')
    const engine = new Engine(canvas, true)
    createScene(canvas, engine)
  },
  methods: {
  },
  computed: {
  }
}
</script>
<style lang="scss">
</style>
