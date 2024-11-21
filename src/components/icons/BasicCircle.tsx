type Props = {
  className?: string;
  color?: string;
  size?: number;
};

const BasicCircle: React.FC<Props> = (props) => {
  const { className, color, size } = props;
  return (
    <svg
      className={className}
      height={size}
      id="basic-circle.svg"
      version="1.0"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle r="45" cx="50" cy="50" fill={color} />
    </svg>
  );
};
export default BasicCircle;
