import React from 'react';

export default function DownloadButton({ show, data, prevData, title, preppingDownload, setpreppingDownload }: { show?: boolean; }) {

  if (!show) return;

  function arrayToCsv(data){
    return data.map(row =>
      row
        .map(String)  // convert every value to String
        .map(v => v.replaceAll('"', '""'))  // escape double quotes
        .map(v => `"${v}"`)  // quote it
        .join(',')  // comma-separated
    ).join('\r\n');  // rows starting on new lines
  }

  function downloadBlob(content, filename, contentType) {
    // Create a blob
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);

    // Create a link to download it
    const pom = document.createElement('a');
    pom.href = url;
    pom.setAttribute('download', filename);
    pom.click();
    setpreppingDownload(false)
  }

  function formatValue(v) {
    if(v === null || v === undefined) {
      return '';
    }
    return v;
  }

  function handleClick() {
    setpreppingDownload(true);
    const rows = [];
    const columns = Object.keys(data[0]);
    rows.push(columns.map(c => c)); //title row
    data?.map(row => {
      const rowValues = columns.map(c => row[c]);
      rows.push(rowValues);
    })
    prevData?.map(row => {
      const rowValues = columns.map(c => row[c]);
      rows.push(rowValues);
    })
    const csv = arrayToCsv(rows);
    setTimeout(() => {  downloadBlob(csv, 'export.csv', 'text/csv;charset=utf-8;'); }, 200); //timeout set to indicate that the download is in progress (if instant it can appear to the user that it hasn't been successful)
  }


 return (
    <svg 
      onClick={handleClick}
      className={`absolute right-0 top-0 z-1 cursor-pointer hover:opacity-100 ${preppingDownload ? ' opacity-0' : 'opacity-50'}` }
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none">
      <g clipPath="url(#clip0_271_1583)">
        <path d="M18.6381 16.3934C19.642 16.0066 20.5242 15.5087 21.2192 14.8964C22.0401 14.1733 22.562 13.1801 22.6861 12.105C22.8102 11.0299 22.5278 9.94756 21.8927 9.06283C21.2574 8.1781 20.3133 7.55246 19.2392 7.30435C19.1649 7.28263 19.0986 7.24058 19.048 7.18313C18.9974 7.12569 18.9647 7.05525 18.9536 6.98011C18.8207 5.55336 18.1931 4.21437 17.1752 3.18641C16.1573 2.15846 14.8107 1.50368 13.36 1.33129C11.9093 1.15889 10.4421 1.47929 9.20317 2.23905C7.96425 2.99882 7.02844 4.15202 6.5518 5.50636C6.52028 5.56951 6.47096 5.62248 6.40969 5.65905C6.34842 5.69561 6.27777 5.71421 6.20606 5.71269C5.51514 5.75817 4.8401 5.93662 4.21953 6.23786C3.59894 6.53909 3.04496 6.95722 2.58921 7.46837C1.66876 8.50066 1.2043 9.84916 1.29799 11.2172C1.39168 12.5852 2.03586 13.8607 3.08879 14.7631C3.64641 15.241 4.32746 15.6568 5.09728 16.0085M5.96024 5.71713C7.99888 5.71713 9.82211 7.06087 10.3973 8.2885M12.0004 13.4472V22.6658M8.48186 19.6122C9.55106 20.9781 10.2793 21.6138 11.3646 22.445C11.7486 22.7392 12.2524 22.7392 12.6364 22.445C13.7217 21.6138 14.4499 20.9781 15.5191 19.6122" stroke="#474752" strokeWidth="1.71429" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
        <defs>
          <clipPath id="clip0_271_1583">
            <rect width="24" height="24" fill="white"/>
          </clipPath>
        </defs>
    </svg>
  );
}
