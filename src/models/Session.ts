import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
    userId: mongoose.Types.ObjectId;
    collectionId: mongoose.Types.ObjectId;
    totalCards: number;
    goodCount: number;
    badCount: number;
    successRate: number;
    completedAt: Date;
}

const SessionSchema = new Schema<ISession>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    collectionId: {
        type: Schema.Types.ObjectId,
        ref: 'Collection',
        required: true,
    },
    totalCards: {
        type: Number,
        required: true,
    },
    goodCount: {
        type: Number,
        required: true,
    },
    badCount: {
        type: Number,
        required: true,
    },
    successRate: {
        type: Number,
        required: true,
    },
    completedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);
