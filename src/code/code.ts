import { clientStorageKey, Config } from './modules/config';
import { CMD, counter } from './modules/globals';
import { messages } from './modules/messages';
import { showNofication } from './modules/notifications';
import { applyStyles, changeAllStyles, extractAllStyles, updateStyleNames } from './modules/styles';

let currentConfig;

figma.clientStorage.getAsync(clientStorageKey).then((cachedSettings) => {
  currentConfig = new Config(cachedSettings);
  const { notificationTimeout } = currentConfig;

  switch (CMD) {
    case 'clear-cache':
      figma.clientStorage.setAsync(clientStorageKey, undefined).then(() => {
        showNofication(0, messages(counter).clearCache, currentConfig.notificationTimeout);
      });
      break;

    case 'extract-all-styles':
      extractAllStyles(currentConfig).then(() =>
        showNofication(counter.extracted, messages(counter).extracted, notificationTimeout),
      );
      break;

    case 'customize-plugin':
      figma.showUI(__html__, { width: 320, height: 424 });

      figma.ui.postMessage(cachedSettings);

      figma.ui.onmessage = (msg) => {
        if (msg.type === 'cancel-modal') {
          showNofication(0, messages(counter).cancelSettings, notificationTimeout);
        }

        // save
        else if (msg.type === 'save-settings') {
          figma.clientStorage.setAsync(clientStorageKey, msg.uiSettings).then(() => {
            const newConfig = new Config(msg.uiSettings);

            updateStyleNames(currentConfig, newConfig);

            showNofication(
              counter.customize,
              messages(counter).customize,
              newConfig.notificationTimeout,
            );
            return;
          });
        }
      };
      break;

    case 'apply-all-styles':
      applyStyles(currentConfig);
      break;

    default:
      changeAllStyles(currentConfig);
      break;
  }
});