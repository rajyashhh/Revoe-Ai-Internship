// pages/api/sheets.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

// Load service account credentials
// Store these securely using environment variables in production
const credentials = {
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

// Create a JWT client
const jwtClient = new JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

// Create Google Sheets API client
const sheets = google.sheets({ version: 'v4', auth: jwtClient });

// Parse Google Sheet URL to extract the spreadsheet ID
function extractSpreadsheetId(url: string): string | null {
  const regex = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// API handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url, tab } = req.query;
    
    if (!url || !tab || Array.isArray(url) || Array.isArray(tab)) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    const spreadsheetId = extractSpreadsheetId(url);
    
    if (!spreadsheetId) {
      return res.status(400).json({ error: 'Invalid Google Sheet URL' });
    }
    
    const data = await fetchSheetData(spreadsheetId, tab);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    res.status(500).json({ error: 'Failed to fetch sheet data' });
  }
}

// Function to fetch data from Google Sheets
async function fetchSheetData(spreadsheetId: string, tabName: string) {
  try {
    // First, get the header row to determine column names
    const headerResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${tabName}!A1:Z1`,
    });
    
    const headers = headerResponse.data.values?.[0] || [];
    
    // Then get all data
    const dataResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${tabName}!A2:Z`,
    });
    
    const rows = dataResponse.data.values || [];
    
    // Convert to array of objects with headers as keys
    return rows.map((row: string[]) => {
      const rowData: Record<string, string> = {};
      headers.forEach((header: string, index: number) => {
        rowData[header] = index < row.length ? row[index] : '';
      });
      return rowData;
    });
  } catch (error) {
    console.error('Error in fetchSheetData:', error);
    throw error;
  }
}