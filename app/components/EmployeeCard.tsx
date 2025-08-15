import React from 'react';

export interface Employee {
  employee_id: number;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  gender?: string;
  email: string;
  phone?: string;
  hire_date: string;
  department?: string;
  position?: string;
  salary?: string;
  manager_id?: number | null;
  // Skills-related fields
  highest_degree?: string;
  graduation_year?: number;
  university?: string;
  major?: string;
  technical_skills?: string;
  certifications?: string;
  languages_spoken?: string;
}

interface EmployeeCardProps {
  employee: Employee;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee }) => {
  return (
    <div className="bg-background border border-foreground/10 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold">
            {employee.first_name} {employee.last_name}
          </h3>
          <p className="text-foreground/70">{employee.position || 'No position specified'}</p>
        </div>
        <div className="bg-foreground/5 px-3 py-1 rounded-full text-sm">
          {employee.department || 'No department'}
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-sm text-foreground/50">Email</p>
          <p className="text-sm">{employee.email}</p>
        </div>
        <div>
          <p className="text-sm text-foreground/50">Phone</p>
          <p className="text-sm">{employee.phone || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-foreground/50">Hire Date</p>
          <p className="text-sm">{employee.hire_date}</p>
        </div>
        {employee.salary && (
          <div>
            <p className="text-sm text-foreground/50">Salary</p>
            <p className="text-sm">${typeof employee.salary === 'string' ? employee.salary : employee.salary.toString()}</p>
          </div>
        )}
      </div>
      
      {employee.manager_id && (
        <div className="mt-4 pt-3 border-t border-foreground/10">
          <p className="text-sm text-foreground/50">Reports to Manager ID: {employee.manager_id}</p>
        </div>
      )}
      
      {/* Skills information section */}
      {(employee.highest_degree || employee.technical_skills || employee.certifications) && (
        <div className="mt-4 pt-3 border-t border-foreground/10">
          <h4 className="text-md font-medium mb-2">Skills & Education</h4>
          
          <div className="grid grid-cols-1 gap-2">
            {employee.highest_degree && (
              <div>
                <p className="text-sm text-foreground/50">Education</p>
                <p className="text-sm">
                  {employee.highest_degree} in {employee.major || 'N/A'}, 
                  {employee.university ? ` ${employee.university}` : ''} 
                  {employee.graduation_year ? ` (${employee.graduation_year})` : ''}
                </p>
              </div>
            )}
            
            {employee.technical_skills && (
              <div>
                <p className="text-sm text-foreground/50">Technical Skills</p>
                <p className="text-sm">{employee.technical_skills}</p>
              </div>
            )}
            
            {employee.certifications && (
              <div>
                <p className="text-sm text-foreground/50">Certifications</p>
                <p className="text-sm">{employee.certifications}</p>
              </div>
            )}
            
            {employee.languages_spoken && (
              <div>
                <p className="text-sm text-foreground/50">Languages</p>
                <p className="text-sm">{employee.languages_spoken}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeCard;