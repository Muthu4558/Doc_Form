import mongoose from 'mongoose';

const clinicEnquirySchema = new mongoose.Schema({
  clinicName: String,
  spocName: String,
  mobile: String,
  email: String,
  city: String,
  state: String,
  specialization: [String],
  clinicType: String,
  usesSoftware: String,
  softwareName: String,
  expectedFeatures: [String],
  notes: String,
  status: { type: String, default: 'Pending' },
  remark: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('ClinicEnquiry', clinicEnquirySchema);