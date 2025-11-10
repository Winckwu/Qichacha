# MCA System Setup Guide

## Prerequisites

- Node.js 18 or higher
- pnpm 8 or higher
- PostgreSQL 14 or higher
- API Keys:
  - OpenAI API key (required)
  - Anthropic Claude API key (optional, for multi-model comparison)
  - Google Gemini API key (optional, for multi-model comparison)

## Installation Steps

### 1. Install Dependencies

```bash
# Install pnpm if not already installed
npm install -g pnpm

# Install all dependencies
pnpm install
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb mca_system

# Or using psql
psql -U postgres
CREATE DATABASE mca_system;
\q
```

### 3. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your configuration
nano .env
```

Required environment variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mca_system?schema=public"

# OpenAI (Required)
OPENAI_API_KEY="your-openai-api-key-here"

# Claude API (Optional - for multi-model comparison)
CLAUDE_API_KEY="your-claude-api-key-here"

# Google Gemini (Optional - for multi-model comparison)
GEMINI_API_KEY="your-gemini-api-key-here"

# Server
PORT=3001
NODE_ENV=development

# Frontend
VITE_API_URL=http://localhost:3001

# Session
SESSION_SECRET="change-this-to-a-random-secret-in-production"

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 4. Database Migration

```bash
# Generate Prisma client
cd apps/api
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev --name init

# Go back to root
cd ../..
```

### 5. Start Development Servers

```bash
# Start both frontend and backend
pnpm dev
```

This will start:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### 6. Verify Installation

Open your browser and navigate to:
- Frontend: http://localhost:5173
- API Health Check: http://localhost:3001/health

## Development Tools

### Prisma Studio (Database GUI)

```bash
pnpm db:studio
```

This opens Prisma Studio at http://localhost:5555

### Type Checking

```bash
pnpm type-check
```

### Linting

```bash
pnpm lint
```

### Code Formatting

```bash
pnpm format
```

## Project Structure

```
mca-system/
├── apps/
│   ├── web/                    # React frontend
│   │   ├── src/
│   │   │   ├── components/     # UI components
│   │   │   ├── pages/          # Page components
│   │   │   ├── lib/            # Utilities and API
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   └── types/          # TypeScript types
│   │   └── package.json
│   │
│   └── api/                    # Express backend
│       ├── src/
│       │   ├── routes/         # API routes
│       │   ├── controllers/    # Request handlers
│       │   ├── services/       # Business logic
│       │   │   ├── confidence/           # Confidence calculation
│       │   │   ├── ai-integration/       # AI API integrations
│       │   │   ├── pattern-recognition/  # Pattern classification
│       │   │   └── skill-monitoring/     # Independence tracking
│       │   ├── lib/            # Utilities
│       │   └── types/          # TypeScript types
│       ├── prisma/
│       │   └── schema.prisma   # Database schema
│       └── package.json
│
├── package.json                # Root package.json
├── pnpm-workspace.yaml         # Workspace configuration
└── README.md
```

## Key Features

### 1. Confidence Scoring (MR13)
Every AI response includes a multi-factor confidence score:
- Model uncertainty
- Knowledge base match
- Information recency
- Domain reliability
- Source consensus

### 2. Pattern Recognition
The system identifies 6 user behavior patterns:
- **Pattern A**: Strategic Thinker
- **Pattern B**: Iterative Learner
- **Pattern C**: Calibrated Delegator
- **Pattern D**: Efficient User
- **Pattern E**: Over-Reliant
- **Pattern F**: Uncritical Acceptor

### 3. Adaptive Interface
UI adapts based on detected user pattern:
- Pattern A: Enhanced verification tools
- Pattern F: Intervention prompts

### 4. Skill Monitoring
Tracks independence ratio and alerts on skill degradation risks:
- Daily/weekly metrics
- Skill breakdown by task type
- Trend analysis
- Alert system

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
pg_isready

# Test connection
psql -U postgres -d mca_system -c "SELECT 1;"
```

### Port Already in Use

```bash
# Change ports in .env
PORT=3002  # Backend
# And in apps/web/vite.config.ts for frontend
```

### Prisma Client Issues

```bash
# Regenerate Prisma client
cd apps/api
pnpm prisma generate
```

### TypeScript Errors

```bash
# Clean and rebuild
rm -rf node_modules dist .next
pnpm install
pnpm build
```

## Next Steps

1. **Test the Chat Interface**: Visit http://localhost:5173 and start a conversation
2. **View Dashboard**: Navigate to the Dashboard to see skill metrics
3. **Check Confidence Scores**: Every AI response shows confidence breakdown
4. **Explore Pattern Detection**: The system will classify your usage pattern

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use strong `SESSION_SECRET`
3. Configure production database
4. Set up SSL/TLS
5. Configure CORS properly
6. Enable rate limiting
7. Set up monitoring and logging

## Support

For issues or questions:
- Check the main README.md
- Review code comments
- Check API documentation at `/api/health`

## License

MIT
