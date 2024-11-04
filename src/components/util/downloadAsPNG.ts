import { toPng } from 'html-to-image';
import { Dispatch, SetStateAction } from 'react';

// Create a canvas from the element, convert to png, and download
const downloadAsPNG = async (
  element: HTMLDivElement,
  filename: string,
  setLoadingState: Dispatch<SetStateAction<boolean>>,
) => {
  // Prevent transparent PNGs
  let changedBkg = false;
  if (!element.style.backgroundColor) {
    element.style.backgroundColor = 'white';
    changedBkg = true;
  }

  // Download the image
  const imageUrl = await toPng(element);
  await downloadImage(imageUrl, filename);

  // Reset the background color if it was changed
  if (changedBkg) {
    element.style.backgroundColor = '';
  }
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
