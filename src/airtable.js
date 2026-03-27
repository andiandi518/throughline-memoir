// Airtable Configuration
// Replace these values with your actual Airtable credentials

const AIRTABLE_CONFIG = {
  // Your Personal Access Token from Airtable Developer Hub
  API_KEY: import.meta.env.VITE_AIRTABLE_API_KEY || "YOUR_AIRTABLE_API_KEY",

  // Your Base ID - found in your Airtable URL (starts with "app")
  BASE_ID: import.meta.env.VITE_AIRTABLE_BASE_ID || "app2jKZrXs9VT2oJx",

  // Table names
  TABLES: {
    PROMPTS: "Prompts",
    ENTRIES: "Entries",
    THEMES: "Themes",
    CHAPTERS: "Chapters",
  },
};

// Airtable API helper functions
const airtableUrl = (table, recordId) => {
  const base = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.BASE_ID}/${encodeURIComponent(table)}`;
  return recordId ? `${base}/${recordId}` : base;
};

const airtableHeaders = {
  Authorization: `Bearer ${AIRTABLE_CONFIG.API_KEY}`,
  "Content-Type": "application/json",
};

// Fetch a single entry record by ID
export async function fetchEntry(recordId) {
  try {
    const response = await fetch(airtableUrl(AIRTABLE_CONFIG.TABLES.ENTRIES, recordId), {
      headers: airtableHeaders,
    });
    if (!response.ok) throw new Error("Failed to fetch entry");
    return await response.json();
  } catch (err) {
    console.error("Error fetching entry:", err);
    return null;
  }
}

// Save entry text (autosave)
export async function saveEntryText(recordId, text) {
  try {
    const response = await fetch(airtableUrl(AIRTABLE_CONFIG.TABLES.ENTRIES, recordId), {
      method: "PATCH",
      headers: airtableHeaders,
      body: JSON.stringify({
        fields: { "Response Text": text },
      }),
    });
    if (!response.ok) throw new Error("Failed to save entry");
    return await response.json();
  } catch (err) {
    console.error("Error saving entry:", err);
    return null;
  }
}

// Fetch the prompt for a given entry (via linked record)
export async function fetchPrompt(promptRecordId) {
  try {
    const response = await fetch(airtableUrl(AIRTABLE_CONFIG.TABLES.PROMPTS, promptRecordId), {
      headers: airtableHeaders,
    });
    if (!response.ok) throw new Error("Failed to fetch prompt");
    return await response.json();
  } catch (err) {
    console.error("Error fetching prompt:", err);
    return null;
  }
}

// Fetch all entries (for the reader view)
export async function fetchAllEntries() {
  try {
    const response = await fetch(
      airtableUrl(AIRTABLE_CONFIG.TABLES.ENTRIES) +
        "?sort%5B0%5D%5Bfield%5D=Date+Received&sort%5B0%5D%5Bdirection%5D=desc&filterByFormula=NOT(%7BResponse+Text%7D%3D'')",
      { headers: airtableHeaders }
    );
    if (!response.ok) throw new Error("Failed to fetch entries");
    const data = await response.json();
    return data.records || [];
  } catch (err) {
    console.error("Error fetching entries:", err);
    return [];
  }
}

export default AIRTABLE_CONFIG;
