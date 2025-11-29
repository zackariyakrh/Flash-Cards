import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Flashcard from '@/models/Flashcard';
import Collection from '@/models/Collection';
import { verifyToken, getTokenFromHeader } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const token = getTokenFromHeader(request.headers.get('authorization'));
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = verifyToken(token);
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const collectionId = searchParams.get('collectionId');

        if (!collectionId) {
            return NextResponse.json({ error: 'Collection ID is required' }, { status: 400 });
        }

        // Verify collection belongs to user
        const collection = await Collection.findOne({
            _id: collectionId,
            userId: payload.userId,
        });

        if (!collection) {
            return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
        }

        const flashcards = await Flashcard.find({ collectionId }).sort({ createdAt: -1 });

        return NextResponse.json({ flashcards });
    } catch (error) {
        console.error('Get flashcards error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const token = getTokenFromHeader(request.headers.get('authorization'));
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = verifyToken(token);
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const { collectionId, german, english, arabic } = await request.json();

        if (!collectionId || !german || !english || !arabic) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Verify collection belongs to user
        const collection = await Collection.findOne({
            _id: collectionId,
            userId: payload.userId,
        });

        if (!collection) {
            return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
        }

        const flashcard = await Flashcard.create({
            collectionId,
            german: german.trim(),
            english: english.trim(),
            arabic: arabic.trim(),
        });

        return NextResponse.json({ flashcard }, { status: 201 });
    } catch (error) {
        console.error('Create flashcard error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await connectDB();

        const token = getTokenFromHeader(request.headers.get('authorization'));
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = verifyToken(token);
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const flashcardId = searchParams.get('id');

        if (!flashcardId) {
            return NextResponse.json({ error: 'Flashcard ID is required' }, { status: 400 });
        }

        const flashcard = await Flashcard.findById(flashcardId);
        if (!flashcard) {
            return NextResponse.json({ error: 'Flashcard not found' }, { status: 404 });
        }

        // Verify collection belongs to user
        const collection = await Collection.findOne({
            _id: flashcard.collectionId,
            userId: payload.userId,
        });

        if (!collection) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await Flashcard.findByIdAndDelete(flashcardId);

        return NextResponse.json({ message: 'Flashcard deleted successfully' });
    } catch (error) {
        console.error('Delete flashcard error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
