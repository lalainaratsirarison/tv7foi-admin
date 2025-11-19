"use client";

import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Settings, Loader2 } from 'lucide-react';
import { useGetProfile, useUpdateProfile, useChangePassword } from '@/services/admin';
import toast from 'react-hot-toast';

export default function SettingsPage() {
    const [currentView, setCurrentView] = useState<'profile' | 'password'>('profile');
    
    // Récupération automatique des données réelles
    const { data: profile, isLoading: isLoadingProfile } = useGetProfile();

    if (isLoadingProfile) {
        return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Settings className="mr-3" /> Paramètres du Compte
            </h1>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row min-h-[500px]">
                {/* Sidebar de navigation */}
                <nav className="w-full md:w-64 bg-gray-50 border-r border-gray-100 p-6 space-y-2">
                    <button
                        onClick={() => setCurrentView('profile')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                            currentView === 'profile' 
                            ? 'bg-primary-100 text-primary-800 font-medium shadow-sm' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <User size={20} />
                        <span>Mon Profil</span>
                    </button>
                    <button
                        onClick={() => setCurrentView('password')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                            currentView === 'password' 
                            ? 'bg-primary-100 text-primary-800 font-medium shadow-sm' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <Lock size={20} />
                        <span>Sécurité</span>
                    </button>
                </nav>

                {/* Contenu */}
                <div className="flex-1 p-8">
                    {currentView === 'profile' && profile && (
                        <ProfileForm initialData={profile} />
                    )}
                    {currentView === 'password' && (
                        <PasswordForm />
                    )}
                </div>
            </div>
        </div>
    );
}

// --- SOUS-COMPOSANT : Formulaire de Profil ---
function ProfileForm({ initialData }: { initialData: any }) {
    const [formData, setFormData] = useState({
        name: initialData.name || '',
        surname: initialData.surname || '',
        newEmail: initialData.email || '',
        password: '', // Requis pour confirmation
    });

    const { mutate: updateProfile, isPending } = useUpdateProfile();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.password) return toast.error("Mot de passe actuel requis pour confirmer.");

        updateProfile(formData, {
            onSuccess: () => {
                toast.success("Profil mis à jour !");
                setFormData(prev => ({ ...prev, password: '' })); // Reset mdp
            },
            onError: (err: any) => {
                toast.error(err.response?.data || "Erreur lors de la mise à jour.");
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Informations personnelles</h2>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            value={formData.surname}
                            onChange={e => setFormData({...formData, surname: e.target.value})}
                            className="pl-10 w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                    <input 
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input 
                        type="email" 
                        value={formData.newEmail}
                        onChange={e => setFormData({...formData, newEmail: e.target.value})}
                        className="pl-10 w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                </div>
            </div>

            <div className="pt-4 border-t mt-6">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Confirmation de sécurité <span className="text-red-500">*</span>
                </label>
                <input 
                    type="password" 
                    placeholder="Votre mot de passe actuel"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-primary-500 outline-none"
                    required
                />
                <p className="text-xs text-gray-500 mt-1">Requis pour enregistrer les changements.</p>
            </div>

            <button 
                type="submit" 
                disabled={isPending}
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition disabled:opacity-50 flex justify-center"
            >
                {isPending ? <Loader2 className="animate-spin" /> : "Enregistrer les modifications"}
            </button>
        </form>
    );
}

// --- SOUS-COMPOSANT : Formulaire de Mot de Passe ---
function PasswordForm() {
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirm: ''
    });

    const { mutate: changePassword, isPending } = useChangePassword();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirm) {
            return toast.error("Les nouveaux mots de passe ne correspondent pas.");
        }
        if (passwords.newPassword.length < 6) {
            return toast.error("Le mot de passe est trop court.");
        }

        changePassword({
            oldPassword: passwords.oldPassword,
            newPassword: passwords.newPassword
        }, {
            onSuccess: () => {
                toast.success("Mot de passe modifié !");
                setPasswords({ oldPassword: '', newPassword: '', confirm: '' });
            },
            onError: (err: any) => {
                toast.error(err.response?.data || "Erreur.");
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Changer le mot de passe</h2>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ancien mot de passe</label>
                <input 
                    type="password" 
                    value={passwords.oldPassword}
                    onChange={e => setPasswords({...passwords, oldPassword: e.target.value})}
                    className="w-full p-2.5 border rounded-lg outline-none focus:border-primary-500"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                <input 
                    type="password" 
                    value={passwords.newPassword}
                    onChange={e => setPasswords({...passwords, newPassword: e.target.value})}
                    className="w-full p-2.5 border rounded-lg outline-none focus:border-primary-500"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le nouveau</label>
                <input 
                    type="password" 
                    value={passwords.confirm}
                    onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                    className="w-full p-2.5 border rounded-lg outline-none focus:border-primary-500"
                    required
                />
            </div>

            <button 
                type="submit" 
                disabled={isPending}
                className="w-full mt-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition disabled:opacity-50 flex justify-center"
            >
                {isPending ? <Loader2 className="animate-spin" /> : "Mettre à jour le mot de passe"}
            </button>
        </form>
    );
}