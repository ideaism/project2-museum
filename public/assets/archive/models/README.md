# 3D Mug Model Assets

Store object-detail 3D mug models in this folder and reference them from
`MugRecord.modelPath`. These files are for the camera-free `/object/:id`
walkthrough and do not depend on AR marker assets.

Current supplied model paths:

```txt
/assets/archive/models/mug1.glb  # Support the Miners
/assets/archive/models/mug2.glb  # Compartment 02 / Labour
/assets/archive/models/mug3.glb  # Compartment 03 / People's March for Jobs
```

Disk location:

```txt
public/assets/archive/models/mug1.glb
public/assets/archive/models/mug2.glb
public/assets/archive/models/mug3.glb
```

Model requirements:

- Format: prefer a single `.glb`; use `.gltf` with external `.bin` and textures only when needed.
- Budget: target 1-2 MB for mobile review; stay under 3 MB unless documented.
- Scale: one mug should fit comfortably in a 1 m viewer scene with the model centered at the origin. The current viewer is tuned for supplied metric mugs about 0.12 m tall, using a close camera orbit rather than modifying model scale.
- Orientation: Y-up, mug upright, centered around the origin, front label facing positive Z.
- Textures: use compressed or baked textures at 1024 px square or smaller; avoid large texture atlases.
- Materials: simple PBR/base-color materials; no runtime animation requirement for MVP.
- Fallback: if the model is missing or cannot load, `/object/:id` falls back to the image path or placeholder image panel.
