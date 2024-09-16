import fs from "node:fs/promises";
import path from "node:path";
import type { AstroIntegration } from "astro";

// In Astro 4, unused images are removed from the build, but some original images may still remain in the _astro folder.
const removeOriginalImages: AstroIntegration = {
	name: 'remove-original-images',
	hooks: {
		'astro:build:done': async ({ dir }) => {
		  const astroDir = path.join(dir.pathname, `_astro/`);
      const files = await fs.readdir(astroDir);
          for (const file of files) {
            const { name, ext } = path.parse(file);
            const { ext: hashStr } = path.parse(name);
            if (!ext) continue;
            if (!hashStr) continue;
            if (![`.jpg`, `.jpeg`, `.png`, `.webp`].includes(ext)) continue;
            if (hashStr.includes(`_`)) continue;

            console.log(`Removing original image: ${file}`);
            await fs.unlink(path.join(astroDir, file));
          }
		}
	}
}

export default removeOriginalImages;

