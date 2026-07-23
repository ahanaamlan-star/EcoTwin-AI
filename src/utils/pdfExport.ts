import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFExportOptions {
  elementId: string;
  filename?: string;
  reportTitle?: string;
}

function parseValue(val: string, isPercentScale: boolean, maxScale: number = 1): number {
  if (!val) return 0;
  const clean = val.trim();
  if (clean.endsWith('%')) {
    return (parseFloat(clean) / 100) * (isPercentScale ? 1 : maxScale);
  }
  return parseFloat(clean) || 0;
}

function oklabToRgba(L: number, a: number, bVal: number, alpha: number): string {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * bVal;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * bVal;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * bVal;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const rLinear = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const gLinear = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bLinear = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  const gamma = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

  const r = Math.round(Math.max(0, Math.min(255, gamma(rLinear) * 255)));
  const g = Math.round(Math.max(0, Math.min(255, gamma(gLinear) * 255)));
  const b = Math.round(Math.max(0, Math.min(255, gamma(bLinear) * 255)));

  if (alpha < 1) {
    return `rgba(${r}, ${g}, ${b}, ${Number(alpha.toFixed(3))})`;
  }
  return `rgb(${r}, ${g}, ${b})`;
}

function parseOklab(str: string): string {
  try {
    const content = str.replace(/^oklab\s*\(\s*/i, '').replace(/\s*\)$/, '');
    const parts = content.split(/\s*[\/\,]\s*|\s+/).filter(Boolean);
    if (parts.length < 3) return 'rgb(15, 23, 42)';

    const L = parseValue(parts[0], true);
    const a = parseValue(parts[1], false, 0.4);
    const b = parseValue(parts[2], false, 0.4);
    const alpha = parts[3] ? parseValue(parts[3], true) : 1;

    return oklabToRgba(L, a, b, alpha);
  } catch {
    return 'rgb(15, 23, 42)';
  }
}

function parseOklch(str: string): string {
  try {
    const content = str.replace(/^oklch\s*\(\s*/i, '').replace(/\s*\)$/, '');
    const parts = content.split(/\s*[\/\,]\s*|\s+/).filter(Boolean);
    if (parts.length < 3) return 'rgb(15, 23, 42)';

    const L = parseValue(parts[0], true);
    const c = parseValue(parts[1], false, 0.4);
    const hStr = parts[2].replace(/deg/i, '');
    const h = parseFloat(hStr) || 0;
    const alpha = parts[3] ? parseValue(parts[3], true) : 1;

    const hRad = (h * Math.PI) / 180;
    const a = c * Math.cos(hRad);
    const b = c * Math.sin(hRad);

    return oklabToRgba(L, a, b, alpha);
  } catch {
    return 'rgb(15, 23, 42)';
  }
}

function parseColorSrgb(str: string): string {
  try {
    const content = str.replace(/^color\s*\(\s*/i, '').replace(/\s*\)$/, '');
    const parts = content.split(/\s*[\/\,]\s*|\s+/).filter(Boolean);
    const nums = parts.filter(p => !['srgb', 'display-p3', 'rec2020'].includes(p.toLowerCase()));
    if (nums.length < 3) return 'rgb(15, 23, 42)';

    let r = parseValue(nums[0], true) * 255;
    let g = parseValue(nums[1], true) * 255;
    let b = parseValue(nums[2], true) * 255;
    const alpha = nums[3] ? parseValue(nums[3], true) : 1;

    r = Math.round(Math.max(0, Math.min(255, r)));
    g = Math.round(Math.max(0, Math.min(255, g)));
    b = Math.round(Math.max(0, Math.min(255, b)));

    return alpha < 1 ? `rgba(${r}, ${g}, ${b}, ${alpha})` : `rgb(${r}, ${g}, ${b})`;
  } catch {
    return 'rgb(15, 23, 42)';
  }
}

export function sanitizeCssText(cssText: string): string {
  if (!cssText) return '';
  return cssText
    .replace(/oklab\s*\([^)]+\)/gi, (match) => parseOklab(match))
    .replace(/oklch\s*\([^)]+\)/gi, (match) => parseOklch(match))
    .replace(/color\s*\([^)]+\)/gi, (match) => parseColorSrgb(match))
    .replace(/color-mix\s*\([^)]+\)/gi, 'rgb(16, 185, 129)')
    .replace(/light-dark\s*\([^)]+\)/gi, 'rgb(248, 250, 252)');
}

/**
 * Captures an HTML element by ID, converts it into high-resolution canvas,
 * formats it into an A4 multi-page PDF with headers, footers, and page numbers,
 * and automatically triggers browser download.
 */
export async function exportElementToPDF({
  elementId,
  filename = 'EcoTwin-Sustainability-Report.pdf',
  reportTitle = 'EcoTwin AI Executive Report'
}: PDFExportOptions): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Report element with ID "${elementId}" was not found in the DOM.`);
  }

  // Temporarily scroll to top of container to ensure full canvas capture
  const originalScrollTop = window.scrollY;
  window.scrollTo(0, 0);

  // Sanitization step: Temporarily replace oklab / oklch in all main document <style> tags
  // to prevent html2canvas CSS parser from failing when reading document.styleSheets
  const styleTags = Array.from(document.querySelectorAll('style'));
  const originalStyleContents: string[] = styleTags.map((tag) => tag.textContent || '');

  styleTags.forEach((tag) => {
    if (tag.textContent && /(?:oklab|oklch|color)\s*\(/i.test(tag.textContent)) {
      tag.textContent = sanitizeCssText(tag.textContent);
    }
  });

  try {
    // Capture element with high scale DPI
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#0f172a', // Dark theme background matching EcoTwin UI
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        // 1. Sanitize all <style> elements in cloned document
        const clonedStyleElements = clonedDoc.querySelectorAll('style');
        clonedStyleElements.forEach((styleEl) => {
          if (styleEl.textContent) {
            styleEl.textContent = sanitizeCssText(styleEl.textContent);
          }
        });

        // 2. Sanitize inline styles and computed styles on all elements
        const allNodes = clonedDoc.querySelectorAll('*');
        allNodes.forEach((node) => {
          const htmlEl = node as HTMLElement;
          const inlineStyle = htmlEl.getAttribute('style');
          if (inlineStyle) {
            htmlEl.setAttribute('style', sanitizeCssText(inlineStyle));
          }

          // Convert computed oklab/oklch styles to explicit inline rgb/rgba
          try {
            const computed = window.getComputedStyle(htmlEl);
            const propertiesToSanitize = [
              'color',
              'backgroundColor',
              'borderColor',
              'outlineColor',
              'fill',
              'stroke'
            ];

            propertiesToSanitize.forEach((prop) => {
              const val = computed.getPropertyValue(prop);
              if (val && (val.includes('oklab') || val.includes('oklch') || val.includes('color('))) {
                const sanitized = sanitizeCssText(val);
                htmlEl.style.setProperty(prop, sanitized);
              }
            });
          } catch {
            // ignore computed style lookup failure on special nodes
          }
        });

        // 3. Ensure cloned target element is visible and styled cleanly for print export
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          clonedElement.style.padding = '32px';
          clonedElement.style.width = '100%';
          clonedElement.style.backgroundColor = '#0f172a';
          clonedElement.style.color = '#f8fafc';
        }
      }
    });

    // Revert window scroll position
    window.scrollTo(0, originalScrollTop);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

    const margin = 10; // 10mm margins
    const imgWidth = pdfWidth - margin * 2; // 190mm
    const pageContentHeight = pdfHeight - margin * 2 - 10; // 267mm available for content
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = margin;

    // First page
    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
    heightLeft -= pageContentHeight;

    // Multi-page handling if content height exceeds A4 single page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight + margin;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
      heightLeft -= pageContentHeight;
    }

    // Add page numbers and EcoTwin header/footer on all pages
    const totalPages = pdf.getNumberOfPages();
    const generatedDate = new Date().toISOString().split('T')[0];

    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);

      // Top subtle header line
      pdf.setDrawColor(30, 41, 59); // slate-800
      pdf.setLineWidth(0.3);
      pdf.line(margin, 8, pdfWidth - margin, 8);

      pdf.setFontSize(7);
      pdf.setTextColor(148, 163, 184); // slate-400
      pdf.text(`EcoTwin AI Digital Twin Engine | ${reportTitle}`, margin, 6);
      pdf.text(`ISO 14064 / SEC ESG Compliant`, pdfWidth - margin, 6, { align: 'right' });

      // Bottom footer
      pdf.line(margin, pdfHeight - 8, pdfWidth - margin, pdfHeight - 8);
      pdf.text(`Confidential - For Municipal Governance & Executive Review`, margin, pdfHeight - 4);
      pdf.text(`Page ${i} of ${totalPages} | Exported ${generatedDate}`, pdfWidth - margin, pdfHeight - 4, { align: 'right' });
    }

    // Save and download PDF file automatically
    pdf.save(filename);
    return true;
  } catch (error) {
    window.scrollTo(0, originalScrollTop);
    console.error('Failed to generate PDF:', error);
    throw error;
  } finally {
    // Revert all document <style> elements back to original content
    styleTags.forEach((tag, i) => {
      if (originalStyleContents[i] !== undefined) {
        tag.textContent = originalStyleContents[i];
      }
    });
  }
}


