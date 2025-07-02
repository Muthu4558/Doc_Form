import React, { useEffect, useState } from 'react';

const AdminClinic = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/clinic-enquiry/all`);
      const data = await res.json();
      setEntries(data);
    };
    fetchData();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-teal-600">Doctor Enquiries</h1>
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
              <th className="px-4 py-2">Preferred Date/Time</th>
              <th className="px-4 py-2">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {entries.map((e, i) => (
              <tr key={e._id} className="hover:bg-teal-50">
                <td className="px-4 py-2 font-bold text-gray-600">{i + 1}</td>
                <td className="px-4 py-2">{e.clinicName}</td>
                <td className="px-4 py-2">{e.spocName}</td>
                <td className="px-4 py-2">{e.mobile}<br/>{e.email}</td>
                <td className="px-4 py-2">{e.city}, {e.state}</td>
                <td className="px-4 py-2">{e.specialization.join(', ')}</td>
                <td className="px-4 py-2">{e.clinicType}</td>
                <td className="px-4 py-2">{e.usesSoftware} {e.softwareName ? `(${e.softwareName})` : ''}</td>
                <td className="px-4 py-2">{e.expectedFeatures.join(', ')}</td>
                <td className="px-4 py-2">{e.preferredDate} {e.preferredTime}</td>
                <td className="px-4 py-2">{e.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminClinic;