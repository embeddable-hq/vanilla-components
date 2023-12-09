import { useEffect } from 'react';

import { FONTS } from '../constants';

export default () => {
  useEffect(() => {
    Object.keys(FONTS).forEach(async (family) => {
      const font = new FontFace(
        family,
        `url('https://storage.googleapis.com/luuk-bucket/fonts/${FONTS[family]}')`
      );

      if (Array.from(document.fonts.keys()).find((f) => f.family === family)) return;

      const loaded = await font.load();

      document.fonts.add(loaded);
    });
  }, []);
};
