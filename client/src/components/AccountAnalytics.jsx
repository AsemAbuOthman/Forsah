
const analyticsData = {
    totalEarnings: 5875.50,
    earningsTimeline: [ // Simplified data for placeholder chart concept
        { month: 'Jan', amount: 800 },
        { month: 'Feb', amount: 1200 },
        { month: 'Mar', amount: 950 },
        { month: 'Apr', amount: 1500 },
        { month: 'May', amount: 1425.50 },
    ],
    postsCreated: 45,
    proposalsSent: 120,
    proposalsCompleted: 25,
    proposalWinRate: ((25 / 120) * 100).toFixed(1), // Example calculation
    activeProjects: 3,
};
// --- End Dummy Data ---

export default function AnalyticsDashboard() {
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-7xl mx-auto my-5 font-sans">
            <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
                Freelancer Dashboard
            </h1>

            {/* --- Key Performance Indicators (KPIs) --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-10">
                {/* Total Earned Card */}
                <div className="bg-gray-50 p-5 rounded-lg shadow-sm text-center border-l-4 border-orange-500 transition duration-200 ease-in-out hover:-translate-y-1 hover:shadow-md">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Total Earned</h3>
                    <p className="text-3xl font-bold text-orange-700 my-1">
                        ${analyticsData.totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">All Time</p>
                </div>

                {/* Posts Created Card */}
                <div className="bg-gray-50 p-5 rounded-lg shadow-sm text-center border-l-4 border-yellow-400 transition duration-200 ease-in-out hover:-translate-y-1 hover:shadow-md">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Posts Created</h3>
                    <p className="text-3xl font-bold text-yellow-600 my-1">
                        {analyticsData.postsCreated}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Content & Portfolio</p>
                </div>

                {/* Proposals Sent Card */}
                    <div className="bg-gray-50 p-5 rounded-lg shadow-sm text-center border-l-4 border-yellow-300 transition duration-200 ease-in-out hover:-translate-y-1 hover:shadow-md">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Proposals Sent</h3>
                    <p className="text-3xl font-bold text-yellow-500 my-1">
                        {analyticsData.proposalsSent}
                    </p>
                        <p className="text-xs text-gray-500 mt-1">Seeking Opportunities</p>
                </div>

                {/* Projects Won Card */}
                <div className="bg-gray-50 p-5 rounded-lg shadow-sm text-center border-l-4 border-blue-500 transition duration-200 ease-in-out hover:-translate-y-1 hover:shadow-md">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Projects Won</h3>
                    <p className="text-3xl font-bold text-blue-700 my-1">
                        {analyticsData.proposalsCompleted}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        Success Rate: {analyticsData.proposalWinRate}%
                    </p>
                </div>

                 {/* Active Projects Card */}
                 <div className="bg-gray-50 p-5 rounded-lg shadow-sm text-center border-l-4 border-amber-500 transition duration-200 ease-in-out hover:-translate-y-1 hover:shadow-md"> {/* Using Amber as another shade */}
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Active Projects</h3>
                    <p className="text-3xl font-bold text-amber-700 my-1">
                        {analyticsData.activeProjects}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Currently In Progress</p>
                </div>
            </div>

            {/* --- Earnings Timeline Chart --- */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-medium text-gray-700 mb-5 pb-3 border-b border-gray-200">
                    Earnings Over Time
                </h2>
                <div className="min-h-[250px] flex flex-col items-center justify-center bg-gray-50 rounded border border-dashed border-gray-300 text-gray-500">
                    {/* --- CHART LIBRARY INTEGRATION POINT --- */}
                    <p className="mb-4">Earnings Chart Area</p>
                    <p className="text-sm">(Integrate a chart library like Recharts, Chart.js, Nivo here)</p>

                    {/* --- Simple Bar Chart Placeholder (for visualization) --- */}
                    {/* You SHOULD replace this with a real chart component */}
                    <div className="flex items-end justify-around w-4/5 h-[150px] mt-5 py-2 border-t border-gray-200">
                        {analyticsData.earningsTimeline.map(data => (
                            <div key={data.month} className="flex flex-col items-center flex-1 mx-1 group">
                                <div
                                    className="bg-yellow-400 w-[60%] rounded-t transition duration-150 group-hover:bg-yellow-500 mb-1"
                                    // Inline style for height is necessary here as Tailwind can't easily do dynamic heights based on data
                                    style={{ height: `${Math.min(100, data.amount / 15)}%` }} // Basic scaling, capped height
                                    title={`$${data.amount.toFixed(2)}`}
                                ></div>
                                <span className="text-xs text-gray-600">{data.month}</span>
                            </div>
                        ))}
                    </div>
                     {/* --- End Simple Bar Chart Placeholder --- */}
                     {/* --- END CHART LIBRARY INTEGRATION POINT --- */}
                </div>
            </div>

            {/* --- Optional: Other Sections --- */}
            {/* <div className="bg-white p-5 rounded-lg shadow-md">
                <h2 className="text-lg font-medium text-gray-700 mb-4 pb-2 border-b border-gray-200">Recent Activity</h2>
                <ul className="space-y-2">
                    <li className="text-sm text-gray-600">Proposal for Project X - Pending</li>
                    <li className="text-sm text-gray-600">Proposal for Website Redesign - Won</li>
                    <li className="text-sm text-gray-600">Proposal for Marketing Campaign - Sent</li>
                </ul>
            </div> */}

        </div>
    );
}
