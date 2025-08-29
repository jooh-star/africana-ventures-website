# Core Focus Areas Image Upload Guide

To ensure your uploaded images appear correctly on the website instead of falling back to hardcoded images, follow this guide when uploading images through the admin panel.

## Correct Subsection Names for Each Block

When uploading images for the core focus areas section, use these exact subsection names:

### Block 1: Agri-Marketplace Platform
- **Subsection Name**: `marketplace` or `agri_marketplace`

### Block 2: Smart Logistics & Distribution
- **Subsection Name**: `logistics` or `smart_logistics`

### Block 3: Advisory & Consulting
- **Subsection Name**: `advisory` or `consulting`

### Block 4: Access to Inputs & Finance
- **Subsection Name**: `finance` or `inputs`

### Block 5: Training & Capacity Building
- **Subsection Name**: `training` or `capacity`

### Block 6: Data & Traceability
- **Subsection Name**: `data` or `traceability`

### Block 7: Value Addition & Processing
- **Subsection Name**: `value_addition` or `processing`

## Upload Instructions

1. Go to the Admin Panel → Images section
2. Click "Upload New Image"
3. Set the following fields:
   - **Page Name**: `index`
   - **Section Name**: `core_focus_areas`
   - **Subsection Name**: Use the exact name from the list above based on which block you're updating
   - **Description**: Brief description of the image
   - **Image Type**: `static` (default)
   - **Display Order**: `0` (default)
4. Select your image file
5. Click "Upload"

## Troubleshooting

If your image doesn't appear after uploading:

1. Check that you used the correct subsection name from the list above
2. Verify the image is active (checkbox should be checked)
3. Clear your browser cache
4. Refresh the index page

## Template Expectations

The frontend template looks for images using these exact subsection names. If there's a mismatch, it will fall back to hardcoded images. The system is case-sensitive, so make sure to use lowercase names exactly as listed above.