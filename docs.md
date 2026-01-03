## Arcana Vision – Technical Documentation

### Overview

Arcana Vision is a browser-based experimental project that combines webcam hand tracking with a 3D, gesture-driven card interface. It is a static frontend application built with JavaScript, Three.js, and MediaPipe Hands. There is no backend.

The project is structured to clearly separate input, state, rendering, and data.

---

### Folder Structure

```
assets/
public/
src/
```

---

### `/assets`

```
assets/
  readme.txt
```

Purpose:

* Placeholder directory for local static assets such as images, fonts, or screenshots.
* Not currently used by runtime code.

Notes:

* No JavaScript should live here.
* Files here are typically referenced by HTML or CSS if needed.

---

### `/public`

```
public/
  index.html
```

Purpose:

* Browser entry point.
* Defines the DOM structure.
* Loads external libraries (via Import Maps / CDN).
* Loads the application entry script.

Responsibilities:

* HTML markup only.
* Script and stylesheet references.

Rules:

* No application logic.
* No state.
* No Three.js or MediaPipe setup.

---

### `/src`

All application logic lives here.

---

### `/src/core`

```
src/core/
  main.js
  style.css
```

#### `main.js`

**Primary entry point and orchestrator.**

Responsibilities:

* Initializes subsystems (vision, rendering, data).
* Owns the main render / update loop.
* Coordinates state transitions.
* Passes data between vision and rendering layers.

What belongs here:

* High-level control flow
* State machine logic
* Per-frame update sequencing

What does NOT belong here:

* Mesh creation
* MediaPipe setup
* DOM structure

---

#### `style.css`

**All styling for the application.**

Responsibilities:

* Layout
* UI visuals
* Animations and transitions

Notes:

* Loaded by `index.html`
* Kept in `core` to reflect that UI styling is part of app logic, not assets

---

### `/src/data`

```
src/data/
  tarotData.js
```

#### `arcana.js`

**Static data and pure helpers.**

Responsibilities:

* Major Arcana card definitions
* Meanings and metadata
* Shuffle or utility functions related to tarot data

Rules:

* No DOM access
* No rendering logic
* No side effects

This file should remain deterministic.

---

### `/src/three`

```
src/three/
  scene.js
  textures.js
  world.js
  animation.js
```

This folder owns **everything related to rendering**.

---

#### `scene.js`

**Low-level Three.js setup.**

Responsibilities:

* Scene creation
* Camera setup
* Renderer initialization
* Post-processing configuration (composer, bloom, etc.)

Rules:

* No application state logic
* No MediaPipe data
* No UI manipulation

---

#### `textures.js`

**Procedural texture generation.**

Responsibilities:

* Canvas-based texture creation
* Tarot card backgrounds
* Noise, gradients, symbols

Rules:

* No scene or mesh creation
* Returns textures only

---

#### `world.js`

**Scene contents.**

Responsibilities:

* Creating meshes (cards, particles, cursor)
* Adding/removing objects from the scene
* Positioning objects in world space

Rules:

* No render loop
* No state machine
* No MediaPipe logic

---

#### `animation.js`

**Per-frame updates and animation logic.**

Responsibilities:

* Render loop
* Lerp / smoothing logic
* State-based transitions
* Applying transformations to meshes

Rules:

* Uses existing meshes
* Does not create new objects
* Reads state, does not define it

---

### `/src/vision`

```
src/vision/
  mediapipe.js
```

#### `mediapipe.js`

**Input and perception layer.**

Responsibilities:

* Webcam access
* MediaPipe Hands initialization
* Landmark processing
* Gesture detection (pinch, fist, presence)

Outputs:

* Normalized hand data
* Gesture flags

Rules:

* No Three.js calls
* No mesh manipulation
* No DOM updates

---

### Data Flow

1. `mediapipe.js` processes camera input and emits hand data
2. `main.js` receives and interprets this data
3. State transitions are evaluated in `animation.js`
4. Visual updates are applied to meshes in `world.js`
5. Rendering is handled via `scene.js`

Flow is one-directional. No circular dependencies.

---

### Development Notes

* The project must be served via HTTP (ES modules).
* Webcam access requires HTTPS in production.
* GitHub Pages is a supported deployment target.
* No build step is required.

---

### Try nout

* Mobile-first support
* Accessibility compliance
* Persistent storage


---

### License

MIT. Provided for clarity and reuse permissions.


