import html2canvas from 'html2canvas';

// Create a canvas from the element, convert to png, and download
const downloadAsPNG = async (element: HTMLDivElement, filename: string) => {
  const canvas = await html2canvas(element);
  const imageUrl = canvas.toDataURL('image/png', 1.0);
  downloadImage(imageUrl, filename);
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
