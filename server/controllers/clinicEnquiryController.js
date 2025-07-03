import ClinicEnquiry from '../models/ClinicEnquiry.js';

export const submitClinicEnquiry = async (req, res) => {
  try {
    const formData = new ClinicEnquiry(req.body);
    await formData.save();
    res.status(201).json({ message: 'Form submitted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Submission failed', error: error.message });
  }
};

export const getAllClinicEnquiries = async (_req, res) => {
  try {
    const data = await ClinicEnquiry.find().sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Fetching failed', error: error.message });
  }
};

export const updateClinicEnquiry = async (req, res) => {
  try {
    const updated = await ClinicEnquiry.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

export const deleteClinicEnquiry = async (req, res) => {
  try {
    await ClinicEnquiry.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
};