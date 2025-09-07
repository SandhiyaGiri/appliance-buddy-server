import { Request, Response } from 'express';
import { ApplianceService } from '../services/ApplianceService.js';

export class ApplianceController {
  private applianceService = new ApplianceService();

  async getAllAppliances(req: Request, res: Response) {
    try {
      const { search, filter } = req.query;
      const appliances = await this.applianceService.getAllAppliances({
        search: search as string,
        filter: filter as string,
      });
      res.json(appliances);
    } catch (error) {
      console.error('Error fetching appliances:', error);
      res.status(500).json({ error: 'Failed to fetch appliances' });
    }
  }

  async getApplianceById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const appliance = await this.applianceService.getApplianceById(id);
      
      if (!appliance) {
        return res.status(404).json({ error: 'Appliance not found' });
      }
      
      res.json(appliance);
    } catch (error) {
      console.error('Error fetching appliance:', error);
      res.status(500).json({ error: 'Failed to fetch appliance' });
    }
  }

  async createAppliance(req: Request, res: Response) {
    try {
      const applianceData = req.body;
      const appliance = await this.applianceService.createAppliance(applianceData);
      res.status(201).json(appliance);
    } catch (error) {
      console.error('Error creating appliance:', error);
      res.status(500).json({ error: 'Failed to create appliance' });
    }
  }

  async updateAppliance(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const appliance = await this.applianceService.updateAppliance(id, updates);
      
      if (!appliance) {
        return res.status(404).json({ error: 'Appliance not found' });
      }
      
      res.json(appliance);
    } catch (error) {
      console.error('Error updating appliance:', error);
      res.status(500).json({ error: 'Failed to update appliance' });
    }
  }

  async deleteAppliance(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const success = await this.applianceService.deleteAppliance(id);
      
      if (!success) {
        return res.status(404).json({ error: 'Appliance not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting appliance:', error);
      res.status(500).json({ error: 'Failed to delete appliance' });
    }
  }

  async getStats(req: Request, res: Response) {
    try {
      const stats = await this.applianceService.getStats();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ error: 'Failed to fetch statistics' });
    }
  }
} 