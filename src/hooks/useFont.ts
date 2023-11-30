import { useCallback } from 'react';

export default () => {
  const load = useCallback((fonts: { [family: string]: string }) => {
    Object.keys(fonts).forEach(async (family) => {
      const font = new FontFace(
        family,
        `url('https://storage.googleapis.com/luuk-bucket/fonts/${fonts[family]}')`
      );

      if (Array.from(document.fonts.keys()).find((f) => f.family === family)) return;

      const loaded = await font.load();

      document.fonts.add(loaded);
    });
  }, []);

  return { load };
};
