import DataManager from '@/react-app/components/DataManager';

export default function DataManagementPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Data Management
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Backup and restore your Mindwell data
        </p>
      </div>
      
      <DataManager />
    </div>
  );
}
