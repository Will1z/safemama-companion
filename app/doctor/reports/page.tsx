import { getSupabaseAdmin } from '@/lib/supabase/server';
import { ReportsTable } from '@/components/doctor/ReportsTable';

async function getReports() {
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase
    .from('conversation_summaries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    console.error('Error fetching reports:', error);
    return [];
  }

  return data || [];
}

export default async function DoctorReportsPage() {
  const reports = await getReports();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Conversation Reports</h1>
        <p className="text-gray-600">
          Latest 200 conversation summaries sent to clinicians
        </p>
      </div>

      <ReportsTable reports={reports} />
    </div>
  );
}
