import mongoose from 'mongoose';

const clinicEnquirySchema = new mongoose.Schema({
  fullName: String,
  mobile: String,
  email: String,
  city: String,
  state: String,
  specialization: [String],
  clinicType: String,
  usesSoftware: String,
  softwareName: String,
  expectedFeatures: [String],
  preferredDate: String,
  preferredTime: String,
  notes: String
}, { timestamps: true });

export default mongoose.model('ClinicEnquiry', clinicEnquirySchema);