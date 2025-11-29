'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import styles from './dashboard.module.css';

interface Collection {
    _id: string;
    name: string;
    createdAt: string;
}

interface Flashcard {
    _id: string;
    german: string;
    english: string;
    arabic: string;
}

interface Session {
    _id: string;
    totalCards: number;
    goodCount: number;
    badCount: number;
    successRate: number;
    completedAt: string;
}

export default function Dashboard() {
    const { user, token, logout, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [collections, setCollections] = useState<Collection[]>([]);
    const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [sessions, setSessions] = useState<Session[]>([]);

    const [view, setView] = useState<'main' | 'create' | 'practice' | 'stats'>('main');
    const [newCollectionName, setNewCollectionName] = useState('');
    const [newFlashcard, setNewFlashcard] = useState({ german: '', english: '', arabic: '' });

    const [practiceIndex, setPracticeIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [practiceResults, setPracticeResults] = useState<{ good: number; bad: number }>({ good: 0, bad: 0 });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user && token) {
            fetchCollections();
            fetchSessions();
        }
    }, [user, token]);

    useEffect(() => {
        if (selectedCollection && token) {
            fetchFlashcards(selectedCollection);
        }
    }, [selectedCollection, token]);

    const fetchCollections = async () => {
        try {
            const response = await fetch('/api/collections', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setCollections(data.collections || []);
        } catch (error) {
            console.error('Error fetching collections:', error);
        }
    };

    const fetchFlashcards = async (collectionId: string) => {
        try {
            const response = await fetch(`/api/flashcards?collectionId=${collectionId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setFlashcards(data.flashcards || []);
        } catch (error) {
            console.error('Error fetching flashcards:', error);
        }
    };

    const fetchSessions = async () => {
        try {
            const response = await fetch('/api/sessions', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setSessions(data.sessions || []);
        } catch (error) {
            console.error('Error fetching sessions:', error);
        }
    };

    const createCollection = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/collections', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: newCollectionName }),
            });

            if (response.ok) {
                setNewCollectionName('');
                await fetchCollections();
            }
        } catch (error) {
            console.error('Error creating collection:', error);
        }
    };

    const createFlashcard = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCollection) return;

        try {
            const response = await fetch('/api/flashcards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    collectionId: selectedCollection,
                    ...newFlashcard,
                }),
            });

            if (response.ok) {
                setNewFlashcard({ german: '', english: '', arabic: '' });
                await fetchFlashcards(selectedCollection);
            }
        } catch (error) {
            console.error('Error creating flashcard:', error);
        }
    };

    const startPractice = () => {
        if (flashcards.length === 0) {
            alert('No flashcards in this collection!');
            return;
        }
        setPracticeIndex(0);
        setShowAnswer(false);
        setPracticeResults({ good: 0, bad: 0 });
        setView('practice');
    };

    const handleAnswer = async (isGood: boolean) => {
        const newResults = {
            good: practiceResults.good + (isGood ? 1 : 0),
            bad: practiceResults.bad + (isGood ? 0 : 1),
        };
        setPracticeResults(newResults);

        if (practiceIndex < flashcards.length - 1) {
            setPracticeIndex(practiceIndex + 1);
            setShowAnswer(false);
        } else {
            // Session complete - save statistics
            try {
                await fetch('/api/sessions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        collectionId: selectedCollection,
                        totalCards: flashcards.length,
                        goodCount: newResults.good,
                        badCount: newResults.bad,
                    }),
                });

                await fetchSessions();
                setView('stats');
            } catch (error) {
                console.error('Error saving session:', error);
            }
        }
    };

    const deleteFlashcard = async (id: string) => {
        if (!confirm('Delete this flashcard?')) return;

        try {
            await fetch(`/api/flashcards?id=${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (selectedCollection) {
                await fetchFlashcards(selectedCollection);
            }
        } catch (error) {
            console.error('Error deleting flashcard:', error);
        }
    };

    if (authLoading || !user) {
        return (
            <div className="flex-center" style={{ minHeight: '100vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className="text-gradient">Flashcard Dashboard</h1>
                    <div className={styles.userInfo}>
                        <span>{user.email}</span>
                        <button onClick={logout} className="btn btn-secondary">
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className={styles.main}>
                {view === 'main' && (
                    <div className={styles.mainView}>
                        <div className={styles.actions}>
                            <button onClick={() => setView('create')} className="btn btn-primary">
                                📚 Create Flashcards
                            </button>
                            <button
                                onClick={startPractice}
                                className="btn btn-success"
                                disabled={!selectedCollection || flashcards.length === 0}
                            >
                                🎯 Start Practice
                            </button>
                        </div>

                        <div className={styles.grid}>
                            <div className={styles.section}>
                                <h2>Collections</h2>
                                <form onSubmit={createCollection} className={styles.createForm}>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="New collection name..."
                                        value={newCollectionName}
                                        onChange={(e) => setNewCollectionName(e.target.value)}
                                        required
                                    />
                                    <button type="submit" className="btn btn-primary">
                                        Create
                                    </button>
                                </form>

                                <div className={styles.collectionList}>
                                    {collections.map((col) => (
                                        <div
                                            key={col._id}
                                            className={`${styles.collectionItem} ${selectedCollection === col._id ? styles.selected : ''
                                                }`}
                                            onClick={() => setSelectedCollection(col._id)}
                                        >
                                            <span>{col.name}</span>
                                            <span className={styles.badge}>
                                                {flashcards.filter((f) => f.collectionId === col._id).length || 0}
                                            </span>
                                        </div>
                                    ))}
                                    {collections.length === 0 && (
                                        <p className={styles.empty}>No collections yet. Create one above!</p>
                                    )}
                                </div>
                            </div>

                            <div className={styles.section}>
                                <h2>Recent Statistics</h2>
                                <div className={styles.statsList}>
                                    {sessions.slice(0, 5).map((session) => (
                                        <div key={session._id} className={styles.statItem}>
                                            <div className={styles.statInfo}>
                                                <div className={styles.statRate}>
                                                    {session.successRate}%
                                                </div>
                                                <div className={styles.statDetails}>
                                                    <div>✅ {session.goodCount} Good</div>
                                                    <div>❌ {session.badCount} Bad</div>
                                                </div>
                                            </div>
                                            <div className={styles.statDate}>
                                                {new Date(session.completedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))}
                                    {sessions.length === 0 && (
                                        <p className={styles.empty}>No practice sessions yet!</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'create' && (
                    <div className={styles.createView}>
                        <button onClick={() => setView('main')} className="btn btn-secondary">
                            ← Back
                        </button>

                        <h2>Create Flashcards</h2>

                        {!selectedCollection ? (
                            <p className={styles.empty}>Please select a collection first!</p>
                        ) : (
                            <>
                                <form onSubmit={createFlashcard} className={styles.flashcardForm}>
                                    <div className="form-group">
                                        <label className="form-label">German Text</label>
                                        <input
                                            type="text"
                                            className="input"
                                            value={newFlashcard.german}
                                            onChange={(e) =>
                                                setNewFlashcard({ ...newFlashcard, german: e.target.value })
                                            }
                                            placeholder="Hallo"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">English Translation</label>
                                        <input
                                            type="text"
                                            className="input"
                                            value={newFlashcard.english}
                                            onChange={(e) =>
                                                setNewFlashcard({ ...newFlashcard, english: e.target.value })
                                            }
                                            placeholder="Hello"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Arabic Translation</label>
                                        <input
                                            type="text"
                                            className="input"
                                            value={newFlashcard.arabic}
                                            onChange={(e) =>
                                                setNewFlashcard({ ...newFlashcard, arabic: e.target.value })
                                            }
                                            placeholder="مرحبا"
                                            required
                                            dir="rtl"
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-primary">
                                        Save Flashcard
                                    </button>
                                </form>

                                <div className={styles.flashcardList}>
                                    <h3>Flashcards in this collection ({flashcards.length})</h3>
                                    {flashcards.map((card) => (
                                        <div key={card._id} className={styles.flashcardItem}>
                                            <div className={styles.flashcardContent}>
                                                <div><strong>🇩🇪</strong> {card.german}</div>
                                                <div><strong>🇬🇧</strong> {card.english}</div>
                                                <div dir="rtl"><strong>🇸🇦</strong> {card.arabic}</div>
                                            </div>
                                            <button
                                                onClick={() => deleteFlashcard(card._id)}
                                                className="btn btn-danger"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {view === 'practice' && (
                    <div className={styles.practiceView}>
                        <div className={styles.practiceHeader}>
                            <div className={styles.progress}>
                                Card {practiceIndex + 1} of {flashcards.length}
                            </div>
                            <div className={styles.score}>
                                ✅ {practiceResults.good} | ❌ {practiceResults.bad}
                            </div>
                        </div>

                        <div className={styles.flashcard}>
                            <div className={styles.flashcardFront}>
                                <h3>🇩🇪 German</h3>
                                <p className={styles.flashcardText}>{flashcards[practiceIndex]?.german}</p>
                            </div>

                            {showAnswer && (
                                <div className={styles.flashcardBack}>
                                    <div className={styles.translation}>
                                        <h4>🇬🇧 English</h4>
                                        <p>{flashcards[practiceIndex]?.english}</p>
                                    </div>
                                    <div className={styles.translation}>
                                        <h4>🇸🇦 Arabic</h4>
                                        <p dir="rtl">{flashcards[practiceIndex]?.arabic}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {!showAnswer ? (
                            <button
                                onClick={() => setShowAnswer(true)}
                                className="btn btn-primary"
                                style={{ width: '100%', maxWidth: '400px' }}
                            >
                                Show Answer
                            </button>
                        ) : (
                            <div className={styles.answerButtons}>
                                <button
                                    onClick={() => handleAnswer(false)}
                                    className="btn btn-danger"
                                >
                                    ❌ BAD
                                </button>
                                <button
                                    onClick={() => handleAnswer(true)}
                                    className="btn btn-success"
                                >
                                    ✅ GOOD
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {view === 'stats' && (
                    <div className={styles.statsView}>
                        <h2>Session Complete! 🎉</h2>

                        <div className={styles.statsCard}>
                            <div className={styles.statsBig}>
                                <div className={styles.statsCircle}>
                                    {Math.round((practiceResults.good / flashcards.length) * 100)}%
                                </div>
                                <h3>Success Rate</h3>
                            </div>

                            <div className={styles.statsGrid}>
                                <div className={styles.statsItem}>
                                    <div className={styles.statsNumber}>{flashcards.length}</div>
                                    <div className={styles.statsLabel}>Total Cards</div>
                                </div>
                                <div className={styles.statsItem}>
                                    <div className={styles.statsNumber} style={{ color: 'var(--success)' }}>
                                        {practiceResults.good}
                                    </div>
                                    <div className={styles.statsLabel}>Good</div>
                                </div>
                                <div className={styles.statsItem}>
                                    <div className={styles.statsNumber} style={{ color: 'var(--danger)' }}>
                                        {practiceResults.bad}
                                    </div>
                                    <div className={styles.statsLabel}>Bad</div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.statsActions}>
                            <button onClick={startPractice} className="btn btn-success">
                                Practice Again
                            </button>
                            <button onClick={() => setView('main')} className="btn btn-primary">
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
