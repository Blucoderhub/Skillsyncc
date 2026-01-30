# Skillsyncc Platform Architecture (CTO Edition)

As of v2.0, Skillsyncc has evolved from a simple browser extension into a unified **Career Acceleration Ecosystem**.

## 🏗️ 3-Tier Architecture

### 1. The Web Intelligence Center (`/web`)
- **Technology Stack**: Next.js 15 (App Router), Tailwind CSS, Framer Motion.
- **Design Philosophy**: **"Retro Premium"**—Combining 80s aesthetics (gold/amber accents, CRT scanlines) with modern Glassmorphism and premium typography.
- **Core Responsibility**: Source of truth for the **Professional Vault**. Users orchestrate their identity, skills, and STAR stories in a high-fidelity web environment.

### 2. The AI Copilot Extension (`src/`)
- **Technology Stack**: React, Vite, Chrome Extension Manifest V3.
- **UI/UX**: Fixed Vertical Dock (Glassmorphism) injected into job boards.
- **Core Responsibility**: The "Edge Assistant." It provides context-aware features like Magic Tailor, Autofill Buddy, and Expert Alignment exactly where the application happens.

### 3. The Neural Sync Engine
- **Protocol**: `BroadcastChannel` (Web-to-Ext Bridge).
- **Communication Flow**:
  1. User updates Profile on `Skillsyncc.com`.
  2. Web Dashboard broadcasts `PROFILE_UPDATED` via the `skillsyncc_sync` channel.
  3. Content Script (on open tabs) intercepts the broadcast and notifies the Background Worker.
  4. Background Worker persists the update to `chrome.storage.sync`.
  5. All active Copilot Docks update in real-time.

## 🧱 Key Components

| Component | Responsibility | Tech Detail |
| :--- | :--- | :--- |
| **Magic Tailor** | Resume/Summary Optimization | AI-driven content generation based on expert profile synergy. |
| **Autofill Buddy** | Form Assistance | Dom-aware field detection and expert value injection triggers. |
| **Expert Matching** | Role Assessment | Alignerr-grade semantic analysis and skill gap identification. |
| **Outreach Expert** | Networking | High-conversion message drafting focusing on technical synergry. |

## 📁 System Structure
```text
/
├── src/                # Chrome Extension Source
│   ├── background/     # Service Worker & Message Hub
│   ├── content/        # Floating UI & Sync Bridge
│   ├── shared/         # Core AI & Storage Logic
├── web/                # Skillsyncc.com Platform (Next.js)
│   ├── app/            # Retro-Premium Pages & Dashboard
│   ├── tailwind.config # Platform Design Tokens
```

## 🔐 Security & Privacy
- **Local-First**: All AI processing keys and personal data are stored in secure Chrome/Browser storage.
- **Encrypted Sync**: The bridge between web and extension is local to the user's browser instance.
- **Non-Intrusive**: No data is sent to Skillsyncc servers without explicit user interaction (e.g. cloud backup).


## Core Modules

### 1. Professional Vault (`src/shared/vault/vaultManager.ts`)
- Manages user profile data
- Handles resume versions
- Stores STAR stories
- Manages skills and experiences

### 2. Storage Manager (`src/shared/storage/storage.ts`)
- Wraps Chrome Storage API
- Handles profile, applications, and settings
- Uses `chrome.storage.sync` for profile data
- Uses `chrome.storage.local` for application data

### 3. Platform Detector (`src/shared/platforms/platformDetector.ts`)
- Detects job platform (LinkedIn, Indeed, etc.)
- Provides platform-specific adapters
- Extracts job descriptions
- Detects form fields for autofill

### 4. AI Service (`src/shared/ai/aiService.ts`)
- Resume optimization
- Job match analysis
- Answer generation
- Outreach drafting
- Supports OpenAI, Anthropic, and local models

### 5. Application Tracker (`src/shared/tracking/applicationTracker.ts`)
- Tracks application status
- Records outcomes
- Provides statistics
- Calculates response times

### 6. Autofill Manager (`src/shared/autofill/autofillManager.ts`)
- Generates field suggestions
- Maps profile data to form fields
- Requires user approval before filling

## Data Flow

1. **User visits job page** → Content script detects platform
2. **Content script extracts job** → Sends to background worker
3. **Background worker analyzes** → Uses AI service if configured
4. **Results displayed** → Overlay shows match score and suggestions
5. **User interacts** → Opens options page or triggers autofill
6. **Data stored** → Saved to Chrome storage

## Security & Privacy

- All data stored locally by default
- No data sent to external servers without user consent
- API keys stored securely in Chrome storage
- User approval required for all automated actions
- No silent form submissions

## Extension Points

### Adding New Platforms

1. Create adapter class implementing `PlatformAdapter`
2. Add detection logic in `PlatformDetector.detectPlatform()`
3. Add case in `PlatformDetector.getAdapter()`
4. Update manifest.json content_scripts matches

### Adding New AI Providers

1. Add provider type to `ExtensionSettings.aiProvider`
2. Implement provider method in `AIService`
3. Add provider selection in settings UI

### Extending Features

- Resume versions: Extend `ResumeVersion` type
- Application tracking: Extend `Application` type
- Autofill: Add field matching logic in `AutofillManager`

## Build Process

1. **Popup**: React + Tailwind → `dist/popup/`
2. **Options**: React + Tailwind → `dist/options/`
3. **Content**: TypeScript → `dist/content/`
4. **Background**: TypeScript → `dist/background/`
5. **Assets**: Copied to `dist/`

## Testing Strategy

- Unit tests for core modules (storage, vault, tracking)
- Integration tests for platform adapters
- E2E tests for user flows
- Manual testing on supported platforms

## Future Enhancements

- [ ] Cloud sync option (encrypted)
- [ ] Advanced analytics dashboard
- [ ] Resume templates library
- [ ] Interview preparation tools
- [ ] Salary negotiation assistant
- [ ] Company research integration
