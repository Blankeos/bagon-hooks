import { createEffect, createSignal, onCleanup, onMount } from 'solid-js';

interface NetworkStatus {
  downlink?: number;
  downlinkMax?: number;
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  rtt?: number;
  saveData?: boolean;
  type?: 'bluetooth' | 'cellular' | 'ethernet' | 'wifi' | 'wimax' | 'none' | 'other' | 'unknown';
}

function getConnection(): NetworkStatus {
  if (typeof navigator === 'undefined') {
    return {};
  }

  const _navigator = navigator as any;
  const connection: any =
    _navigator.connection || _navigator.mozConnection || _navigator.webkitConnection;

  if (!connection) {
    return {};
  }

  return {
    downlink: connection?.downlink,
    downlinkMax: connection?.downlinkMax,
    effectiveType: connection?.effectiveType,
    rtt: connection?.rtt,
    saveData: connection?.saveData,
    type: connection?.type,
  };
}

/**
 * A hook that returns the current network status.
 */
export function useNetwork() {
  const [status, setStatus] = createSignal<{ online: boolean } & NetworkStatus>({
    online: true,
  });

  function handleConnectionChange() {
    setStatus(current => ({ ...current, ...getConnection() }));
  }

  // (Replaced useWindowEvent with this)
  onMount(() => {
    const onlineListener = () => setStatus({ online: true, ...getConnection() });
    const offlineListener = () => setStatus({ online: false, ...getConnection() });
    window.addEventListener('online', onlineListener);
    window.addEventListener('offline', offlineListener);

    onCleanup(() => {
      window.removeEventListener('online', onlineListener);
      window.removeEventListener('offline', offlineListener);
    });
  });

  createEffect(() => {
    const _navigator = navigator as any;

    if (_navigator.connection) {
      setStatus({ online: _navigator.onLine, ...getConnection() });
      _navigator.connection.addEventListener('change', handleConnectionChange);

      onCleanup(() => _navigator.connection.removeEventListener('change', handleConnectionChange));
    }

    if (typeof _navigator.onLine === 'boolean') {
      // Required for Firefox and other browsers that don't support navigator.connection
      setStatus(current => ({ ...current, online: _navigator.onLine }));
    }
  });

  return status;
}
