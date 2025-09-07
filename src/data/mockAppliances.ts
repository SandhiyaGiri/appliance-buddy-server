import { addDays, subDays, subMonths, subYears } from 'date-fns';
import { Appliance, MaintenanceTask } from '../types/appliance.js';

const getMaintenanceStatus = (scheduledDate: Date, completedDate?: Date): 'Upcoming' | 'Completed' | 'Overdue' => {
  if (completedDate) {
    return 'Completed';
  }
  
  const now = new Date();
  if (scheduledDate < now) {
    return 'Overdue';
  }
  
  return 'Upcoming';
};

const mkTask = (
  applianceId: string,
  taskName: string,
  offsetDays: number,
  frequency: 'One-time' | 'Monthly' | 'Yearly' | 'Custom',
  completed?: boolean,
  notes?: string,
  serviceProvider?: { name: string; phone?: string; email?: string; notes?: string }
): MaintenanceTask => {
  const now = new Date();
  const scheduledDate = addDays(now, offsetDays);
  const completedDate = completed ? subDays(scheduledDate, 1) : undefined;
  
  return {
    id: crypto.randomUUID(),
    applianceId,
    taskName,
    scheduledDate,
    frequency,
    notes,
    serviceProvider,
    status: getMaintenanceStatus(scheduledDate, completedDate),
    completedDate,
  };
};

export const generateMockAppliances = (now = new Date()): Appliance[] => {
  const appliances: Appliance[] = [];
  
  // Generate unique IDs for each appliance
  const ids = Array.from({ length: 22 }, () => crypto.randomUUID());
  
  // Whirlpool Dryer - Warranty expiring soon, mixed maintenance
  appliances.push({
    id: ids[0],
    name: 'Whirlpool Dryer',
    brand: 'Whirlpool',
    model: 'WED5620HW',
    purchaseDate: subMonths(now, 23),
    warrantyDurationMonths: 24,
    serialNumber: 'WHIR-DR-001',
    purchaseLocation: 'Home Depot',
    notes: 'Stackable dryer with steam refresh cycle',
    supportContacts: [
      {
        id: crypto.randomUUID(),
        name: 'Whirlpool Customer Service',
        company: 'Whirlpool Corporation',
        phone: '1-866-698-2538',
        email: 'customerservice@whirlpool.com',
        website: 'https://www.whirlpool.com/services/contact-us.html'
      }
    ],
    maintenanceTasks: [
      mkTask(ids[0], 'Clean lint trap and exhaust vent', -10, 'Monthly', false, 'Check for blockages'),
      mkTask(ids[0], 'Professional duct cleaning', 14, 'Yearly', false, 'Schedule with HVAC service'),
      mkTask(ids[0], 'Drum cleaning cycle', -30, 'Monthly', true, 'Used dryer cleaning kit')
    ],
    linkedDocuments: [
      { id: crypto.randomUUID(), title: 'User Manual', url: 'https://www.whirlpool.com/content/dam/global/documents/201706/user-instructions-W10751102-A.pdf' },
      { id: crypto.randomUUID(), title: 'Purchase Receipt', url: 'https://example.com/receipts/whirlpool-dryer' }
    ]
  });

  // Bosch Dishwasher - Expired warranty, overdue maintenance
  appliances.push({
    id: ids[1],
    name: 'Bosch Dishwasher',
    brand: 'Bosch',
    model: 'SHXM4AY55N',
    purchaseDate: subYears(now, 3),
    warrantyDurationMonths: 12,
    serialNumber: 'BOSCH-DW-002',
    purchaseLocation: 'Lowe\'s',
    notes: 'Third rack design with adjustable tines',
    supportContacts: [
      {
        id: crypto.randomUUID(),
        name: 'Bosch Customer Care',
        company: 'BSH Home Appliances',
        phone: '1-800-944-2904',
        email: 'support@bsh-group.com',
        website: 'https://www.bosch-home.com/us/service'
      }
    ],
    maintenanceTasks: [
      mkTask(ids[1], 'Clean dishwasher filter', -5, 'Monthly', false, 'Remove and rinse filter'),
      mkTask(ids[1], 'Run cleaning cycle with cleaner', 7, 'Monthly', false),
      mkTask(ids[1], 'Check spray arms for clogs', -45, 'Monthly', true)
    ],
    linkedDocuments: [
      { id: crypto.randomUUID(), title: 'Installation Guide', url: 'https://www.bosch-home.com/us/service/installation' }
    ]
  });

  // Samsung TV - Active warranty
  appliances.push({
    id: ids[2],
    name: 'Samsung 55" QLED TV',
    brand: 'Samsung',
    model: 'QN55Q80C',
    purchaseDate: subMonths(now, 2),
    warrantyDurationMonths: 36,
    serialNumber: 'SAM-TV-003',
    purchaseLocation: 'Best Buy',
    notes: 'Quantum HDR 24x with Direct Full Array backlighting',
    supportContacts: [
      {
        id: crypto.randomUUID(),
        name: 'Samsung Support',
        company: 'Samsung Electronics',
        phone: '1-800-SAMSUNG',
        email: 'support@samsung.com',
        website: 'https://www.samsung.com/us/support/'
      }
    ],
    maintenanceTasks: [
      mkTask(ids[2], 'Dust screen and vents', -15, 'Monthly', true, 'Use microfiber cloth'),
      mkTask(ids[2], 'Software update check', 30, 'Monthly', false),
      mkTask(ids[2], 'Clean remote control', 45, 'Monthly', false)
    ],
    linkedDocuments: [
      { id: crypto.randomUUID(), title: 'TV Receipt', url: 'https://example.com/receipts/samsung-tv' },
      { id: crypto.randomUUID(), title: 'Warranty Information', url: 'https://www.samsung.com/us/support/warranty/' }
    ]
  });

  // Add more appliances as needed...
  // For brevity, I'll add a few more key examples

  // LG Refrigerator - Active warranty, upcoming maintenance
  appliances.push({
    id: ids[3],
    name: 'LG French Door Refrigerator',
    brand: 'LG',
    model: 'LRFVS3006S',
    purchaseDate: subMonths(now, 8),
    warrantyDurationMonths: 24,
    serialNumber: 'LG-REF-004',
    purchaseLocation: 'Costco',
    notes: 'InstaView Door-in-Door with craft ice maker',
    supportContacts: [
      {
        id: crypto.randomUUID(),
        name: 'LG Customer Service',
        company: 'LG Electronics',
        phone: '1-800-243-0000',
        email: 'lgecs@lge.com',
        website: 'https://www.lg.com/us/support'
      }
    ],
    maintenanceTasks: [
      mkTask(ids[3], 'Replace water filter', 5, 'Monthly', false, 'Model LT1000P filter', {
        name: 'Appliance Service Co',
        phone: '555-123-4567'
      }),
      mkTask(ids[3], 'Clean coils and vents', 90, 'Yearly', false),
      mkTask(ids[3], 'Ice maker cleaning', -60, 'Monthly', true, 'Used LG cleaning solution')
    ],
    linkedDocuments: [
      { id: crypto.randomUUID(), title: 'User Manual', url: 'https://www.lg.com/us/support/product/lg-LRFVS3006S' }
    ]
  });

  return appliances;
}; 