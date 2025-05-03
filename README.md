# 💰 Loan EMI Calculator

<p align="center">
  <img src="https://img.shields.io/badge/NextJS-15.3.1-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-4-blue?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

<p align="center">
  An open-source project by <a href="https://ajkerprogram.com" target="_blank">AjkerProgram.com</a>
</p>

A responsive and interactive web application to calculate loan EMI (Equated Monthly Installment), total interest, and payment schedule. Built with Next.js and optimized for embedding in WordPress sites.

![EMI Calculator Screenshot](https://via.placeholder.com/800x450.png?text=EMI+Calculator+Screenshot)

## ✨ Features

- 🧮 Calculate monthly EMI based on loan amount, interest rate, and loan tenure
- 💸 View total interest payable and total payment amount
- 🎚️ Interactive sliders for easy adjustment of input values 
- 📊 Visual breakdown of principal vs. interest payments
- 📑 Detailed amortization schedule showing month-by-month payments
- 📱 Fully responsive design across all devices
- 🔄 Switch between BDT (৳) and USD ($) currencies
- 📥 Download complete payment schedule as CSV file
- 📋 WordPress-ready embedding with auto-resizing iframe support

## 🚀 Demo

Check out the live demo: [EMI Calculator Demo](https://emi-calculator-demo.vercel.app)

## 🛠️ Built With

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) - Animations

## 🧮 How the EMI Calculation Works

The calculator uses the standard EMI formula:

```
EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1]
```

Where:
- P = Principal (loan amount)
- r = Monthly interest rate (annual rate ÷ 12 ÷ 100)
- n = Loan tenure in months

The amortization schedule is calculated by tracking remaining balance with each payment:
1. Interest for the month = Remaining balance × monthly interest rate
2. Principal for the month = EMI - Interest for the month
3. New remaining balance = Previous remaining balance - Principal for the month

## 🏁 Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/emi-calculator.git
   cd emi-calculator
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

### Deploying to Vercel

This application is optimized for deployment on Vercel.

#### Using the Deployment Script

1. Make sure you have the Vercel CLI installed
2. Run the deployment script:
   ```bash
   ./deploy.sh
   ```
3. Follow the prompts to complete the deployment

#### Manual Deployment

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Build the application:
   ```bash
   npm run build
   ```

3. Deploy to Vercel:
   ```bash
   vercel --prod
   ```

## 🔌 WordPress Integration

### Embedding the Calculator

After deploying to Vercel, you can easily embed this calculator in your WordPress site:

1. Go to your deployed application URL
2. Click on "Get WordPress Embed Code" at the bottom of the page
3. Choose between the basic or advanced embed code
4. In WordPress, add a "Custom HTML" block and paste the code
5. Replace `REPLACE_WITH_YOUR_DEPLOYMENT_URL` with your actual Vercel deployment URL

### Example Embed Code

```html
<div style="max-width: 100%; margin: 0 auto;">
  <iframe 
    src="https://your-deployment-url.vercel.app" 
    width="100%" 
    height="900px" 
    style="border: none; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); max-width: 100%;" 
    title="Loan EMI Calculator" 
    allowfullscreen 
    loading="lazy">
  </iframe>
</div>
```

## 📁 Project Structure

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

## 🔧 Customization

### Changing Default Values

Edit the `EMICalculator.tsx` component to modify default values:

```typescript
// State for input values
const [loanAmount, setLoanAmount] = useState(100000); // Default loan amount
const [interestRate, setInterestRate] = useState(8);  // Default interest rate
const [loanTenure, setLoanTenure] = useState(5);     // Default loan tenure
```

### Adding More Currencies

To add more currencies, modify the `CurrencyType` type and related functions in `emiCalculator.ts`:

```typescript
export type CurrencyType = 'BDT' | 'USD' | 'EUR'; // Add more currencies here

// Update currency config
const currencyConfig: Record<CurrencyType, { locale: string, currency: string }> = {
  BDT: { locale: 'bn-BD', currency: 'BDT' },
  USD: { locale: 'en-US', currency: 'USD' },
  EUR: { locale: 'en-EU', currency: 'EUR' } // Add new currency config
};
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- Open-source project by [AjkerProgram.com](https://ajkerprogram.com)
- EMI calculation formulas based on standard financial calculations
- Built with Next.js, deployed on Vercel

---

Made with ❤️ by [AjkerProgram.com](https://ajkerprogram.com)
