# The Dispersed Memorial Forest

## A Community Covid Memorial for Dumfries & Galloway

'Remembering Together Dumfries & Galloway — The Dispersed Memorial Forest',
a ScotGov-funded initiative in Dumfries & Galloway, Scotland, by
commissioned artists t s Beall and Katie Anderson.

This repo contains the project's primary website or mirror.

For more information about the project, please visit the website:
<https://memorialforestdg.co.uk/> | <https://memorialforestdg.github.io>

Please note that public access to this archive does not imply an open-source license
or a waiver of copyright protections. For full details, please see our [USAGE LICENSE](https://github.com/memorialforestdg/.github/blob/main/LICENCE.md)

Copyright © 2024 Remembering Together Dumfries & Galloway, Dr. t s Beall, Katie Anderson.

All Rights Reserved

## Setup and Cloning

To clone the repository with submodules:

```bash
git clone --recurse-submodules https://github.com/rememberingtogetherdg/rememberingtogetherdg.github.io
```

Then cd into the `rememberingtogetherdg.github.io` folder and update the submodules:

```bash
git submodule update --remote
```

And finally from the project root we will run a clean install.

```bash
npm ci
```

Note that this only works when the `package-lock.json` is in place.
If for what ever reason you have had to remove `package-lock.json`,
use `npm install` instead.

### Remotes

Run `git remote -v` to see the remotes.

The correct response should be:

```bash
origin  https://github.com/memorialforestdg/memorialforestdg.github.io (fetch)
origin  https://github.com/memorialforestdg/memorialforestdg.mirror (push)
origin  https://github.com/memorialforestdg/memorialforestdg.github.io (push)
```

If you do not see these values, then you will need set these remotes up manual.

### .env

Once the project has been created locally, create a `.env` files to hold the following:

```bash
# ./.env
# Default domain for local builds
CURRENT_DOMAIN = 'https://memorialforest.co.uk'

## These are also set in .github/workflows/astro.yml
PUBLIC_CANONICAL = 'https://memorialforestdg.github.io'
PUBLIC_MIRROR = 'https://memorialforestdg.co.uk'
```

These values are used at build time to create flags in our html indicating
if the site being built is the canonical, or mirror.

### Solus-CSS

If making customisations to Solus-CSS `cd` to the
`deps/solus-tachyons-sass` directory and run:

```bash
npm install
```

All changes to this project should be tracked on the "RT" branch.

```bash
git chagebranch RT
```

To build the SASS files, run:

```bash
npm run build # build the css
npm run dev   # watch for changes
```

## Astro Commands

All commands are run from the root of the project from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Commits, Deploys & Mirrors

- Any commits and pushes to the `main` branch will trigger GitHub actions,
  which build and deploy the site's GitHub Pages.
- This repo has two upstream remotes: `rememberingtogetherdg.github.io` and `rememberingtogetherdg.mirror`.
- Always work directly with `rememberingtogetherdg.github.io`. eg pull and push to it.

- Do NOT push to `rememberingtogetherdg.mirror` directly.
- Do NOT make edits on either repo using the GitHub interface,
  as otherwise they will be out of sync.

```bash
git pull # pulls from rememberingtogetherdg.github.io

git push # pushes to both rememberingtogetherdg.github.io AND rememberingtogetherdg.mirror
```

### Multiple Artifacts Errors

If your build fails with 'multiple artefacts', see errors, see this discussion:
[https://github.com/orgs/community/discussions/111260](https://github.com/orgs/community/discussions/111260)
