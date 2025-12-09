import React from 'react';
import { formatCurrency, getSRText } from '../utils/formatters';

const InfoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const SummaryCards = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="summary-cards">
      <div className="summary-card">
        <div className="summary-card-label">
          Total units sold
          <InfoIcon />
        </div>
        <div className="summary-card-value">{summary.totalUnitsSold.toLocaleString()}</div>
      </div>
      
      <div className="summary-card">
        <div className="summary-card-label">
          Total Amount
          <InfoIcon />
        </div>
        <div className="summary-card-value">{formatCurrency(summary.totalAmount)}</div>
        <div className="summary-card-subtext">({getSRText(summary.recordCount)})</div>
      </div>
      
      <div className="summary-card">
        <div className="summary-card-label">
          Total Discount
          <InfoIcon />
        </div>
        <div className="summary-card-value">{formatCurrency(summary.totalDiscount)}</div>
        <div className="summary-card-subtext">({getSRText(summary.recordCount)})</div>
      </div>
    </div>
  );
};

export default SummaryCards;
