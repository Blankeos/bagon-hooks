<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=bagon-hooks&background=tiles&project=%20" alt="bagon-hooks">
</p>

# bagon-hooks

<div align="center">
  <img src="https://img.shields.io/badge/maintained%20with-bun-cc00ff.svg?style=for-the-badge&logo=bun)](https://bun.sh/" alt="Bun"></img>
  <img src="https://img.shields.io/npm/dw/bagon-hooks?style=for-the-badge" alt="NPM Downloads"></img>
  <img src="https://img.shields.io/npm/l/bagon-hooks?style=for-the-badge" alt="NPM License"></img>
  <img src="https://img.shields.io/bundlephobia/minzip/bagon-hooks?style=for-the-badge" alt="NPM Bundle Size" ></img>
</div>

A collection of zero-dependency hooks for SolidJS forked directly from Mantine Hooks.

## Quick start

Install it:

```bash
npm i bagon-hooks
# or
yarn add bagon-hooks
# or
pnpm add bagon-hooks
# or
bun add bagon-hooks
```

Use it:

```tsx
import { useHotkeys } from 'bagon-hooks';
```

We want to achieve as 1:1 as possible with Mantine's original hooks. So you can always refer to their [original docs](https://v3.mantine.dev/hooks/use-hotkeys/). There are a few improvements and renaming because SolidJS has its own conventions. But just take note:

1. We removed Solid's convention of `use` vs `create` as it's too confusing for familiarity with Mantine. So every hook in Bagon is prefixed with `use`.
2. The only renaming we did was `state` -> `signal`.
3. Refer to [Mantine](https://mantine.dev/hooks/use-click-outside/)'s original docs for deeper examples and usecases.
4. Refer to [Bagon Hooks](https://bagon-hooks.pages.dev/)'s docs for actual SolidJS examples.

## Features

- 🌳 Tree-shakable
- 🖌️ TypeScript support
- 🔵 For SolidJS
- 📦 Zero-dependencies (except Solid)

## Roadmap

### Hooks

Based on the [@mantine/hooks](https://github.com/mantinedev/mantine/tree/master/packages/%40mantine/hooks/src) library.

- [x] ~~use-callback-ref~~ (Not needed, only used internally by mantine for preventing re-renders on a function)
- [x] use-click-outside
- [x] use-clipboard
- [x] use-color-scheme
- [x] use-counter
- [x] use-debounced-callback
- [x] ~~use-debounced-state~~ use-debounced-signal
- [x] use-debounced-value
- [x] use-did-update
- [x] use-disclosure (✨ Improved, slightly better than mantine thanks to `set` for passing to stuff like `onOpenChange`)
- [x] use-document-title
- [x] use-document-visibility
- [ ] use-event-listener
- [x] use-eye-dropper (✨ improved, state management is inside the hook)
- [x] use-favicon (✨ improved, more flexible, better control)
- [ ] use-fetch
- [ ] use-focus-return
- [ ] use-focus-trap
- [ ] use-focus-within
- [ ] use-force-update
- [x] use-fullscreen
- [x] use-hash
- [ ] use-headroom
- [x] use-hotkeys
- [x] use-hover
- [x] use-id (Added, but note that there is [`createUniqueId`](https://docs.solidjs.com/reference/component-apis/create-unique-id) in Solid)
- [x] use-idle (Added, but note that there is [`createIdleTimer`](https://primitives.solidjs.community/package/idle/) the official solid-primitives as well)
- [x] use-in-viewport
- [x] use-input-state
- [x] use-intersection (Added, but note that there is [`createIntersectionObserver`](https://primitives.solidjs.community/package/intersection-observer/) in the official solid-primitives as well)
- [x] use-interval
- [x] ~~use-is-first-render~~ (Every component function in SolidJS runs only once! Every component is first render only 🙂)
- [x] ~~use-isomorphic-effect~~ (Solid's [`createEffect`](https://docs.solidjs.com/reference/basic-reactivity/create-effect) is technically already isomorphic because it doesn't error on SSR. Also, it also only runs on client-side.)
- [ ] use-list-state
- [x] use-local-storage
- [x] use-local-storage-store (✨ Improved, more similar to 'createStore' API).
- [ ] use-logger
- [ ] use-map
- [x] use-media-query
- [ ] use-merged-ref
- [x] use-mounted
- [x] use-mouse
- [x] use-move
- [ ] use-mutation-observer
- [x] use-network
- [x] use-orientation
- [x] use-os
- [ ] use-page-leave
- [ ] use-pagination
- [ ] use-previous
- [ ] use-queue
- [ ] use-reduced-motion
- [x] use-resize-observer
- [ ] use-scroll-into-view
- [ ] use-session-storage
- [ ] use-set-state
- [ ] use-set
- [ ] use-shallow-effect
- [ ] use-state-history
- [ ] use-text-selection
- [ ] use-throttled-callback
- [ ] use-throttled-state
- [ ] use-throttled-value
- [x] use-timeout
- [x] use-toggle
- [ ] use-uncontrolled
- [ ] use-validated-state
- [ ] use-viewport-size
- [ ] use-window-event
- [ ] use-window-scroll
- [ ] utils

### New in Bagon Hooks

- [x] use-keyboard (✨ Runs even on single keys as opposed useHotkeys that only runs on combinations, so more general usecases)
- [x] use-disclosure-data (✨ Improved, an alternative to use-disclosure for data-driven disclosures. I use it)

### Others

- [x] Docs Website (Powered by mdx + tailwind prose)
- [x] Examples
- [ ] Tests?

## Contributing

This library is far from done. If you have time implementing the roadmap, feel free to submit a pull request. We always appreciate collaborators. If you find anything outdated, please make an issue. If you like this project, consider giving it a star! ⭐️

## License

This project is licensed under the [MIT License](https://github.com/omsimos/react-highlight-popover/blob/main/LICENSE)

## Credits

- [Mantine Hooks](https://v3.mantine.dev/) - amazing library for components and hooks, but currently not in SolidJS so we forked that part only.
