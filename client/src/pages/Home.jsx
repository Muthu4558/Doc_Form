import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const specializations = [
  'General Physician', 'Dermatologist', 'Diabetologist', 'Cardiologists',
  'Gynecologist', 'Psychiatrists', 'Other (please specify)'
];

const clinicTypes = [
  'Solo Clinic', 'Multi-Doctor Clinic', 'Chain of Clinics',
  'Hospital Setup', 'Teleconsultation Only', 'Individual Doctor Without Physical Clinic'
];

const features = [
  'Digital Prescription', 'Appointment Scheduling', 'AI-Powered Suggestions',
  'Patient Record Management', 'Lab & Pharmacy Integration',
  'Online Payments', 'Teleconsultation', 'WhatsApp Follow-Up Automation'
];

const EnquiryForm = () => {
  const [form, setForm] = useState({
    clinicName: '',
    spocName: '',
    mobile: '',
    email: '',
    city: '',
    state: '',
    specialization: [],
    otherSpecialization: '',
    clinicType: '',
    usesSoftware: 'No',
    softwareName: '',
    expectedFeatures: [],
    preferredDate: '',
    preferredTime: '',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Regex patterns
    const onlyAlphabets = /^[A-Za-z\s]*$/;
    const onlyNumbers = /^[0-9]*$/;

    // Field-specific validation
    if (
      (['clinicName', 'spocName', 'city', 'state'].includes(name) && !onlyAlphabets.test(value)) ||
      (name === 'mobile' && !onlyNumbers.test(value))
    ) {
      return; // Prevent updating state if invalid input
    }

    setForm({ ...form, [name]: value });
  };

  const toggleCheckbox = (field, value) => {
    setForm(prev => {
      const current = new Set(prev[field]);
      current.has(value) ? current.delete(value) : current.add(value);
      return { ...prev, [field]: Array.from(current) };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = {
      ...form,
      specialization: form.specialization.includes('Other (please specify)') && form.otherSpecialization
        ? [...form.specialization.filter(sp => sp !== 'Other (please specify)'), form.otherSpecialization]
        : form.specialization
    };

    const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/clinic-enquiry/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submissionData)
    });
    if (res.ok) {
      setSubmitted(true);
    } else {
      alert('Submission failed');
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-teal-200 to-green-100 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">🎉 Thank you!</h1>
        <p className="text-lg">Our Nizcare team will contact you shortly to schedule your demo.</p>
        <p className="text-sm mt-2">📞 For urgent queries, call us at +91-XXXXXXX or email support@nizcare.com</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-teal-200 to-green-100 p-4 md:p-6 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white backdrop-blur-lg rounded-3xl shadow-2xl p-4 md:p-10">
        <h1 className="text-3xl md:text-5xl font-extrabold text-center text-teal-500 mb-6 md:mb-10 tracking-wider font-serif">
          Enquiry Form
        </h1>
        <form className="space-y-10 md:space-y-12" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <input type="text" name="clinicName" className="fancy-input" placeholder="Clinic Name *" value={form.clinicName} onChange={handleChange} required />
            <input type="text" name="spocName" className="fancy-input" placeholder="Spoc Name *" value={form.spocName} onChange={handleChange} required />
            <div className="relative">
              {/* <span className="absolute top-2 left-3 text-gray-500">+91</span> */}
              <input type="tel" name="mobile" className="fancy-input pl-12" placeholder="Mobile Number *" maxLength={10} value={form.mobile} onChange={handleChange} required />
            </div>
            <input type="email" name="email" className="fancy-input" placeholder="Email *" value={form.email} onChange={handleChange} required />
            <input type="text" name="city" className="fancy-input" placeholder="City *" value={form.city} onChange={handleChange} required />
            <input type="text" name="state" className="fancy-input" placeholder="State *" value={form.state} onChange={handleChange} required />
          </div>

          <div>
            <label className="block font-semibold text-teal-600 mb-1">Clinic Specialization *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {specializations.map(sp => (
                <label key={sp} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.specialization.includes(sp)}
                    onChange={() => toggleCheckbox('specialization', sp)}
                  /> {sp}
                </label>
              ))}
            </div>
            {form.specialization.includes('Other (please specify)') && (
              <input
                type="text"
                name="otherSpecialization"
                className="fancy-input mt-2"
                placeholder="Please specify other specialization"
                value={form.otherSpecialization}
                onChange={handleChange}
              />
            )}
          </div>

          <div>
            <label className="block font-semibold text-teal-600 mb-1">Clinic Type *</label>
            <select name="clinicType" className="fancy-input" value={form.clinicType} onChange={handleChange}>
              <option value="">Select Clinic Type</option>
              {clinicTypes.map(type => <option key={type}>{type}</option>)}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-teal-600 mb-1">Do you currently use any clinic software? *</label>
            <div className="flex gap-4">
              <label><input type="radio" name="usesSoftware" value="Yes" checked={form.usesSoftware === 'Yes'} onChange={handleChange} /> Yes</label>
              <label><input type="radio" name="usesSoftware" value="No" checked={form.usesSoftware === 'No'} onChange={handleChange} /> No</label>
            </div>
            {form.usesSoftware === 'Yes' && (
              <input name="softwareName" type="text" className="fancy-input mt-2" placeholder="Which one?" value={form.softwareName} onChange={handleChange} />
            )}
          </div>

          <div>
            <label className="block font-semibold text-teal-600 mb-1">Expected Features</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {features.map(f => (
                <label key={f} className="flex items-center gap-2">
                  <input type="checkbox" checked={form.expectedFeatures.includes(f)} onChange={() => toggleCheckbox('expectedFeatures', f)} /> {f}
                </label>
              ))}
            </div>
          </div>

          <textarea name="notes" className="fancy-input h-24" placeholder="Anything else you’d like us to know?" value={form.notes} onChange={handleChange}></textarea>

          <div className="text-center">
            <button type="submit" className="bg-teal-500 hover:bg-teal-400 text-white text-lg px-8 py-3 rounded-full shadow-xl transition duration-300 hover:scale-105">
              Submit Enquiry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnquiryForm;