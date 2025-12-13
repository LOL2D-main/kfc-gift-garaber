import * as React from 'react';

const DEVICE_ID_KEY = 'kfc_gift_device_id';

export const useDeviceId = () => {
  const [deviceId, setDeviceId] = React.useState<string>('');

  React.useEffect(() => {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = `device_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    setDeviceId(id);
  }, []);

  return deviceId;
};
