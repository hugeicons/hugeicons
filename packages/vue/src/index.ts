import type { App } from 'vue';
import HugeiconsIcon from './components/HugeiconsIcon.vue';

export { default as HugeiconsIcon } from './components/HugeiconsIcon.vue';
export * from './types';

export const HugeiconsPlugin = {
  install: (app: App) => {
    app.component('HugeiconsIcon', HugeiconsIcon);
  }
};

export default HugeiconsPlugin; 