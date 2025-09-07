# SafeMama - Maternal Health Platform

A comprehensive maternal health platform connecting expecting mothers with healthcare professionals for safer, healthier pregnancies.

## Features

### Patient Features
- **AI-Powered Health Monitoring**: Intelligent symptom tracking with real-time risk assessment
- **Emergency Response System**: Instant access to emergency contacts and nearest healthcare facilities  
- **Smart Reminders**: Automated ANC appointments and medication reminders
- **Vital Signs Tracking**: Manual logging of BP, temperature, weight with trend analysis
- **Daily Health Chat**: Natural language symptom reporting with AI triage
- **Offline Capability**: PWA with offline data caching for remote areas
- **PDF Reports**: Automated daily/weekly health summaries

### Clinician Features
- **Real-time Console**: Dashboard with at-risk patients and active cases
- **Case Management**: Accept, track, and close patient cases
- **Availability Management**: On-call status and service radius configuration
- **Messaging Templates**: Pre-built SMS/WhatsApp response templates
- **Facility Directory**: Comprehensive healthcare facility database

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase (PostgreSQL, Auth, Storage)
- **AI/ML**: OpenAI GPT-3.5 for symptom classification
- **Communication**: Twilio (SMS/WhatsApp)
- **Maps**: Mapbox for facility location
- **PWA**: Next-PWA for offline functionality
- **UI Components**: Radix UI with custom design system

## Design System

### Colors
- **Primary**: `#1C3D3A` (Deep teal)
- **Secondary**: `#FAD9C1` (Warm peach)
- **Accent**: `#D4AF37` (Gold)
- **Background**: `#FAFAFA` (Off-white)
- **Text**: `#1B2735` (Dark slate)
- **Muted**: `#6C757D` (Gray)
- **Success**: `#2ECC71` (Green)
- **Warning**: `#FFC107` (Amber)
- **Danger**: `#E74C3C` (Red)

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)  
- **Vitals**: Roboto Mono (monospace)

### Features
- Dark mode support with class-based theming
- Accessible contrast ratios and focus management
- Mobile-first responsive design
- Touch-friendly 44px minimum target size

## Database Schema

### Core Tables
- `user_profiles` - User accounts with role-based access
- `pregnancies` - Pregnancy records with risk flags
- `vitals` - Vital signs measurements  
- `symptoms` - AI-labeled symptom reports with triage results
- `cases` - Emergency cases requiring clinical attention
- `facilities` - Healthcare facilities with services and location
- `messages` - SMS/WhatsApp communication log

### Security
- Row Level Security (RLS) enabled on all tables
- Role-based access control (patient, clinician, dispatcher, admin)
- Audit logging for all sensitive operations
- HIPAA-compliant data handling

## Environment Variables

Create a `.env.local` file with the following:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# ElevenLabs (for voice features)
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=your_elevenlabs_voice_id

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone

# Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token

# App Settings
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/safemama.git
   cd safemama
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Run the migration files in `supabase/migrations/`
   - Configure RLS policies
   - Add environment variables

4. **Configure external services**
   - Set up OpenAI API key
   - Configure Twilio for SMS/WhatsApp
   - Get Mapbox access token

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Expose your app publicly (for webhooks)**
   After running `npm run dev` in one terminal, open another terminal and run:
   ```bash
   npm run tunnel
   ```
   This will create a public ngrok URL (e.g., `https://abc123.ngrok.io`) that you can use for ElevenLabs webhooks and other external integrations.

## API Endpoints

### Patient APIs
- `POST /api/labels` - Classify symptoms using OpenAI
- `POST /api/triage` - Run triage rules and create cases
- `POST /api/vitals` - Log vital signs
- `GET /api/nearest-facilities` - Find nearby healthcare facilities
- `POST /api/summaries/[period]` - Generate PDF reports

### Communication APIs  
- `POST /api/messaging/send` - Send SMS/WhatsApp messages
- `POST /api/webhooks/twilio` - Handle inbound messages
- `GET /api/cron/daily-reminders` - Automated reminder system

### Clinician APIs
- `GET /api/console/cases` - Get assigned cases
- `PUT /api/cases/[id]` - Update case status
- `POST /api/availability` - Update on-call status

## Triage System

The AI-powered triage system classifies symptoms into three tiers:

### Tier 1 (Green) - Low Risk
- Self-care monitoring
- Regular check-ups
- **Action**: "Self care and monitor. Recheck tomorrow."

### Tier 2 (Amber) - Moderate Risk  
- Clinical assessment within 24 hours
- Enhanced monitoring
- **Action**: "Visit a clinic within 24 hours"

### Tier 3 (Red) - High Risk
- Immediate medical attention required
- Emergency response activated
- **Action**: "Go to the nearest equipped facility now"

### Rules Engine
- Blood pressure thresholds (140/90 moderate, 160/110 severe)
- Temperature monitoring (37.5°C moderate, 38.5°C severe)
- Symptom combinations (headache + vision changes = emergency)
- Gestational age considerations
- Risk factor evaluation

## Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

Test coverage includes:
- Triage rules engine
- API endpoint validation  
- Component rendering
- Database operations

## Deployment

### Vercel (Recommended)
1. Connect repository to Vercel
2. Configure environment variables
3. Deploy with automatic builds

### Manual Build
```bash
npm run build
npm start
```

### PWA Deployment
The app automatically generates:
- Service worker for offline caching
- Web app manifest
- Install prompts for mobile users

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Email: support@safemama.com
- Documentation: https://docs.safemama.com
- Issues: https://github.com/your-org/safemama/issues

---

**⚠️ Medical Disclaimer**: SafeMama is a health information platform and does not replace professional medical advice. Always consult healthcare providers for medical emergencies and clinical decisions.