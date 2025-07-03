import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TiEdit } from "react-icons/ti";
import { MdDelete } from "react-icons/md";
import { toast } from 'react-hot-toast';

const AdminClinic = () => {
  const [entries, setEntries] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [remarkInput, setRemarkInput] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/clinic-enquiry/all`);
        const data = await res.json();
        setEntries(data);
      } catch (error) {
        toast.error("Failed to fetch enquiries");
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const updateClinicField = async (id, field, value) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/clinic-enquiry/update/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
      });

      if (!res.ok) {
        const html = await res.text(); // to debug
        console.error("Invalid response:", html);
        throw new Error("Invalid response from server");
      }

      const updated = await res.json();
      setEntries(entries.map(e => e._id === id ? updated : e));
      toast.success(`${field === "remark" ? "Remark" : "Status"} updated`);
    } catch (err) {
      toast.error("Failed to update");
      console.error(err);
    }
  };

  const deleteEntry = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/clinic-enquiry/delete/${id}`, {
        method: 'DELETE'
      });
      setEntries(entries.filter(e => e._id !== id));
      toast.success("Entry deleted");
    } catch (err) {
      toast.error("Failed to delete");
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    toast.success("Logged out");
    navigate('/');
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-teal-600">Doctor Enquiries</h1>
        <button
          onClick={handleLogout}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-full shadow"
        >
          Logout
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full table-auto">
          <thead className="bg-teal-600 text-white">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Clinic Name</th>
              <th className="px-4 py-2">Spoc Name</th>
              <th className="px-4 py-2">Contact</th>
              <th className="px-4 py-2">City/State</th>
              <th className="px-4 py-2">Specializations</th>
              <th className="px-4 py-2">Clinic Type</th>
              <th className="px-4 py-2">Software</th>
              <th className="px-4 py-2">Features</th>
              <th className="px-4 py-2">Notes</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Remark</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {entries.map((e, i) => (
              <tr key={e._id} className="hover:bg-teal-50">
                <td className="px-4 py-2 font-bold text-gray-600">{i + 1}</td>
                <td className="px-4 py-2">{e.clinicName}</td>
                <td className="px-4 py-2">{e.spocName}</td>
                <td className="px-4 py-2">{e.mobile}<br />{e.email}</td>
                <td className="px-4 py-2">{e.city}, {e.state}</td>
                <td className="px-4 py-2">{e.specialization.join(', ')}</td>
                <td className="px-4 py-2">{e.clinicType}</td>
                <td className="px-4 py-2">{e.usesSoftware} {e.softwareName ? `(${e.softwareName})` : ''}</td>
                <td className="px-4 py-2">{e.expectedFeatures.join(', ')}</td>
                <td className="px-4 py-2">{e.notes}</td>
                <td className="px-4 py-2">
                  <select
                    value={e.status || 'Pending'}
                    onChange={(event) => updateClinicField(e._id, 'status', event.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  {e.remark ? (
                    <div>
                      <p>{e.remark}</p>
                      <button
                        onClick={() => updateClinicField(e._id, 'remark', '')}
                        className="text-red-500 text-xs hover:underline"
                      >
                        Clear
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">No remarks</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditIndex(i);
                        setRemarkInput(e.remark || '');
                      }}
                      className="text-blue-600 text-xl"
                    >
                      <TiEdit />
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(e._id)}
                      className="text-red-600 text-xl"
                    >
                      <MdDelete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Remark Modal */}
      {editIndex !== null && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-teal-700">Edit Remark</h2>
            <textarea
              rows="4"
              value={remarkInput}
              onChange={(e) => setRemarkInput(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="Enter your remark here..."
            />
            <div className="flex justify-end mt-4 gap-3">
              <button
                onClick={() => {
                  updateClinicField(entries[editIndex]._id, 'remark', remarkInput);
                  setEditIndex(null);
                  setRemarkInput('');
                }}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditIndex(null);
                  setRemarkInput('');
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Are you sure you want to delete this entry?</h3>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  deleteEntry(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClinic;