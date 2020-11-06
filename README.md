# Ikon

![Screenshot](https://user-images.githubusercontent.com/21795/98355143-ab96f380-2019-11eb-864d-0db08a5b22d1.png)

[![Netlify Status](https://api.netlify.com/api/v1/badges/99414afd-a15c-4cb6-81d1-0fb1574e71ff/deploy-status)](https://app.netlify.com/sites/heuristic-brown-8c35fc/deploys)

An app for creating downloadaable spritesheets from dragged & dropped individual SVGSs or icon directories

### Features...

- Works wholly in-browser
- Fully keyboard-navigable UI
- Workflow-focused: 
    - Select icons in bulk by directory
    - Fuzzily search by name
    - Flatten heavily-nested directories

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
- [ ] Make selection respect order of input
