import { supabase } from '../src/config/database.js';
import { generateMockAppliances } from '../src/data/mockAppliances.js';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create a test user first
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        email: 'test@example.com',
        name: 'Test User'
      })
      .select()
      .single();

    if (userError) {
      console.error('Error creating user:', userError);
      return;
    }

    console.log('✅ Created test user:', user.email);

    // Generate mock appliances
    const mockAppliances = generateMockAppliances();

    // Insert appliances with the test user ID
    const appliancesWithUserId = mockAppliances.map(appliance => ({
      ...appliance,
      userId: user.id
    }));

    const { data: appliances, error: appliancesError } = await supabase
      .from('appliances')
      .insert(appliancesWithUserId)
      .select();

    if (appliancesError) {
      console.error('Error creating appliances:', appliancesError);
      return;
    }

    console.log(`✅ Created ${appliances.length} appliances`);

    // Insert support contacts
    const allSupportContacts = [];
    const allMaintenanceTasks = [];
    const allLinkedDocuments = [];

    for (const appliance of appliances) {
      const originalAppliance = mockAppliances.find(a => a.name === appliance.name);
      if (originalAppliance) {
        // Add support contacts
        if (originalAppliance.supportContacts) {
          const supportContacts = originalAppliance.supportContacts.map(contact => ({
            ...contact,
            applianceId: appliance.id
          }));
          allSupportContacts.push(...supportContacts);
        }

        // Add maintenance tasks
        if (originalAppliance.maintenanceTasks) {
          const maintenanceTasks = originalAppliance.maintenanceTasks.map(task => ({
            ...task,
            applianceId: appliance.id
          }));
          allMaintenanceTasks.push(...maintenanceTasks);
        }

        // Add linked documents
        if (originalAppliance.linkedDocuments) {
          const linkedDocuments = originalAppliance.linkedDocuments.map(doc => ({
            ...doc,
            applianceId: appliance.id
          }));
          allLinkedDocuments.push(...linkedDocuments);
        }
      }
    }

    // Insert support contacts
    if (allSupportContacts.length > 0) {
      const { error: supportError } = await supabase
        .from('support_contacts')
        .insert(allSupportContacts);

      if (supportError) {
        console.error('Error creating support contacts:', supportError);
      } else {
        console.log(`✅ Created ${allSupportContacts.length} support contacts`);
      }
    }

    // Insert maintenance tasks
    if (allMaintenanceTasks.length > 0) {
      const { error: tasksError } = await supabase
        .from('maintenance_tasks')
        .insert(allMaintenanceTasks);

      if (tasksError) {
        console.error('Error creating maintenance tasks:', tasksError);
      } else {
        console.log(`✅ Created ${allMaintenanceTasks.length} maintenance tasks`);
      }
    }

    // Insert linked documents
    if (allLinkedDocuments.length > 0) {
      const { error: docsError } = await supabase
        .from('linked_documents')
        .insert(allLinkedDocuments);

      if (docsError) {
        console.error('Error creating linked documents:', docsError);
      } else {
        console.log(`✅ Created ${allLinkedDocuments.length} linked documents`);
      }
    }

    console.log('🎉 Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    process.exit(0);
  }
}

seedDatabase();
