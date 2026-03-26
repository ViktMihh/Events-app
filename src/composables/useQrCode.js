import QRCode from 'qrcode';

export default function useQrCode() {
  const generateQrCode = async (url) => {
    const dataURL = await QRCode.toString(url, {
      errorCorrectionLevel: 'H',
      type: 'svg',
      width: 200,
      height: 200,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
    return `data:image/svg+xml,${encodeURIComponent(dataURL)}`;
  };

  const downloadSVG = (qr, lang, type) => {
    const link = document.createElement('a');
    link.href = qr;
    link.download = `${type}_qr_${lang}.svg`;
    link.click();
  };

  return {
    generateQrCode,
    downloadSVG,
  };
}
