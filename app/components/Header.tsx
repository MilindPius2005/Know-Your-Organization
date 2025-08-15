import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-foreground text-background p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Know Your Organization</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="#" className="hover:underline">Dashboard</a>
            </li>
            <li>
              <a href="#" className="hover:underline">Employees</a>
            </li>
            <li>
              <a href="#" className="hover:underline">Departments</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;