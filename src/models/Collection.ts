import mongoose, { Schema, Document } from 'mongoose';

export interface ICollection extends Document {
    name: string;
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
}

const CollectionSchema = new Schema<ICollection>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Collection || mongoose.model<ICollection>('Collection', CollectionSchema);
