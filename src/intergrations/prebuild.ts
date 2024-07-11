import type { AstroIntegration } from "astro";
import packageJson from "../../package.json";
import { exec } from 'child_process';

export const prebuild = () => {
    // `astro:config:setup`,
    // `astro:config:done`,
    // `astro:server:setup`,
    // `astro:server:start`,
    // `astro:server:done`,
    // `astro:build:start`,
    // `astro:build:setup`,
    // `astro:build:generated`,
    // `astro:build:ssr`,
    // `astro:build:done`,

  let integration: AstroIntegration = {
    name: "astro-lifecycle-logs",
    hooks: {
      "astro:config:done": (options) => {
        // run our prebuild script
         exec(`node ${options.config.root.pathname}/deps/process-meta-albums.mjs`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error running script: ${error.message}`);
                return;
            }
            console.log(`Script output: ${stdout}`);
            console.error(`Script error: ${stderr}`);
        });
      },
    }
  }
  return integration;
};

export default prebuild;
