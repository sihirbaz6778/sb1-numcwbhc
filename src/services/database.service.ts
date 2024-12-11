import { Sqlite } from '@nativescript/sqlite';

export class DatabaseService {
    private db: Sqlite;

    constructor() {
        this.initializeDatabase();
    }

    private async initializeDatabase() {
        this.db = await new Sqlite('attendance.db');
        await this.createTables();
    }

    private async createTables() {
        await this.db.execSQL(`
            CREATE TABLE IF NOT EXISTS students (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                studentNumber TEXT UNIQUE,
                faceData TEXT,
                classId INTEGER
            )
        `);

        await this.db.execSQL(`
            CREATE TABLE IF NOT EXISTS attendance (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                studentId INTEGER,
                date TEXT,
                present BOOLEAN,
                FOREIGN KEY(studentId) REFERENCES students(id)
            )
        `);
    }

    async addStudent(name: string, studentNumber: string, faceData: string, classId: number) {
        await this.db.execSQL(
            'INSERT INTO students (name, studentNumber, faceData, classId) VALUES (?, ?, ?, ?)',
            [name, studentNumber, faceData, classId]
        );
    }

    async updateStudent(id: number, name: string, studentNumber: string, faceData: string) {
        await this.db.execSQL(
            'UPDATE students SET name = ?, studentNumber = ?, faceData = ? WHERE id = ?',
            [name, studentNumber, faceData, id]
        );
    }

    async deleteStudent(id: number) {
        await this.db.execSQL('DELETE FROM students WHERE id = ?', [id]);
    }

    async getStudentsByClass(classId: number) {
        return await this.db.all('SELECT * FROM students WHERE classId = ?', [classId]);
    }

    async recordAttendance(studentId: number, present: boolean) {
        const date = new Date().toISOString().split('T')[0];
        await this.db.execSQL(
            'INSERT INTO attendance (studentId, date, present) VALUES (?, ?, ?)',
            [studentId, date, present]
        );
    }

    async getAbsentStudents(classId: number, date: string) {
        return await this.db.all(`
            SELECT s.* FROM students s
            LEFT JOIN attendance a ON s.id = a.studentId AND a.date = ?
            WHERE s.classId = ? AND (a.present IS NULL OR a.present = 0)
        `, [date, classId]);
    }
}