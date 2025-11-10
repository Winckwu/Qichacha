# MCA System - Metacognitive Collaborative Agent

An educational AI system designed to foster metacognitive awareness and prevent skill degradation through adaptive interfaces and intelligent monitoring.

## Core Features

1. **Uncertainty Visualization**: AI outputs with confidence scores
2. **Pattern Recognition**: Identifies 6 user behavior patterns (A-F)
3. **Adaptive Interface**: UI adjusts based on detected patterns
4. **Verification Tools**: Multi-model comparison and fact-checking
5. **Skill Monitoring**: Tracks independence and prevents over-reliance

## Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Shadcn/ui components
- Vite
- Zustand (state management)
- React Query (data fetching)

### Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- TypeScript

### AI Integration
- OpenAI GPT-4
- Anthropic Claude
- Google Gemini

## Project Structure

```
mca-system/
├── apps/
│   ├── web/          # React frontend application
│   └── api/          # Express backend API
├── packages/         # Shared packages (future)
├── pnpm-workspace.yaml
└── package.json
```

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm 8+
- PostgreSQL 14+

### Installation

```bash
# Install dependencies
pnpm install

# Setup database
pnpm db:migrate

# Start development servers
pnpm dev
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

## Development

```bash
# Run both frontend and backend
pnpm dev

# Build all apps
pnpm build

# Run linters
pnpm lint

# Format code
pnpm format

# Open Prisma Studio
pnpm db:studio
```

## Architecture

### User Patterns (A-F)

- **Pattern A**: Strategic thinker - high metacognition, systematic verification
- **Pattern B**: Iterative learner - trial and error approach
- **Pattern C**: Calibrated delegator - appropriate trust calibration
- **Pattern D**: Efficient user - balanced AI use
- **Pattern E**: Over-reliant - limited verification
- **Pattern F**: Uncritical acceptor - blind trust, skill degradation risk

### Key Modules

1. **Confidence Calculator**: Multi-factor confidence scoring
2. **Feature Extractor**: Behavioral feature analysis
3. **Pattern Classifier**: Rule-based pattern recognition
4. **Scaffolding Engine**: Context-adaptive support
5. **Verification Services**: Multi-model comparison and fact-checking
6. **Independence Tracker**: Skill monitoring and alerts

## License

MIT
