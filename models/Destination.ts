import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDestination extends Document {
  title: string;
  location: string;
  imageUrl: string;
  description: string;
  createdAt: Date;
}

const DestinationSchema = new Schema<IDestination>({
  title: {
    type: String,
    required: [true, "Please provide a title."],
    trim: true,
  },
  location: {
    type: String,
    required: [true, "Please provide a location."],
  },
  imageUrl: {
    type: String,
    required: [true, "Please provide an image URL."],
  },
  description: {
    type: String,
    required: [true, "Please provide a description."],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Destination: Model<IDestination> =
  mongoose.models.Destination ||
  mongoose.model<IDestination>("Destination", DestinationSchema);

export default Destination;
