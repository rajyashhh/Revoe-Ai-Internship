import React, { useState } from 'react';
import { GoogleSheetsTable } from './GoogleSheetsTable';
import { TableConfig, ColumnDefinition } from '../types';
import styles from '@/styles/Dashboard.module.css';

const Dashboard: React.FC = () => {
  const [tables, setTables] = useState<TableConfig[]>([]);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [columnDefinitions, setColumnDefinitions] = useState<ColumnDefinition[]>([]);
  const [sheetUrl, setSheetUrl] = useState<string>('');
  const [tabName, setTabName] = useState<string>('');

  const handleAddTable = () => {
    setShowCreateForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTable: TableConfig = {
      id: Date.now(),
      columns: columnDefinitions,
      sheetUrl,
      tabName
    };
    
    setTables([...tables, newTable]);
    setShowCreateForm(false);
    resetForm();
  };

  const handleAddColumn = () => {
    setColumnDefinitions([
      ...columnDefinitions, 
      { name: '', type: 'Text' }
    ]);
  };

  const updateColumnDefinition = (index: number, field: keyof ColumnDefinition, value: string) => {
    const updatedColumns = [...columnDefinitions];
    updatedColumns[index][field] = field === 'type' 
      ? (value as 'Text' | 'Date' | 'Number') 
      : value;
    setColumnDefinitions(updatedColumns);
  };

  const resetForm = () => {
    setColumnDefinitions([]);
    setSheetUrl('');
    setTabName('');
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.dashboardHeader}>
        <h1>Data Dashboard</h1>
        <button className={styles.createButton} onClick={handleAddTable}>
          Create Table
        </button>
      </header>

      {showCreateForm && (
        <div className={styles.createFormContainer}>
          <form onSubmit={handleSubmit} className={styles.createForm}>
            <h2>Create New Table</h2>
            
            <div className={styles.formGroup}>
              <label>Google Sheet URL:</label>
              <input 
                type="text" 
                value={sheetUrl} 
                onChange={(e) => setSheetUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/..."
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Sheet/Tab Name:</label>
              <input 
                type="text" 
                value={tabName} 
                onChange={(e) => setTabName(e.target.value)}
                placeholder="Sheet1"
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Columns:</label>
              <button type="button" onClick={handleAddColumn}>
                Add Column
              </button>
              
              {columnDefinitions.map((col, index) => (
                <div key={index} className={styles.columnDefinition}>
                  <input
                    type="text"
                    placeholder="Column Name"
                    value={col.name}
                    onChange={(e) => updateColumnDefinition(index, 'name', e.target.value)}
                    required
                  />
                  <select 
                    value={col.type}
                    onChange={(e) => updateColumnDefinition(index, 'type', e.target.value)}
                  >
                    <option value="Text">Text</option>
                    <option value="Date">Date</option>
                    <option value="Number">Number</option>
                  </select>
                </div>
              ))}
            </div>
            
            <div className={styles.formActions}>
              <button type="submit">Create Table</button>
              <button type="button" onClick={() => setShowCreateForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.tablesContainer}>
        {tables.map(table => (
          <div key={table.id} className={styles.tableWrapper}>
            <GoogleSheetsTable 
              columns={table.columns} 
              sheetUrl={table.sheetUrl}
              tabName={table.tabName}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard; 