# GitHub & Astro Handling Multiple Mirror Domains

## Context

The strategy for this website is to use GitHub Pages to create two websites, one a mirror of the other. Repo "A" is considered the 'canonical' website, and will be using the free `github.io` domain. This is the site that we will pull from. The second, repo "B" will be a fork of "A" and will be treated as a mirror. Using GitHubs UI, we will give it a custom domain. In our site and deploy logic, we will use headers which signal to search engines that the `github.io` version of the site is 'canonical'. When our custom domain eventually expires, the `github.io` or 'canonical' domain will survive, and will have also been indexed by search engines, archive.org and others.

## Goals

1. Deploy once and programmatically build to multiple mirror domains (e.g. projectdomain.github.io, and projectdomain.mirror (with a custom domain of projectdomain.com)).

2. Contextually access the current domain in components:

For example, we can reference our current build target in a component, e.g., when creating related links to the 'canonical' version of the site (e.g., .github.io). We have these links in the `<head>` metadata for both OpenGraph and `<link rel="canonical" href={canonical} />`. We also create visible links in the footer for users and web crawlers to follow for each page. The visual links only appear in the 'mirrors', e.g., not on the canonical website. So, for longevity, after the domain name has expired (after a max of 10 years), the canonical website (.github.io) will remain.

3. Reference current domain at build time:

We want to set our astro.config `site` property so we can programmatically generate `robots.txt` and `index-sitemaps.xml` files.

## Overview of Git, GitHub Pages

The following is a high-level overview. For specific settings for deploying to multiple repos simultaneously, please refer to the README. In short, GitHub provides several constructs that allow us to automate the deployment to multiple Astro sites.

### Orgs

We can isolate each client project to its own GitHub organisation, which allows the collection of resources on its own GH landing page, readme, T&Cs, etc., separate from the developer's personal GH account. It is also easy to transfer the ownership of a GH Org if that is a required step for project handoff. GH Orgs also offer some excellent features that help us when we go to create the 'canonical' side mirror.

For example, with a personal or even 'pro' GH account, it's not possible to 'fork' your own repo. However, any repo in an org can be forked. This feature is _very_ useful in creating project mirrors, as you may treat the canonical domain as `<orgname>.github.io`, then make a fork of this repo, change its name, and provide it with a custom domain. While it is optional to do this, and having two independent repos which are pushed simultaneously can work, having the custom domain be a fork of the 'canonical' site means that you can immediately tell if the fork is up to date with the master by simply looking at the GH UI, and if it falls out 'sync it'.

## Limitations of Astro & GitHub

At the time of this project (October 2024), Astro v4.12.2 and GitHub have several limitations that complicate deploying to two or more 'mirror' sites.

### Astro config `site` property

In our tests, while not recommended, _not_ setting the `site` property in `astro.config.mjs` provides surprisingly flawless DX, at least for simple websites, when deployed to GH Pages. The basic GH Action for building Astro to Pages correctly picks up the deploy target, using the custom Domain if set, or falling back to `<username>.github.io`. Things get complicated when you want to include plugins that require the `site` property to have been set, as they access `import.meta.env.SITE`. Such plugins include various `robots.txt` and `sitemap.xml` generators, which help manage hidden pages and SEO.

### Astro ENV variables

In 4.10 Astro released [experimental type-safe environmental variables](https://docs.astro.build/en/reference/configuration-reference/#experimentalenv), which are helpful in this context. However, at the time of writing, these variables are _not_ available within our `astro.config.mjs` file. Not being able to access these values in our Astro config is problematic, as it prevents us from dynamically setting the `site` property based on the build context.

To circumvent this, we are also using the [dotenv](https://www.npmjs.com/package/dotenv#dotenv-) npm package, which makes `.env` variables globaly available under the `process.env` object (though not in type-safe a context for our Astro config).

### GitHub does not expose the current domain as a global variable

At the time of writing, GitHub does not appear to expose the current Pages domain for the repo in its [default `.env` object](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/store-information-in-variables#default-environment-variables). This would be awesome, but to get around this we can manually create a `CURRENT_DOMAIN` env value using the UI in each of the target domain repos. This means we also need to set up an `.env` file in our local development environment.

**NOTE:** By default, Git ignores `.env` files as they may contain secrets, and we do NOT override this behaviour. Therefore, setting the correct values in both the local development `.env` and via the UI in each 'mirror' repo must be done manually and is not tracked by the repo.

## Project Setup

To identify our current build target and access this value, we need to do the following:

1. Type Safety:
   Using Astro [ENV vars](https://docs.astro.build/en/guides/environment-variables/), we establish schemas for our vars in `Astro.config.mjs`:

```
defineConfig({
  ...,
  experimental: {
   env: {
   // Env to identify server build for GH actions -
   // eg 'public canonical' (https://memorialforestdg.github.io)
   schema: {
     PUBLIC_CANONICAL: envField.string({
      context: "server",
      access: "public",
      optional: true
     }),
     PUBLIC_MIRROR: envField.string({
      context: "server",
      access: "public",
      optional: true
     }),
     CURRENT_DOMAIN: envField.string({
      context: "server",
      access: "public",
      optional: true
     })
    }
   }
  }
 }
```

The above code makes Astro aware of our environmental variables, which we can now access in a type-safe way.

**2) GitHub**

In GitHub, for each repo associated with a target domain, we use the `PAGES_DOMAIN` for the related domain. We do this by using the settings UI in each repo, e.g.:
[Settings/Actions, secrets and variables](https://github.com/memorialforestdg/memorialforestdg.github.io/settings/variables/actions)

**3) Local Development**

For local development we need to manually create a `.env` file with the following:

```
# ./.env
# Default domain for local builds
CURRENT_DOMAIN = 'https://memorialforest.co.uk'

## These are also set in .github/workflows/astro.yml
PUBLIC_CANONICAL = 'https://memorialforestdg.github.io'
PUBLIC_MIRROR = 'https://memorialforestdg.co.uk'
```

**4) Astro Build**

So the build targets are globally available, we set these values in the `.github/workflows/astro.yml` file (approximately at line 71):

```
env:
 PUBLIC_CANONICAL: 'https://memorialforestdg.github.io'
 PUBLIC_MIRROR: 'https://memorialforestdg.co.uk'
```

**NOTE**: `PUBLIC_CANONICAL` and `PUBLIC_MIRROR` _could_ be set via the GH UI as well. But as these values are common across all repos, it makes sense to commit them to the repo.

**NOTE:** We need to do this because GitHub does not appear to provide a global variable for the current domain, e.g. (<username>.github.io), or the custom domain if set.

**5) Astro Config**

With these definitions in place, we can dynamically access the current build target domain across environments at build time.

Here is how we can configure our `astro.config.mjs`:

```
import { defineConfig, envField } from 'astro/config'
import 'dotenv/config'


//Define the current build target URL
const siteUrl = process.env.CURRENT_DOMAIN

export default defineConfig({
 site: siteUrl,
 ...
})
```

##  An example component

```

---
CanonicalFooterLink.astro

// Conditionally put a link to the canonical mirror in the footer.
// It relies on the PUBLIC_CANONICAL set in both .env for dev and in .github/workflows/astro.yml for deployment.

import {PUBLIC_CANONICAL} from 'astro:env/server'
---

<>
 {
  import.meta.env?.SITE !== PUBLIC_CANONICAL && (
   <li class="ml-1">
    <span class="dn di-m" aira-hidden> | </span>{' '}
    mirror:{' '}
    <a
     href={PUBLIC_CANONICAL}
     class="sans di-underline-hover burnt-sienna-1"
    >
     {PUBLIC_CANONICAL?.replace(/^https:\/\//, '')}
    </a>
   </li>
  )
 }
</>
```

## Useful Notes

- [Astro env vars](https://docs.astro.build/en/guides/environment-variables/) (cannot be used in config files)
- [Astro type-safe env](https://docs.astro.build/en/reference/configuration-reference/#experimentalenv)
- [dotenv package](https://www.npmjs.com/package/dotenv)
- [GitHub saving env vars](https://docs.github.com/en/enterprise-server@3.13/actions/writing-workflows/choosing-what-your-workflow-does/store-information-in-variables)
- [GitHub default vars](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/store-information-in-variables#default-environment-variables)
- `import.meta.env` exposed by [Vite](https://vite.dev/guide/env-and-mode)
- `process.env` exposed by [Node](https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs)
