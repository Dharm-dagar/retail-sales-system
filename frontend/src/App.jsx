import React from 'react';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import SummaryCards from './components/SummaryCards';
import DataTable from './components/DataTable';
import Pagination from './components/Pagination';
import { useSalesData } from './hooks/useSalesData';

const App = () => {
  const {
    data,
    summary,
    pagination,
    filterOptions,
    filters,
    sort,
    loading,
    error,
    setSearch,
    updateFilter,
    resetFilters,
    updateSort,
    goToPage,
    nextPage,
    prevPage,
    refresh,
  } = useSalesData();

  return (
    <div className="app-layout">
      <Sidebar />
      
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Sales Management System</h1>
          <SearchBar 
            value={filters.search} 
            onChange={setSearch} 
          />
        </div>
        
        <FilterPanel
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={updateFilter}
          onReset={resetFilters}
          sort={sort}
          onSortChange={updateSort}
        />
        
        <SummaryCards summary={summary} />
        
        {error && (
          <div style={{ 
            padding: '16px', 
            marginBottom: '16px', 
            background: '#fef2f2', 
            border: '1px solid #fecaca', 
            borderRadius: '8px',
            color: '#dc2626',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>Error loading data: {error}</span>
            <button 
              onClick={refresh}
              style={{
                padding: '8px 16px',
                background: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '13px',
                fontWeight: '500'
              }}
            >
              Retry
            </button>
          </div>
        )}
        
        <DataTable data={data} loading={loading} />
        
        <Pagination
          pagination={pagination}
          onPageChange={goToPage}
          onNext={nextPage}
          onPrev={prevPage}
        />
      </main>
    </div>
  );
};

export default App;
