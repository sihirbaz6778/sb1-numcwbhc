import { Application } from '@nativescript/core';
import { initializeDatabase } from './services/database.service';

// Initialize database when app starts
initializeDatabase().catch(error => {
    console.error('Database initialization failed:', error);
});

Application.run({ moduleName: 'app-root' });