import React from 'react';

// Helper: lightens (positive) or darkens (negative) a hex color.
const shadeColor = (color, percent) => {
  let num = parseInt(color.slice(1), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + amt,
      G = (num >> 8 & 0x00FF) + amt,
      B = (num & 0x0000FF) + amt;
  return "#" + (
    0x1000000 +
    (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 0 ? 0 : B) : 255)
  ).toString(16).slice(1);
};

// Generate a scale with 12 steps (100–1200); baseColor is the 500 value.
const generateScale = (baseColor) => ({
  100: shadeColor(baseColor, 50),
  200: shadeColor(baseColor, 40),
  300: shadeColor(baseColor, 30),
  400: shadeColor(baseColor, 20),
  500: baseColor,
  600: shadeColor(baseColor, -10),
  700: shadeColor(baseColor, -20),
  800: shadeColor(baseColor, -30),
  900: shadeColor(baseColor, -40),
  1000: shadeColor(baseColor, -50),
  1100: shadeColor(baseColor, -60),
  1200: shadeColor(baseColor, -70)
});

const Button = ({ primary, secondary, text }) => {
  const primaryScale = generateScale(primary);
  const secondaryScale = generateScale(secondary);

  // Dynamically set CSS variables from the generated scales.
  const style = {
    '--emb-rc-color-primary-100': primaryScale[100],
    '--emb-rc-color-primary-200': primaryScale[200],
    '--emb-rc-color-primary-300': primaryScale[300],
    '--emb-rc-color-primary-400': primaryScale[400],
    '--emb-rc-color-primary-500': primaryScale[500],
    '--emb-rc-color-primary-600': primaryScale[600],
    '--emb-rc-color-primary-700': primaryScale[700],
    '--emb-rc-color-primary-800': primaryScale[800],
    '--emb-rc-color-primary-900': primaryScale[900],
    '--emb-rc-color-primary-1000': primaryScale[1000],
    '--emb-rc-color-primary-1100': primaryScale[1100],
    '--emb-rc-color-primary-1200': primaryScale[1200],
    '--emb-rc-color-secondary-500': secondaryScale[500]
  };

  return (
    <button className="custom-button" style={style}>
      {text}
      <style jsx>{`
        .custom-button {
          background-color: var(--emb-rc-color-primary-500);
          border: 2px solid var(--emb-rc-color-secondary-500);
          color: #fff;
          padding: 10px 20px;
          cursor: pointer;
          transition: background-color 0.3s;
          border-radius: 8px;
        }
        .custom-button:hover {
          background-color: var(--emb-rc-color-primary-800);
        }
        .custom-button:active {
          background-color: var(--emb-rc-color-primary-600);
        }
      `}</style>
    </button>
  );
};

const Documentation = () => (
    <div style={{ marginTop: '1rem', fontFamily: 'sans-serif' }}>
        <h3>Component Documentation</h3>
        <br/>
        CSS Variable scales are generated automatically from a 'primary' and 'secondary' hex code. 
        <br/>
        <br/>
        <ul>
        <li>
            <code>--emb-rc-color-primary-500</code> is used as the default background color.
        </li>
        <li>
            <code>--emb-rc-color-primary-800</code> defines the hover state background.
        </li>
        <li>
            <code>--emb-rc-color-primary-600</code> defines the active state background.
        </li>
        <li>
            <code>--emb-rc-color-secondary-500</code> is used for the border color.
        </li>
        </ul>
    </div>
);

const ButtonWithDocumentation = (props) => (
  <div>
    <Button {...props}>Click Me</Button>
    <Documentation />
  </div>
);

export default ButtonWithDocumentation;