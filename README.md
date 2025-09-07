# Home Appliance Tracker - Backend API

A robust Node.js/Express backend API for managing home appliances, built with TypeScript and Supabase.

## 🚀 Features

- **RESTful API** for appliance management
- **Supabase Integration** for database operations
- **TypeScript** for type safety
- **Express.js** with middleware for security and performance
- **CORS** configured for frontend communication
- **Error handling** and validation
- **Rate limiting** for API protection

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account and project
- Git

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd homeappliances/backend
   ```
2. **Install dependencies**

   ```bash
   npm install
   ```
3. **Environment Setup**

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your Supabase credentials:

   ```env
   # Database
   DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres

   # Server
   PORT=3001
   NODE_ENV=development

   # CORS
   FRONTEND_URL=http://localhost:8080

   # Supabase
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   # JWT (for future authentication)
   JWT_SECRET=your-jwt-secret
   JWT_EXPIRES_IN=3600
   ```

## 🗄️ Database Setup

### Supabase Configuration

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)
2. **Run the SQL scripts** in your Supabase SQL Editor:

   For development (permissive policies):

   ```sql
   -- Enable RLS on all tables
   ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.appliances ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.support_contacts ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.maintenance_tasks ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.linked_documents ENABLE ROW LEVEL SECURITY;

   -- Create permissive policies for development
   CREATE POLICY "Allow all operations on users" ON public.users FOR ALL USING (true) WITH CHECK (true);
   CREATE POLICY "Allow all operations on appliances" ON public.appliances FOR ALL USING (true) WITH CHECK (true);
   CREATE POLICY "Allow all operations on support_contacts" ON public.support_contacts FOR ALL USING (true) WITH CHECK (true);
   CREATE POLICY "Allow all operations on maintenance_tasks" ON public.maintenance_tasks FOR ALL USING (true) WITH CHECK (true);
   CREATE POLICY "Allow all operations on linked_documents" ON public.linked_documents FOR ALL USING (true) WITH CHECK (true);
   ```
3. **Seed the database** (optional):

   ```bash
   npm run seed
   ```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

The server will start on `http://localhost:3001`

### Production Mode

```bash
npm run build
npm start
```

## 📚 API Endpoints

### Appliances

- `GET /api/appliances` - Get all appliances
- `GET /api/appliances/:id` - Get appliance by ID
- `POST /api/appliances` - Create new appliance
- `PUT /api/appliances/:id` - Update appliance
- `DELETE /api/appliances/:id` - Delete appliance

### Health Check

- `GET /health` - Server health status

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # Supabase configuration
│   ├── controllers/
│   │   └── ApplianceController.ts # API route handlers
│   ├── middleware/
│   │   ├── errorHandler.ts      # Global error handling
│   │   └── validation.ts        # Request validation
│   ├── models/
│   │   └── schema.ts            # Database schema definitions
│   ├── routes/
│   │   ├── appliances.ts        # Appliance routes
│   │   └── index.ts             # Route aggregation
│   ├── services/
│   │   └── ApplianceService.ts  # Business logic
│   ├── types/
│   │   └── appliance.ts         # TypeScript type definitions
│   ├── data/
│   │   └── mockAppliances.ts    # Sample data
│   ├── app.ts                   # Express app configuration
│   └── server.ts                # Server startup
├── scripts/
│   ├── migrate.ts               # Database migrations
│   ├── seed.ts                  # Database seeding
│   ├── enable-rls-simple.sql    # RLS setup for development
│   └── fix-supabase-rls.sql     # Comprehensive RLS setup
├── package.json
├── tsconfig.json
├── nodemon.json
└── README.md
```

## 🛡️ Security Features

- **CORS** configured for specific origins
- **Helmet** for security headers
- **Rate limiting** to prevent abuse
- **Input validation** and sanitization
- **Error handling** without sensitive data exposure

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📝 Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data
- `npm test` - Run test suite
- `npm run lint` - Check code quality
- `npm run lint:fix` - Fix code quality issues

## 🌐 Environment Variables

| Variable                      | Description               | Required                  |
| ----------------------------- | ------------------------- | ------------------------- |
| `PORT`                      | Server port               | No (default: 3001)        |
| `NODE_ENV`                  | Environment mode          | No (default: development) |
| `SUPABASE_URL`              | Supabase project URL      | Yes                       |
| `SUPABASE_ANON_KEY`         | Supabase anonymous key    | Yes                       |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes                       |
| `FRONTEND_URL`              | Frontend URL for CORS     | No                        |
| `JWT_SECRET`                | JWT signing secret        | No (for future auth)      |

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**

   - Check your Supabase URL and keys
   - Ensure RLS policies are set up correctly
   - Verify network connectivity
2. **CORS Errors**

   - Update `FRONTEND_URL` in `.env`
   - Check CORS configuration in `app.ts`
3. **TypeScript Errors**

   - Run `npm run build` to check for type errors
   - Ensure all dependencies are installed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [troubleshooting section](#-troubleshooting)
2. Review the [API documentation](#-api-endpoints)
3. Open an issue on GitHub
4. Contact the development team

## 🔮 Future Enhancements

- [ ] User authentication and authorization
- [ ] File upload for appliance images
- [ ] Email notifications for maintenance reminders
- [ ] API rate limiting per user
- [ ] Database query optimization
- [ ] Comprehensive test coverage
- [ ] API documentation with Swagger
- [ ] Docker containerization
- [ ] CI/CD pipeline setup

---

**Happy Coding! 🚀**
