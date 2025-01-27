export default {
  onOverrideConfigUpdated: (config: any) => {
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --main-color: #3498db;
        --secondary-color: #2ecc71;
      }
    `;
    style.id = 'lifecycle-config';

    if (!document.head.querySelector('#lifecycle-config')) {
      document.head.appendChild(style);
    }
    return () => {
      style.remove();
    };
  },
};
