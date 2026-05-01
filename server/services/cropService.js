const axios = require('axios');
const FormData = require('form-data');

exports.analyzeCrop = async (imageBuffer, filename) => {
  console.log("--- DEBUG: Starting crop.health API call ---");
  
  if (!process.env.VITE_CROP_API_KEY) {
    console.error("DEBUG: VITE_CROP_API_KEY is missing!");
    throw new Error("Missing API Key");
  }
  
  console.log("DEBUG: API Key exists.");

  const form = new FormData();
  form.append('images', imageBuffer, { filename });

  try {
    const response = await axios.post('https://crop.kindwise.com/api/v1/identification', form, {
      headers: { 
        ...form.getHeaders(),
        'Api-Key': process.env.VITE_CROP_API_KEY
      },
      timeout: 30000
    });

    console.log("DEBUG: API Response Status:", response.status);
    return response.data;

  } catch (error) {
    console.error("--- DEBUG: API Error ---");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", JSON.stringify(error.response.data));
      throw new Error(`Kindwise API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else {
      console.error("Message:", error.message);
      throw new Error(`Kindwise Network Error: ${error.message}`);
    }
  }
};
