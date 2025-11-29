import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
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

        const collections = await Collection.find({ userId: payload.userId }).sort({ createdAt: -1 });

        return NextResponse.json({ collections });
    } catch (error) {
        console.error('Get collections error:', error);
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

        const { name } = await request.json();

        if (!name || name.trim().length === 0) {
            return NextResponse.json({ error: 'Collection name is required' }, { status: 400 });
        }

        const collection = await Collection.create({
            name: name.trim(),
            userId: payload.userId,
        });

        return NextResponse.json({ collection }, { status: 201 });
    } catch (error) {
        console.error('Create collection error:', error);
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
        const collectionId = searchParams.get('id');

        if (!collectionId) {
            return NextResponse.json({ error: 'Collection ID is required' }, { status: 400 });
        }

        const collection = await Collection.findOneAndDelete({
            _id: collectionId,
            userId: payload.userId,
        });

        if (!collection) {
            return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Collection deleted successfully' });
    } catch (error) {
        console.error('Delete collection error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
