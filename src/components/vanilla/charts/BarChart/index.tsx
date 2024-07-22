import Container from '../../Container';
import BarChart from './components/BarChart';

export default (props: Props) => {

  return (
    <Container
      {...props}
      className="overflow-y-hidden"
      >
      <BarChart
        {...props}
      />
    </Container>
  );
};

