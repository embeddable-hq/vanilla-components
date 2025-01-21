import { useEffect } from 'react';

import { useOverrideConfig } from '@embeddable.com/react';
import { Theme } from '../../themes/theme';

export default () => {
  // Get theme for use in component
  const overrides: { theme: Theme } = useOverrideConfig() as { theme: Theme };
  const { theme } = overrides;

  useEffect(() => {
    if (!theme) {
      return;
    }
    const imports: { [key: string]: string } = theme.font.imports;
    Object.entries(imports).forEach(async ([family, fontFile]) => {
      const font = new FontFace(
        family,
        `url('https://storage.googleapis.com/embeddable-static-data-production/fonts/${fontFile}')`,
      );

      if (Array.from(document.fonts.keys()).find((f) => f.family === family)) return;

      const loaded = await font.load();

      document.fonts.add(loaded);
    });
  }, [theme]);
};
