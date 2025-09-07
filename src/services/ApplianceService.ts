import { supabase } from '../config/database.js';
import { Appliance, CreateApplianceData, UpdateApplianceData } from '../types/appliance.js';
import { addMonths, isAfter, differenceInDays } from 'date-fns';

export class ApplianceService {
  private async getDefaultUserId(): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', 'default@example.com')
        .limit(1)
        .single();
      
      if (error) {
        console.error('Error fetching default user:', error);
        return null;
      }
      
      return data?.id || null;
    } catch (error) {
      console.error('Error fetching default user:', error);
      return null;
    }
  }

  async getAllAppliances(options: { search?: string; filter?: string } = {}) {
    const { search, filter } = options;
    
    try {
      // Get all appliances
      let query = supabase
        .from('appliances')
        .select(`
          *,
          support_contacts(*),
          maintenance_tasks(*),
          linked_documents(*)
        `)
        .order('created_at', { ascending: false });

      // Apply search filter
      if (search) {
        query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%,model.ilike.%${search}%`);
      }

      const { data: appliances, error } = await query;

      if (error) {
        console.error('Error fetching appliances:', error);
        throw error;
      }

      if (!appliances) {
        return [];
      }

      // Transform the data to match the expected format
      const transformedAppliances = appliances.map(appliance => ({
        id: appliance.id,
        name: appliance.name,
        brand: appliance.brand,
        model: appliance.model,
        purchaseDate: appliance.purchase_date,
        warrantyDurationMonths: appliance.warranty_duration_months,
        serialNumber: appliance.serial_number,
        purchaseLocation: appliance.purchase_location,
        notes: appliance.notes,
        createdAt: appliance.created_at,
        updatedAt: appliance.updated_at,
        supportContacts: appliance.support_contacts || [],
        maintenanceTasks: (appliance.maintenance_tasks || []).map(task => ({
          id: task.id,
          applianceId: task.appliance_id,
          taskName: task.task_name,
          scheduledDate: task.scheduled_date,
          frequency: task.frequency,
          serviceProvider: task.service_provider,
          notes: task.notes,
          status: this.calculateMaintenanceStatus(task.scheduled_date, task.completed_date),
          completedDate: task.completed_date,
          createdAt: task.created_at,
          updatedAt: task.updated_at,
        })),
        linkedDocuments: (appliance.linked_documents || []).map(doc => ({
          id: doc.id,
          applianceId: doc.appliance_id,
          title: doc.title,
          url: doc.url,
          createdAt: doc.created_at,
          updatedAt: doc.updated_at,
        })),
      }));

      // Apply warranty filter
      if (filter && filter !== 'all') {
        return transformedAppliances.filter(appliance => {
          const warrantyStatus = this.getWarrantyStatus(appliance.purchaseDate, appliance.warrantyDurationMonths);
          return warrantyStatus === filter;
        });
      }

      return transformedAppliances;
    } catch (error) {
      console.error('Error in getAllAppliances:', error);
      throw error;
    }
  }

  async getApplianceById(id: string): Promise<Appliance | null> {
    const results = await db
      .select({
        appliance: appliances,
        supportContacts: supportContacts,
        maintenanceTasks: maintenanceTasks,
        linkedDocuments: linkedDocuments,
      })
      .from(appliances)
      .leftJoin(supportContacts, eq(appliances.id, supportContacts.applianceId))
      .leftJoin(maintenanceTasks, eq(appliances.id, maintenanceTasks.applianceId))
      .leftJoin(linkedDocuments, eq(appliances.id, linkedDocuments.applianceId))
      .where(eq(appliances.id, id));

    if (results.length === 0) {
      return null;
    }

    const appliance = results[0].appliance;
    const supportContactsList = results
      .filter(r => r.supportContacts)
      .map(r => r.supportContacts!);
    
    const maintenanceTasksList = results
      .filter(r => r.maintenanceTasks)
      .map(r => ({
        ...r.maintenanceTasks!,
        status: this.calculateMaintenanceStatus(r.maintenanceTasks!.scheduledDate, r.maintenanceTasks!.completedDate),
      }));
    
    const linkedDocumentsList = results
      .filter(r => r.linkedDocuments)
      .map(r => r.linkedDocuments!);

    return {
      ...appliance,
      supportContacts: supportContactsList,
      maintenanceTasks: maintenanceTasksList,
      linkedDocuments: linkedDocumentsList,
    };
  }

  async createAppliance(data: CreateApplianceData): Promise<Appliance> {
    try {
      // Get the default user ID if no userId is provided
      const userId = data.userId || await this.getDefaultUserId();
      
      const { data: appliance, error } = await supabase
        .from('appliances')
        .insert({
          user_id: userId,
          name: data.name,
          brand: data.brand,
          model: data.model,
          purchase_date: data.purchaseDate,
          warranty_duration_months: data.warrantyDurationMonths,
          serial_number: data.serialNumber || null,
          purchase_location: data.purchaseLocation || null,
          notes: data.notes || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating appliance:', error);
        throw error;
      }

      return {
        id: appliance.id,
        name: appliance.name,
        brand: appliance.brand,
        model: appliance.model,
        purchaseDate: appliance.purchase_date,
        warrantyDurationMonths: appliance.warranty_duration_months,
        serialNumber: appliance.serial_number,
        purchaseLocation: appliance.purchase_location,
        notes: appliance.notes,
        createdAt: appliance.created_at,
        updatedAt: appliance.updated_at,
        supportContacts: [],
        maintenanceTasks: [],
        linkedDocuments: [],
      };
    } catch (error) {
      console.error('Error in createAppliance:', error);
      throw error;
    }
  }

  async updateAppliance(id: string, data: UpdateApplianceData): Promise<Appliance | null> {
    const [updatedAppliance] = await db
      .update(appliances)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(appliances.id, id))
      .returning();

    if (!updatedAppliance) {
      return null;
    }

    return this.getApplianceById(id);
  }

  async deleteAppliance(id: string): Promise<boolean> {
    const result = await db
      .delete(appliances)
      .where(eq(appliances.id, id));

    return result.rowCount > 0;
  }

  async getStats() {
    const allAppliances = await this.getAllAppliances();
    
    const stats = {
      total: allAppliances.length,
      active: 0,
      expiring: 0,
      expired: 0,
    };

    allAppliances.forEach(appliance => {
      const status = this.getWarrantyStatus(appliance.purchaseDate, appliance.warrantyDurationMonths);
      switch (status) {
        case 'Active':
          stats.active++;
          break;
        case 'Expiring Soon':
          stats.expiring++;
          break;
        case 'Expired':
          stats.expired++;
          break;
      }
    });

    return stats;
  }

  private getWarrantyStatus(purchaseDate: Date, warrantyDurationMonths: number): 'Active' | 'Expiring Soon' | 'Expired' {
    const now = new Date();
    const warrantyEndDate = addMonths(purchaseDate, warrantyDurationMonths);
    const daysUntilExpiry = differenceInDays(warrantyEndDate, now);

    if (isAfter(now, warrantyEndDate)) {
      return 'Expired';
    } else if (daysUntilExpiry <= 30) {
      return 'Expiring Soon';
    } else {
      return 'Active';
    }
  }

  private calculateMaintenanceStatus(scheduledDate: Date, completedDate?: Date): 'Upcoming' | 'Completed' | 'Overdue' {
    if (completedDate) {
      return 'Completed';
    }
    
    const now = new Date();
    if (scheduledDate < now) {
      return 'Overdue';
    }
    
    return 'Upcoming';
  }
} 