# MCA System - Feature Documentation

## Overview

The Metacognitive Collaborative Agent (MCA) System is designed to promote healthy AI usage patterns and prevent skill degradation through intelligent monitoring and adaptive interfaces.

## Core Features

### 1. Transparent Uncertainty Display (MR13)

**Purpose**: Help users understand AI confidence levels to make informed decisions.

**Implementation**:
- Multi-factor confidence scoring algorithm
- Visual confidence indicators with color coding
- Detailed factor breakdown on hover
- Real-time calculation for every AI response

**Confidence Factors**:
1. **Model Uncertainty** (20% weight): Based on response characteristics and hedging language
2. **Knowledge Base Match** (30% weight): Presence of specific facts, citations, and detailed information
3. **Recency Penalty** (20% weight): Adjustment for recent information that may be outdated
4. **Domain Reliability** (10% weight): Inherent reliability of the topic domain
5. **Source Consensus** (20% weight): Indicators of agreement or controversy

**Confidence Levels**:
- **High** (≥85%): Green indicator, high trust appropriate
- **Moderate** (50-85%): Yellow indicator, verification recommended
- **Low** (30-50%): Orange indicator, strong verification needed
- **Critical** (<30%): Red indicator, independent verification required

---

### 2. Pattern Recognition System

**Purpose**: Identify user behavior patterns to provide appropriate support and interventions.

**The 6 Patterns**:

#### Pattern A: Strategic Thinker ⭐
- **Characteristics**: High metacognition, systematic verification, task decomposition
- **Score Triggers**:
  - Task decomposition observed (+3)
  - Verification rate >70% (+2)
  - Planning time >5 minutes (+2)
  - Explicit goal statements (+1)
  - Critical questioning >2 (+1)
- **UI Adaptations**:
  - Task decomposition wizard
  - Prominent verification tools
  - Process tracking interface

#### Pattern B: Iterative Learner 🔄
- **Characteristics**: Trial and error, frequent revisions, adaptive strategy
- **Score Triggers**:
  - High iteration propensity >60% (+3)
  - Frequent revisions >3 (+2)
  - Multiple strategy adjustments (+2)
  - Moderate verification (+2)
- **UI Adaptations**:
  - Iteration history tracking
  - Version comparison tools
  - Learning progress visualization

#### Pattern C: Calibrated Delegator 🎯
- **Characteristics**: Appropriate trust calibration, context-aware AI use
- **Score Triggers**:
  - Trust calibration mentions >1 (+3)
  - AI capability awareness (+2)
  - Balanced independence 30-70% (+2)
  - High verification on high-stakes tasks (+2)
- **UI Adaptations**:
  - Trust dashboard
  - ROI calculator
  - Context-sensitive recommendations

#### Pattern D: Efficient User ✅
- **Characteristics**: Balanced AI use, good metacognition
- **Score Triggers**:
  - Independence ratio 40-60% (+3)
  - Moderate verification 30-60% (+2)
  - Metacognitive awareness 30-70% (+2)
  - Reasonable planning time 2-8 min (+2)
- **UI Adaptations**:
  - Standard interface
  - Optional enhancement tools

#### Pattern E: Over-Reliant ⚠️
- **Characteristics**: High AI dependence, limited verification
- **Score Triggers**:
  - Low independence <30% (+3)
  - Low verification <30% (+2)
  - Immediate AI use <1 min (+2)
  - Minimal critical questioning (+2)
- **UI Adaptations**:
  - Gentle prompts to try independently
  - Verification reminders
  - Skill development suggestions

#### Pattern F: Uncritical Acceptor 🚨
- **Characteristics**: Blind trust, minimal verification, skill degradation risk
- **Score Triggers**:
  - Very low verification <10% (+3)
  - Immediate reliance <30 sec (+2)
  - Superficial reading <2 sec/100 words (+2)
  - Critical independence deficit <20% (+2)
- **UI Adaptations**:
  - Strong intervention prompts
  - Mandatory reflection questions
  - "Try it yourself first" requirements
  - Skill degradation alerts

---

### 3. Behavioral Feature Extraction

**Purpose**: Quantify user behaviors for pattern recognition.

**18 Behavioral Features**:

#### Planning Indicators:
- **Task Decomposition Observed**: Detected breakdown of complex tasks
- **Explicit Goal Statement**: Clear articulation of objectives
- **Strategy Discussion**: Consideration of approaches
- **Time Before AI**: Duration of independent work before AI use

#### Monitoring Indicators:
- **Verification Rate**: Proportion of outputs verified
- **Output Reading Time**: Time spent reviewing AI responses
- **Revision Frequency**: How often users iterate

#### Evaluation Indicators:
- **Critical Questioning**: Frequency of "why" and "how" questions
- **Trust Calibration Mentions**: Discussion of AI reliability
- **Capability Awareness**: Recognition of AI limitations

#### Regulation Indicators:
- **Strategy Adjustments**: Changes in approach
- **Tool Switching**: Use of alternative methods

#### Task Context:
- **Task Complexity**: Estimated difficulty (0-1)
- **Task Stakes**: Low/Medium/High importance
- **Domain Familiarity**: User's expertise level

#### Longitudinal Indicators:
- **Independence Ratio**: Proportion of work done without AI
- **Iteration Propensity**: Tendency to refine work
- **Metacognitive Awareness**: Self-reflection score

---

### 4. Skill Monitoring Dashboard

**Purpose**: Track independence and prevent skill degradation.

**Key Metrics**:

#### Independence Tracker:
- Current ratio (30-day window)
- Trend analysis (improving/stable/declining)
- Comparison to baseline (60-90 days ago)
- Target threshold: 40% independence

#### Skill Breakdown:
- Writing independence
- Coding independence
- Analysis independence

#### Alert System:
- **None**: No concerns
- **Gentle**: Declining trend detected
- **Strong**: Below 30% with declining trend
- **Critical**: Below 20% independence

#### Historical Trends:
- 4-week rolling chart
- Milestone markers
- Goal progress visualization

#### AI-Free Time Scheduler:
- Daily practice slots
- Weekly skill challenges
- Custom schedules
- Emergency override option

---

### 5. Adaptive User Interface

**Purpose**: Provide pattern-appropriate support and interventions.

**Pattern-Specific Interfaces**:

#### For Pattern A (Strategic):
- Task Decomposition Wizard
- Enhanced Verification Panel
- Process Tracking Mode
- Advanced Analysis Tools

#### For Pattern F (Uncritical):
- Strong Warning Alerts
- "Try Solo First" Card
- Mandatory Reflection Questions
- Skill Development Resources

#### Universal Features:
- Confidence indicators on all responses
- Real-time pattern detection
- Adaptive scaffolding
- Contextual help

---

### 6. Verification Tools

**Multi-Model Comparison** (Planned):
- Parallel queries to GPT-4, Claude, Gemini
- Consensus analysis
- Difference highlighting
- Recommendation generation

**Fact Checking** (Planned):
- Automatic claim extraction
- Wikipedia/Wikidata verification
- Source citation
- Confidence scoring per claim

---

## Technical Architecture

### Frontend Stack:
- React 18 with TypeScript
- Tailwind CSS + Shadcn/ui
- Zustand for state management
- React Query for data fetching
- Recharts for visualizations

### Backend Stack:
- Node.js + Express
- Prisma ORM + PostgreSQL
- OpenAI API integration
- RESTful API design

### Database Schema:
- User → Sessions → Interactions
- Behavioral Signals tracking
- Pattern history (time series)
- Independence logs
- Skill assessments

---

## Usage Scenarios

### Scenario 1: High-Stakes Coding Task
1. User Pattern: A (Strategic Thinker)
2. Task Complexity: High (0.85)
3. Task Stakes: High
4. **System Response**:
   - Suggests task decomposition
   - Enables process tracking
   - Highlights verification tools
   - Shows detailed confidence breakdown

### Scenario 2: Quick Question
1. User Pattern: D (Efficient User)
2. Task Complexity: Low (0.3)
3. Task Stakes: Low
4. **System Response**:
   - Standard chat interface
   - Confidence indicator
   - Optional verification link

### Scenario 3: Declining Independence
1. User Pattern: E → F (Degrading)
2. Independence: 18% (was 45%)
3. Verification Rate: 5%
4. **System Response**:
   - Critical alert displayed
   - "Try it yourself first" intervention
   - Mandatory reflection questions
   - Skill assessment recommendation

---

## Future Enhancements

1. **Multi-Model Integration**: Full Claude + Gemini support
2. **Advanced Fact Checking**: NLP-based claim extraction
3. **Personalized Learning Paths**: Adaptive skill development
4. **Team Analytics**: Organization-wide patterns
5. **Mobile App**: iOS and Android clients
6. **Browser Extension**: In-context support
7. **API Access**: Third-party integrations

---

## Research Foundation

Based on research in:
- Metacognitive scaffolding
- Trust calibration in AI
- Skill maintenance with AI assistants
- Behavioral pattern recognition
- Adaptive user interfaces

## Success Metrics

1. **Metacognitive Awareness**: +40% in detected metacognitive behaviors
2. **Independence Maintenance**: >40% independent work ratio
3. **Verification Rate**: >30% for moderate-confidence responses
4. **Pattern Distribution**: <15% users in Pattern F
5. **User Satisfaction**: >4.0/5.0 rating

---

For implementation details, see:
- `/apps/api/src/services/` - Backend services
- `/apps/web/src/components/` - UI components
- `SETUP.md` - Installation guide
