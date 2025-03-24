import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { motion } from 'framer-motion';

function Profile() {
    const { currentUser } = useAuth();
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setDisplayName(currentUser.displayName || '');
            setEmail(currentUser.email || '');
        }
    }, [currentUser]);

    const handleSave = async (e) => {
        e.preventDefault();

        if (password && password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        if (password && password.length < 6) {
            return setError('Password must be at least 6 characters long');
        }

        try {
            setLoading(true);
            setError('');
            setMessage('');

            // Reauthenticate user if changing sensitive information
            if ((email !== currentUser.email || password) && currentPassword) {
                const credential = EmailAuthProvider.credential(
                    currentUser.email,
                    currentPassword
                );
                await reauthenticateWithCredential(currentUser, credential);
            } else if ((email !== currentUser.email || password) && !currentPassword) {
                throw new Error('Current password is required to update email or password');
            }

            // Update profile (display name)
            if (displayName !== currentUser.displayName) {
                await updateProfile(currentUser, { displayName });
            }

            // Update email if changed
            if (email !== currentUser.email) {
                await updateEmail(currentUser, email);
            }

            // Update password if provided
            if (password) {
                await updatePassword(currentUser, password);
            }

            setMessage('Profile updated successfully!');
            setEditMode(false);
            setPassword('');
            setConfirmPassword('');
            setCurrentPassword('');
        } catch (error) {
            setError(`Failed to update profile: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
        >
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center mb-6">Your Profile</h2>

                {message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {!editMode ? (
                    <div className="space-y-4">
                        <div className="border-b pb-2">
                            <label className="block text-gray-500 text-sm">Display Name</label>
                            <p className="text-lg">{displayName || 'Not set'}</p>
                        </div>

                        <div className="border-b pb-2">
                            <label className="block text-gray-500 text-sm">Email</label>
                            <p className="text-lg">{email}</p>
                        </div>

                        <button
                            onClick={() => setEditMode(true)}
                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Edit Profile
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="display-name">
                                Display Name
                            </label>
                            <input
                                type="text"
                                id="display-name"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="password">
                                New Password (leave blank to keep current)
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {password && (
                            <div>
                                <label className="block text-gray-700 mb-2" htmlFor="confirm-password">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    id="confirm-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        )}

                        {(email !== currentUser.email || password) && (
                            <div>
                                <label className="block text-gray-700 mb-2" htmlFor="current-password">
                                    Current Password (required to change email/password)
                                </label>
                                <input
                                    type="password"
                                    id="current-password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required={email !== currentUser.email || !!password}
                                />
                            </div>
                        )}

                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setEditMode(false);
                                    setDisplayName(currentUser.displayName || '');
                                    setEmail(currentUser.email || '');
                                    setPassword('');
                                    setConfirmPassword('');
                                    setCurrentPassword('');
                                    setError('');
                                }}
                                className="w-1/2 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-1/2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </motion.div>
    );
}

export default Profile; 