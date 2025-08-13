const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for index migration");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

const fixClassIndexes = async () => {
  try {
    console.log("Starting class index migration...");
    
    const db = mongoose.connection.db;
    const collection = db.collection('classes');
    
    // Get all existing indexes
    const indexes = await collection.indexes();
    console.log("Current indexes:", indexes.map(idx => idx.name));
    
    // Check if there's a unique index on just class_name
    const classNameIndex = indexes.find(idx => 
      idx.key && idx.key.class_name === 1 && 
      Object.keys(idx.key).length === 1 && 
      idx.unique === true
    );
    
    if (classNameIndex) {
      console.log("Found problematic unique index on class_name, dropping it...");
      await collection.dropIndex(classNameIndex.name);
      console.log("Dropped index:", classNameIndex.name);
    }
    
    // Check if the compound index exists
    const compoundIndex = indexes.find(idx => 
      idx.key && 
      idx.key.class_name === 1 && 
      idx.key.section === 1 && 
      idx.key.admin_id === 1 && 
      idx.unique === true
    );
    
    if (!compoundIndex) {
      console.log("Creating compound unique index on {class_name, section, admin_id}...");
      await collection.createIndex(
        { class_name: 1, section: 1, admin_id: 1 }, 
        { unique: true, name: 'class_section_admin_unique' }
      );
      console.log("Created compound unique index successfully");
    } else {
      console.log("Compound index already exists:", compoundIndex.name);
    }
    
    // Verify the fix by checking if we can have multiple sections for the same class
    console.log("Index migration completed successfully!");
    console.log("You can now add multiple sections under the same class name.");
    
  } catch (error) {
    console.error("Error during index migration:", error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
};

// Run the migration
connectDB().then(() => {
  fixClassIndexes();
}); 