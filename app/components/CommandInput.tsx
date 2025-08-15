import React, { useState } from 'react';

interface CommandInputProps {
  onSubmit: (command: string) => void;
  isLoading: boolean;
}

const CommandInput: React.FC<CommandInputProps> = ({ onSubmit, isLoading }) => {
  const [command, setCommand] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      onSubmit(command);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-6">
      <div className="bg-background border border-foreground/10 rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-semibold mb-3">Ask about your organization</h2>
        <p className="text-sm text-foreground/70 mb-4">
          Enter commands like "Show all employees in Engineering" or "Find employees reporting to John Smith"
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Enter your command..."
            className="flex-1 px-4 py-2 border border-foreground/20 rounded-md focus:outline-none focus:ring-2 focus:ring-foreground/30"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-foreground text-background px-4 py-2 rounded-md hover:bg-foreground/80 focus:outline-none focus:ring-2 focus:ring-foreground/30 disabled:opacity-50"
            disabled={isLoading || !command.trim()}
          >
            {isLoading ? 'Processing...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommandInput;