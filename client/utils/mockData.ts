import { Textbook } from "../types/index.d";

// Mock textbooks for demo purposes
export const mockTextbooks: Textbook[] = [
  {
    id: "1",
    title: "Introduction to Computer Science",
    description:
      "A comprehensive guide to computer science fundamentals, covering programming basics, algorithms, and data structures. Perfect for first-year students.",
    author: "Dr. Sarah Johnson",
    price: 45.99,
    coverImage:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400",
    pdfUrl: "https://example.com/textbooks/intro-cs.pdf",
    lecturerId: "lecturer1",
    lecturerName: "Dr. Sarah Johnson",
    uploadedAt: new Date("2024-09-15"),
    category: "Computer Science",
    isbn: "978-3-16-148410-0",
  },
  {
    id: "2",
    title: "Advanced Mathematics for Engineering",
    description:
      "Master advanced mathematical concepts including calculus, linear algebra, and differential equations. Essential for engineering students.",
    author: "Prof. Michael Chen",
    price: 52.5,
    coverImage:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400",
    pdfUrl: "https://example.com/textbooks/advanced-math.pdf",
    lecturerId: "lecturer2",
    lecturerName: "Prof. Michael Chen",
    uploadedAt: new Date("2024-10-01"),
    category: "Mathematics",
    isbn: "978-1-23-456789-0",
  },
  {
    id: "3",
    title: "Modern Physics: Concepts and Applications",
    description:
      "Explore quantum mechanics, relativity, and particle physics with clear explanations and real-world applications. Includes practice problems.",
    author: "Dr. Emily Rodriguez",
    price: 48.0,
    coverImage:
      "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400",
    pdfUrl: "https://example.com/textbooks/modern-physics.pdf",
    lecturerId: "lecturer3",
    lecturerName: "Dr. Emily Rodriguez",
    uploadedAt: new Date("2024-09-20"),
    category: "Physics",
    isbn: "978-0-12-345678-9",
  },
  {
    id: "4",
    title: "Database Systems and Design",
    description:
      "Learn database design principles, SQL, normalization, and modern database technologies. Includes hands-on projects and examples.",
    author: "Dr. James Williams",
    price: 41.99,
    coverImage:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400",
    pdfUrl: "https://example.com/textbooks/database-systems.pdf",
    lecturerId: "lecturer1",
    lecturerName: "Dr. Sarah Johnson",
    uploadedAt: new Date("2024-10-10"),
    category: "Computer Science",
    isbn: "978-4-56-789012-3",
  },
  {
    id: "5",
    title: "Organic Chemistry Fundamentals",
    description:
      "Comprehensive coverage of organic chemistry reactions, mechanisms, and synthesis. Features molecular models and practice exercises.",
    author: "Prof. Lisa Anderson",
    price: 55.0,
    coverImage:
      "https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=400",
    pdfUrl: "https://example.com/textbooks/organic-chemistry.pdf",
    lecturerId: "lecturer4",
    lecturerName: "Prof. Lisa Anderson",
    uploadedAt: new Date("2024-09-25"),
    category: "Chemistry",
    isbn: "978-7-89-012345-6",
  },
  {
    id: "6",
    title: "Digital Signal Processing",
    description:
      "Master DSP concepts including Fourier analysis, filter design, and signal transforms. Includes MATLAB examples and implementations.",
    author: "Dr. Robert Kim",
    price: 49.99,
    coverImage:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400",
    pdfUrl: "https://example.com/textbooks/dsp.pdf",
    lecturerId: "lecturer2",
    lecturerName: "Prof. Michael Chen",
    uploadedAt: new Date("2024-10-05"),
    category: "Engineering",
    isbn: "978-2-34-567890-1",
  },
];

export const textbookCategories = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Engineering",
  "Biology",
  "Economics",
  "Business",
  "Other",
];
