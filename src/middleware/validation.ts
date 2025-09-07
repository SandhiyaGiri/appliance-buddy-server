import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const applianceSchema = z.object({
  name: z.string().min(1, 'Appliance name is required'),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  purchaseDate: z.string().datetime('Invalid purchase date'),
  warrantyDurationMonths: z.number().min(1, 'Warranty duration must be at least 1 month'),
  serialNumber: z.string().optional(),
  purchaseLocation: z.string().optional(),
  notes: z.string().optional(),
});

export const validateAppliance = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = applianceSchema.parse(req.body);
    req.body = {
      ...validatedData,
      purchaseDate: new Date(validatedData.purchaseDate),
    };
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors,
      });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
