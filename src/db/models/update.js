import { model, Schema } from 'mongoose';
const updateContactsSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      required: false,
      enum: ['work', 'home', 'personal'],
      default: 'personal',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    photo: {
      type: String,
      required: false,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
export const UpdateContactsCollection = model('contact', updateContactsSchema);
