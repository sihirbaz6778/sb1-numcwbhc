import { Observable } from '@nativescript/core';
import { AttendanceService } from '../../services/attendance.service';
import { AppConfig } from '../../config/app.config';

export class AttendanceReportViewModel extends Observable {
    private attendanceService: AttendanceService;
    
    public currentDate: string;
    public totalStudents: number = 0;
    public presentCount: number = 0;
    public absentCount: number = 0;
    public absentStudents: any[] = [];

    constructor() {
        super();
        this.attendanceService = new AttendanceService();
        this.currentDate = new Date().toISOString().split('T')[0];
        this.loadReport();
    }

    async loadReport() {
        try {
            const report = await this.attendanceService.getAttendanceReport(
                AppConfig.DEFAULT_CLASS_ID,
                this.currentDate
            );

            this.totalStudents = report.totalStudents;
            this.presentCount = report.presentCount;
            this.absentCount = report.absentCount;
            this.absentStudents = report.absentStudents;

            this.notifyPropertyChange('totalStudents', this.totalStudents);
            this.notifyPropertyChange('presentCount', this.presentCount);
            this.notifyPropertyChange('absentCount', this.absentCount);
            this.notifyPropertyChange('absentStudents', this.absentStudents);
        } catch (error) {
            console.error('Rapor yükleme hatası:', error);
        }
    }

    async exportToPdf() {
        // PDF export işlemi burada implement edilecek
        console.log('PDF export özelliği yakında eklenecek');
    }
}