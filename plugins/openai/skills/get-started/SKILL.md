---
name: get-started
description: Use right after Hugeicons is installed, or when the user asks to set up Hugeicons in a project. Detects the framework, installs the right Hugeicons package and adds one working example icon.
---

# Set up Hugeicons

Goal: the user ends with Hugeicons installed and one real icon rendering in their project.

## Steps

1. **Find the framework.** Look at the project files first: `package.json` dependencies (react, vue, @angular/core, svelte, solid-js, react-native), `pubspec.yaml` (Flutter), or plain `.html` files with no build step. Ask only if you can't tell.
2. **Ask about Pro once.** "Do you have a Hugeicons Pro license? If not, I'll use the free Stroke Rounded style." Don't ask again if the project already imports `@hugeicons-pro/...`.
3. **Get the setup.** Call `get_platform_usage` for the framework. Use its install command and import pattern exactly.
   - Free: the core package plus `@hugeicons/core-free-icons` (Flutter: `flutter pub add hugeicons`; HTML: the stylesheet `https://use.hugeicons.com/font/icons.css`).
   - Pro: the Pro package for the chosen style, for example `@hugeicons-pro/core-solid-rounded`. Pro packages need the license token set up first, so point the user to the Pro setup in the Hugeicons docs at https://hugeicons.com/docs if it is missing.
4. **Add one example icon.** Use `search_icons` to find a real icon that fits the project (for example `home-01` in the main navigation) and add it. Pass only `icon` — size 24, `currentColor` and stroke width 1.5 are the defaults, so writing them out is noise.
5. **Confirm.** Run `get_icon_glyphs` on the name you used, then tell the user what you installed, which style you picked and where the example icon is.

After setup, follow the `hugeicons` skill for all further icon work — it covers name
resolution, the props for every framework, one-style consistency and the final name check.

Never draw icons as inline SVG. Icons come from the official package or web font only.
