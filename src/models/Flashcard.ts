import mongoose, { Schema, Document } from 'mongoose';

export interface IFlashcard extends Document {
    collectionId: mongoose.Types.ObjectId;
    german: string;
    english: string;
    arabic: string;
    createdAt: Date;
}

const FlashcardSchema = new Schema<IFlashcard>({
    collectionId: {
        type: Schema.Types.ObjectId,
        ref: 'Collection',
        required: true,
    },
    german: {
        type: String,
        required: true,
        trim: true,
    },
    english: {
        type: String,
        required: true,
        trim: true,
    },
    arabic: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Flashcard || mongoose.model<IFlashcard>('Flashcard', FlashcardSchema);
