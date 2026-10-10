# Sheldon715 interactive pet

This worker provides the interactive SVG pet used by the GitHub Profile README.
It follows the `aw-snap` pattern: GitHub displays external SVG images, button
links navigate to the Worker, and the Worker redirects back after updating one
Durable Object counter.

## Deploy

From this directory, authenticate Wrangler with the Cloudflare account that owns
the deployment, then run:

```powershell
npx wrangler login
npx wrangler deploy
```

Wrangler prints the resulting `workers.dev` URL. Put that URL into the profile
README using these paths:

```text
/globe/blip.svg
/globe/btn-cookie.svg
/globe/btn-pet.svg
/globe/btn-play.svg
/globe/treat
/globe/pet
/globe/play
```

The Durable Object instance name is intentionally fixed in `src/index.js` so
the counter survives future deployments. Do not rename it unless you intend to
start over with a new pet state.
