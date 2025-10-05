# Alumni Connect & Scholarship Support Platform

A modern, responsive React application that connects alumni with students through opportunities, mentorship, and scholarship support.

## 🚀 Features

### For Students
- **Browse Opportunities**: Discover internships, scholarships, and mentorship programs
- **Apply for Programs**: Submit applications with resume and cover letter
- **Track Applications**: Monitor application status and upload additional documents
- **Profile Management**: Maintain academic and personal information
- **Success Stories**: Get inspired by alumni journeys

### For Alumni
- **Post Opportunities**: Create internships, scholarships, and mentorship programs
- **Review Applications**: Accept or decline student applications
- **Manage Profile**: Update professional information and bio
- **Track Impact**: Monitor application statistics and success rates
- **Share Stories**: Inspire students with success stories

### For Admins
- **User Management**: View and manage all platform users
- **Platform Overview**: Monitor platform statistics and activities
- **Analytics Dashboard**: Track platform performance and user engagement

## 🛠️ Tech Stack

- **Frontend**: React 19.1.1 with functional components and hooks
- **Routing**: React Router v6
- **Styling**: TailwindCSS for modern, responsive design
- **State Management**: React hooks (useState, useEffect)
- **Data**: Mock data with API-ready structure

## 📁 Project Structure

```
src/
├── App.js                 # Main application component with routing
├── index.js              # Application entry point
├── components/           # Reusable UI components
│   ├── Navbar.js        # Navigation bar
│   ├── Sidebar.js       # Dashboard sidebar
│   └── Footer.js        # Footer component
├── pages/               # Page components
│   ├── HomePage.js      # Landing page
│   ├── LoginPage.js     # User authentication
│   ├── RegisterPage.js   # User registration
│   ├── Admin/           # Admin-specific pages
│   │   ├── AdminDashboard.js
│   │   └── ManageUsersPage.js
│   ├── Alumni/          # Alumni-specific pages
│   │   ├── AlumniDashboard.js
│   │   ├── ProfilePage.js
│   │   ├── OpportunitiesPage.js
│   │   ├── InternshipPage.js
│   │   ├── ScholarshipPage.js
│   │   ├── MentorshipPage.js
│   │   ├── SuccessStoriesPage.js
│   │   └── ApplicationsPage.js
│   └── Student/         # Student-specific pages
│       ├── StudentDashboard.js
│       ├── ProfilePage.js
│       ├── OpportunitiesPage.js
│       ├── InternshipPage.js
│       ├── ScholarshipPage.js
│       ├── MentorshipPage.js
│       └── MyApplicationsPage.js
└── utils/
    └── mockData.js      # Sample data and helper functions
```

## 🎨 Design Features

- **Modern UI**: Clean, professional design with TailwindCSS
- **Responsive**: Mobile-first design that works on all devices
- **Accessibility**: Semantic HTML and keyboard navigation support
- **Dark/Light Theme**: Consistent color scheme with primary and secondary colors
- **Interactive Elements**: Hover effects, transitions, and smooth animations

## 🔐 Authentication & Authorization

- **Role-based Access**: Admin, Alumni, and Student roles with different permissions
- **Protected Routes**: Route protection based on authentication status and user role
- **Local Storage**: User session persistence across browser refreshes
- **Form Validation**: Client-side validation for all forms

## 📱 Responsive Design

- **Mobile Navigation**: Collapsible sidebar and mobile-friendly navigation
- **Grid Layouts**: Responsive grid systems for different screen sizes
- **Touch-friendly**: Optimized for touch interactions on mobile devices
- **Cross-browser**: Compatible with modern browsers

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd alumni-connect-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## 🔧 Configuration

### TailwindCSS
The project uses TailwindCSS with custom configuration:
- Custom color palette with primary and secondary colors
- Extended theme configuration
- Responsive breakpoints

### Mock Data
The application uses mock data located in `src/utils/mockData.js`:
- Sample users (admin, alumni, students)
- Sample opportunities (internships, scholarships, mentorship, success stories)
- Sample applications
- Helper functions for data manipulation

## 🌟 Key Features Implemented

### Dashboard Layouts
- **Admin Dashboard**: Platform overview with statistics and quick actions
- **Alumni Dashboard**: Opportunity management and application reviews
- **Student Dashboard**: Application tracking and opportunity discovery

### Form Handling
- **Registration**: Role-specific forms with validation
- **Login**: Email/password authentication with role selection
- **Profile Management**: Editable forms with real-time validation

### Data Management
- **CRUD Operations**: Create, read, update, delete operations for opportunities
- **Filtering & Search**: Advanced filtering and search functionality
- **Status Management**: Application status tracking and updates

## 🔮 Future Enhancements

- **Backend Integration**: Connect to Flask backend API
- **Real-time Notifications**: WebSocket integration for live updates
- **File Upload**: Resume and document upload functionality
- **Email Integration**: Automated email notifications
- **Advanced Analytics**: Detailed reporting and analytics
- **Mobile App**: React Native mobile application
- **Payment Integration**: Scholarship payment processing

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email support@alumniconnect.com or join our Slack channel.

---

Built with ❤️ by the Alumni Connect Team