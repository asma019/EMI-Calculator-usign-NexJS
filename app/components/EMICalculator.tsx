'use client';

import { useState, useEffect } from 'react';
import { 
  calculateEMI, 
  calculateTotalPayment, 
  calculateTotalInterest, 
  generateAmortizationSchedule,
  formatCurrency,
  AmortizationRow,
  CurrencyType,
  getCurrencySymbol
} from '../utils/emiCalculator';

const EMICalculator = () => {
  // State for input values
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(8);
  const [loanTenure, setLoanTenure] = useState(5);
  const [tenureType, setTenureType] = useState<'year' | 'month'>('year');
  const [currencyType, setCurrencyType] = useState<CurrencyType>('BDT');
  
  // State for calculation results
  const [emi, setEmi] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [schedule, setSchedule] = useState<AmortizationRow[]>([]);
  
  // State for current page of payment schedule
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 12; // Display 12 months per page
  
  // Check if running in iframe
  const [isInIframe, setIsInIframe] = useState(false);
  
  useEffect(() => {
    try {
      setIsInIframe(window.self !== window.top);
    } catch (e) {
      setIsInIframe(true);
    }
  }, []);
  
  // Function to handle calculations
  const handleCalculate = () => {
    try {
      if (loanAmount <= 0 || interestRate < 0 || loanTenure <= 0) {
        alert('Please enter valid values');
        return;
      }
      
      // Convert tenure to years if it's in months
      const tenureInYears = tenureType === 'month' ? loanTenure / 12 : loanTenure;
      
      const calculatedEmi = calculateEMI(loanAmount, interestRate, tenureInYears);
      const calculatedTotalPayment = calculateTotalPayment(calculatedEmi, tenureInYears);
      const calculatedTotalInterest = calculateTotalInterest(calculatedTotalPayment, loanAmount);
      const amortizationSchedule = generateAmortizationSchedule(loanAmount, interestRate, tenureInYears);
      
      setEmi(calculatedEmi);
      setTotalPayment(calculatedTotalPayment);
      setTotalInterest(calculatedTotalInterest);
      setSchedule(amortizationSchedule);
    } catch (error) {
      console.error('Calculation error:', error);
      alert('An error occurred during calculation');
    }
  };
  
  // Calculate whenever inputs change
  useEffect(() => {
    handleCalculate();
  }, [loanAmount, interestRate, loanTenure, tenureType]);
  
  // Get current page items for payment schedule
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = schedule.slice(indexOfFirstRow, indexOfLastRow);
  
  // Function to handle pagination
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // Function to download payment schedule as CSV
  const downloadPaymentSchedule = () => {
    // Create CSV content
    const headers = ['Month', 'EMI', 'Principal', 'Interest', 'Balance'];
    const csvContent = [
      headers.join(','),
      ...schedule.map(row => [
        row.month,
        row.emi.toFixed(2),
        row.principal.toFixed(2),
        row.interest.toFixed(2),
        row.balance.toFixed(2)
      ].join(','))
    ].join('\n');
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'loan_payment_schedule.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Send height message to parent (for iframe integration)
  useEffect(() => {
    if (isInIframe) {
      const sendHeight = () => {
        const height = document.body.scrollHeight;
        window.parent.postMessage({ type: 'resize', height }, '*');
      };
      
      // Send initial height
      sendHeight();
      
      // Create observer to monitor size changes
      const resizeObserver = new ResizeObserver(sendHeight);
      resizeObserver.observe(document.body);
      
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [isInIframe]);
  
  return (
    <div className={`w-full max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden ${isInIframe ? 'iframe-container' : ''}`}>
      <div className="p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-gray-800">Loan EMI Calculator</h1>
        
        {/* Currency Selector */}
        <div className="mb-4 md:mb-6 flex justify-end">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setCurrencyType('BDT')}
              className={`px-3 py-1.5 md:px-4 md:py-2 text-sm font-medium rounded-l-lg border ${
                currencyType === 'BDT' 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              BDT (৳)
            </button>
            <button
              type="button"
              onClick={() => setCurrencyType('USD')}
              className={`px-3 py-1.5 md:px-4 md:py-2 text-sm font-medium rounded-r-lg border ${
                currencyType === 'USD' 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              USD ($)
            </button>
          </div>
        </div>
        
        {/* Input Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Loan Amount</label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">{getCurrencySymbol(currencyType)}</span>
              </div>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 py-2 md:py-3"
                placeholder="100000"
                min="1"
              />
            </div>
            <input
              type="range"
              min="10000"
              max="1000000"
              step="10000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 py-2 md:py-3 pr-10"
                placeholder="8"
                min="0"
                step="0.1"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 sm:text-sm">%</span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Loan Tenure</label>
            <div className="flex gap-2">
              <div className="relative flex-1 rounded-md shadow-sm">
                <input
                  type="number"
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(Number(e.target.value))}
                  className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 py-2 md:py-3"
                  placeholder={tenureType === 'year' ? "5" : "60"}
                  min="1"
                  max={tenureType === 'year' ? "30" : "360"}
                />
              </div>
              <div className="w-1/3">
                <select
                  value={tenureType}
                  onChange={(e) => setTenureType(e.target.value as 'year' | 'month')}
                  className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 py-2 md:py-3 pr-10"
                >
                  <option value="year">Years</option>
                  <option value="month">Months</option>
                </select>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max={tenureType === 'year' ? "30" : "360"}
              step="1"
              value={loanTenure}
              onChange={(e) => setLoanTenure(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
        
        {/* Results Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 md:p-4 rounded-lg shadow-md text-white">
            <h3 className="text-xs md:text-sm font-medium mb-1">Monthly EMI</h3>
            <p className="text-xl md:text-2xl font-bold">{formatCurrency(emi, currencyType)}</p>
          </div>
          
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-3 md:p-4 rounded-lg shadow-md text-white">
            <h3 className="text-xs md:text-sm font-medium mb-1">Total Interest</h3>
            <p className="text-xl md:text-2xl font-bold">{formatCurrency(totalInterest, currencyType)}</p>
          </div>
          
          <div className="bg-gradient-to-r from-violet-500 to-violet-600 p-3 md:p-4 rounded-lg shadow-md text-white">
            <h3 className="text-xs md:text-sm font-medium mb-1">Total Payment</h3>
            <p className="text-xl md:text-2xl font-bold">{formatCurrency(totalPayment, currencyType)}</p>
          </div>
        </div>
        
        {/* Chart Visualization */}
        <div className="bg-gray-50 p-3 md:p-4 rounded-lg mb-6 md:mb-8">
          <h3 className="text-base md:text-lg font-medium text-gray-800 mb-3 md:mb-4">Payment Breakdown</h3>
          <div className="flex h-16 md:h-20 items-end">
            <div className="bg-blue-500 h-full" style={{ width: `${(loanAmount / totalPayment) * 100}%` }}></div>
            <div className="bg-emerald-500 h-full" style={{ width: `${(totalInterest / totalPayment) * 100}%` }}></div>
          </div>
          <div className="flex justify-between text-xs md:text-sm text-gray-600 mt-2">
            <div className="flex items-center">
              <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-500 rounded-full mr-1 md:mr-2"></div>
              <span>Principal ({Math.round((loanAmount / totalPayment) * 100)}%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 md:w-3 md:h-3 bg-emerald-500 rounded-full mr-1 md:mr-2"></div>
              <span>Interest ({Math.round((totalInterest / totalPayment) * 100)}%)</span>
            </div>
          </div>
        </div>
        
        {/* Payment Schedule */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="flex justify-between items-center p-3 md:p-4 border-b">
            <h3 className="text-base md:text-lg font-medium text-gray-800">Payment Schedule</h3>
            <button 
              onClick={downloadPaymentSchedule}
              className="px-3 py-1.5 md:px-4 md:py-2 bg-blue-600 text-white text-xs md:text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                  <th scope="col" className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMI</th>
                  <th scope="col" className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Principal</th>
                  <th scope="col" className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
                  <th scope="col" className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentRows.map((row) => (
                  <tr key={row.month}>
                    <td className="px-3 md:px-6 py-2 md:py-3 whitespace-nowrap text-xs md:text-sm text-gray-500">{row.month}</td>
                    <td className="px-3 md:px-6 py-2 md:py-3 whitespace-nowrap text-xs md:text-sm text-gray-500">{formatCurrency(row.emi, currencyType)}</td>
                    <td className="px-3 md:px-6 py-2 md:py-3 whitespace-nowrap text-xs md:text-sm text-gray-500">{formatCurrency(row.principal, currencyType)}</td>
                    <td className="px-3 md:px-6 py-2 md:py-3 whitespace-nowrap text-xs md:text-sm text-gray-500">{formatCurrency(row.interest, currencyType)}</td>
                    <td className="px-3 md:px-6 py-2 md:py-3 whitespace-nowrap text-xs md:text-sm text-gray-500">{formatCurrency(row.balance, currencyType)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {schedule.length > 0 && (
            <div className="flex justify-between items-center p-3 md:p-4 border-t">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 md:px-3 md:py-1 rounded-md bg-gray-100 text-gray-700 text-xs md:text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-xs md:text-sm text-gray-500">
                Page {currentPage} of {Math.ceil(schedule.length / rowsPerPage)}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(schedule.length / rowsPerPage)))}
                disabled={currentPage === Math.ceil(schedule.length / rowsPerPage)}
                className="px-2 py-1 md:px-3 md:py-1 rounded-md bg-gray-100 text-gray-700 text-xs md:text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EMICalculator; 