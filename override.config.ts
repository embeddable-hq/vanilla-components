import defaultTheme from './src/themes/defaulttheme';
const overrideProps = (ctx: any): any => {
  return {
    theme: defaultTheme,
  };
};
export default overrideProps;
