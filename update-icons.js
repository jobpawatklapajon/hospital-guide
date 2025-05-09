import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the clinics.json file
const clinicsFilePath = path.join(__dirname, 'src', 'data', 'clinics.json');
const clinicsData = JSON.parse(fs.readFileSync(clinicsFilePath, 'utf8'));

// Update icon paths
clinicsData.clinics.forEach(clinic => {
  if (clinic.icon && clinic.icon.startsWith('/icons/')) {
    // Extract the base name without path and extension
    clinic.icon = clinic.icon.replace('/icons/', '').replace('.webp', '');
  }
});

// Write the updated file
fs.writeFileSync(clinicsFilePath, JSON.stringify(clinicsData, null, 4));

console.log('Updated all icon paths in clinics.json'); 