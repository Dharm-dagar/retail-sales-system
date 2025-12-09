import React from 'react';

// Icons as simple SVG components
const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const NexusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="16"></line>
    <line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);

const IntakeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const ServiceIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
  </svg>
);

const InvoiceIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <line x1="10" y1="9" x2="8" y2="9"></line>
  </svg>
);

const PreActiveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const ActiveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
  </svg>
);

const BlockedIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
  </svg>
);

const ClosedIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="16 12 12 8 8 12"></polyline>
    <line x1="12" y1="16" x2="12" y2="8"></line>
  </svg>
);

const ChevronIcon = ({ expanded }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    style={{ 
      width: '14px', 
      height: '14px', 
      marginLeft: 'auto',
      transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.2s ease'
    }}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const Sidebar = () => {
  const [servicesExpanded, setServicesExpanded] = React.useState(true);
  const [invoicesExpanded, setInvoicesExpanded] = React.useState(true);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img className='logo-img' src="/assets/img/logo.jpg" alt="" />
          <div className="sidebar-logo-text">
            <span className="sidebar-logo-title">Dharma Production</span>
            <span className="sidebar-logo-subtitle">Sales Portal</span>
          </div>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <a className="nav-item" href="#dashboard">
          <DashboardIcon />
          Dashboard
        </a>
        <a className="nav-item" href="#nexus">
          <NexusIcon />
          Nexus
        </a>
        <a className="nav-item" href="#intake">
          <IntakeIcon />
          Intake
        </a>
        
        <div className="nav-section">
          <div 
            className="nav-item" 
            onClick={() => setServicesExpanded(!servicesExpanded)}
          >
            <ServiceIcon />
            Services
            <ChevronIcon expanded={servicesExpanded} />
          </div>
          {servicesExpanded && (
            <>
              <a className="nav-item nav-sub-item" href="#pre-active">
                <PreActiveIcon />
                Pre-active
              </a>
              <a className="nav-item nav-sub-item active" href="#active">
                <ActiveIcon />
                Active
              </a>
              <a className="nav-item nav-sub-item" href="#blocked">
                <BlockedIcon />
                Blocked
              </a>
              <a className="nav-item nav-sub-item" href="#closed">
                <ClosedIcon />
                Closed
              </a>
            </>
          )}
        </div>
        
        <div className="nav-section">
          <div 
            className="nav-item" 
            onClick={() => setInvoicesExpanded(!invoicesExpanded)}
          >
            <InvoiceIcon />
            Invoices
            <ChevronIcon expanded={invoicesExpanded} />
          </div>
          {invoicesExpanded && (
            <>
              <a className="nav-item nav-sub-item" href="#proforma">
                <InvoiceIcon />
                Proforma Invoices
              </a>
              <a className="nav-item nav-sub-item" href="#final">
                <InvoiceIcon />
                Final Invoices
              </a>
            </>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
