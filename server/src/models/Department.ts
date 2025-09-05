import mongoose, { Document, Schema } from 'mongoose';

export interface IDepartment extends Document {
  name: string;
  description: string;
  categories: string[];
  head?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const departmentSchema = new Schema<IDepartment>(
  {
    name: {
      type: String,
      required: [true, 'Department name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Department description is required'],
      trim: true,
    },
    categories: [{
      type: String,
      required: [true, 'At least one category is required'],
    }],
    head: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Department = mongoose.model<IDepartment>('Department', departmentSchema);

export default Department;