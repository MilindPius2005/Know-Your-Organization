'use client';

import { useState, useEffect } from 'react';
import Header from './components/Header';
import CommandInput from './components/CommandInput';
import EmployeeList from './components/EmployeeList';
import { Employee } from './components/EmployeeCard';
import { processAICommand } from './services/aiService';

function Component() {
  const [time, setTime] = useState<number | null>(null);
  useEffect(() => {
    setTime(Date.now());
  }, []);
  return <p>{time}</p>;
}

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState<string | undefined>(undefined);

  // Initial data load
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const result = await processAICommand('show all employees');
        setEmployees(result.employees);
        setMessage(result.message);
      } catch (err) {
        setError('Failed to load initial data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleCommandSubmit = async (command: string) => {
    setLoading(true);
    setError(undefined);
    
    try {
      const result = await processAICommand(command);
      setEmployees(result.employees);
      setMessage(result.message);
    } catch (err) {
      setError('Failed to process command. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Know Your Organization</h1>
          
          <p className="text-foreground/70 mb-8">
            Use natural language commands to explore your organization's structure and personnel.
            Try commands like "Show all employees in Engineering" or "Find employees reporting to John Smith".
          </p>
          
          <CommandInput onSubmit={handleCommandSubmit} isLoading={loading} />
          
          {message && (
            <div className="w-full max-w-3xl mx-auto my-4 p-3 bg-foreground/5 rounded-md">
              <p>{message}</p>
            </div>
          )}
          
          <EmployeeList 
            employees={employees} 
            loading={loading} 
            error={error} 
          />
        </div>
      </main>
      
      <footer className="bg-foreground/5 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-foreground/60">
          <p>© 2025 Know Your Organization. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}