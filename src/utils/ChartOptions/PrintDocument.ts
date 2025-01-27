import html2canvas from 'html2canvas';
import { useTranslation } from 'react-i18next';
import JsPDF from 'jspdf';
import { type CategoryCodes, type ChartData, CategoryToLabel } from '../../types/chartDataTypes';

interface PrintDocumentProps {
  category: keyof typeof CategoryCodes;
  dataset: keyof ChartData;
  gender: string;
  firstName?: string;
  lastName?: string;
}

export const PrintDocument = ({ category, dataset, gender, firstName, lastName }: PrintDocumentProps) => {
  const { t } = useTranslation();
  const datasetPdfLabel = String(dataset).replace(/ /g, '_');
  const input = document.getElementById('divToPrint');
  html2canvas(input, { logging: false }).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new JsPDF('l', 'mm', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();

    pdf.setFontSize(18);
    lastName && pdf.text(`${firstName} ${lastName}`, 20, 20);
    lastName && pdf.setFontSize(14);
    pdf.text(`${t(gender)} - ${CategoryToLabel[category]} - ${dataset}`, 20, 30);
    pdf.addImage(imgData, 'JPEG', 10, 35, width - 20, height - 40);

    lastName
      ? pdf.save(`${lastName}_${category}_${datasetPdfLabel}.pdf`)
      : pdf.save(`${category}_${datasetPdfLabel}.pdf`);
  });
};
