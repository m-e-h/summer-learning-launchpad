# 3rd Grade Prep App

An interactive educational web application designed to help children prepare for 3rd grade through engaging activities in Math, Reading, Science, and Social Studies.

## Features

### 📚 **Subject Areas**
- **Math**: Multiplication & Division, Fractions, Telling Time
- **Reading**: Story comprehension, Grammar identification
- **Science**: Solar system exploration with interactive drag-and-drop
- **Social Studies**: North Carolina state symbols

### 🤖 **AI-Powered Learning**
- **Word Problems**: Generate custom math word problems using Gemini AI
- **Story Continuation**: AI continues reading stories for creative engagement
- **Planet Q&A**: Ask questions to planets and get child-friendly responses

### 🎨 **Modern UI/UX**
- Responsive design with Tailwind CSS
- Interactive animations and transitions
- Child-friendly interface with emojis and colors
- Mobile-first responsive design

## Tech Stack

- **Frontend**: React 18 with modern hooks
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS with PostCSS
- **AI Integration**: Google Gemini API
- **Development**: ESLint for code quality

## Project Structure

```
src/
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── NavButton.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── index.js
│   ├── layout/                # Layout components
│   │   ├── Header.jsx
│   │   ├── HomePage.jsx
│   │   └── index.js
│   ├── math/                  # Math-related components
│   │   ├── MultiplicationDivision.jsx
│   │   ├── FractionsPractice.jsx
│   │   ├── TellingTime.jsx
│   │   └── index.js
│   ├── reading/               # Reading components
│   │   ├── StoryTime.jsx
│   │   ├── GrammarPower.jsx
│   │   └── index.js
│   ├── science/               # Science components
│   │   ├── ScienceExplorer.jsx
│   │   └── index.js
│   └── social-studies/        # Social Studies components
│       ├── SocialStudiesExplorer.jsx
│       └── index.js
├── services/
│   └── geminiApi.js          # API service layer
├── App.jsx                   # Main application component
├── main.jsx                  # Application entry point
└── index.css                 # Global styles
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd class-prep
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

This project uses ESLint with React-specific rules. The configuration includes:
- React hooks rules
- React refresh plugin
- Unused disable directives reporting

### Component Architecture

- **UI Components**: Reusable, stateless components in `src/components/ui/`
- **Feature Components**: Subject-specific components with their own state
- **Layout Components**: App structure and navigation
- **Services**: External API calls and business logic

## API Integration

The app integrates with Google's Gemini AI API for enhanced learning experiences:

- **Word Problem Generation**: Creates contextual math problems
- **Story Continuation**: Extends reading stories creatively
- **Interactive Q&A**: Provides educational responses from "planets"

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with React and Vite for modern development experience
- Styled with Tailwind CSS for rapid UI development
- Enhanced with Google Gemini AI for interactive learning
- Designed with children's learning and engagement in mind