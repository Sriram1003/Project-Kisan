require('dotenv').config({ path: '../.env' });
const axios = require('axios');

async function testAPIs() {
  console.log("Testing OpenWeather API...");
  try {
    const wRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Karimnagar,IN&appid=${process.env.Openweather_API}&units=metric`);
    console.log("✅ Weather OK:", wRes.data.main.temp);
  } catch (e) {
    console.log("❌ Weather Failed:", e.response?.data || e.message);
  }

  console.log("\nTesting Mandi API...");
  try {
    const mRes = await axios.get(`https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24?api-key=${process.env.market_prices_API}&format=json&limit=1`);
    console.log("✅ Mandi OK:", mRes.data.records?.length > 0 ? "Got records" : "No records");
  } catch (e) {
    console.log("❌ Mandi Failed:", e.response?.data || e.message);
  }

  console.log("\nTesting Plant.id API...");
  try {
    // 1x1 transparent pixel base64
    const fakeImage = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    const pRes = await axios.post('https://api.plant.id/v2/identify', { images: [fakeImage], health: "all" }, {
      headers: { 'Api-Key': process.env['Plant.id_API_key'] }
    });
    console.log("✅ Plant.id OK:", pRes.data.suggestions?.[0]?.plant_name);
  } catch (e) {
    console.log("❌ Plant.id Failed:", e.response?.data || e.message);
  }
}

testAPIs();
