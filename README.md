# InternHub - AI-Powered Internship Matching Platform

InternHub is a modern, full-stack web application that uses artificial intelligence to match students with internship opportunities based on their skills, education, and experience.

## Features

### For Students
- **AI-Powered Recommendations**: Get personalized internship matches based on your profile
- **Match Scores**: See detailed compatibility scores explaining why each internship is a good fit
- **Profile Management**: Upload your resume and manage your education, experience, and skills
- **Application Tracking**: Apply to internships in seconds and track all your applications in one place
- **Responsive Design**: Access InternHub from any device

### For Recruiters/Admins
- **Internship Management**: Create, edit, and manage internship positions
- **Application Review**: Review student applications with detailed profile information
- **Candidate Evaluation**: Accept or reject applications directly from the dashboard
- **Analytics**: View application counts and status at a glance

## Technology Stack

### Frontend
- **React 19** - UI framework
- **Next.js 16** - React framework with file-based routing
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests

### Design
- **Dark theme** - Modern, professional appearance
- **Mobile-first** - Responsive design for all devices
- **Semantic colors** - Blue primary, green accents, neutral grays
- **Component-based** - Reusable, maintainable UI components

## Project Structure

```
├── app/                           # Next.js app directory
│   ├── (auth)/
│   │   ├── login/                # Student/Admin login page
│   │   └── register/             # Registration page
│   ├── student/                  # Student pages
│   │   ├── page.tsx              # Student dashboard
│   │   ├── profile/              # Profile management
│   │   ├── matches/              # AI-matched internships
│   │   └── applications/         # Application tracking
│   ├── admin/                    # Admin pages
│   │   ├── page.tsx              # Admin dashboard
│   │   ├── internships/          # Internship management
│   │   │   ├── page.tsx          # List internships
│   │   │   ├── new/              # Create internship
│   │   │   └── [id]/             # Edit internship
│   │   └── applications/         # Application review
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   └── page.tsx                  # Landing page
├── components/
│   ├── header.tsx                # Navigation header
│   └── layout.tsx                # Layout wrapper
├── lib/
│   ├── api.ts                    # API client
│   ├── auth.ts                   # Authentication utilities
│   └── matching.ts               # AI matching algorithm
├── public/                       # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd internhub
```

2. **Install dependencies**
```bash
npm install
# or
pnpm install
# or
yarn install
```

3. **Set up environment variables**
Create a `.env.local` file in the project root:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Integration

The frontend communicates with a backend API for authentication, data management, and matching. The API client is configured in `lib/api.ts`.

### API Endpoints Used

**Authentication**
- `POST /auth/register` - Create new account
- `POST /auth/login` - User login

**Students**
- `GET /students/:userId` - Get student profile
- `PUT /students/:userId` - Update student profile
- `POST /students/:userId/resume` - Upload resume

**Internships**
- `GET /internships` - List all internships
- `GET /internships/:id` - Get internship details
- `POST /internships` - Create internship (admin only)
- `PUT /internships/:id` - Update internship (admin only)
- `DELETE /internships/:id` - Delete internship (admin only)

**Matching**
- `GET /matches/recommended/:userId` - Get AI-matched internships

**Applications**
- `POST /applications` - Submit application
- `GET /applications/student/:studentId` - Get student applications
- `GET /applications` - Get all applications (admin only)
- `PUT /applications/:id` - Update application status (admin only)

## AI Matching Algorithm

The matching algorithm (`lib/matching.ts`) calculates compatibility scores using:

1. **Skill Matching (60%)** - Compares student skills with required skills
2. **GPA Matching (20%)** - Evaluates academic performance
3. **Education (10%)** - Checks for relevant degree programs
4. **Experience (10%)** - Assesses work experience relevance

Scores range from 0-100 and students see the top matches ranked by compatibility.

## Authentication Flow

1. User registers or logs in
2. Backend validates credentials and returns JWT token
3. Token stored in localStorage for persistence
4. API client automatically includes token in requests
5. User redirected based on account type (student/admin)

## Development Guide

### Adding a New Page

1. Create a new directory under `app/` with the route name
2. Add `page.tsx` file
3. Import `Layout` component for consistent header/footer
4. Use `apiClient` for backend calls
5. Use `getStoredUser()` to check authentication

### Styling

- Use Tailwind CSS classes
- Color values available: `primary`, `primary-dark`, `accent`, `neutral-light`, `neutral-mid`, `background`, `foreground`
- All colors defined in `globals.css` and `tailwind.config.js`

### Making API Calls

```typescript
import { apiClient } from '@/lib/api'

// Example
const response = await apiClient.getInternships()
```

## Building for Production

```bash
npm run build
npm start
```

The application will be optimized for production and ready to deploy.

## Deployment

Deploy to Vercel with a single command:

```bash
vercel deploy
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Security Considerations

- Passwords should be securely hashed on the backend (bcrypt)
- JWT tokens should have appropriate expiration times
- Always validate and sanitize user input on the backend
- Use HTTPS in production
- Implement rate limiting on API endpoints
- Store sensitive data (API keys, secrets) in environment variables

## Future Enhancements

- Real-time notifications for application updates
- Video interviews integration
- Company profiles and reviews
- Enhanced matching with ML models
- Email notifications
- Admin analytics dashboard
- Saved favorites for students
- Interview scheduling

## Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For issues or questions, please open an issue on GitHub or contact the development team.

---

**Made with Next.js and Tailwind CSS** | Powered by AI Matching Algorithm
