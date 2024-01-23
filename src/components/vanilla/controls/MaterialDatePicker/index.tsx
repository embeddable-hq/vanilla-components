import createCache from '@emotion/cache';
import { CacheProvider, EmotionCache, Theme, ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React, { useLayoutEffect, useRef, useState } from 'react';

import '../../index.css';
import { Inputs } from './MaterialDatePicker.emb';
import Picker from './Picker';

export type Props = Inputs & {};

export default (props: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [cache, setCache] = useState<EmotionCache>();
  const [theme, setTheme] = useState<Theme>();

  useLayoutEffect(() => {
    if (ref.current === null) return;

    const cache = createCache({
      key: 'css',
      prepend: false,
      container: ref.current
    });

    setCache(cache);

    const theme = createTheme({
      components: {
        MuiPopover: {
          defaultProps: {
            container: ref.current
          }
        },
        MuiPopper: {
          defaultProps: {
            container: ref.current
          }
        },
        MuiModal: {
          defaultProps: {
            container: ref.current
          }
        }
      }
    });

    setTheme(theme);
  }, []);

  return (
    <div ref={ref} className="w-full font-embeddable text-sm">
      {cache && theme && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CacheProvider value={cache}>
            <ThemeProvider theme={theme}>
              <Picker {...props} />
            </ThemeProvider>
          </CacheProvider>
        </LocalizationProvider>
      )}
    </div>
  );
};
