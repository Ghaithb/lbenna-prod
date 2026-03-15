Place HDRI files under hdri/, glTF/GLB models under models/, and texture image maps under textures/.

The API exposes:
- GET /api/assets -> { hdri: string[], models: string[], textures: string[] }
- Static URLs: /assets/hdri/..., /assets/models/..., /assets/textures/...
