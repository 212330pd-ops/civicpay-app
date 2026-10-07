export type ServiceType = 'electricity' | 'water' | 'traffic' | 'property_tax' | 'telecom';

export interface ServiceMeta {
  id: ServiceType;
  nameAm: string;
  nameEn: string;
  providerAm: string;
  providerEn: string;
  icon: string;
  color: string;
  accentBg: string;
  prefixExample: string;
  shortCode: string;
}

export type BillStatus = 'unpaid' | 'paid' | 'overdue';

export interface BillItem {
  id: string;
  serviceType: ServiceType;
  accountNumber: string;
  customerName: string;
  customerPhone?: string;
  amountDue: number;
  status: BillStatus;
  dueDate: string; // e.g. "2024-10-15"
  dueDateAmharic: string; // e.g. "ጥቅምት 05, 2017"
  issueDate?: string;
  billingPeriod?: string;
  breakdown: {
    labelAm: string;
    labelEn: string;
    value: string | number;
  }[];
  notes?: string;
  paymentReference?: string;
  paidAt?: string;
  paidVia?: 'Telebirr' | 'CBE Birr' | 'Bank Card';
}

export interface ParsedBillResult {
  serviceType: ServiceType;
  serviceNameAm: string;
  serviceNameEn: string;
  accountNumber: string;
  customerName: string;
  amountDue: number;
  status: BillStatus;
  dueDate: string;
  dueDateAmharic: string;
  providerAm: string;
  providerEn: string;
  breakdown: {
    labelAm: string;
    labelEn: string;
    value: string | number;
  }[];
  confidence: number;
  extractedQuery: string;
  timestamp: string;
}

export type ActiveTab = 'lookup' | 'my_bills' | 'help';
