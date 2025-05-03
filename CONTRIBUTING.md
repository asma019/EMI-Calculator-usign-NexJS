# Contributing to EMI Calculator

Thank you for considering contributing to the EMI Calculator! This document outlines the process for contributing to this project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct: be respectful, considerate, and collaborative.

## How Can I Contribute?

### Reporting Bugs

- Check if the bug has already been reported in the Issues section
- Use the bug report template if available
- Include detailed steps to reproduce the bug
- Include screenshots if applicable
- Specify your operating system and browser

### Suggesting Features

- Check if the feature has already been suggested in the Issues section
- Use the feature request template if available
- Provide a clear description of the feature
- Explain why this feature would benefit the project

### Pull Requests

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Run tests to ensure your changes don't break functionality
5. Commit your changes: `git commit -m 'Add some feature'`
6. Push to the branch: `git push origin feature/your-feature-name`
7. Open a pull request

## Development Process

### Setting Up the Development Environment

1. Clone the repository: `git clone https://github.com/yourusername/emi-calculator.git`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

### Coding Standards

- Follow the existing code style
- Use TypeScript for type safety
- Use descriptive variable and function names
- Include comments for complex logic
- Write tests for new features

### Testing

- Ensure your code passes all existing tests: `npm run test`
- Add tests for new features
- Test on different browsers and screen sizes

## Project Structure

```
emi-calculator/
├── app/                  # Next.js app directory
│   ├── components/       # React components
│   │   └── EMICalculator.tsx
│   ├── utils/            # Utility functions
│   │   └── emiCalculator.ts
│   ├── globals.css       # Global styles
│   ├── iframe.css        # iframe-specific styles
│   ├── layout.tsx        # App layout
│   └── page.tsx          # Main page
├── public/               # Static assets
│   └── iframe-embed-code.html
├── next.config.js        # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── vercel.json           # Vercel deployment configuration
├── deploy.sh             # Deployment script
└── package.json          # Dependencies
```

## License

By contributing to this project, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).

---

Thank you for contributing to make the EMI Calculator better! 

— The AjkerProgram.com Team 