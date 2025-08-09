import Navbar from "../../components/Navbar"
import { useNavigate } from "react-router-dom"

const AdminDashboard = () => {
    const navigate = useNavigate()
    return (
        <>
            <Navbar />
            <div className="max-w-6xl mx-auto p-6 space-y-6 py-40">
                <div className="max-w-6xl mx-auto p-6 space-y-6">
                    <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Classes */}
                        <div className="bg-white rounded-xl shadow p-5">
                            <h2 className="font-semibold mb-2">Classes</h2>
                            <p className="text-sm text-gray-500 mb-4">
                                Manage all classes, create new, and view details.
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigate("/admin/dashboard/classes")}
                                    className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200"
                                >
                                    View All
                                </button>
                                <button
                                    onClick={() => navigate("/admin/dashboard/classes/new")}
                                    className="px-3 py-1.5 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                                >
                                    Create
                                </button>
                            </div>
                        </div>

                        {/* Subjects */}
                        <div className="bg-white rounded-xl shadow p-5">
                            <h2 className="font-semibold mb-2">Subjects</h2>
                            <p className="text-sm text-gray-500 mb-4">
                                Manage subjects, add to classes, and view details.
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigate("/admin/dashboard/subjects")}
                                    className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200"
                                >
                                    View All
                                </button>
                                <button
                                    onClick={() => navigate("/admin/dashboard/subjects/new")}
                                    className="px-3 py-1.5 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                                >
                                    Create
                                </button>
                            </div>
                        </div>

                        {/* Teachers */}
                        <div className="bg-white rounded-xl shadow p-5">
                            <h2 className="font-semibold mb-2">Teachers</h2>
                            <p className="text-sm text-gray-500 mb-4">
                                Manage teacher profiles, assign subjects, and view details.
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigate("/admin/dashboard/teachers")}
                                    className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200"
                                >
                                    View All
                                </button>
                                <button
                                    onClick={() => navigate("/admin/dashboard/teachers/new")}
                                    className="px-3 py-1.5 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminDashboard