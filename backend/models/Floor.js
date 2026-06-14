import mongoose from 'mongoose';

const floorSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Floor name is required'], trim: true },
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const Floor = mongoose.model('Floor', floorSchema);
export default Floor;
