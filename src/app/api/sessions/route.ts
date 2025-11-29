import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Session from '@/models/Session';
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

        if (collectionId) {
            // Get sessions for specific collection
            const sessions = await Session.find({
                userId: payload.userId,
                collectionId,
            }).sort({ completedAt: -1 });

            return NextResponse.json({ sessions });
        } else {
            // Get all sessions for user
            const sessions = await Session.find({ userId: payload.userId })
                .sort({ completedAt: -1 })
                .limit(10);

            return NextResponse.json({ sessions });
        }
    } catch (error) {
        console.error('Get sessions error:', error);
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

        const { collectionId, totalCards, goodCount, badCount } = await request.json();

        if (!collectionId || totalCards === undefined || goodCount === undefined || badCount === undefined) {
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

        // Calculate success rate
        const successRate = totalCards > 0 ? Math.round((goodCount / totalCards) * 100) : 0;

        const session = await Session.create({
            userId: payload.userId,
            collectionId,
            totalCards,
            goodCount,
            badCount,
            successRate,
        });

        return NextResponse.json({ session }, { status: 201 });
    } catch (error) {
        console.error('Create session error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
