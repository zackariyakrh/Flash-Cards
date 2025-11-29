'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import styles from './page.module.css';

export default function Home() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, register, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push('/dashboard');
        }
    }, [user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(email, password);
            }
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1 className={styles.title}>
                        <span className="text-gradient">Flashcard</span> Learning
                    </h1>
                    <p className={styles.subtitle}>
                        Master German with interactive flashcards
                    </p>
                </div>

                <div className={styles.formCard}>
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${isLogin ? styles.active : ''}`}
                            onClick={() => {
                                setIsLogin(true);
                                setError('');
                            }}
                        >
                            Login
                        </button>
                        <button
                            className={`${styles.tab} ${!isLogin ? styles.active : ''}`}
                            onClick={() => {
                                setIsLogin(false);
                                setError('');
                            }}
                        >
                            Register
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {error && (
                            <div className={styles.error}>
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isLoading}
                            style={{ width: '100%', marginTop: '1rem' }}
                        >
                            {isLoading ? (
                                <div className="flex-center gap-sm">
                                    <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                                    <span>{isLogin ? 'Logging in...' : 'Creating account...'}</span>
                                </div>
                            ) : (
                                isLogin ? 'Login' : 'Create Account'
                            )}
                        </button>
                    </form>
                </div>

                <div className={styles.features}>
                    <div className={styles.feature}>
                        <div className={styles.featureIcon}>📚</div>
                        <h3>Organized Collections</h3>
                        <p>Create and manage multiple flashcard collections</p>
                    </div>
                    <div className={styles.feature}>
                        <div className={styles.featureIcon}>🎯</div>
                        <h3>Practice Mode</h3>
                        <p>Interactive learning with instant feedback</p>
                    </div>
                    <div className={styles.feature}>
                        <div className={styles.featureIcon}>📊</div>
                        <h3>Track Progress</h3>
                        <p>Monitor your learning statistics and success rate</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
