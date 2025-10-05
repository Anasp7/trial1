// Mock data for Alumni Connect Platform
export const mockUsers = {
  admin: {
    id: 1,
    name: "Admin User",
    email: "admin@alumni.com",
    role: "admin",
    createdAt: "2024-01-01"
  },
  alumni: [
    {
      id: 2,
      name: "John Smith",
      email: "john.smith@email.com",
      role: "alumni",
      occupation: "Software Engineer",
      company: "Google",
      workingDomain: "Technology",
      createdAt: "2024-01-15"
    },
    {
      id: 3,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      role: "alumni",
      occupation: "Product Manager",
      company: "Microsoft",
      workingDomain: "Product Management",
      createdAt: "2024-01-20"
    },
    {
      id: 4,
      name: "Michael Chen",
      email: "michael.chen@email.com",
      role: "alumni",
      occupation: "Data Scientist",
      company: "Amazon",
      workingDomain: "Data Science",
      createdAt: "2024-02-01"
    }
  ],
  students: [
    {
      id: 5,
      name: "Alice Brown",
      email: "alice.brown@student.edu",
      role: "student",
      cgpa: 8.5,
      category: "General",
      createdAt: "2024-01-10"
    },
    {
      id: 6,
      name: "Bob Wilson",
      email: "bob.wilson@student.edu",
      role: "student",
      cgpa: 7.8,
      category: "OBC",
      createdAt: "2024-01-12"
    },
    {
      id: 7,
      name: "Carol Davis",
      email: "carol.davis@student.edu",
      role: "student",
      cgpa: 9.2,
      category: "SC",
      createdAt: "2024-01-18"
    }
  ]
};

export const mockOpportunities = [
  {
    id: 1,
    title: "Software Engineering Internship",
    type: "internship",
    description: "Join our team as a software engineering intern and work on cutting-edge projects.",
    company: "Google",
    location: "Mountain View, CA",
    duration: "3 months",
    stipend: "$5000/month",
    requirements: "Computer Science background, Python/Java knowledge",
    postedBy: 2,
    postedAt: "2024-01-15",
    deadline: "2024-03-15",
    status: "active"
  },
  {
    id: 2,
    title: "Merit Scholarship Program",
    type: "scholarship",
    description: "Financial support for outstanding students with academic excellence.",
    amount: "$5000",
    eligibility: "CGPA > 8.0, Financial need",
    deadline: "2024-04-30",
    postedBy: 2,
    postedAt: "2024-01-20",
    status: "active"
  },
  {
    id: 3,
    title: "Tech Mentorship Program",
    type: "mentorship",
    description: "Get guidance from industry experts in technology and career development.",
    mentor: "John Smith",
    duration: "6 months",
    focus: "Career guidance, Technical skills",
    postedBy: 2,
    postedAt: "2024-01-25",
    status: "active"
  },
  {
    id: 4,
    title: "Success Story: From Student to Google Engineer",
    type: "success_story",
    description: "How I landed my dream job at Google through persistence and skill development.",
    author: "Sarah Johnson",
    company: "Google",
    journey: "Started as intern, now Senior Engineer",
    postedBy: 3,
    postedAt: "2024-02-01",
    status: "active"
  }
];

export const mockApplications = [
  {
    id: 1,
    studentId: 5,
    opportunityId: 1,
    status: "pending",
    appliedAt: "2024-02-01",
    resume: "alice_resume.pdf",
    coverLetter: "I am very interested in this internship opportunity..."
  },
  {
    id: 2,
    studentId: 6,
    opportunityId: 2,
    status: "accepted",
    appliedAt: "2024-01-25",
    resume: "bob_resume.pdf",
    coverLetter: "I believe I meet all the requirements for this scholarship..."
  },
  {
    id: 3,
    studentId: 7,
    opportunityId: 3,
    status: "declined",
    appliedAt: "2024-01-30",
    resume: "carol_resume.pdf",
    coverLetter: "I would love to be mentored by an industry expert..."
  }
];

// Helper functions for data manipulation
export const getUserById = (id) => {
  const allUsers = [mockUsers.admin, ...mockUsers.alumni, ...mockUsers.students];
  return allUsers.find(user => user.id === id);
};

export const getOpportunitiesByType = (type) => {
  return mockOpportunities.filter(opp => opp.type === type);
};

export const getApplicationsByStudent = (studentId) => {
  return mockApplications.filter(app => app.studentId === studentId);
};

export const getApplicationsByOpportunity = (opportunityId) => {
  return mockApplications.filter(app => app.opportunityId === opportunityId);
};
