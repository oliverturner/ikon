# Ikon

[![Netlify Status](https://api.netlify.com/api/v1/badges/99414afd-a15c-4cb6-81d1-0fb1574e71ff/deploy-status)](https://app.netlify.com/sites/heuristic-brown-8c35fc/deploys)

An app for creating icon spritesheets and React components from dragged & dropped directories of SVGs

## Installation

## TODOs

### MVP
- [ ] Make UI accessible: switch from `ul` to keyboard-friendly alternative
- [x] Download constructed spritesheet
- [x] Hosting

### Perf
- [ ] Identify bottlenecks for large imports
- [x] Investigate whether image blobs are more efficiently rendered

### UX
- [x] Use async reactive assignment to conditionally render elements
- [x] Allow selection by directory
- [x] Use embedded icons instead of SVGs
- [ ] Investigate crossfading icons from library to `selection` panel
- [ ] Prevent drop during processing
- [ ] Search for icons by name
- [x] Allow flattening directories
- [ ] Create templates to render selected icons as React, Vue, etc components
