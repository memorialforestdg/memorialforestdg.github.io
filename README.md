# Remembering Together D&G

## Setup and Cloning

To clone the repository with submodules:

```bash
git clone --recurse-submodules https://github.com/rememberingtogetherdg/rememberingtogetherdg.github.io
```

Then cd into the `rememberingtogetherdg.github.io` folder, and update the submodules:

```bash
git submodule update --remote
```

### Solus-CSS

If making customisations to Solus-CSS cd to the `deps/solus-tachyons-sass` folder and run:

```bash
npm install
```

To build the SASS files run:

```bash
npm run build # build the css
npm run dev   # watch for changes
```

## Astro Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Commits, Deploys & Mirrors

- Any commits and pushes to the `main` branch will trigger GitHub actions which build and deploy the site GitHub Pages.
- This repo has two upstream remotes: `rememberingtogetherdg.github.io` and `rememberingtogetherdg.mirror`.
- Always work directly with `rememberingtogetherdg.github.io`. eg pull and push to it.

- Do NOT push to `rememberingtogetherdg.mirror` directly.
- Do NOT make edits on either repo using the GitHub interface, otherwise they will be out of sync.

```bash
git pull # pulls from rememberingtogetherdg.github.io

git push # pushes to both rememberingtogetherdg.github.io AND rememberingtogetherdg.mirror
```

### Mutiple Artifacts Errrors

If your build fails with 'multiple artifacts', see errors, see this discussion:
[https://github.com/orgs/community/discussions/111260](https://github.com/orgs/community/discussions/111260)
