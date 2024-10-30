import html2canvas from 'html2canvas';
import { Dispatch, SetStateAction } from 'react';

// Create a canvas from the element, convert to png, and download
const downloadAsPNG = async (
  element: HTMLDivElement,
  filename: string,
  setLoadingState: Dispatch<SetStateAction<boolean>>,
) => {
  const canvas = await html2canvas(element);
  const imageUrl = canvas.toDataURL('image/png', 1.0);
  downloadImage(imageUrl, filename);
  setLoadingState(false);
};

const downloadImage = (imageUrl: string, filename: string) => {
  const downloadLink = window.document.createElement('a');
  downloadLink.style.display = 'none';
  downloadLink.download = filename;

  downloadLink.href = imageUrl;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);

  downloadLink.remove();
};

export default downloadAsPNG;
