// Mock data for Smart Attend app

export const MOCK_STUDENTS = [
  {
    role: 'student' as const,
    fullName: 'John Ric',
    email: 'john@example.com',
    regNumber: 'REG1BB82C',
    department: 'Computer Science',
    level: '200',
    password: 'password123',
  },
];

export const MOCK_LECTURERS = [
  {
    role: 'lecturer' as const,
    fullName: 'Dr. Sarah Johnson',
    email: 'sarah@example.com',
    staffId: 'STAFF001',
    department: 'Computer Science',
    courses: ['CSC 214 - Data Structures', 'CSC 312 - Algorithms'],
    password: 'password123',
  },
];

export const MOCK_ATTENDANCE = [
  {
    id: '1',
    course: 'CSC 214 - Data Structures',
    date: '24 May 2025',
    time: '2:30pm',
    status: 'PRESENT',
  },
  {
    id: '2',
    course: 'MTH 212 - Calculus I',
    date: '27 May 2025',
    time: '9:00am',
    status: 'PRESENT',
  },
  {
    id: '3',
    course: 'ENG 201 - Technical Writing',
    date: '28 May 2025',
    time: '11:00am',
    status: 'PRESENT',
  },
  {
    id: '4',
    course: 'PHY 211 - Mechanics',
    date: '29 May 2025',
    time: '8:00am',
    status: 'ABSENT',
  },
  {
    id: '5',
    course: 'CSC 214 - Data Structures',
    date: '30 May 2025',
    time: '2:30pm',
    status: 'PRESENT',
  },
];

export const MOCK_BOOKS = [
  {
    id: '1',
    title: 'Data Structures & Algorithms',
    course: 'CSC 214',
    author: 'Dr. Sarah Johnson',
    price: 2500,
    cover: '📘',
    description: 'Comprehensive guide to data structures and algorithms for computer science students.',
    purchased: true,
  },
  {
    id: '2',
    title: 'Calculus for Engineers',
    course: 'MTH 212',
    author: 'Prof. Ahmed Musa',
    price: 1800,
    cover: '📙',
    description: 'A detailed walkthrough of calculus concepts used in engineering disciplines.',
    purchased: true,
  },
  {
    id: '3',
    title: 'Technical Writing Essentials',
    course: 'ENG 201',
    author: 'Mrs. Grace Obi',
    price: 1200,
    cover: '📗',
    description: 'Master technical communication for academic and professional writing.',
    purchased: false,
  },
  {
    id: '4',
    title: 'Classical Mechanics',
    course: 'PHY 211',
    author: 'Dr. Emeka Nwosu',
    price: 2100,
    cover: '📕',
    description: 'Foundational mechanics from Newton to Lagrangian dynamics.',
    purchased: false,
  },
];

export const MOCK_COURSES = [
  { id: '1', code: 'CSC 214', name: 'Data Structures', students: 48, nextClass: 'Mon 2:30pm' },
  { id: '2', code: 'CSC 312', name: 'Algorithms', students: 35, nextClass: 'Wed 10:00am' },
];

export const MOCK_LECTURER_ATTENDANCE = [
  {
    id: '1',
    course: 'CSC 214 - Data Structures',
    date: '27 May 2025',
    time: '2:30pm',
    present: 42,
    total: 48,
  },
  {
    id: '2',
    course: 'CSC 214 - Data Structures',
    date: '24 May 2025',
    time: '2:30pm',
    present: 45,
    total: 48,
  },
  {
    id: '3',
    course: 'CSC 312 - Algorithms',
    date: '25 May 2025',
    time: '10:00am',
    present: 30,
    total: 35,
  },
];
