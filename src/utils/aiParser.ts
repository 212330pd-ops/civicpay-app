import { INITIAL_MOCK_BILLS, SERVICE_METADATA } from '../data/mockBills';
import { BillItem, ParsedBillResult, ServiceType } from '../types';

export interface ParseOptions {
  bills: BillItem[];
}

export function detectServiceType(input: string): ServiceType {
  const text = input.toLowerCase();
  
  // Electricity checks (Amharic & English)
  if (
    text.includes('መብራት') ||
    text.includes('ኤሌክትሪክ') ||
    text.includes('eeu') ||
    text.includes('electric') ||
    text.includes('power') ||
    text.includes('ቆጣሪ')
  ) {
    return 'electricity';
  }

  // Water checks
  if (
    text.includes('ውሃ') ||
    text.includes('ውሀ') ||
    text.includes('aawsa') ||
    text.includes('water') ||
    text.includes('ፍሳሽ')
  ) {
    return 'water';
  }

  // Traffic fine checks
  if (
    text.includes('ትራፊክ') ||
    text.includes('ቅጣት') ||
    text.includes('መንጃ') ||
    text.includes('ሰሌዳ') ||
    text.includes('traffic') ||
    text.includes('fine') ||
    text.includes('penalty')
  ) {
    return 'traffic';
  }

  // Property Tax checks
  if (
    text.includes('ታክስ') ||
    text.includes('ግብር') ||
    text.includes('ቤት') ||
    text.includes('መሬት') ||
    text.includes('tax') ||
    text.includes('property') ||
    text.includes('land')
  ) {
    return 'property_tax';
  }

  // Telecom checks
  if (
    text.includes('ቴሌኮም') ||
    text.includes('ቴሌ') ||
    text.includes('ስልክ') ||
    text.includes('telecom') ||
    text.includes('ethio') ||
    text.includes('wifi') ||
    text.includes('ኢንተርኔት')
  ) {
    return 'telecom';
  }

  return 'electricity'; // default fallback
}

export function extractAccountNumber(input: string): string | null {
  // Check for traffic plate format (e.g., AA-2-B49102, 2-B-12345, AA-12345)
  const plateMatch = input.match(/[A-Za-z0-9]{2,3}[- ]?[0-9]{1,2}[- ]?[A-Za-z0-9]{4,6}/i);
  if (plateMatch && plateMatch[0].length >= 5) {
    return plateMatch[0].toUpperCase().replace(/\s+/g, '-');
  }

  // Check for tax code format (e.g., TAX-BL-2024-91, BL-TAX-2024)
  const taxMatch = input.match(/[A-Za-z]{2,4}[- ]?(?:TAX|BL)[- ]?[0-9]{3,6}/i);
  if (taxMatch) {
    return taxMatch[0].toUpperCase().replace(/\s+/g, '-');
  }

  // Check for numeric account / meter numbers (e.g., 6 to 12 digits)
  const numMatch = input.match(/\b\d{6,12}\b/);
  if (numMatch) {
    return numMatch[0];
  }

  // Check for any number >= 4 digits
  const fallbackNum = input.match(/\b\d{4,}\b/);
  if (fallbackNum) {
    return fallbackNum[0];
  }

  return null;
}

export async function parseQueryWithAI(
  rawInput: string,
  existingBills: BillItem[] = INITIAL_MOCK_BILLS
): Promise<ParsedBillResult> {
  const query = rawInput.trim();
  const serviceType = detectServiceType(query);
  const detectedAcc = extractAccountNumber(query);
  const meta = SERVICE_METADATA[serviceType];

  // 1. First, check if there is an exact or partial match in existing saved bills
  let matchedBill = existingBills.find(
    (b) => detectedAcc && b.accountNumber.toLowerCase().includes(detectedAcc.toLowerCase())
  );

  // If no direct account number, look if service matches any bill
  if (!matchedBill && !detectedAcc) {
    matchedBill = existingBills.find((b) => b.serviceType === serviceType && b.status === 'unpaid') ||
      existingBills.find((b) => b.serviceType === serviceType);
  }

  // Simulate AI latency (300ms - 600ms) for realistic processing feel
  await new Promise((res) => setTimeout(res, 450));

  if (matchedBill) {
    return {
      serviceType: matchedBill.serviceType,
      serviceNameAm: meta.nameAm,
      serviceNameEn: meta.nameEn,
      accountNumber: matchedBill.accountNumber,
      customerName: matchedBill.customerName,
      amountDue: matchedBill.amountDue,
      status: matchedBill.status,
      dueDate: matchedBill.dueDate,
      dueDateAmharic: matchedBill.dueDateAmharic,
      providerAm: meta.providerAm,
      providerEn: meta.providerEn,
      breakdown: matchedBill.breakdown,
      confidence: 0.98,
      extractedQuery: query,
      timestamp: new Date().toISOString(),
    };
  }

  // 2. If it's a new or customized account number not in database, dynamically generate authentic Ethiopian civic bill record
  const accNumber = detectedAcc || `${Math.floor(10000000 + Math.random() * 90000000)}`;
  
  let amount = 0;
  let breakdown: { labelAm: string; labelEn: string; value: string | number }[] = [];
  const customerNames = [
    'ዮናስ ታደሰ ክፍሌ (Yonas Tadesse)',
    'ማርታ ወርቁ ኃይሌ (Marta Worku)',
    'አብዱልከሪም ጀማል (Abdulkerim Jemal)',
    'ብርሃኑ ተፈራ (Birhanu Tefera)',
    'ሄለን ግርማ (Helen Girma)',
    'ሰለሞን አበበ (Solomon Abebe)',
  ];
  const customerName = customerNames[Math.floor(Math.random() * customerNames.length)];

  switch (serviceType) {
    case 'electricity': {
      const kwh = Math.floor(180 + Math.random() * 220);
      const baseTariff = 2.45;
      const energyCharge = Number((kwh * baseTariff).toFixed(2));
      const vat = Number((energyCharge * 0.15).toFixed(2));
      amount = Number((energyCharge + vat + 45).toFixed(2));
      breakdown = [
        { labelAm: 'የተጠቃሚ ኃይል', labelEn: 'Energy Consumption', value: `${kwh} kWh` },
        { labelAm: 'የታሪፍ ተመን', labelEn: 'Tariff Rate', value: `${baseTariff} ETB/kWh` },
        { labelAm: 'የቆጣሪ አገልግሎት', labelEn: 'Meter Service Fee', value: '45.00 ETB' },
        { labelAm: 'ተ.እ.ታ (VAT 15%)', labelEn: 'VAT (15%)', value: `${vat} ETB` },
      ];
      break;
    }
    case 'water': {
      const m3 = (12 + Math.random() * 15).toFixed(1);
      const waterCharge = Number((Number(m3) * 14.5).toFixed(2));
      const sewer = 38.0;
      amount = Number((waterCharge + sewer + 25).toFixed(2));
      breakdown = [
        { labelAm: 'የውሃ ፍጆታ መጠን', labelEn: 'Water Volume', value: `${m3} m³` },
        { labelAm: 'የፍሳሽ ማስወገጃ ሂሳብ', labelEn: 'Sewerage Charge', value: `${sewer.toFixed(2)} ETB` },
        { labelAm: 'የቆጣሪ ጥገና መዋጮ', labelEn: 'Maintenance Levy', value: '25.00 ETB' },
      ];
      break;
    }
    case 'traffic': {
      const fines = [500, 800, 1000, 1200, 1500];
      amount = fines[Math.floor(Math.random() * fines.length)];
      breakdown = [
        { labelAm: 'የጥፋት ዓይነት', labelEn: 'Infraction Type', value: 'የፍጥነት ገደብ ማለፍ / የትራፊክ መብራት (Speed/Signal)' },
        { labelAm: 'የተመዘገበበት አድራሻ', labelEn: 'Location', value: 'አዲስ አበባ፤ ቦሌ መድኃኔዓለም አካባቢ' },
        { labelAm: 'የቅጣት ነጥብ', labelEn: 'Penalty Points', value: '3 ነጥብ' },
      ];
      break;
    }
    case 'property_tax': {
      amount = Number((1800 + Math.random() * 1200).toFixed(2));
      breakdown = [
        { labelAm: 'የይዞታ ስፋት (ካሬ)', labelEn: 'Plot Area (m²)', value: '160 m²' },
        { labelAm: 'የከተማ ልማት ግብር', labelEn: 'Urban Development Levy', value: `${(amount * 0.7).toFixed(2)} ETB` },
        { labelAm: 'የአካባቢ ጽዳት መዋጮ', labelEn: 'Sanitation Charge', value: `${(amount * 0.3).toFixed(2)} ETB` },
      ];
      break;
    }
    case 'telecom': {
      amount = Number((450 + Math.random() * 500).toFixed(2));
      breakdown = [
        { labelAm: 'የድምጽ ጥሪ ፍጆታ', labelEn: 'Voice Bundle Usage', value: '220 ደቂቃ (Mins)' },
        { labelAm: '4G ሞባይል ኢንተርኔት', labelEn: '4G Mobile Internet', value: '10 GB' },
        { labelAm: 'የቴሌኮም ኤክሳይስ ታክስ', labelEn: 'Excise Tax (5%)', value: `${(amount * 0.05).toFixed(2)} ETB` },
      ];
      break;
    }
  }

  return {
    serviceType,
    serviceNameAm: meta.nameAm,
    serviceNameEn: meta.nameEn,
    accountNumber: accNumber,
    customerName,
    amountDue: amount,
    status: 'unpaid',
    dueDate: '2026-10-25',
    dueDateAmharic: 'ጥቅምት 15, 2019',
    providerAm: meta.providerAm,
    providerEn: meta.providerEn,
    breakdown,
    confidence: 0.94,
    extractedQuery: query,
    timestamp: new Date().toISOString(),
  };
}

export const SAMPLE_PROMPTS = [
  {
    labelAm: '⚡ የመብራት ክፍያ',
    labelEn: 'Electric Bill',
    query: 'የመብራት ቁጥሬ 10293845 ነው፤ ስንት ደረሰ?',
    type: 'electricity' as ServiceType,
  },
  {
    labelAm: '💧 የውሃ ቢል ማጣሪያ',
    labelEn: 'Water Bill Lookup',
    query: 'የውሃ ቆጣሪ ቁጥር 4455823 ያለበትን ያልተከፈለ ሂሳብ አሳየኝ',
    type: 'water' as ServiceType,
  },
  {
    labelAm: '🚗 የትራፊክ ቅጣት',
    labelEn: 'Traffic Penalty',
    query: 'የትራፊክ ቅጣት ሰሌዳ AA-2-B49102 ተመዝግቧል?',
    type: 'traffic' as ServiceType,
  },
  {
    labelAm: '🏠 የቤት ታክስ',
    labelEn: 'Property Tax',
    query: 'የቦሌ ክፍለ ከተማ የቤት ታክስ BL-TAX-2024 ማጣራት',
    type: 'property_tax' as ServiceType,
  },
  {
    labelAm: '📱 የቴሌኮም ቢል',
    labelEn: 'Ethio Telecom',
    query: 'የቴሌኮም ድህረ-ክፍያ 0911223344 ስንት ቀሪ አለኝ?',
    type: 'telecom' as ServiceType,
  },
];
