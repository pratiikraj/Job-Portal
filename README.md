# Job-O-Hunt

Job-O-Hunt is a full-stack **MERN** (MongoDB · Express · React · Node.js) Job Portal that streamlines every step of the hiring workflow — from posting openings to accepting candidates. Users choose a role (**Applicant** or **Recruiter**) at sign-up, and the platform tailors every screen to that role.

> Login sessions are persistent and all REST API endpoints are secured with JWT token verification.

## 🌐 Live Demo - https://frontend-alpha-eight-33.vercel.app/

---

## ✨ Key Features

### Recruiter

| Feature | Description |
|---|---|
| **Create Jobs** | Post jobs with title, description, company name, location, salary, job type (Full-time / Part-time / Work from Home), duration, deadline, required skills, positions available, bond details, and company website link. |
| **Manage Jobs** | View all posted jobs on the **My Jobs** page with options to **Update Details**, **View Applications**, or **Delete Job**. |
| **Application Screening** | Shortlist, accept, or reject applicants. View applicant résumés and ratings. |
| **Accepted Applicants** | View all accepted candidates with the option to end/terminate the job relationship. |
| **Profile Management** | Edit recruiter profile information including name, contact, and bio. |

### Applicant

| Feature | Description |
|---|---|
| **Browse Jobs** | View all available job listings on the home feed with detailed job cards showing company name, location, salary, bond info, company website, skills, and more. |
| **Fuzzy Search & Filters** | Search jobs by title and filter by job type, salary range, duration, and sort by salary/duration/rating. |
| **Apply for Jobs** | Apply to job listings directly from the feed. |
| **Not Interested** | Hide irrelevant jobs from the feed or withdraw pending applications. Hidden jobs are stored locally for a clean, personalized feed. |
| **Track Applications** | View all submitted applications with real-time status badges — **Applied** (yellow), **Shortlisted** (green), **Accepted** (green), **Rejected** (red), **Cancelled** / **Deleted** (grey). |
| **Profile Management** | Edit profile, upload profile picture, upload résumé, and manage skills. |

### Common

- **Role-based routing** — Recruiters and applicants see entirely different dashboards.
- **Responsive UI** — Built with Material-UI for a clean, modern interface.
- **Ratings** — Applicants can rate jobs; recruiters can rate employees.

---

## 📁 Directory Structure

```
job-portal/
├── backend/
│   ├── db/                 # Mongoose models (User, Job, Application, etc.)
│   ├── lib/                # Passport strategies & auth helpers
│   ├── routes/             # Express API routes
│   ├── public/             # Uploaded files (résumés, profile pictures)
│   ├── server.js           # Express server entry point
│   ├── .env                # Environment variables
│   └── package.json
├── frontend/
│   ├── public/             # Static assets & index.html
│   └── src/
│       ├── component/      # React components
│       │   ├── recruiter/  # Recruiter-specific views
│       │   ├── Home.js     # Job feed (applicant view)
│       │   ├── Applications.js
│       │   ├── Login.js
│       │   ├── Signup.js
│       │   ├── Profile.js
│       │   ├── Navbar.js
│       │   └── Welcome.js
│       ├── lib/            # API helpers & context
│       └── App.js          # Router & app shell
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14+)
- **MongoDB** (local instance or Atlas connection string)

### Installation & Run

```bash
# 1. Clone the repository
git clone <repo-url>
cd job-portal

# 2. Set up the backend
cd backend
npm install

# 3. Configure environment variables
#    Create/edit .env with your MongoDB URI, JWT secret, etc.

# 4. Start the backend server (port 4444)
npm start          # or: npm run dev  (uses nodemon for hot-reload)

# 5. In a new terminal, set up the frontend
cd ../frontend
npm install

# 6. Start the frontend dev server (port 3000)
npm start          # or: npm run dev

# 7. Open http://localhost:3000 in your browser
```

---

## 🗄️ Data Models

| Model | File | Purpose |
|---|---|---|
| **User** | `backend/db/User.js` | Authentication credentials and role (`applicant` / `recruiter`) |
| **JobApplicant** | `backend/db/JobApplicant.js` | Extended applicant profile (education, skills, résumé) |
| **Recruiter** | `backend/db/Recruiter.js` | Extended recruiter profile (company name, bio, contact) |
| **Job** | `backend/db/Job.js` | Job listing with title, description, salary, bond, website, skills, etc. |
| **Application** | `backend/db/Application.js` | Tracks each applicant–job relationship and its status |
| **Rating** | `backend/db/Rating.js` | Applicant ↔ Job ratings |

---

## 🔗 API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/signup` | Register a new user |
| POST | `/auth/login` | Login and receive JWT |

### Jobs
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/jobs` | List all jobs (with search & filter query params) |
| GET | `/api/jobs/:id` | Get a single job by ID |
| POST | `/api/jobs` | Create a new job (recruiter only) |
| PUT | `/api/jobs/:id` | Update job details (recruiter only) |
| DELETE | `/api/jobs/:id` | Delete a job (recruiter only) |

### Applications
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/applications` | Get applications (filtered by role) |
| POST | `/api/applications` | Apply to a job (applicant only) |
| PUT | `/api/applications/:id` | Update application status (shortlist/accept/reject) |

### Users
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/user` | Get current user profile |
| GET | `/api/user/:id` | Get user by ID |
| PUT | `/api/user` | Update profile |

### File Uploads
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/upload/resume` | Upload résumé (PDF) |
| POST | `/api/upload/profile` | Upload profile picture |

---

## 📦 Dependencies

### Frontend
| Package | Purpose |
|---|---|
| `react` / `react-dom` | UI library |
| `react-router-dom` | Client-side routing |
| `@material-ui/core` | Material Design component library |
| `@material-ui/icons` | Material icons |
| `@material-ui/lab` | Lab components (Rating, Autocomplete) |
| `axios` | HTTP client |
| `material-ui-chip-input` | Skill-tag chip input |
| `react-phone-input-2` | Phone number input with country codes |

### Backend
| Package | Purpose |
|---|---|
| `express` | Web framework |
| `mongoose` | MongoDB ODM |
| `passport` / `passport-local` / `passport-jwt` | Authentication strategies |
| `jsonwebtoken` | JWT generation & verification |
| `bcrypt` | Password hashing |
| `multer` | File upload handling |
| `cloudinary` | Cloud image/file storage |
| `nodemailer` | Email notifications |
| `dotenv` | Environment variable management |
| `cors` | Cross-origin resource sharing |
| `body-parser` | Request body parsing |
| `uuid` | Unique ID generation |
| `connect-mongo` / `express-session` | Session store |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 17, Material-UI v4 |
| **Backend** | Node.js, Express |
| **Database** | MongoDB (Mongoose ODM) |
| **Auth** | Passport.js + JWT |
| **File Storage** | Cloudinary + Multer |
| **Dev Tools** | Nodemon, cross-env |

---

## 📄 License

ISC
