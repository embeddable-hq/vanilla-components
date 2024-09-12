import { useEffect } from 'react';

import { FONTS } from '../constants';

export default () => {
  useEffect(() => {
    Object.entries(FONTS).forEach(async ([family, fontFile]) => {
      const font = new FontFace(
        family,
        `url('https://storage.googleapis.com/embeddable-static-data-production/fonts/${fontFile}')`
      );

      if (Array.from(document.fonts.keys()).find((f) => f.family === family)) return;

      const loaded = await font.load();

      document.fonts.add(loaded);
    });
  }, []);
};
