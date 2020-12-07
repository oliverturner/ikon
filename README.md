# Ikon

![Screenshot](https://user-images.githubusercontent.com/21795/98355143-ab96f380-2019-11eb-864d-0db08a5b22d1.png)

[![Netlify Status](https://api.netlify.com/api/v1/badges/99414afd-a15c-4cb6-81d1-0fb1574e71ff/deploy-status)](https://app.netlify.com/sites/heuristic-brown-8c35fc/deploys)

An app for creating downloadable spritesheets from dragged & dropped individual SVGSs or icon directories

### Features...

- Workflow-focused: 
    - Select icons in bulk by directory
    - Fuzzily search by name
    - Flatten heavily-nested directories
    - Installable for offline use
    - Auto updating service worker via Workbox
- Secure:
    - Works wholly in-browser
    - Headers verified by [securityheaders.com](https://securityheaders.com/?q=ikon.oliverturner.cloud&followRedirects=on)
- Accessible
    - Fully keyboard-navigable UI

...more features to come!

## Installation

```sh
git clone git@github.com:oliverturner/ikon.git
npm i
npm start
```

## Roadmap

### Perf

- [ ] Identify bottlenecks for large imports

### UX

- [ ] Prevent drop during processing
- [ ] Create templates to render selected icons as React, Vue, etc components
- [ ] Add "info" tips to panels explaining usage
