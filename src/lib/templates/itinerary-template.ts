/**
 * Itinerary Template Generator
 * Generates HTML itinerary templates based on data
 * Based on the Sekhar family itinerary sample
 */

import { getCompanySettings } from '@/lib/hooks/useCompanySettings';

export interface ItineraryDay {
  day: number;
  title: string;
  date: string;
  activity?: string;
  night: string;
  description: string;
  image_url?: string;
  schedule?: string[];
  highlights?: string[];
  meals?: string[];
  subsections?: {
    title: string;
    items: string[];
  }[];
}

export interface ItineraryData {
  // Cover Information
  title: string;
  subtitle?: string;
  guest_name: string;
  duration_days: number;
  duration_nights: number;
  start_date: string;
  end_date: string;
  destinations?: string[];
  cover_image_url?: string;

  // Letter Section
  letter_date?: string;
  letter_salutation?: string;
  letter_body: string[];
  letter_highlights?: {
    title: string;
    points: string[];
  };
  letter_signature_name?: string;
  letter_signature_title?: string;

  // Flight Details
  flight_details?: {
    departure_flight?: string;
    departure_time?: string;
    departure_city?: string;
    arrival_flight?: string;
    arrival_time?: string;
    arrival_city?: string;
  };

  // Itinerary Days
  days: ItineraryDay[];

  // Pricing
  total_price: number;
  currency?: string;
  price_inclusions?: {
    title: string;
    description: string;
  }[];
  inclusions_list?: string[];
  exclusions?: string[];
  payment_terms?: string[];

  // Terms & Conditions
  terms?: {
    title: string;
    content: string;
  }[];

  // Packing Checklist
  packing_checklist?: {
    category: string;
    items: string[];
  }[];

  // Contact Information
  contact_phone?: string;
  contact_email?: string;
  contact_website?: string;
}

export async function generateItineraryHTML(data: ItineraryData): Promise<string> {
  // Fetch company settings
  const settings = await getCompanySettings();

  // Format dates for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const formattedStartDate = formatDate(data.start_date);
  const formattedEndDate = formatDate(data.end_date);
  const letterDate = data.letter_date || new Date(data.start_date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  // Use company settings with fallbacks
  const companyName = settings?.company_name || 'HIMALAYAN MARVELS';
  const companyLogo = settings?.logo_url || '';
  const companyLicense = settings?.license_number || '';
  const companyPhone = settings?.mobile || data.contact_phone || '+975 17111111';
  const companyEmail = settings?.email || data.contact_email || 'info@himalayanmarvels.com';
  const companyWebsite = settings?.website || data.contact_website || 'www.himalayanmarvels.com';
  const companyAddress = settings?.address || 'Thimphu, Bhutan';
  const companyTagline = 'Tours & Treks';

  // Build letter body paragraphs
  const letterBodyParagraphs = data.letter_body.map(paragraph =>
    `        <p class="letter-body">${paragraph}</p>`
  ).join('\n');

  // Build letter highlights
  let letterHighlightsHTML = '';
  if (data.letter_highlights) {
    letterHighlightsHTML = `
        <div class="response-box">
            <div class="response-title">${data.letter_highlights.title}</div>
            ${data.letter_highlights.points.map(point => `<p>${point}</p>`).join('')}
        </div>`;
  }

  // Build flight details section
  let flightDetailsHTML = '';
  if (data.flight_details) {
    const fd = data.flight_details;
    flightDetailsHTML = `
            <div class="flight-card">
                <div class="flight-card-title">Flight Details</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    ${fd.departure_flight ? `
                    <div>
                        <div class="flight-label">Departure Flight</div>
                        <div class="flight-value">${fd.departure_flight}</div>
                        <div class="flight-meta">${fd.departure_city || 'Bangalore'} → ${fd.departure_time || '05:30'}</div>
                    </div>
                    ` : ''}
                    ${fd.arrival_flight ? `
                    <div>
                        <div class="flight-label">Return Flight</div>
                        <div class="flight-value">${fd.arrival_flight}</div>
                        <div class="flight-meta">${fd.arrival_city || 'Bagdogra'} → ${fd.arrival_time || '13:20'}</div>
                    </div>
                    ` : ''}
                </div>
            </div>`;
  }

  // Build day sections
  let currentPage = 5; // Start days from page 5 (after cover, letter, family info, section opener)
  let daysHTML = '';

  // Add section opener before first day
  daysHTML += `
    <!-- PAGE ${currentPage++}: SECTION OPENER -->
    <div class="page section-opener">
        <div class="opener-bg" style="background-image: url('${data.days[0]?.image_url || 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291879/tiger-nest-close_rm2bee.jpg'}');"></div>
        <div class="opener-overlay"></div>
        <div class="opener-content">
            <div class="opener-section">Itinerary</div>
            <div class="opener-title">BHUTAN<br>DISCOVERY</div>
            <div class="opener-subtitle">Your Journey Awaits</div>
        </div>
        <div class="opener-page-num">${currentPage - 1}</div>
    </div>
`;

  data.days.forEach((day, index) => {
    const scheduleItems = day.schedule?.map(item =>
      `                            <li>${item}</li>`
    ).join('\n') || '';

    const highlightsList = day.highlights?.map(h =>
      `                            <span>${h}</span>`
    ).join('\n') || '';

    const mealsList = day.meals?.map(meal =>
      `                            <li>${meal}</li>`
    ).join('\n') || '';

    const subsectionsHTML = day.subsections?.map(sub => `
                    <div class="day-subsection">
                        <div class="day-subsection-title">${sub.title}</div>
                        <ul class="day-menu-list">
                            ${sub.items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>`
    ).join('\n') || '';

    // Add section opener for certain days
    if (index === 2 || index === 5 || index === data.days.length - 1) {
      daysHTML += `
    <!-- PAGE ${currentPage++}: SECTION OPENER -->
    <div class="page section-opener">
        <div class="opener-bg" style="background-image: url('${day.image_url || 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291902/buddha-point-view_skbl41.jpg'}');"></div>
        <div class="opener-overlay"></div>
        <div class="opener-content">
            <div class="opener-section">Itinerary</div>
            <div class="opener-title">${day.title.split('•')[0].trim().toUpperCase()}<br>DISCOVERY</div>
            <div class="opener-subtitle">${day.activity || 'Exploration Day'}</div>
        </div>
        <div class="opener-page-num">${currentPage - 1}</div>
    </div>
`;
    }

    daysHTML += `
    <!-- PAGE ${currentPage++}: DAY ${day.day} -->
    <div class="page inner-page">
        <div class="running-header">
            <span>${companyName}</span>
            <span>${data.title.toUpperCase()}</span>
        </div>

        <!-- DAY ${day.day} -->
        <div class="day-section">
            <div class="day-header">
                <div class="day-number-circle"><span>${String(day.day).padStart(2, '0')}</span></div>
                <div class="day-title-block">
                    <div class="day-title">${day.title}</div>
                    <div class="day-meta">
                        <div class="day-meta-item"><strong>Date:</strong> ${day.date}</div>
                        ${day.activity ? `<div class="day-meta-item"><strong>Activity:</strong> ${day.activity}</div>` : ''}
                        <div class="day-meta-item"><strong>Night:</strong> ${day.night}</div>
                    </div>
                </div>
            </div>
            <div class="day-content">
                <div class="day-text">
                    <p class="day-description drop-cap">${day.description}</p>
                    ${day.image_url ? `
                    <div style="margin: 12px 0;">
                        <img src="${day.image_url}" alt="${day.title ? `Day ${day.day}: ${day.title}` : `Day ${day.day}`}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 4px;">
                    </div>
                    ` : ''}
                    ${scheduleItems ? `
                    <div class="day-subsection">
                        <div class="day-subsection-title">Today's Schedule</div>
                        <ul class="day-menu-list">
                            ${scheduleItems}
                        </ul>
                    </div>
                    ` : ''}
                    ${mealsList ? `
                    <div class="day-subsection">
                        <div class="day-subsection-title">Today's Menu</div>
                        <ul class="day-menu-list">
                            ${mealsList}
                        </ul>
                    </div>
                    ` : ''}
                    ${subsectionsHTML}
                    ${highlightsList ? `
                    <div class="day-highlights">
                        <div class="day-highlights-title">Today's Highlights</div>
                        <div class="day-highlights-list">
                            ${highlightsList}
                        </div>
                    </div>
                    ` : ''}
                </div>
                ${day.image_url ? `
                <div class="day-image">
                    <img src="${day.image_url}" alt="${day.title}">
                </div>
                ` : ''}
            </div>
        </div>

        <div class="running-footer">
            <span>${companyName}</span>
            <span>${companyWebsite}</span>
            <div class="page-number">${currentPage - 1}</div>
        </div>
    </div>
`;
  });

  // Build pricing page
  const priceInclusionsHTML = data.price_inclusions?.map(inc => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                <div>
                    <div style="font-family: 'Montserrat', sans-serif; font-size: 13px; color: var(--forest-green); font-weight: 700;">${inc.title}</div>
                    <div style="font-size: 11px; color: #666; margin-top: 3px;">${inc.description}</div>
                </div>
                <div style="font-family: 'Montserrat', sans-serif; font-size: 14px; color: var(--dark-brown); font-weight: 700;">✓</div>
            </div>`).join('\n') || '';

  const inclusionsListHTML = data.inclusions_list?.map(inc =>
    `                <div style="font-size: 11px; color: #000; font-weight: 600;">✓ ${inc}</div>`
  ).join('\n') || '';

  const paymentTermsHTML = data.payment_terms?.map(term =>
    `                <li style="margin-bottom: 6px;">${term}</li>`
  ).join('\n') || '';

  // Build terms page
  const termsCardsHTML = data.terms?.map(term => `
            <div class="terms-card">
                <div class="terms-title">${term.title}</div>
                <p class="terms-text">${term.content}</p>
            </div>`).join('\n') || '';

  // Build checklist page
  let checklistHTML = '';
  if (data.packing_checklist && data.packing_checklist.length > 0) {
    const checklist = data.packing_checklist;
    checklistHTML = checklist.map((section, index) => `
        <div class="checklist-section" ${index > 0 ? 'style="margin-top: 15px;"' : ''}>
            <div class="checklist-title">${section.category}</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <ul class="checklist-list">
                    ${section.items.slice(0, Math.ceil(section.items.length / 2)).map(item => `<li>${item}</li>`).join('')}
                </ul>
                <ul class="checklist-list">
                    ${section.items.slice(Math.ceil(section.items.length / 2)).map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        </div>`).join('\n');
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title} | ${data.guest_name} | ${data.duration_days} Days</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Open+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap');

        /* EARTH TONE COLOR PALETTE */
        :root {
            --forest-green: #2d5a3d;
            --warm-brown: #8b7355;
            --tan: #a0826d;
            --cream: #faf8f5;
            --beige: #f5f1e8;
            --dark-brown: #4a3728;
            --sage: #7a8b7a;
            --gold: #c9a961;
            --burgundy: #8b1538;
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

        /* ========== RUNNING HEADER ========== */
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
            background: url('${data.cover_image_url || 'https://res.cloudinary.com/dxztrqjft/image/upload/v1776291879/tiger-nest-close_rm2bee.jpg'}') center/cover;
        }

        .cover-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg,
                rgba(45,90,61,0.60) 0%,
                rgba(45,90,61,0.35) 40%,
                rgba(74,55,40,0.50) 100%);
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

        /* ========== SECTION OPENER ========== */
        .section-opener {
            width: 210mm;
            height: 297mm;
            position: relative;
            overflow: hidden;
        }

        .opener-bg {
            position: absolute;
            inset: 0;
            background-size: cover;
            background-position: center;
        }

        .opener-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg,
                rgba(45,90,61,0.50) 0%,
                rgba(45,90,61,0.25) 50%,
                rgba(74,55,40,0.45) 100%);
        }

        .opener-content {
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

        .opener-section {
            font-family: 'Montserrat', sans-serif;
            font-size: 10px;
            letter-spacing: 4px;
            color: var(--gold);
            text-transform: uppercase;
            margin-bottom: 30px;
            font-weight: 600;
        }

        .opener-title {
            font-family: 'Montserrat', sans-serif;
            font-size: 64px;
            color: #fff;
            font-weight: 900;
            text-shadow: 2px 2px 25px rgba(0,0,0,0.5);
            letter-spacing: 3px;
            line-height: 1.1;
            margin-bottom: 20px;
        }

        .opener-subtitle {
            font-family: 'Open Sans', sans-serif;
            font-size: 24px;
            color: rgba(255,255,255,0.9);
            font-weight: 600;
        }

        .opener-page-num {
            position: absolute;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            width: 45px;
            height: 45px;
            background: var(--forest-green);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Montserrat', sans-serif;
            font-size: 20px;
            color: #fff;
            font-weight: 700;
        }

        /* ========== INNER PAGE ========== */
        .inner-page {
            padding: 55px 40px 105px;
            min-height: 297mm;
            display: flex;
            flex-direction: column;
        }

        /* ========== LETTER PAGE ========== */
        .letter-header {
            text-align: center;
            margin: 60px 0 40px;
            padding-bottom: 25px;
            border-bottom: 2px solid var(--forest-green);
        }

        .letter-logo {
            font-family: 'Montserrat', sans-serif;
            font-size: 16px;
            letter-spacing: 4px;
            color: var(--forest-green);
            text-transform: uppercase;
            font-weight: 800;
            margin-bottom: 12px;
        }

        .letter-date {
            font-family: 'Open Sans', sans-serif;
            font-size: 12px;
            color: var(--warm-brown);
            text-weight: 600;
        }

        .letter-salutation {
            font-family: 'Open Sans', sans-serif;
            font-size: 14px;
            color: var(--forest-green);
            font-weight: 700;
            margin-bottom: 15px;
        }

        .letter-body {
            font-family: 'Open Sans', sans-serif;
            font-size: 13px;
            color: #000000;
            line-height: 1.5;
            margin-bottom: 12px;
            text-align: justify;
        }

        .letter-signature {
            text-align: center;
            margin-top: 25px;
        }

        .letter-sign-name {
            font-family: 'Open Sans', sans-serif;
            font-size: 14px;
            color: var(--forest-green);
            font-weight: 700;
            margin-bottom: 2px;
        }

        .letter-sign-title {
            font-family: 'Open Sans', sans-serif;
            font-size: 11px;
            color: var(--warm-brown);
        }

        .response-box {
            background: linear-gradient(135deg, rgba(45,90,61,0.06), rgba(160,130,109,0.04));
            padding: 12px 16px;
            border-radius: 0 8px 8px 0;
            margin: 12px 0;
            border-left: 3px solid var(--forest-green);
        }

        .response-title {
            font-family: 'Montserrat', sans-serif;
            font-size: 14px;
            color: var(--forest-green);
            font-weight: 700;
            margin-bottom: 8px;
        }

        .response-box p {
            font-family: 'Open Sans', sans-serif;
            font-size: 13px;
            color: #000000;
            line-height: 1.4;
            margin-bottom: 6px;
            font-weight: 600;
        }

        /* ========== FAMILY INFO ========== */
        .family-info-box {
            background: linear-gradient(135deg, rgba(45,90,61,0.05), rgba(160,130,109,0.03));
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 15px;
        }

        .family-info-title {
            font-family: 'Montserrat', sans-serif;
            font-size: 12px;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: var(--forest-green);
            font-weight: 700;
            margin-bottom: 12px;
        }

        .family-info-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
        }

        .family-info-item {
            background: #fff;
            padding: 12px;
            border-radius: 4px;
            text-align: center;
        }

        .family-info-label {
            font-size: 10px;
            color: var(--warm-brown);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 4px;
            font-weight: 600;
        }

        .family-info-value {
            font-family: 'Montserrat', sans-serif;
            font-size: 14px;
            color: var(--forest-green);
            font-weight: 700;
        }

        .flight-card {
            background: #fff;
            padding: 15px;
            border-radius: 8px;
            border: 2px solid var(--gold);
        }

        .flight-card-title {
            font-family: 'Montserrat', sans-serif;
            font-size: 12px;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: var(--forest-green);
            margin-bottom: 12px;
            font-weight: 700;
        }

        .flight-label {
            font-size: 10px;
            color: var(--warm-brown);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 4px;
            font-weight: 600;
        }

        .flight-value {
            font-family: 'Montserrat', sans-serif;
            font-size: 16px;
            color: var(--forest-green);
            font-weight: 700;
        }

        .flight-meta {
            font-size: 11px;
            color: #666;
            margin-top: 2px;
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

        /* ========== PULL QUOTE ========== */
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

        /* ========== TERMS ========== */
        .terms-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin: 12px 0;
        }

        .terms-card {
            background: #fff;
            padding: 12px;
            border-radius: 4px;
            border: 1px solid var(--tan);
        }

        .terms-title {
            font-family: 'Montserrat', sans-serif;
            font-size: 14px;
            color: var(--forest-green);
            font-weight: 700;
            margin-bottom: 8px;
        }

        .terms-text {
            font-family: 'Open Sans', sans-serif;
            font-size: 12px;
            color: #000000;
            line-height: 1.4;
            font-weight: 600;
        }

        /* ========== CHECKLIST ========== */
        .checklist-section {
            margin-top: 10px;
            padding: 10px;
            background: linear-gradient(135deg, rgba(45,90,61,0.05), rgba(160,130,109,0.03));
            border-radius: 8px;
        }

        .checklist-title {
            font-family: 'Montserrat', sans-serif;
            font-size: 14px;
            color: var(--forest-green);
            font-weight: 700;
            margin-bottom: 6px;
        }

        .checklist-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 18px;
        }

        .checklist-category-title {
            font-family: 'Montserrat', sans-serif;
            font-size: 11px;
            color: var(--forest-green);
            font-weight: 700;
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .checklist-list {
            list-style: none;
        }

        .checklist-list li {
            font-family: 'Open Sans', sans-serif;
            font-size: 12px;
            color: #000000;
            margin-bottom: 4px;
            padding-left: 16px;
            position: relative;
            font-weight: 600;
        }

        .checklist-list li::before {
            content: '☐';
            position: absolute;
            left: 0;
            color: var(--forest-green);
            font-size: 10px;
        }

        /* ========== BACK COVER ========== */
        .back-cover {
            position: relative;
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
            color: #fff;
            text-transform: uppercase;
            font-weight: 800;
            margin-bottom: 15px;
        }

        .back-cover-tagline {
            font-family: 'Open Sans', sans-serif;
            font-size: 14px;
            color: var(--gold);
            font-weight: 600;
            margin-bottom: 30px;
            letter-spacing: 2px;
        }

        .back-cover-contact {
            font-family: 'Open Sans', sans-serif;
            font-size: 12px;
            color: #fff;
            line-height: 1.8;
            font-weight: 600;
        }

        .back-cover-contact a {
            color: var(--gold);
            text-decoration: none;
        }

        @media print {
            body {
                background: #fff;
            }
            .page {
                box-shadow: none;
            }
        }
    </style>
</head>
<body>

    <!-- PAGE 1: COVER -->
    <div class="page cover-page">
        <div class="cover-bg"></div>
        <div class="cover-overlay"></div>
        <div class="cover-content">
            ${companyLogo ? `
            <div style="margin-bottom: 60px;">
                <img src="${companyLogo}" alt="${companyName}" style="max-width: 200px; height: auto;">
            </div>
            ` : `
            <div class="cover-logo">${companyName}</div>
            `}
            <div class="cover-title">${data.title.toUpperCase().replace(/ /g, '<br>')}</div>
            ${data.subtitle ? `<div class="cover-subtitle">${data.subtitle}</div>` : ''}
            <div class="cover-divider">
                <div class="cover-divider-line"></div>
                <div class="cover-divider-diamond"></div>
                <div class="cover-divider-line"></div>
            </div>
            <div class="cover-guest">${data.guest_name}</div>
            <div class="cover-dates">${formattedStartDate} – ${formattedEndDate}</div>
        </div>
    </div>

    <!-- PAGE 2: LETTER -->
    <div class="page inner-page letter-page">
        <div class="running-header">
            <span>${companyName}</span>
            <span>${data.title.toUpperCase()}</span>
        </div>

        <div class="letter-header">
            ${companyLogo ? `
            <div style="margin-bottom: 15px;">
                <img src="${companyLogo}" alt="${companyName}" style="max-width: 150px; height: auto;">
            </div>
            ` : `
            <div class="letter-logo">${companyName}</div>
            `}
            <p class="letter-date">${letterDate}</p>
        </div>

        <p class="letter-salutation">Namaste, ${data.guest_name}</p>

${letterBodyParagraphs}

${letterHighlightsHTML}

        <div class="letter-signature" style="margin-top: 25px; text-align: center;">
            <p style="font-size: 11px; letter-spacing: 3px; color: #2d5a3d; text-transform: uppercase; margin-bottom: 8px;">${companyName}</p>
            <p class="letter-sign-name">${data.letter_signature_name || 'Tshering Lhamo'}</p>
            <p class="letter-sign-title">${data.letter_signature_title || 'COO'}</p>
        </div>

        <div class="running-footer">
            <span>${companyName}</span>
            <span>${companyWebsite} | ${companyPhone}</span>
            <div class="page-number">2</div>
        </div>
    </div>

    <!-- PAGE 3: FAMILY INFO & FLIGHT DETAILS -->
    <div class="page inner-page">
        <div class="running-header">
            <span>${companyName}</span>
            <span>${data.title.toUpperCase()}</span>
        </div>

        <div class="letter-header">
            <div class="pricing-label">Booking Details</div>
            <div class="pricing-title">Family Profile & Travel</div>
        </div>

        <div class="family-info-box">
            <div class="family-info-title">Traveling Party</div>
            <div class="family-info-grid">
                <div class="family-info-item">
                    <div class="family-info-label">Guest Family</div>
                    <div class="family-info-value">${data.guest_name}</div>
                </div>
                <div class="family-info-item">
                    <div class="family-info-label">Duration</div>
                    <div class="family-info-value">${data.duration_days} Days / ${data.duration_nights} Nights</div>
                </div>
                <div class="family-info-item">
                    <div class="family-info-label">Travel Dates</div>
                    <div class="family-info-value">${formattedStartDate}-${new Date(data.end_date).getDate()}, ${new Date(data.end_date).getFullYear()}</div>
                </div>
            </div>
        </div>

${flightDetailsHTML}

        <div class="running-footer">
            <span>HIMALAYAN MARVELS</span>
            <span>${data.contact_website || 'www.himalayanmarvels.com'}</span>
            <div class="page-number">3</div>
        </div>
    </div>

${daysHTML}

    <!-- PAGE ${currentPage++}: PRICING -->
    <div class="page inner-page pricing-page">
        <div class="running-header">
            <span>${companyName}</span>
            <span>${data.title.toUpperCase()}</span>
        </div>

        <div class="pricing-header" style="margin-bottom: 20px;">
            <div class="pricing-label">Cost Details</div>
            <div class="pricing-title">Package Pricing</div>
        </div>

        <div style="background: linear-gradient(135deg, #2d5a3d 0%, #4a3728 100%); padding: 18px 25px; border-radius: 8px; margin-bottom: 18px; text-align: center;">
            <div style="font-family: 'Montserrat', sans-serif; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--gold); margin-bottom: 6px; font-weight: 600;">Premium Package</div>
            <div style="font-family: 'Montserrat', sans-serif; font-size: 28px; color: #fff; font-weight: 700; margin-top: 6px;">${data.currency || '₹'} ${data.total_price.toLocaleString('en-IN')} ${data.currency === 'USD' ? 'USD' : 'INR'}</div>
            <div style="font-family: 'Open Sans', sans-serif; font-size: 11px; color: rgba(255,255,255,0.9); margin-top: 6px; font-weight: 600;">Total Package Price</div>
        </div>

        <div style="background: #fff; border: 2px solid var(--gold); border-radius: 8px; padding: 15px; margin-bottom: 15px;">
            <div style="font-family: 'Montserrat', sans-serif; font-size: 12px; color: var(--forest-green); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; font-weight: 700; text-align: center;">Package Inclusions</div>

${priceInclusionsHTML}
        </div>

        <div style="margin-top: 15px; padding-top: 12px; border-top: 2px solid #2d5a3d;">
            <div style="font-family: 'Montserrat', sans-serif; font-size: 12px; color: #2d5a3d; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">What's Included</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
${inclusionsListHTML}
            </div>
        </div>

        ${paymentTermsHTML ? `
        <div style="margin-top: 15px; padding: 12px; background: linear-gradient(135deg, rgba(45,90,61,0.05), rgba(160,130,109,0.03)); border-radius: 8px;">
            <div style="font-family: 'Montserrat', sans-serif; font-size: 12px; color: #2d5a3d; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">Payment Terms</div>
            <ul style="font-family: 'Open Sans', sans-serif; font-size: 11px; color: #000; line-height: 1.4;">
${paymentTermsHTML}
            </ul>
        </div>
        ` : ''}

        <div class="running-footer">
            <span>${companyName}</span>
            <span>${companyWebsite}</span>
            <div class="page-number">${currentPage - 1}</div>
        </div>
    </div>

    <!-- PAGE ${currentPage++}: TERMS -->
    <div class="page inner-page">
        <div class="running-header">
            <span>${companyName}</span>
            <span>${data.title.toUpperCase()}</span>
        </div>

        <div class="pricing-header">
            <div class="pricing-label">Important Information</div>
            <div class="pricing-title">Terms & Conditions</div>
        </div>

        <div class="terms-grid">
${termsCardsHTML}
        </div>

        <div class="running-footer">
            <span>${companyName}</span>
            <span>${companyWebsite}</span>
            <div class="page-number">${currentPage - 1}</div>
        </div>
    </div>

    <!-- PAGE ${currentPage++}: CHECKLIST -->
    <div class="page inner-page">
        <div class="running-header">
            <span>${companyName}</span>
            <span>${data.title.toUpperCase()}</span>
        </div>

        <div class="pricing-header">
            <div class="pricing-label">Prepare for Your Journey</div>
            <div class="pricing-title">Packing Checklist</div>
        </div>

${checklistHTML}

        <div class="running-footer">
            <span>${companyName}</span>
            <span>${companyWebsite}</span>
            <div class="page-number">${currentPage - 1}</div>
        </div>
    </div>

    <!-- PAGE ${currentPage}: BACK COVER -->
    <div class="page cover-page">
        <div class="cover-bg"></div>
        <div class="cover-overlay"></div>
        <div class="back-cover">
            ${companyLogo ? `
            <div style="margin-bottom: 30px;">
                <img src="${companyLogo}" alt="${companyName}" style="max-width: 250px; height: auto;">
            </div>
            ` : `
            <div class="back-cover-logo">${companyName}</div>
            `}
            <div class="back-cover-tagline">${companyTagline}</div>
            <div class="back-cover-contact">
                ${companyAddress}<br><br>
                <a href="mailto:${companyEmail}">${companyEmail}</a><br>
                ${companyPhone}<br><br>
                <a href="https://${companyWebsite.replace(/^https?:\/\//, '')}" target="_blank">${companyWebsite.replace(/^https?:\/\//, '')}</a>
            </div>
        </div>
    </div>

</body>
</html>`;
}
