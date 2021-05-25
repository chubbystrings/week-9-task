import { model, Schema } from 'mongoose';
import { Org } from '../types/index';

const schema = new Schema({
  organization: { type: String, required: true },
  products: { type: Array, required: true },
  marketValue: { type: String, required: true },
  address: { type: String, required: true },
  ceo: { type: String, required: true },
  country: { type: String, required: true },
  noOfEmployees: { type: Number, required: true },
  employees: { type: Array, required: true },
}, { timestamps: true });

export const OrgSchema = model<Org>('Organizations', schema);
