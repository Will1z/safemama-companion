export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function LearnPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <svg className="h-8 w-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7v14M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
          </svg>
          <h1 className="text-3xl font-bold text-gray-900">Learn - Updated</h1>
        </div>
        <p className="text-gray-600 max-w-2xl">
          Evidence-based information tailored to your current trimester. 
          Learn about your pregnancy journey with topics that matter most to you right now.
        </p>
      </div>

      <div className="mb-6">
        <div className="rounded-xl border bg-teal-50 border-teal-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
            <p className="text-teal-800 font-medium">
              Second Trimester (13–27 weeks)
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="rounded-xl border bg-white border-pink-100 hover:shadow-lg transition-shadow duration-200">
          <div className="p-6 pb-3">
            <h3 className="flex items-center gap-2 text-lg text-gray-800 font-semibold">
              <svg className="h-5 w-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Body Changes
            </h3>
          </div>
          <div className="px-6 pb-6">
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="leading-relaxed">Growing bump and more energy.</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="leading-relaxed">Nausea usually improves.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded-xl border bg-white border-pink-100 hover:shadow-lg transition-shadow duration-200">
          <div className="p-6 pb-3">
            <h3 className="flex items-center gap-2 text-lg text-gray-800 font-semibold">
              <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              Nutrition Focus
            </h3>
          </div>
          <div className="px-6 pb-6">
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="leading-relaxed">Increase protein, iron, and calcium.</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="leading-relaxed">Track healthy weight gain.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded-xl border bg-white border-pink-100 hover:shadow-lg transition-shadow duration-200">
          <div className="p-6 pb-3">
            <h3 className="flex items-center gap-2 text-lg text-gray-800 font-semibold">
              <svg className="h-5 w-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Warning Signs
            </h3>
          </div>
          <div className="px-6 pb-6">
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="leading-relaxed">Signs of preterm labor</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="leading-relaxed">High blood pressure symptoms</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
        <div className="flex items-start gap-2">
          <svg className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-sm text-amber-800">
            <strong>Important:</strong> SafeMama gives general information only. It is not a diagnosis. In an emergency, go to the nearest clinic.
          </p>
        </div>
      </div>
    </div>
  );
}