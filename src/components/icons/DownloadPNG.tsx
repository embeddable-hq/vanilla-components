import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../themes/theme';

type Props = {
  className?: string;
};

const DownloadAsPNG: React.FC<Props> = (props) => {
  const { className } = props;
  const theme: Theme = useTheme() as Theme;

  return (
    <svg
      className={className}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.06393 2.06412C2.69405 1.434 3.54868 1.08 4.43981 1.08H19.5598C20.4509 1.08 21.3056 1.434 21.9357 2.06412C22.5658 2.69424 22.9198 3.54887 22.9198 4.44V19.56C22.9198 20.4511 22.5658 21.3058 21.9357 21.9359C21.3056 22.566 20.4509 22.92 19.5598 22.92H4.43981C3.54868 22.92 2.69405 22.566 2.06393 21.9359C1.43381 21.3058 1.07981 20.4511 1.07981 19.56V4.44C1.07981 3.54887 1.4338 2.69424 2.06393 2.06412ZM4.43981 3.48C4.1852 3.48 3.94102 3.58114 3.76098 3.76118C3.58095 3.94121 3.47981 4.18539 3.47981 4.44V19.56C3.47981 19.8146 3.58095 20.0588 3.76098 20.2388C3.94102 20.4189 4.1852 20.52 4.43981 20.52H19.5598C19.8144 20.52 20.0586 20.4189 20.2386 20.2388C20.4187 20.0588 20.5198 19.8146 20.5198 19.56V4.44C20.5198 4.18539 20.4187 3.94121 20.2386 3.76118C20.0586 3.58114 19.8144 3.48 19.5598 3.48H4.43981Z"
        fill={theme.svg.fillLight}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.8639 6.38412C13.494 5.754 14.3487 5.4 15.2398 5.4C16.1309 5.4 16.9856 5.754 17.6157 6.38412C18.2458 7.01424 18.5998 7.86887 18.5998 8.76C18.5998 9.65113 18.2458 10.5058 17.6157 11.1359C16.9856 11.766 16.1309 12.12 15.2398 12.12C14.3487 12.12 13.494 11.766 12.8639 11.1359C12.2338 10.5058 11.8798 9.65113 11.8798 8.76C11.8798 7.86887 12.2338 7.01424 12.8639 6.38412ZM15.2398 7.8C14.9852 7.8 14.741 7.90114 14.561 8.08118C14.3809 8.26121 14.2798 8.50539 14.2798 8.76C14.2798 9.01461 14.3809 9.25879 14.561 9.43882C14.741 9.61886 14.9852 9.72 15.2398 9.72C15.4944 9.72 15.7386 9.61886 15.9186 9.43882C16.0987 9.25879 16.1998 9.01461 16.1998 8.76C16.1998 8.50539 16.0987 8.26121 15.9186 8.08118C15.7386 7.90114 15.4944 7.8 15.2398 7.8Z"
        fill={theme.svg.fillLight}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.46059 11.5474C7.35586 11.474 10.183 12.4334 12.4358 14.254C14.6928 16.0781 16.2254 18.647 16.7585 21.4996C16.8802 22.151 16.4508 22.7778 15.7994 22.8996C15.1479 23.0213 14.5211 22.5919 14.3993 21.9404C13.9712 19.6492 12.7401 17.5858 10.9272 16.1207C9.11439 14.6556 6.83854 13.8848 4.5085 13.9469C4.49784 13.9472 4.48718 13.9474 4.47653 13.9474C3.81011 13.9474 3.14799 14.006 2.50159 14.1276C1.85027 14.2501 1.22297 13.8213 1.10048 13.17C0.977991 12.5187 1.4067 11.8914 2.05802 11.7689C2.85355 11.6193 3.65914 11.5483 4.46059 11.5474Z"
        fill={theme.svg.fillLight}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.9361 13.7916C15.966 13.7863 14.0205 14.229 12.2466 15.0862C11.6499 15.3745 11.3999 16.092 11.6883 16.6888C11.9767 17.2855 12.6942 17.5355 13.2909 17.2471C14.7379 16.5479 16.3249 16.1869 17.932 16.1916L17.9378 16.1916C19.0944 16.1893 20.2436 16.3743 21.341 16.7394C21.9699 16.9486 22.6493 16.6084 22.8585 15.9795C23.0677 15.3506 22.7275 14.6713 22.0986 14.4621C20.7563 14.0155 19.3506 13.7891 17.9361 13.7916Z"
        fill={theme.svg.fillLight}
      />
    </svg>
  );
};

export default DownloadAsPNG;
