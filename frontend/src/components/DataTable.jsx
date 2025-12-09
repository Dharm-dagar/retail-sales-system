import React, { useState } from "react";
import { formatDate, formatPhone, copyToClipboard } from "../utils/formatters";

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const EmptyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
  </svg>
);

const DataTable = ({ data, loading }) => {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyPhone = async (phone, id) => {
    const success = await copyToClipboard(phone);
    if (success) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    }
  };

  if (loading) {
    return (
      <div className="table-container">
        <div className="loading-container">
          <div className="loading-spinner" />
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <EmptyIcon />
          <h3>No results found</h3>
          <p>Try adjusting your filters or search.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Date</th>
              <th>Customer ID</th>
              <th>Customer Name</th>
              <th>Phone Number</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Product Category</th>
              <th>Quantity</th>
              <th>Total Amount</th>
              <th>Customer Region</th>
              <th>Product ID</th>
              <th>Employee Name</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => (
              <tr key={row.transactionId || index}>
                <td>{row.transactionId}</td>
                <td>{formatDate(row.date)}</td>
                <td>{row.customerId}</td>
                <td>{row.customerName}</td>

                <td>
                  <div className="phone-cell">
                    {formatPhone(row.phoneNumber)}
                    <button
                      className="copy-btn"
                      onClick={() => handleCopyPhone(row.phoneNumber, row.transactionId)}
                    >
                      {copiedId === row.transactionId ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </div>
                </td>

                <td>{row.gender}</td>
                <td>{row.age}</td>
                <td>{row.productCategory}</td>
                <td>{String(row.quantity).padStart(2, "0")}</td>
                <td>₹ {row.finalAmount ?? row.totalAmount}</td>
                <td>{row.customerRegion}</td>
                <td>{row.productId}</td>
                <td>{row.employeeName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
