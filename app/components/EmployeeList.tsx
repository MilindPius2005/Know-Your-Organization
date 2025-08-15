import React from 'react';
import EmployeeCard, { Employee } from './EmployeeCard';

interface EmployeeListProps {
  employees: Employee[];
  loading: boolean;
  error?: string;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees, loading, error }) => {
  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto my-6 p-8 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-foreground/10 rounded mb-4"></div>
          <div className="h-4 w-32 bg-foreground/10 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-5xl mx-auto my-6 p-8 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="w-full max-w-5xl mx-auto my-6 p-8 text-center">
        <p className="text-foreground/70">No employees found. Try a different search query.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto my-6">
      <h2 className="text-xl font-semibold mb-4">Employees ({employees.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee) => (
          <EmployeeCard key={employee.employee_id} employee={employee} />
        ))}
      </div>
    </div>
  );
};

export default EmployeeList;