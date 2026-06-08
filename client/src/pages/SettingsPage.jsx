import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
    User, 
    Bell, 
    Globe, 
    Shield, 
    Smartphone,
    Mail,
    Lock,
    LogOut,
    ToggleLeft,
    ToggleRight
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/auth/authSlice';
import UserAvatar from '../components/common/UserAvatar';

const SettingsPage = () => {
    const { t } = useTranslation();
    const user = useSelector(selectUser);

    const [toggles, setToggles] = useState({
        push: true,
        email: true,
        sms: false,
        ai: true,
        sheriha: true
    });

    const handleToggle = (key) => {
        setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Profile & Settings</h1>
                <p className="text-neutral-400 text-sm mt-1">Manage your account details, security, and notification preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column (Profile & Preferences) */}
                <div className="lg:col-span-1 space-y-6">
                    
                    {/* Profile Card */}
                    <div className="bg-kashf-surface border border-kashf-border rounded-2xl p-6 flex flex-col items-center text-center">
                        <UserAvatar user={user} className="size-24 mb-4 ring-4 ring-neutral-800" />
                        <h2 className="text-lg font-bold text-white">{user?.username || 'Kashf User'}</h2>
                        <p className="text-sm text-neutral-400 mb-4">{user?.email || 'user@example.com'}</p>
                        
                        <div className="w-full space-y-3 mt-2">
                            <button className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm font-medium text-white transition-colors">
                                Edit Profile
                            </button>
                            <button className="w-full py-2 border border-neutral-700 hover:bg-neutral-800 rounded-lg text-sm font-medium text-neutral-300 transition-colors">
                                Change Avatar
                            </button>
                        </div>
                    </div>

                    {/* Language Preferences */}
                    <div className="bg-kashf-surface border border-kashf-border rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Globe className="size-5 text-kashf-light-blue" />
                            <h3 className="text-base font-bold text-white">Preferences</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">Interface Language</label>
                                <select className="w-full bg-neutral-900 border border-neutral-800 text-sm text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-kashf-blue">
                                    <option value="en">English</option>
                                    <option value="ar">العربية (Arabic)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (Notifications & Security) */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Notification Settings */}
                    <div className="bg-kashf-surface border border-kashf-border rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Bell className="size-5 text-amber-400" />
                            <h3 className="text-base font-bold text-white">Notification Settings</h3>
                        </div>
                        
                        <div className="space-y-1">
                            <ToggleRow 
                                title="Push Notifications" 
                                desc="Receive alerts directly on your device." 
                                icon={Smartphone} 
                                active={toggles.push} 
                                onToggle={() => handleToggle('push')} 
                            />
                            <ToggleRow 
                                title="Email Summaries" 
                                desc="Weekly consumption and billing summaries." 
                                icon={Mail} 
                                active={toggles.email} 
                                onToggle={() => handleToggle('email')} 
                            />
                            <ToggleRow 
                                title="AI Recommendations" 
                                desc="Get notified when Kashf AI finds savings." 
                                icon={User} 
                                active={toggles.ai} 
                                onToggle={() => handleToggle('ai')} 
                            />
                            <ToggleRow 
                                title="Sheriha (Tier) Alerts" 
                                desc="Critical warnings before crossing a new tier." 
                                icon={Bell} 
                                active={toggles.sheriha} 
                                onToggle={() => handleToggle('sheriha')} 
                            />
                        </div>
                    </div>

                    {/* Security Section */}
                    <div className="bg-kashf-surface border border-kashf-border rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Shield className="size-5 text-emerald-400" />
                            <h3 className="text-base font-bold text-white">Security & Login</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border border-neutral-800 rounded-xl bg-neutral-900/30">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-neutral-800 rounded-lg text-neutral-400">
                                        <Lock className="size-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-white">Change Password</h4>
                                        <p className="text-xs text-neutral-400">Last changed 3 months ago</p>
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm font-medium text-white transition-colors">
                                    Update
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 border border-neutral-800 rounded-xl bg-neutral-900/30">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-kashf-blue/10 rounded-lg text-kashf-light-blue">
                                        <Shield className="size-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-white">Two-Factor Authentication</h4>
                                        <p className="text-xs text-emerald-400">Currently Enabled</p>
                                    </div>
                                </div>
                                <button className="px-4 py-2 border border-neutral-700 hover:bg-neutral-800 rounded-lg text-sm font-medium text-neutral-300 transition-colors">
                                    Manage
                                </button>
                            </div>

                            <div className="pt-6 mt-6 border-t border-neutral-800">
                                <button className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors">
                                    <LogOut className="size-4" />
                                    Sign out of all other devices
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                        <h3 className="text-base font-bold text-red-400 mb-2">Danger Zone</h3>
                        <p className="text-sm text-neutral-400 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                        <button className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium transition-colors">
                            Delete Account
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

const ToggleRow = ({ title, desc, icon: Icon, active, onToggle }) => (
    <div className="flex items-center justify-between py-3 border-b border-neutral-800/50 last:border-0">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${active ? 'bg-kashf-blue/10 text-kashf-light-blue' : 'bg-neutral-800 text-neutral-500'}`}>
                <Icon className="size-4" />
            </div>
            <div>
                <h4 className="text-sm font-medium text-white">{title}</h4>
                <p className="text-xs text-neutral-500">{desc}</p>
            </div>
        </div>
        <button onClick={onToggle} className={`transition-colors ${active ? 'text-kashf-light-blue' : 'text-neutral-600'}`}>
            {active ? <ToggleRight className="size-8" /> : <ToggleLeft className="size-8" />}
        </button>
    </div>
);

export default SettingsPage;
