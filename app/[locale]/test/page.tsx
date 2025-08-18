export default function TestPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <p>This is a test page to debug routing.</p>
      <p>Params: {JSON.stringify(params)}</p>
    </div>
  );
}
