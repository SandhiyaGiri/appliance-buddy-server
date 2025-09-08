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

  async getAllAppliances(options: { search?: string; filter?: string; userId?: string } = {}) {
    const { search, filter, userId } = options;
    
    try {
      // Get appliances for specific user
      let query = supabase
        .from('appliances')
        .select(`
          *,
          support_contacts(*),
          maintenance_tasks(*),
          linked_documents(*)
        `)
        .order('created_at', { ascending: false });

      // Filter by user ID
      if (userId) {
        query = query.eq('user_id', userId);
      }

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

  async getApplianceById(id: string, userId?: string): Promise<Appliance | null> {
    try {
      let query = supabase
        .from('appliances')
        .select(`
          *,
          support_contacts(*),
          maintenance_tasks(*),
          linked_documents(*)
        `)
        .eq('id', id);

      // Filter by user ID if provided
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data: appliances, error } = await query;

      if (error) {
        console.error('Error fetching appliance:', error);
        return null;
      }

      if (!appliances || appliances.length === 0) {
        return null;
      }

      const appliance = appliances[0];
      
      // Calculate maintenance status for each task
      const maintenanceTasksWithStatus = appliance.maintenance_tasks?.map(task => ({
        ...task,
        status: this.calculateMaintenanceStatus(task.scheduled_date, task.completed_date),
      })) || [];

      return {
        ...appliance,
        supportContacts: appliance.support_contacts || [],
        maintenanceTasks: maintenanceTasksWithStatus,
        linkedDocuments: appliance.linked_documents || [],
      };
    } catch (error) {
      console.error('Error fetching appliance:', error);
      return null;
    }
  }

  async createAppliance(data: CreateApplianceData): Promise<Appliance> {
    try {
      // Use provided userId or get default user ID
      const userId = data.userId || await this.getDefaultUserId();
      
      if (!userId) {
        throw new Error('User ID is required to create an appliance');
      }
      
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

  async updateAppliance(id: string, data: UpdateApplianceData, userId?: string): Promise<Appliance | null> {
    try {
      let query = supabase
        .from('appliances')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      // Filter by user ID if provided
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { error } = await query;

      if (error) {
        console.error('Error updating appliance:', error);
        return null;
      }

      return this.getApplianceById(id, userId);
    } catch (error) {
      console.error('Error in updateAppliance:', error);
      return null;
    }
  }

  async deleteAppliance(id: string, userId?: string): Promise<boolean> {
    try {
      let query = supabase
        .from('appliances')
        .delete()
        .eq('id', id);

      // Filter by user ID if provided
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { error } = await query;

      if (error) {
        console.error('Error deleting appliance:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteAppliance:', error);
      return false;
    }
  }

  async getStats(userId?: string) {
    const allAppliances = await this.getAllAppliances({ userId });
    
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