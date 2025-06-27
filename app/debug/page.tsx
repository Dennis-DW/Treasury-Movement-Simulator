export default function DebugPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Information</h1>
      <div className="space-y-4">
        <div>
          <strong>NEXT_PUBLIC_API_URL:</strong> {apiUrl || 'Not set'}
        </div>
        <div>
          <strong>Node Environment:</strong> {process.env.NODE_ENV}
        </div>
        <div>
          <strong>Build Time:</strong> {new Date().toISOString()}
        </div>
      </div>
    </div>
  );
} 