// Types
import type { GUI } from 'lil-gui'
import type { RootState } from 'store'

// Fonts
import fnt from '/fonts/MSDF/SairaSemiCondensed-SemiBold-msdf.json?url'
import png from '/fonts/MSDF/SairaSemiCondensed-SemiBold.png?url'

// Utils
import * as THREE from 'three'
import { gsap } from 'gsap'
import lerp from 'utils/lerp'
import { scaleValue, randomIntFromInterval } from 'utils/math'
import { Howl } from 'howler'
import breakpoints from 'utils/breakpoints'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'
import { rootNavigate } from 'components/CustomRouter'
import {
  ClickableMesh,
  StateMaterialSet,
  MouseEventManager,
  ThreeMouseEventType
} from '@masatomakino/threejs-interactive-object'
import { MSDFTextGeometry, uniforms } from '../utils/MSDFText'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import StoreWatcher from '../utils/StoreWatcher'

// Shaders
import vertexShader from './shaders/portfolio/vertex'
import fragmentShader from './shaders/portfolio/fragment'
import captionVertexShader from './shaders/title/vertex'
import captionFragmentShader from './shaders/title/fragment'

// Components
import Experience from '../Experience'


type DebugObject = {
  offsetX: number
  offsetY: number
  offsetZ: number
  iColorOuter: THREE.Color
  iColorInner: THREE.Color
}

type ItemSnapshot = {
  position: THREE.Vector3
  rotation: THREE.Euler
  iFactor: number
}

type Project = {
  name: string
  url: string
  media: 'image' | 'video'
  source: HTMLImageElement | HTMLVideoElement
}

export default class Portfolio {
  experience: Experience
  scene: Experience['scene']
  world: Experience['world']
  resources: Experience['resources']
  debug: Experience['debug']
  time: Experience['time']
  sizes: Experience['sizes']
  debugFolder: GUI | undefined
  group!: THREE.Group
  groupPosition!: THREE.Vector3
  items!: THREE.Mesh[]
  captions!: THREE.Mesh[]
  snapshots: ItemSnapshot[]
  debugObject: DebugObject
  material!: StateMaterialSet
  camera: THREE.PerspectiveCamera
  howls: Howl[]
  manager: MouseEventManager | undefined
  projects: Project[]
  scrollBoundaries: [number, number]
  screenSizes: { screenWidth: number; screenHeight: number }
  xPosition: number
  scrollOffset: number
  isVisible: boolean
  visibleItemIndex: number

  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private clickableObjects: THREE.Object3D[] = [];
  private handlePopStateBound: (event: PopStateEvent) => void;

  constructor() {
    this.isVisible = false
    this.scrollBoundaries = [0, 0]
    this.xPosition = 0
    this.scrollOffset = 0
    this.visibleItemIndex = -1
    this.snapshots = []

    this.experience = new Experience()
    this.resources = this.experience.resources
    this.scene = this.experience.scene
    this.world = this.experience.world
    this.sizes = this.experience.sizes

    this.time = this.experience.time
    this.handlePopStateBound = this.handlePopState.bind(this);
    this.camera = this.experience.world.cameraOnPath.camera
    if (this.camera && this.experience.renderer.canvas) {
      this.manager = new MouseEventManager(this.scene, this.camera, this.experience.renderer.canvas)
    }
    window.addEventListener('click', this.onMouseClick.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    const bells = 4
    this.howls = []
    for (let i = 1; i <= bells; i++) {
      this.howls.push(
        new Howl({
          src: [`/audio/bell${i}.mp3`],
          volume: 1
        })
      )
    }

    // Add this utility function at the top of your file
const createCardImage = (title: string, description: string, icon: string): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Set canvas size
  canvas.width = 700;
  canvas.height = 500;
  

const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
gradient.addColorStop(0, 'rgba(73, 10, 80, 0.53)');  // Slightly transparent purple
gradient.addColorStop(1, 'rgba(48, 10, 53, 0.8)');  // Darker purple

// Apply the gradient
ctx.fillStyle = gradient;
// Add rounded corners
const cornerRadius = 15;
ctx.beginPath();
ctx.moveTo(cornerRadius, 0);
ctx.lineTo(canvas.width - cornerRadius, 0);
ctx.quadraticCurveTo(canvas.width, 0, canvas.width, cornerRadius);
ctx.lineTo(canvas.width, canvas.height - cornerRadius);
ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - cornerRadius, canvas.height);
ctx.lineTo(cornerRadius, canvas.height);
ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - cornerRadius);
ctx.lineTo(0, cornerRadius);
ctx.quadraticCurveTo(0, 0, cornerRadius, 0);
ctx.closePath();
ctx.fill();

// Add subtle glow effect
const glowGradient = ctx.createRadialGradient(
  canvas.width / 2, 
  canvas.height / 2, 
  0,
  canvas.width / 2, 
  canvas.height / 2, 
  Math.max(canvas.width, canvas.height) / 2
);
glowGradient.addColorStop(0, 'rgba(120, 40, 200, 0.3)');
glowGradient.addColorStop(1, 'rgba(120, 40, 200, 0)');

ctx.fillStyle = glowGradient;
ctx.globalCompositeOperation = 'overlay';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.globalCompositeOperation = 'source-over';

// Add border with gradient
const borderGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, 'rgba(73, 10, 80, 0.53)');  // Slightly transparent purple
gradient.addColorStop(1, 'rgba(48, 10, 53, 0.8)'); 

ctx.strokeStyle = borderGradient;
ctx.lineWidth = 1.5;
ctx.stroke();




  
  // Add title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 40px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(title, canvas.width / 2, 150);
  
  // Add description
  ctx.font = '20px Arial';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  
  // Split description into multiple lines if needed
  const maxWidth = canvas.width - 100;
  const words = description.split(' ');
  let line = '';
  let y = 200;
  
  for (const word of words) {
    const testLine = line + word + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line.length > 0) {
      ctx.fillText(line, canvas.width / 2, y);
      line = word + ' ';
      y += 40;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, canvas.width / 2, y);
  
  // Add icon (using emoji as an example)
  ctx.font = '100px Arial';
  ctx.fillText(icon, canvas.width / 2, y + 110);
  
  return canvas.toDataURL('image/png');
};




    this.projects = [
      {
        name: 'Guidelines',
        url: 'sketchin',
        media: 'image',
        source: (() => {
          const img = new Image();
          img.src = createCardImage(
            'Project Guidelines', 
            'Detailed instructions and requirements for project submission.\nFollow the project guidelines carefully to ensure smooth submission and evaluation', 
            '📋'
          );
          return img;
        })()
      },
      {
        name: 'Evaluation Criteria',
        url: 'aquest',
        media: 'image',
        source: (() => {
          const img = new Image();
          img.src = createCardImage(
            'Evaluation Criteria', 
            'Projects will be evaluated based on:\n• Approach & Structure	(20%)\n• Functionality (20%)\n• Code Quality (15%)\n• Problem Understanding (15%)\n• Testing & Coverage (15%)\n• Documentation (15%)', 
            '📊'
          );
          return img;
        })()
      },
      {
        name: 'FAQ',
        url: 'fastweb',
        media: 'image',
        source: (() => {
          const img = new Image();
          img.src = createCardImage(
            'Frequently Asked Questions', 
            '• How many members per team? (Max 4)\n• What technologies can we use? (Any)\n• Is there a registration fee? (Yes)\n• When is the deadline? (Check timeline)', 
            '❓'
          );
          return img;
        })()
      }
      // {
      //   name: 'Feudi',
      //   url: 'feudi',
      //   media: 'video',
      //   source: document.getElementById('feudiReel') as HTMLVideoElement
      // },
      // {
      //   name: 'Claraluna',
      //   url: 'claraluna',
      //   media: 'video',
      //   source: document.getElementById('claralunaReel') as HTMLVideoElement
      // }
    ]

    this.debug = this.experience.debug

    if (this.debug.active) {
      this.debugFolder = this.debug.ui?.addFolder('Portfolio').close()
    }

    this.debugObject = {
      offsetX: 1.9,
      offsetY: -0.039,
      offsetZ: -1,
      iColorOuter: new THREE.Color(0x426ff5),
      iColorInner: new THREE.Color(0xc9ddf2)
    }

    this.setItems()
    this.setCaptions()
    this.screenSizes = this.getScreenSizes()

    const storeWatcher = new StoreWatcher()
    storeWatcher.addListener(this.stateChangeHandler.bind(this))
  }

  private onMouseMove(event: MouseEvent) {
    // Update mouse position
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  private onMouseClick(event: MouseEvent) {
    if (!this.isVisible) return;

    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // Check for intersections
    const intersects = this.raycaster.intersectObjects(this.clickableObjects, true);
    
    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      const url = this.findUrlInAncestors(clickedObject);
      if (url) {
        console.log('Navigating to:', url);
        rootNavigate(url);
      }
    }
  }
  private handlePopState(event: PopStateEvent) {
    // When back button is clicked, close the project
    if (window.location.pathname === '/') {
      this.closeProjectAnimation();
    }
  }

  private findUrlInAncestors(object: THREE.Object3D): string | undefined {
    let current = object;
    while (current) {
      if (current.userData && current.userData.url) {
        return current.userData.url;
      }
      if (current.parent) {
        current = current.parent;
      } else {
        break;
      }
    }
    return undefined;
  }
  stateChangeHandler(state: RootState, prevState: RootState) {
    const currentSection = state.section.current
    const prevSection = prevState.section.current

    // Section
    if (currentSection !== prevSection && currentSection === 'portfolio') {
      this.enterAnimation()
    }

    if (currentSection !== prevSection && prevSection === 'portfolio') {
      this.leaveAnimation()
    }

    // Menu
    const menuOpen = state.menu.open
    const prevMenuOpen = prevState.menu.open
    if (menuOpen && !prevMenuOpen) {
      // Open Menu
      this.openMenuAnimation()
    }
    if (!menuOpen && prevMenuOpen) {
      // Close Menu
      this.closeMenuAnimation()
    }
  }

  setItems() {
    this.group = new THREE.Group()
    this.group.name = 'portfolio'
    const { offsetX, offsetY, offsetZ } = this.debugObject
    this.group.position.set(offsetX, offsetY, offsetZ)
  
    this.items = []
  
    for (let i = 0; i < this.projects.length; i++) {
      const geometry = new THREE.PlaneGeometry(0.7, 0.5, 12, 12)
      const { source, name, url, media } = this.projects[i]
  
      const iChannel0Texture =
        media === 'video'
          ? new THREE.VideoTexture(source as HTMLVideoElement)
          : new THREE.TextureLoader().load((source as HTMLImageElement).src)
  
      const uniforms = {
        iFactor: { value: 2 },
        iChannel0: { value: iChannel0Texture },
        iChannel1: { value: this.resources.items.noise },
        iColorOuter: { value: this.debugObject.iColorOuter },
        iColorInner: { value: this.debugObject.iColorInner },
        iOffset: { value: new THREE.Vector2(0.01, 0.01) },
        isImage: { value: media === 'image' ? 1.0 : 0.0 }
      }
  
      const material = new StateMaterialSet({
        normal: new THREE.ShaderMaterial({
          transparent: true,
          uniforms,
          vertexShader,
          fragmentShader
        })
      })
  
      const clickableMesh: ClickableMesh & { pathname?: string } = new ClickableMesh({
        geo: geometry,
        material
      }) as any
  
      // metadata
      clickableMesh.castShadow = false
      clickableMesh.receiveShadow = false
      clickableMesh.name = name
      clickableMesh.pathname = url
      clickableMesh.userData = { url, name }
  
      clickableMesh.position.set(i * 1.1, 0, -0.5)
      clickableMesh.rotation.set(Math.PI / 4, Math.PI / -8, 0)
  
      this.clickableObjects.push(clickableMesh)
      this.group.add(clickableMesh)
      this.items[i] = clickableMesh
  
      // Hover detection state
      let wasHovered = false
  
      const onHoverVisuals = (isHovered: boolean) => {
        if (isHovered && !wasHovered) {
          this.onMouseEnter(clickableMesh)
        } else if (!isHovered && wasHovered) {
          this.onMouseLeave(clickableMesh)
        }
        wasHovered = isHovered
  
        // pointer style + sound
        if (isHovered) {
          window.store.dispatch.pointer.setType('hover')
          const index = randomIntFromInterval(1, this.howls.length - 1)
          if (this.howls[index]) this.howls[index].play()
        } else {
          window.store.dispatch.pointer.setType('default')
        }
      }
  
      const checkHover = () => {
        this.raycaster.setFromCamera(this.mouse, this.camera)
        const intersects = this.raycaster.intersectObject(clickableMesh, true)
        onHoverVisuals(intersects.length > 0)
      }
  
      const animateHover = () => {
         if (!this.isVisible) return
        checkHover()
        requestAnimationFrame(animateHover)
      }
      animateHover()
    }
  
    this.setScale()
    this.camera.add(this.group)
  
    // Debug folder code remains unchanged...
  }
  private onMouseEnter(mesh: THREE.Mesh) {
    // window.store.dispatch.pointer.setType('none');
    // // Play hover sound if needed
    // if (this.howls?.length > 0) {
    //   const soundIndex = randomIntFromInterval(0, this.howls.length - 1);
    //   if (this.howls[soundIndex]) {
    //     this.howls[soundIndex].play();
    //   }
    // }
    // // Add hover animation
    // gsap.to(mesh.scale, {
    //   x: 1.1,
    //   y: 1.1,
    //   z: 1.1,
    //   duration: 0.3,
    //   ease: 'power2.out'
    // });
  }
  
  private onMouseLeave(mesh: THREE.Mesh) {
    // window.store.dispatch.pointer.setType('default');
    // // Reset hover animation
    // gsap.to(mesh.scale, {
    //   x: 1.0,
    //   y: 1.0,
    //   z: 1.0,
    //   duration: 0.3,
    //   ease: 'power2.out'
    // });
  }


  setCaptions() {
    const promises = [this.loadFontAtlas(png), this.loadFont(fnt)]

    this.captions = []

    return Promise.all(promises).then(([atlas, fnt]) => {
      const font = (fnt as { data: any }).data

      for (let i = 0; i < this.items.length; i++) {
        const geometry = new MSDFTextGeometry({
          text: this.items[i].name,
          font,
          align: 'left',  // Add this line to align text to the left
          width: 1000     // Add a width to ensure proper alignment
        })
        const material = new THREE.ShaderMaterial({
          side: THREE.DoubleSide,
          transparent: true,
          defines: {
            IS_SMALL: false
          },
          extensions: {
            derivatives: true
          },
          uniforms: {
            // Common
            ...uniforms.common,

            // Rendering
            ...uniforms.rendering,

            // Strokes
            ...uniforms.strokes,

            uOpacity: { value: 1.0 },

            uStrokeOutsetWidth: { value: 0.1 },
            uStrokeInsetWidth: { value: 0.0 },
            uProgress1: { value: 1 },
            uProgress2: { value: 0 },
            uProgress3: { value: 0 },
            uProgress4: { value: 0 },
            uProgress5: { value: 0 },
            uDirection: { value: 1 }
          },
          vertexShader: captionVertexShader,
          fragmentShader: captionFragmentShader
        })
        material.uniforms.uMap.value = atlas

        const mesh = new THREE.Mesh(geometry, material)
        mesh.rotation.x = Math.PI

        this.captions[i] = mesh

        this.group.add(mesh)
      }
      this.positionCaptions()
    })
  }

  positionCaptions() {
    const captions = this.group.children.filter(
      (mesh) => (mesh as THREE.Mesh).geometry instanceof MSDFTextGeometry
    )
    for (let i = 0; i < captions.length; i++) {
      const mesh = captions[i]
      if (this.sizes.width >= breakpoints.mdL) {
        const scale = 0.002
        mesh.scale.set(scale, scale, scale)
        mesh.position.set(i * 1.1 - 0.1, -0.27, 0.1)
      } else {
        const scale = 0.0010
        mesh.scale.set(scale, scale, scale)
        mesh.position.set(i * 0.5 - 0.1, -0.1, 0.1)
      }
    }
  }

  enterAnimation() {
    this.isVisible = true
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].visible = this.isVisible
      this.captions[i].visible = this.isVisible
    }

    this.setBoundaries()
    this.scrollHandler()
    window.addEventListener('scroll', this.scrollHandler)
  }

  revealItem(index: number) {
    if (!this.items[index]) return

    const duration = 3
    const delay = 0.3
    const ease = 'power3.out'

    gsap.to(this.items[index].position, {
      z: 0,
      duration,
      delay,
      ease
    })
    gsap.to(this.items[index].rotation, {
      x: 0,
      y: 0,
      duration,
      delay,
      ease
    })
    // @ts-ignore
    gsap.to(this.items[index].material.uniforms.iFactor, {
      value: 3.2,
      duration,
      delay,
      ease
    })
  }

  openMenuAnimation() {
    // Save snapshots
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i]
      const caption = this.captions[i]

      const itemMaterial = item.material as THREE.ShaderMaterial
      const captionMaterial = caption.material as THREE.ShaderMaterial

      this.snapshots.push({
        position: item.position,
        rotation: item.rotation,
        iFactor: itemMaterial.uniforms.iFactor.value > 2 ? 3.2 : 2
      })
      gsap.killTweensOf(itemMaterial.uniforms.iFactor, 'value')
      gsap.killTweensOf(captionMaterial.uniforms.uOpacity, 'value')
      // Animation
      gsap.to(itemMaterial.uniforms.iFactor, {
        value: 2,
        duration: 1.5,
        ease: 'power3.out'
      })
      gsap.to(captionMaterial.uniforms.uOpacity, {
        value: 0,
        duration: 1.5,
        ease: 'power3.out'
      })
    }
  }

  closeMenuAnimation() {
    // Position group based on the next section
    const portfolioSectionIndex = 1
    const newSectionIndex = window.store.getState().menu.index

    if (newSectionIndex !== portfolioSectionIndex) {
      // Set this.isVisible false and stop animation in loop
      this.leaveAnimation()
      requestAnimationFrame(() => {
        this.scrollHandler()
        gsap.killTweensOf(this.group.position, 'x')
        this.group.position.x = this.xPosition
      })
    }

    // Restore uniforms
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i]
      const caption = this.captions[i]

      const itemMaterial = item.material as THREE.ShaderMaterial
      const captionMaterial = caption.material as THREE.ShaderMaterial

      // Animation
      gsap.killTweensOf(itemMaterial.uniforms.iFactor, 'value')
      gsap.killTweensOf(captionMaterial.uniforms.uOpacity, 'value')
      gsap.to(itemMaterial.uniforms.iFactor, {
        value: this.snapshots[i].iFactor,
        duration: 1.5,
        ease: 'power3.inOut'
      })
      gsap.to(captionMaterial.uniforms.uOpacity, {
        value: 1,
        duration: 1.5,
        ease: 'power3.inOut'
      })
    }

    // Restore snapshot
    this.snapshots = []
  }

  restoreItems() {
    // for (const item of this.items) {
    //   // @ts-ignore
    //   gsap.killTweensOf(item.material.uniforms.iFactor, 'value')
    //   // @ts-ignore
    //   gsap.set(item.material.uniforms.iFactor, { value: 2 })
    // }
  }

  scrollHandler = () => {
    this.xPosition = scaleValue(window.scrollY, this.scrollBoundaries, [
      this.debugObject.offsetX,
      -this.projects.length - 1
    ])
  }

  leaveAnimation() {
    this.isVisible = false
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].visible = this.isVisible
      this.captions[i].visible = this.isVisible
    }
    this.restoreItems()
    window.removeEventListener('scroll', this.scrollHandler)
  }

  openProjectAnimation() {
    // Get the project name and its card
    const location = window.comingLocation;
    const projectName = location.pathname.split('/')[1];
  
    // Find the item by checking userData.url instead of pathname
    const item = this.items.find(item => {
      return item.userData && item.userData.url === projectName;
    });
  
    if (!item) {
      console.error('Project not found:', projectName);
      console.log('Available projects:', this.items.map(i => i.userData?.url));
      throw new Error(`Project "${projectName}" not found`);
    }
  
    // Disable scroll
    disablePageScroll();
  
    // move object to scene without changing its world orientation
    // restored in closeProjectAnimation
    this.scene.attach(item);
  
    this.camera.updateMatrixWorld();
    window.addEventListener('popstate', this.handlePopStateBound);
    // ... rest of the method
  }

  closeProjectAnimation() {
    window.removeEventListener('popstate', this.handlePopStateBound);
    
    const projectName = window.currentLocation.pathname.split('/')[1];
    
    // Find the item by checking userData.url
    const item = this.items.find(item => {
      return item.userData && item.userData.url === projectName;
    });
  
    if (!item) {
      console.error('Project not found on close:', projectName);
      console.log('Available projects:', this.items.map(i => i.userData?.url));
      return; // Instead of throwing an error, just return to prevent crash
    }
  
    // move object to parent without changing its world orientation
    this.group.attach(item);
  
    this.camera.updateMatrixWorld();
  
    // Get the index from the items array
    const index = this.items.findIndex(i => i === item);
    if (index === -1) {
      console.error('Item not found in items array');
      return;
    }
  
    // Position
    gsap.to(item.position, {
      x: index * 1.1,
      y: 0,
      z: 0,
      delay: 0.7,
      ease: 'power4.inOut',
      duration: 1.4
    })

    // Transition
    gsap.to(item.rotation, {
      x: 0,
      y: 0,
      z: 0,
      delay: 0.7,
      ease: 'power4.inOut',
      duration: 1.4,
      onComplete: () => {
        // Enable scroll
        enablePageScroll()
      }
    })
  
    // Re-enable scroll
    enablePageScroll();
  }

  setScale() {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i]
      if (this.sizes.width >= breakpoints.mdL) {
        item.scale.set(1, 1, 1)
        // item.position.set(i * 1.1, 0, 0)
        item.position.x = i * 1.1
      } else {
        const item = this.items[i]
        item.scale.set(0.4, 0.4, 0.4)
        // item.position.set(i * 0.5, 0, 0)
        item.position.x = i * 0.5
      }
    }
  }

  setBoundaries() {
    const cardContainerEl = document.getElementById('card-container')
    if (cardContainerEl) {
      const start = cardContainerEl.offsetTop + this.sizes.height + this.sizes.height * 0.5 // adding half height to enter the cards after the text
      const end = start + cardContainerEl.clientHeight + this.sizes.height * 0.5
      this.scrollBoundaries = [start, end]
    }
  }

  loadFontAtlas(path: string) {
    const promise = new Promise((resolve) => {
      const loader = new THREE.TextureLoader()
      loader.load(path, resolve)
    })

    return promise
  }

  loadFont(path: string) {
    const promise = new Promise((resolve) => {
      const loader = new FontLoader()
      loader.load(path, resolve)
    })

    return promise
  }

  getScreenSizes(): { screenWidth: number; screenHeight: number } {
    // Find out the width of a rendered portion of the scene
    // https://stackoverflow.com/a/13351534/2150128
    const vFOV = THREE.MathUtils.degToRad(this.camera.fov) // convert vertical fov to radians
    const screenHeight = 2 * Math.tan(vFOV / 2) * Math.abs(this.debugObject.offsetZ) // visible height
    const screenWidth = screenHeight * this.camera.aspect // visible width
    return { screenWidth, screenHeight }
  }

  update() {
    if (!this.isVisible) return

    const scrollY = window.scrollY
    this.scrollOffset = lerp(this.scrollOffset, scrollY, 0.1)
    const offset = (scrollY - this.scrollOffset) * 0.0002
    // Update iOffset

    let i = 0
    for (const item of this.items) {
      ;(item.material as THREE.ShaderMaterial).uniforms.iOffset.value.set(-offset, 0.0)

      const itemX = this.group.position.x + i * (this.sizes.width >= breakpoints.mdL ? 1.1 : 0.5)

      if (itemX < this.screenSizes.screenWidth && this.visibleItemIndex < i) {
        this.visibleItemIndex = i
        this.revealItem(i)
      }

      i++
    }

    gsap.to(this.group.position, {
      x: this.xPosition,
      duration: 1
    })
  }

  resize() {
    this.setScale()
    this.setBoundaries()
    this.positionCaptions()
  }

  dispose() {
    window.removeEventListener('popstate', this.handlePopStateBound);
    // ... rest of your cleanup code
  }
}
