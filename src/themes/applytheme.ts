const applyTheme = (theme: any) => {
  // Determine if we're in builder mode or display mode
  const isBuilderMode = document.querySelector('em-beddable') ? false : true;

  // If we're in builder mode, apply the theme to the builder
  if (isBuilderMode) {
    // console.log('builder mode');
  } else {
    // Otherwise, apply it to the embeddable canvas
    // iterate through each container in the embeddable
    for (const container of document.querySelectorAll('em-beddable')) {
      // Get its shadow root
      const shadowRoot = container.shadowRoot;
      if (!shadowRoot) {
        return;
      }
      // create a simple stylesheet that turns the background blue
      const sheet = new CSSStyleSheet();
      const testStyle = document.createElement('style');
      testStyle.innerHTML = `
        #embeddable-main-canvas {
          background-color: #00AA00;
          color: #AA0000;
        }
        div {
          background-color: #AA00000;
        }
      `;

      /*
      for (const key in theme?.css?.variables) {
        const styleRule = `${key} ${theme.css.variables[key]};\n`;
        sheet.insertRule(styleRule);
      }
      */
      for (const key in theme?.css?.styles) {
        const styleRule = `${key} { ${theme.css.styles[key]} }\n`;
        sheet.insertRule(styleRule);
      }
      console.log(shadowRoot.adoptedStyleSheets);
      console.log(sheet);
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, sheet];
      shadowRoot.appendChild(testStyle);
    }
  }
};

export default applyTheme;
