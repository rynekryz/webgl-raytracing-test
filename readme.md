<div align="center">

<!-- decor:top -->
<picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/rynekryz/rynekryz/main/pixel-art/sky-banner-dark.svg"><img src="https://raw.githubusercontent.com/rynekryz/rynekryz/main/pixel-art/sky-banner-light.svg" width="100%" alt="night sky"></picture>

<picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/rynekryz/rynekryz/main/pixel-art/divider-dots-dark.svg"><img src="https://raw.githubusercontent.com/rynekryz/rynekryz/main/pixel-art/divider-dots-light.svg" width="100%" alt=""></picture>
<!-- /decor:top -->

<img src="icon.png" width="160" height="160" style="display: block; margin: 0 auto"/>
<h1>WebGL Ray Tracing Test</h1>
<p>Real-time "ray tracing" in WebGL using SDF ray marching.</p>
<p>Reflective balls with drag, throw, and gravity, without turning your device into a baked potato.</p>
</div>
<p align="center">
  <a href="https://github.com/rynekryz/webgl-raytracing-test/stargazers"><img src="assets/badges/stars.svg" alt="GitHub stars" height="30"/></a>
  <img src="assets/badges/html.svg" alt="HTML"/>
  <img src="assets/badges/css.svg" alt="CSS"/>
  <img src="assets/badges/javascript.svg" alt="JavaScript"/>
  <img src="assets/badges/glsl.svg" alt="GLSL"/>
</p>

<p align="center">
  <a href="https://github.com/rynekryz/webgl-raytracing-test"><img src="assets/badges/getgithub.svg" alt="Get it on GitHub" height="56"/></a>
</p>

<div align="center">
<picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/rynekryz/rynekryz/main/pixel-art/divider-sparkles-dark.svg"><img src="https://raw.githubusercontent.com/rynekryz/rynekryz/main/pixel-art/divider-sparkles-light.svg" width="100%" alt=""></picture>
</div>

## Screenshots

<div align="center">
<img src="Screenshots/31912.png" width="45%" />
<img src="Screenshots/31916.png" width="45%" />
</div>

<div align="center">
<picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/rynekryz/rynekryz/main/pixel-art/divider-wave-dark.svg"><img src="https://raw.githubusercontent.com/rynekryz/rynekryz/main/pixel-art/divider-wave-light.svg" width="100%" alt=""></picture>
</div>

## Features

- Real-time SDF ray marching
- Really nice reflections
- Some balls
- Drag and throw controls
- Sphere collision physics
- Gravity
- FPS / frame-time overlay
- Pure WebGL + fragment shader
- Can run literally on everything (not really), including an [Aternos](https://aternos.org) server (JK)

<div align="center">
<picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/rynekryz/rynekryz/main/pixel-art/divider-dots-dark.svg"><img src="https://raw.githubusercontent.com/rynekryz/rynekryz/main/pixel-art/divider-dots-light.svg" width="100%" alt=""></picture>
</div>

## Technical Stack

- **Rendering:** WebGL with a GLSL fragment shader
- **Physics:** SDF ray marching and sphere collisions
- **UI:** HTML, CSS and vanilla JavaScript
- **Language:** JavaScript and GLSL
- **Build:** none

<div align="center">
<picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/rynekryz/rynekryz/main/pixel-art/divider-sparkles-dark.svg"><img src="https://raw.githubusercontent.com/rynekryz/rynekryz/main/pixel-art/divider-sparkles-light.svg" width="100%" alt=""></picture>
</div>

## Requirements

- PC (optional)

<div align="center">
<picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/rynekryz/rynekryz/main/pixel-art/divider-wave-dark.svg"><img src="https://raw.githubusercontent.com/rynekryz/rynekryz/main/pixel-art/divider-wave-light.svg" width="100%" alt=""></picture>
</div>

## Project Structure

```
webgl-raytracing-test/
├── index.html
├── render.js
├── shaders.glsl
└── ui.css
```

<div align="center">
<picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/rynekryz/rynekryz/main/pixel-art/divider-dots-dark.svg"><img src="https://raw.githubusercontent.com/rynekryz/rynekryz/main/pixel-art/divider-dots-light.svg" width="100%" alt=""></picture>
</div>

## Notes

This isn't actual ray-tracing that uses RT cores, it uses **SDF ray marching**. So the rays are real-time, just not real RTX. But at least it looks good and can run on a potato lol.

<!-- decor:bottom -->
<div align="center">

<picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/rynekryz/rynekryz/main/pixel-art/divider-wave-dark.svg"><img src="https://raw.githubusercontent.com/rynekryz/rynekryz/main/pixel-art/divider-wave-light.svg" width="100%" alt=""></picture>

<picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/rynekryz/rynekryz/main/pixel-art/sticker-heart-dark.svg"><img src="https://raw.githubusercontent.com/rynekryz/rynekryz/main/pixel-art/sticker-heart-light.svg" width="60" alt="heart"></picture> <picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/rynekryz/rynekryz/main/pixel-art/sticker-sparkle-dark.svg"><img src="https://raw.githubusercontent.com/rynekryz/rynekryz/main/pixel-art/sticker-sparkle-light.svg" width="60" alt="sparkle"></picture> <picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/rynekryz/rynekryz/main/pixel-art/sticker-moon-dark.svg"><img src="https://raw.githubusercontent.com/rynekryz/rynekryz/main/pixel-art/sticker-moon-light.svg" width="60" alt="moon"></picture> <picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/rynekryz/rynekryz/main/pixel-art/sticker-flower-dark.svg"><img src="https://raw.githubusercontent.com/rynekryz/rynekryz/main/pixel-art/sticker-flower-light.svg" width="60" alt="flower"></picture> <picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/rynekryz/rynekryz/main/pixel-art/sticker-cat-dark.svg"><img src="https://raw.githubusercontent.com/rynekryz/rynekryz/main/pixel-art/sticker-cat-light.svg" width="60" alt="cat"></picture> <picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/rynekryz/rynekryz/main/pixel-art/sticker-ghost-dark.svg"><img src="https://raw.githubusercontent.com/rynekryz/rynekryz/main/pixel-art/sticker-ghost-light.svg" width="60" alt="ghost"></picture> <picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/rynekryz/rynekryz/main/pixel-art/sticker-lock-dark.svg"><img src="https://raw.githubusercontent.com/rynekryz/rynekryz/main/pixel-art/sticker-lock-light.svg" width="60" alt="lock"></picture>

</div>
<!-- /decor:bottom -->

<div align="center">
<strong>Made with ♥︎ by Ryne</strong>
</div>
<div align="center">
  <a href="https://discord.gg/YKhWXXhKmC"><img src="assets/badges/discord.svg" alt="Discord"/></a>
  <a href="https://tiktok.com/@rynekryz"><img src="assets/badges/tiktok.svg" alt="TikTok"/></a>
</div>
