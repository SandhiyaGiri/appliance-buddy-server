import 'dotenv/config';
import { db } from '../src/config/database.js';
import { appliances, supportContacts, maintenanceTasks, linkedDocuments, users } from '../src/models/schema.js';
import { generateMockAppliances } from '../src/data/mockAppliances.js';

const seedDatabase = async () => {
  try {
    console.log('Seeding database...');
    
    // Clear existing data
    await db.delete(linkedDocuments);
    await db.delete(maintenanceTasks);
    await db.delete(supportContacts);
    await db.delete(appliances);
    await db.delete(users);
    
    // Create a default user first
    const [defaultUser] = await db
      .insert(users)
      .values({
        email: 'default@example.com',
        name: 'Default User',
      })
      .returning();
    
    console.log('Created default user:', defaultUser.id);
    
    // Generate and insert mock data
    const mockAppliances = generateMockAppliances();
    
    for (const appliance of mockAppliances) {
      const [insertedAppliance] = await db
        .insert(appliances)
        .values({
          userId: defaultUser.id, // Use the actual user ID
          name: appliance.name,
          brand: appliance.brand,
          model: appliance.model,
          purchaseDate: appliance.purchaseDate,
          warrantyDurationMonths: appliance.warrantyDurationMonths,
          serialNumber: appliance.serialNumber,
          purchaseLocation: appliance.purchaseLocation,
          notes: appliance.notes,
        })
        .returning();

      // Insert support contacts
      if (appliance.supportContacts.length > 0) {
        await db.insert(supportContacts).values(
          appliance.supportContacts.map(contact => ({
            applianceId: insertedAppliance.id,
            name: contact.name,
            company: contact.company,
            phone: contact.phone,
            email: contact.email,
            website: contact.website,
            notes: contact.notes,
          }))
        );
      }

      // Insert maintenance tasks
      if (appliance.maintenanceTasks.length > 0) {
        await db.insert(maintenanceTasks).values(
          appliance.maintenanceTasks.map(task => ({
            applianceId: insertedAppliance.id,
            taskName: task.taskName,
            scheduledDate: task.scheduledDate,
            frequency: task.frequency,
            serviceProvider: task.serviceProvider,
            notes: task.notes,
            status: task.status,
            completedDate: task.completedDate,
          }))
        );
      }

      // Insert linked documents
      if (appliance.linkedDocuments.length > 0) {
        await db.insert(linkedDocuments).values(
          appliance.linkedDocuments.map(doc => ({
            applianceId: insertedAppliance.id,
            title: doc.title,
            url: doc.url,
          }))
        );
      }
    }
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
