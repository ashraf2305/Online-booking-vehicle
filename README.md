# Online Vehicle Booking System

A comprehensive vehicle booking platform built with React and Tailwind CSS, featuring role-based access control for administrators, branch managers, and customers.

## 🚗 Features

### Admin Dashboard
- **User Management**: Approve/reject user registrations for branch admins and customers
- **Vehicle Management**: Add, edit, and manage vehicle inventory
- **Request Approval**: Review and approve vehicle requests from branch locations
- **Analytics**: Overview of system statistics and recent activities

### Branch Admin Dashboard
- **Profile Management**: Set up and manage branch information
- **Vehicle Requests**: Request vehicles from central inventory
- **Booking Management**: Approve/reject customer booking requests
- **Branch Analytics**: Track branch-specific metrics

### Customer Dashboard
- **Vehicle Search**: Advanced filtering by type, price range, and availability
- **Booking System**: Request vehicle bookings with date selection
- **Profile Management**: Maintain personal information and license details
- **Booking History**: Track all past and current bookings

## 🛠️ Technology Stack

- **Frontend**: React 18 with JSX
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **State Management**: React Context API with useReducer

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd online-vehicle-booking-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 👥 User Roles & Access

### Default Admin Account
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: Administrator

### User Registration
New users can register as either:
- **Branch Admin**: Requires admin approval
- **Customer**: Requires admin approval

## 📱 Application Flow

### For Customers
1. Register and wait for admin approval
2. Complete profile setup with personal details
3. Search and filter available vehicles
4. Submit booking requests with preferred dates
5. Wait for branch admin approval
6. Track booking status

### For Branch Admins
1. Register and wait for admin approval
2. Set up branch profile and information
3. Request vehicles from central inventory
4. Manage customer booking requests
5. Approve or reject bookings

### For Administrators
1. Login with admin credentials
2. Approve user registrations
3. Manage vehicle inventory
4. Review vehicle requests from branches
5. Monitor system-wide activities

## 🎨 Design Features

- **Modern UI**: Clean, professional interface with gradient accents
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Interactive Elements**: Hover effects, transitions, and micro-interactions
- **Consistent Theming**: Unified color scheme and typography
- **Accessibility**: Proper contrast ratios and semantic HTML

## 📁 Project Structure

```
src/
├── components/
│   ├── Admin/
│   │   ├── AdminDashboard.jsx
│   │   └── VehicleForm.jsx
│   ├── Auth/
│   │   └── Login.jsx
│   ├── BranchAdmin/
│   │   ├── BranchDashboard.jsx
│   │   ├── ProfileSetupForm.jsx
│   │   └── VehicleRequestForm.jsx
│   ├── Customer/
│   │   ├── CustomerDashboard.jsx
│   │   ├── VehicleCard.jsx
│   │   ├── BookingForm.jsx
│   │   └── ProfileSetupForm.jsx
│   └── Layout/
│       └── Header.jsx
├── context/
│   └── AppContext.jsx
├── types.js
├── App.jsx
├── main.jsx
└── index.css
```

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS for styling. Configuration can be found in `tailwind.config.js`.

### Vite Configuration
Build and development settings are in `vite.config.js`.

## 🚀 Deployment

### Build the project
```bash
npm run build
```

### Preview the build
```bash
npm run preview
```

The application can be deployed to any static hosting service like:
- Netlify
- Vercel
- GitHub Pages
- AWS S3

## 🔒 Security Features

- Role-based access control
- User approval workflow
- Protected routes based on user roles
- Input validation and sanitization

## 🎯 Future Enhancements

- Payment integration
- Real-time notifications
- Email confirmations
- Advanced reporting and analytics
- Mobile app development
- Integration with external APIs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Built with ❤️ using React and Tailwind CSS**