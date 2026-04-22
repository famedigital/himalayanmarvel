import { Itinerary, ItineraryDay, SectionOpener } from '@/lib/supabase/itinerary-types';

export function generateItineraryHTML(data: any): string {
  const itinerary: Itinerary = data;
  const days: ItineraryDay[] = itinerary.itinerary_days || [];
  const sectionOpeners: SectionOpener[] = itinerary.section_openers || [];

  // Format date range
  const formatDateRange = () => {
    if (!itinerary.start_date || !itinerary.end_date) return '';
    const start = new Date(itinerary.start_date);
    const end = new Date(itinerary.end_date);
    const options = { month: 'short', day: 'numeric' } as const;
    return `${start.toLocaleDateString('en-US', options)} – ${end.toLocaleDateString('en-US', options)}, ${end.getFullYear()}`;
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(itinerary.title)} | ${escapeHtml(itinerary.guest_names)}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Open+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap');

        :root {
            --forest-green: #2d5a3d;
            --warm-brown: #8b7355;
            --tan: #a0826d;
            --cream: #faf8f5;
            --beige: #f5f1e8;
            --dark-brown: #4a3728;
            --gold: #c9a961;
        }

        @page {
            size: A4 portrait;
            margin: 0;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Open Sans', sans-serif;
            background: var(--cream);
            color: #000000;
            line-height: 1.6;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }

        .page {
            width: 210mm;
            height: 297mm;
            margin: 0 auto;
            background: var(--beige);
            position: relative;
            page-break-after: always;
            break-after: page;
            overflow: hidden;
        }

        .running-header {
            position: absolute;
            top: 18px;
            left: 35px;
            right: 35px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-family: 'Montserrat', sans-serif;
            font-size: 9px;
            letter-spacing: 2px;
            color: var(--forest-green);
            text-transform: uppercase;
            z-index: 10;
            font-weight: 700;
        }

        .running-footer {
            position: absolute;
            bottom: 20px;
            left: 35px;
            right: 35px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-family: 'Open Sans', sans-serif;
            font-size: 8px;
            color: var(--warm-brown);
            text-transform: uppercase;
            letter-spacing: 1px;
            z-index: 10;
            padding-top: 10px;
            border-top: 1px solid var(--tan);
        }

        .page-number {
            width: 26px;
            height: 26px;
            background: var(--forest-green);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Montserrat', sans-serif;
            font-size: 10px;
            color: #fff;
            font-weight: 700;
        }

        /* ========== COVER PAGE ========== */
        .cover-page {
            width: 210mm;
            height: 297mm;
            position: relative;
            overflow: hidden;
        }

        .cover-bg {
            position: absolute;
            inset: 0;
            background: ${itinerary.cover_image ? `url('${escapeHtml(itinerary.cover_image)}')` : 'linear-gradient(135deg, #2d5a3d 0%, #4a3728 100%)'} center/cover;
        }

        .cover-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg,
                rgba(45,90,61,0.85) 0%,
                rgba(45,90,61,0.6) 40%,
                rgba(74,55,40,0.75) 100%);
        }

        .cover-content {
            position: relative;
            z-index: 2;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 60px;
        }

        .cover-logo {
            font-family: 'Montserrat', sans-serif;
            font-size: 10px;
            letter-spacing: 6px;
            color: var(--gold);
            margin-bottom: 80px;
            text-transform: uppercase;
            font-weight: 600;
        }

        .cover-title {
            font-family: 'Montserrat', sans-serif;
            font-size: 72px;
            color: #fff;
            font-weight: 900;
            letter-spacing: 6px;
            line-height: 1;
            text-shadow: 2px 2px 30px rgba(0,0,0,0.5);
            margin-bottom: 25px;
        }

        .cover-subtitle {
            font-family: 'Open Sans', sans-serif;
            font-size: 26px;
            color: rgba(255,255,255,0.95);
            font-weight: 700;
            letter-spacing: 4px;
            font-style: italic;
            margin-bottom: 60px;
        }

        .cover-divider {
            display: flex;
            align-items: center;
            gap: 20px;
            margin: 40px 0 60px;
        }

        .cover-divider-line {
            width: 100px;
            height: 1px;
            background: linear-gradient(to right, transparent, var(--gold), transparent);
        }

        .cover-divider-diamond {
            width: 12px;
            height: 12px;
            background: var(--gold);
            transform: rotate(45deg);
        }

        .cover-guest {
            font-family: 'Open Sans', sans-serif;
            font-size: 24px;
            color: #fff;
            font-weight: 700;
            letter-spacing: 2px;
            margin-bottom: 15px;
        }

        .cover-dates {
            font-family: 'Montserrat', sans-serif;
            font-size: 12px;
            color: var(--gold);
            letter-spacing: 3px;
            text-transform: uppercase;
            font-weight: 600;
        }

        /* ========== INNER PAGE ========== */
        .inner-page {
            padding: 55px 40px 105px;
            min-height: 297mm;
            display: flex;
            flex-direction: column;
        }

        /* ========== LETTER PAGE ========== */
        .letter-page {
            padding: 55px 55px 110px;
        }

        .letter-header {
            text-align: center;
            margin-bottom: 25px;
        }

        .letter-logo {
            font-family: 'Montserrat', sans-serif;
            font-size: 18px;
            letter-spacing: 4px;
            color: var(--forest-green);
            margin-bottom: 8px;
            font-weight: 700;
        }

        .letter-date {
            font-family: 'Open Sans', sans-serif;
            font-size: 14px;
            color: var(--warm-brown);
            font-style: italic;
            font-weight: 600;
        }

        .letter-salutation {
            font-family: 'Montserrat', sans-serif;
            font-size: 18px;
            color: var(--forest-green);
            margin-bottom: 12px;
            font-weight: 700;
        }

        .letter-body {
            font-family: 'Open Sans', sans-serif;
            font-size: 14px;
            color: #000000;
            line-height: 1.4;
            margin-bottom: 8px;
            text-align: justify;
            font-weight: 600;
        }

        .letter-signature {
            margin-top: 20px;
        }

        .letter-sign-name {
            font-family: 'Playfair Display', serif;
            font-size: 20px;
            color: #c41e3a;
            font-weight: 700;
        }

        .letter-sign-title {
            font-size: 14px;
            color: #888;
            margin-top: 5px;
        }

        /* ========== DAY STYLES ========== */
        .day-section {
            margin-bottom: 12px;
            page-break-inside: avoid;
        }

        .day-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }

        .day-number-circle {
            width: 50px;
            height: 50px;
            background: var(--forest-green);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            margin-right: 15px;
            box-shadow: 0 2px 8px rgba(45,90,61,0.3);
        }

        .day-number-circle span {
            font-family: 'Montserrat', sans-serif;
            font-size: 24px;
            color: #fff;
            font-weight: 800;
        }

        .day-title-block {
            flex: 1;
        }

        .day-title {
            font-family: 'Montserrat', sans-serif;
            font-size: 16px;
            color: var(--forest-green);
            font-weight: 800;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
            line-height: 1.2;
        }

        .day-meta {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }

        .day-meta-item {
            font-family: 'Montserrat', sans-serif;
            font-size: 10px;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: var(--warm-brown);
            font-weight: 600;
        }

        .day-meta-item strong {
            color: var(--forest-green);
            font-weight: 700;
        }

        .day-content {
            display: flex;
            gap: 25px;
            margin-top: 15px;
        }

        .day-text {
            flex: 1;
        }

        .day-description {
            font-family: 'Open Sans', sans-serif;
            font-size: 13px;
            color: #000000;
            line-height: 1.3;
            margin-bottom: 8px;
            font-weight: 600;
        }

        .day-description.drop-cap::first-letter {
            font-family: 'Montserrat', sans-serif;
            font-size: 42px;
            float: left;
            margin-right: 10px;
            margin-top: 2px;
            line-height: 0.85;
            color: var(--forest-green);
            font-weight: 800;
        }

        .day-image {
            width: 160px;
            flex-shrink: 0;
        }

        .day-image img {
            width: 100%;
            height: 140px;
            object-fit: cover;
            border-radius: 4px;
        }

        .day-subsection {
            margin-bottom: 8px;
        }

        .day-subsection-title {
            font-family: 'Montserrat', sans-serif;
            font-size: 10px;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: var(--forest-green);
            margin-bottom: 6px;
            font-weight: 700;
        }

        .day-highlights {
            background: linear-gradient(135deg, rgba(45,90,61,0.06), rgba(160,130,109,0.04));
            padding: 12px 16px;
            border-radius: 6px;
            margin-top: 12px;
        }

        .day-highlights-title {
            font-family: 'Montserrat', sans-serif;
            font-size: 10px;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: var(--forest-green);
            margin-bottom: 10px;
            font-weight: 700;
        }

        .day-highlights-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px 15px;
        }

        .day-highlights-list span {
            font-family: 'Open Sans', sans-serif;
            font-size: 13px;
            color: #000000;
            padding-left: 14px;
            position: relative;
            font-weight: 600;
        }

        .day-highlights-list span::before {
            content: '✦';
            position: absolute;
            left: 0;
            color: var(--forest-green);
            font-size: 12px;
        }

        .day-menu-list {
            list-style: none;
            display: flex;
            flex-wrap: wrap;
            gap: 10px 20px;
        }

        .day-menu-list li {
            font-family: 'Open Sans', sans-serif;
            font-size: 13px;
            color: #000000;
            padding-left: 16px;
            position: relative;
            font-weight: 600;
        }

        .day-menu-list li::before {
            content: '◆';
            position: absolute;
            left: 0;
            color: var(--forest-green);
            font-size: 8px;
            top: 6px;
        }

        .weather-badge {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 12px 20px;
            background: linear-gradient(135deg, rgba(45,90,61,0.1), rgba(160,130,109,0.08));
            border-radius: 25px;
            font-family: 'Montserrat', sans-serif;
            font-size: 11px;
            color: var(--forest-green);
            font-weight: 700;
            border: 1px solid var(--tan);
        }

        .pull-quote {
            font-family: 'Open Sans', sans-serif;
            font-size: 12px;
            font-style: italic;
            color: var(--dark-brown);
            padding: 10px 14px;
            margin: 8px 0;
            position: relative;
            background: linear-gradient(135deg, rgba(45,90,61,0.08), rgba(160,130,109,0.06));
            border-left: 3px solid var(--forest-green);
            line-height: 1.3;
            font-weight: 600;
        }

        .royal-divider {
            display: flex;
            align-items: center;
            gap: 15px;
            margin: 14px 0;
        }

        .royal-divider-line {
            flex: 1;
            height: 1px;
            background: linear-gradient(to right, transparent, var(--tan), transparent);
        }

        .royal-divider-diamond {
            width: 10px;
            height: 10px;
            background: var(--forest-green);
            transform: rotate(45deg);
        }

        /* ========== PRICING PAGE ========== */
        .pricing-page {
            padding: 55px 45px 110px;
        }

        .pricing-header {
            text-align: center;
            margin-bottom: 35px;
        }

        .pricing-label {
            font-family: 'Montserrat', sans-serif;
            font-size: 10px;
            letter-spacing: 4px;
            text-transform: uppercase;
            color: var(--forest-green);
            margin-bottom: 12px;
            font-weight: 600;
        }

        .pricing-title {
            font-family: 'Montserrat', sans-serif;
            font-size: 28px;
            color: var(--forest-green);
            font-weight: 800;
            letter-spacing: 1px;
        }

        .pricing-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
            border: 1px solid #e0e0e0;
        }

        .pricing-table thead {
            background: var(--forest-green);
        }

        .pricing-table th {
            font-family: 'Montserrat', sans-serif;
            font-size: 9px;
            color: #fff;
            padding: 8px 15px;
            text-align: left;
            letter-spacing: 1px;
            font-weight: 700;
            text-transform: uppercase;
            border-bottom: 2px solid var(--dark-brown);
        }

        .pricing-table th:last-child {
            text-align: right;
        }

        .pricing-table td {
            font-family: 'Open Sans', sans-serif;
            font-size: 14px;
            color: #000000;
            padding: 8px 15px;
            border-bottom: 1px solid #e8e0d5;
            font-weight: 600;
        }

        .pricing-table td:last-child {
            text-align: right;
            font-family: 'Montserrat', sans-serif;
            font-size: 14px;
            color: var(--forest-green);
            font-weight: 700;
        }

        .pricing-table .total-row td {
            font-family: 'Montserrat', sans-serif;
            font-size: 16px;
            color: #fff;
            font-weight: 700;
            padding: 12px 15px;
            background: var(--dark-brown);
        }

        .pricing-table .total-row td:last-child {
            color: var(--gold);
        }

        .included-section {
            margin-top: 20px;
            padding: 16px;
            background: #fff;
            border: 1px solid var(--tan);
            border-radius: 4px;
        }

        .included-title {
            font-family: 'Montserrat', sans-serif;
            font-size: 14px;
            color: var(--forest-green);
            letter-spacing: 2px;
            margin-bottom: 10px;
            text-transform: uppercase;
            font-weight: 700;
        }

        .included-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px;
        }

        .included-item {
            font-family: 'Open Sans', sans-serif;
            font-size: 13px;
            color: #000000;
            padding-left: 20px;
            position: relative;
            line-height: 1.4;
            font-weight: 600;
        }

        .included-item::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: var(--forest-green);
            font-weight: 700;
        }

        /* ========== BACK COVER ========== */
        .back-cover {
            width: 210mm;
            height: 297mm;
            position: relative;
            overflow: hidden;
        }

        .back-cover-bg {
            position: absolute;
            inset: 0;
            background: var(--forest-green) ${itinerary.cover_image ? `url('${escapeHtml(itinerary.cover_image)}')` : ''} center/cover;
        }

        .back-cover-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg,
                rgba(45,90,61,0.9) 0%,
                rgba(74,55,40,0.85) 100%);
        }

        .back-cover-content {
            position: relative;
            z-index: 2;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 60px;
        }

        .back-cover-logo {
            font-family: 'Montserrat', sans-serif;
            font-size: 18px;
            letter-spacing: 6px;
            color: var(--gold);
            margin-bottom: 50px;
            font-weight: 600;
        }

        .back-cover-title {
            font-family: 'Montserrat', sans-serif;
            font-size: 52px;
            color: #fff;
            font-weight: 900;
            letter-spacing: 3px;
            margin-bottom: 60px;
        }

        .contact-info {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .contact-item {
            font-family: 'Open Sans', sans-serif;
            font-size: 22px;
            color: rgba(255,255,255,0.95);
            font-weight: 600;
        }

        .contact-item strong {
            color: var(--gold);
            font-weight: 700;
        }

        @media print {
            .page { box-shadow: none !important; }
        }
    </style>
</head>
<body>

    <!-- PAGE 1: COVER -->
    <div class="page cover-page">
        <div class="cover-bg"></div>
        <div class="cover-overlay"></div>
        <div class="cover-content">
            <div class="cover-logo">${escapeHtml(itinerary.logo || 'Silverpine Bhutan')}</div>
            <div class="cover-title">${escapeHtml(itinerary.title).replace(/ /g, '<br>')}</div>
            ${itinerary.subtitle ? `<div class="cover-subtitle">${escapeHtml(itinerary.subtitle)}</div>` : ''}
            <div class="cover-divider">
                <div class="cover-divider-line"></div>
                <div class="cover-divider-diamond"></div>
                <div class="cover-divider-line"></div>
            </div>
            <div class="cover-guest">${escapeHtml(itinerary.guest_names)}</div>
            <div class="cover-dates">${formatDateRange()}</div>
        </div>
    </div>

    <!-- PAGE 2: LETTER -->
    <div class="page inner-page letter-page">
        <div class="running-header">
            <span>${escapeHtml(itinerary.logo || 'Silverpine Bhutan')}</span>
            <span>${escapeHtml(itinerary.title)}</span>
        </div>

        <div class="letter-header">
            <div class="letter-logo">${escapeHtml((itinerary.logo || 'Silverpine Bhutan').toUpperCase())}</div>
            <p class="letter-date">${escapeHtml(itinerary.letter_date || '')}</p>
        </div>

        ${itinerary.letter_salutation ? `<p class="letter-salutation">${escapeHtml(itinerary.letter_salutation)}</p>` : ''}

        ${(itinerary.letter_body || []).map((para: string) => `<p class="letter-body">${escapeHtml(para)}</p>`).join('')}

        ${itinerary.letter_signature_name || itinerary.letter_signature_title ? `
        <div class="letter-signature" style="margin-top: 25px; text-align: center;">
            ${itinerary.letter_signature_name ? `<p class="letter-sign-name">${escapeHtml(itinerary.letter_signature_name)}</p>` : ''}
            ${itinerary.letter_signature_title ? `<p class="letter-sign-title">${escapeHtml(itinerary.letter_signature_title)}</p>` : ''}
        </div>
        ` : ''}

        <div class="running-footer">
            <span>${escapeHtml(itinerary.logo || 'Silverpine Bhutan')}</span>
            <span>www.silverpinebhutan.com</span>
            <div class="page-number">2</div>
        </div>
    </div>

    ${generateSectionOpener(sectionOpeners[0], 3)}

    ${generateDaysPages(days, itinerary.logo || 'Silverpine Bhutan')}

    ${generatePricingPage(itinerary)}

    <!-- BACK COVER -->
    <div class="page back-cover">
        <div class="back-cover-bg"></div>
        <div class="back-cover-overlay"></div>
        <div class="back-cover-content">
            <div class="back-cover-logo">${escapeHtml((itinerary.logo || 'Silverpine Bhutan').toUpperCase())}</div>
            <div class="back-cover-title">JOURNEY AWAITS</div>
            <div class="contact-info">
                <div class="contact-item"><strong>Email:</strong> info@silverpinebhutan.com</div>
                <div class="contact-item"><strong>Phone:</strong> +975 77773737</div>
                <div class="contact-item"><strong>Website:</strong> www.silverpinebhutan.com</div>
                <div class="contact-item"><strong>Location:</strong> Thimphu, Bhutan</div>
            </div>
        </div>
    </div>

</body>
</html>`;
}

function generateSectionOpener(opener: SectionOpener | undefined, pageNum: number): string {
  if (!opener || !opener.background_image) return '';

  return `
    <!-- SECTION OPENER -->
    <div class="page" style="height: 297mm; position: relative; overflow: hidden;">
        <div style="position: absolute; inset: 0; background: url('${escapeHtml(opener.background_image)}') center/cover;"></div>
        <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(45,90,61,0.6) 0%, rgba(74,55,40,0.5) 100%);"></div>
        <div style="position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 60px;">
            <div style="font-family: 'Montserrat', sans-serif; font-size: 64px; color: #fff; font-weight: 900; text-shadow: 2px 2px 25px rgba(0,0,0,0.5); letter-spacing: 3px; line-height: 1.1;">${escapeHtml(opener.title).replace(/ /g, '<br>')}</div>
            ${opener.subtitle ? `<div style="font-family: 'Open Sans', sans-serif; font-size: 24px; color: rgba(255,255,255,0.9); font-weight: 600;">${escapeHtml(opener.subtitle)}</div>` : ''}
        </div>
        <div style="position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); width: 45px; height: 45px; background: #2d5a3d; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <span style="font-family: 'Montserrat', sans-serif; font-size: 20px; color: #fff; font-weight: 700;">${pageNum}</span>
        </div>
    </div>`;
}

function generateDaysPages(days: ItineraryDay[], logo: string): string {
  if (days.length === 0) return '';

  let pages = '';
  let currentPageNum = 4;
  const daysPerPage = 2;

  for (let i = 0; i < days.length; i += daysPerPage) {
    const pageDays = days.slice(i, i + daysPerPage);

    pages += `
    <div class="page inner-page">
        <div class="running-header">
            <span>${escapeHtml(logo)}</span>
            <span>Itinerary</span>
        </div>

        ${pageDays.map(day => generateDayHTML(day)).join('<div class="royal-divider"><div class="royal-divider-line"></div><div class="royal-divider-diamond"></div><div class="royal-divider-line"></div></div>')}

        <div class="running-footer">
            <span>${escapeHtml(logo)}</span>
            <span>www.silverpinebhutan.com</span>
            <div class="page-number">${currentPageNum}</div>
        </div>
    </div>`;

    currentPageNum++;
  }

  return pages;
}

function generateDayHTML(day: ItineraryDay): string {
  const metaItems = [];
  if (day.altitude) metaItems.push(`<strong>Alt:</strong> ${escapeHtml(day.altitude)}`);
  if (day.distance) metaItems.push(`<strong>Dist:</strong> ${escapeHtml(day.distance)}`);
  if (day.duration) metaItems.push(`<strong>Time:</strong> ${escapeHtml(day.duration)}`);
  if (day.high_point) metaItems.push(`<strong>High:</strong> ${escapeHtml(day.high_point)}`);

  const menuItems = [];
  if (day.breakfast) menuItems.push(`<li>Breakfast: ${escapeHtml(day.breakfast)}</li>`);
  if (day.lunch) menuItems.push(`<li>Lunch: ${escapeHtml(day.lunch)}</li>`);
  if (day.dinner) menuItems.push(`<li>Dinner: ${escapeHtml(day.dinner)}</li>`);
  if (day.snacks) menuItems.push(`<li>Snacks: ${escapeHtml(day.snacks)}</li>`);

  const highlights = (day.highlights || []).map(h => `<span>${escapeHtml(h)}</span>`).join('');

  return `
    <div class="day-section">
        <div class="day-header">
            <div class="day-number-circle"><span>${String(day.day_number).padStart(2, '0')}</span></div>
            <div class="day-title-block">
                <div class="day-title">${escapeHtml(day.title)}</div>
                ${day.subtitle ? `<div class="day-meta">${day.subtitle.split('•').map(s => `<div class="day-meta-item">${escapeHtml(s.trim())}</div>`).join('')}</div>` : ''}
                ${metaItems.length ? `<div class="day-meta">${metaItems.map(item => `<div class="day-meta-item">${item}</div>`).join('')}</div>` : ''}
            </div>
        </div>
        ${day.description || day.image_url ? `
        <div class="day-content">
            <div class="day-text">
                ${day.description ? `<p class="day-description ${day.drop_cap ? 'drop-cap' : ''}">${escapeHtml(day.description)}</p>` : ''}
                ${day.pull_quote ? `<div class="pull-quote">${escapeHtml(day.pull_quote)}</div>` : ''}
                ${menuItems.length ? `
                <div class="day-subsection">
                    <div class="day-subsection-title">Today's Menu</div>
                    <ul class="day-menu-list">${menuItems.join('')}</ul>
                </div>` : ''}
                ${(day.weather_text || day.temperature) ? `
                <div class="weather-badge">
                    <span>${escapeHtml(day.weather_text || '')}${day.weather_text && day.temperature ? ' / ' : ''}${escapeHtml(day.temperature || '')}</span>
                </div>` : ''}
                ${highlights ? `
                <div class="day-highlights">
                    <div class="day-highlights-title">Today's Highlights</div>
                    <div class="day-highlights-list">${highlights}</div>
                </div>` : ''}
            </div>
            ${day.image_url ? `
            <div class="day-image">
                <img src="${escapeHtml(day.image_url)}" alt="${escapeHtml(day.image_alt || day.title)}">
            </div>` : ''}
        </div>` : ''}
    </div>`;
}

function generatePricingPage(itinerary: Itinerary): string {
  const pricing = itinerary.pricing;
  const items = pricing?.items || [];
  const inclusions = pricing?.inclusions || [];
  const exclusions = pricing?.exclusions || [];

  return `
    <!-- PRICING PAGE -->
    <div class="page pricing-page">
        <div class="running-header">
            <span>${escapeHtml(itinerary.logo || 'Silverpine Bhutan')}</span>
            <span>${escapeHtml(itinerary.title)}</span>
        </div>

        <div class="pricing-header">
            <div class="pricing-label">Cost Details</div>
            <div class="pricing-title">${escapeHtml(itinerary.title)} Pricing</div>
        </div>

        ${pricing?.total ? `
        <div style="background: linear-gradient(135deg, #2d5a3d 0%, #4a3728 100%); padding: 18px 25px; border-radius: 8px; margin-bottom: 18px; text-align: center;">
            <div style="font-family: 'Montserrat', sans-serif; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #c9a961; margin-bottom: 6px; font-weight: 600;">${escapeHtml(pricing.total_label || 'Total')}</div>
            <div style="font-family: 'Montserrat', sans-serif; font-size: 38px; color: #fff; font-weight: 900; letter-spacing: 2px; line-height: 1;">${escapeHtml(pricing.symbol || '$')}${escapeHtml(pricing.total)}</div>
        </div>` : ''}

        ${items.length ? `
        <table class="pricing-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th style="text-align: right;">Amount</th>
                </tr>
            </thead>
            <tbody>
                ${items.map(item => `
                <tr>
                    <td>${escapeHtml(item.label)}${item.description ? `<br><small style="font-size: 12px; color: #666;">${escapeHtml(item.description)}</small>` : ''}</td>
                    <td style="text-align: right; font-weight: 700;">${escapeHtml(item.amount)}</td>
                </tr>`).join('')}
                ${pricing?.total ? `
                <tr class="total-row">
                    <td style="color: #fff;">Total</td>
                    <td style="text-align: right; color: #c9a961; font-size: 18px; font-weight: 700;">${escapeHtml(pricing.symbol || '$')}${escapeHtml(pricing.total)}</td>
                </tr>` : ''}
            </tbody>
        </table>` : ''}

        ${inclusions.length ? `
        <div class="included-section">
            <div class="included-title">What's Included</div>
            <div class="included-grid">
                ${inclusions.map(item => `<div class="included-item">${escapeHtml(item)}</div>`).join('')}
            </div>
        </div>` : ''}

        ${exclusions.length ? `
        <div style="margin-top: 15px; padding: 12px; background: linear-gradient(135deg, rgba(139,21,56,0.08), rgba(139,21,56,0.03)); border-left: 3px solid #8b1538; border-radius: 0 6px 6px 0;">
            <div style="font-family: 'Montserrat', sans-serif; font-size: 11px; color: #8b1538; font-weight: 700; margin-bottom: 4px;">Exclusions</div>
            <div style="font-size: 11px; color: #000; font-weight: 600; line-height: 1.4;">
                ${exclusions.map(e => escapeHtml(e)).join(' • ')}
            </div>
        </div>` : ''}

        <div class="running-footer">
            <span>${escapeHtml(itinerary.logo || 'Silverpine Bhutan')}</span>
            <span>www.silverpinebhutan.com</span>
            <div class="page-number">${999}</div>
        </div>
    </div>`;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
