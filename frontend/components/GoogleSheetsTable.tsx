import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { ColumnDefinition, SheetRow } from '../types';
import styles from '@/styles/Table.module.css';

interface GoogleSheetsTableProps {
  columns: ColumnDefinition[];
  sheetUrl: string;
  tabName: string;
}

export const GoogleSheetsTable: React.FC<GoogleSheetsTableProps> = ({ 
  columns, 
  sheetUrl, 
  tabName 
}) => {
  const [tableData, setTableData] = useState<SheetRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Initial data fetch
    fetchTableData();
    
    // Set up Socket.io connection
    const socketIo = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000');
    setSocket(socketIo);
    
    // Generate a unique identifier for this table subscription
    const tableId = `${sheetUrl}#${tabName}`;
    
    // Subscribe to updates for this specific sheet
    socketIo.emit('subscribeToSheet', { sheetUrl, tabName });
    
    // Listen for updates from the server
    socketIo.on(`sheetUpdate-${tableId}`, (updatedData: SheetRow[]) => {
      setTableData(updatedData);
    });
    
    return () => {
      // Clean up socket connection
      if (socketIo) {
        socketIo.emit('unsubscribeFromSheet', { sheetUrl, tabName });
        socketIo.disconnect();
      }
    };
  }, [sheetUrl, tabName]);

  const fetchTableData = async () => {
    try {
      setLoading(true);
      
      // Encode the sheet URL for safe transmission
      const encodedUrl = encodeURIComponent(sheetUrl);
      
      const response = await fetch(
        `/api/sheets?url=${encodedUrl}&tab=${tabName}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch sheet data');
      }
      
      const data = await response.json();
      setTableData(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching sheet data:', err);
      setError('Failed to load data from Google Sheets');
      setLoading(false);
    }
  };

  const formatValue = (value: any, type: string): string => {
    if (value === null || value === undefined) return '';
    
    if (type === 'Date') {
      // Attempt to parse and format date
      try {
        const date = new Date(value);
        return date.toLocaleDateString();
      } catch (e) {
        return String(value);
      }
    }
    
    return String(value);
  };

  if (loading) return <div className={styles.loading}>Loading table data...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.googleSheetsTable}>
      <h3>Sheet Data: {tabName}</h3>
      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index}>{col.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex}>
                    {formatValue(row[col.name], col.type)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 