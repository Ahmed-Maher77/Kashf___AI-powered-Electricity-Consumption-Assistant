import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
    Bot, 
    Send, 
    Sparkles, 
    Zap, 
    TrendingDown,
    Clock,
    ThermometerSnowflake,
    Lightbulb,
    Wifi,
    WifiOff
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import UserAvatar from '../components/common/UserAvatar';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/auth/authSlice';

const AiAdvisorPage = () => {
    const { t } = useTranslation();
    const user = useSelector(selectUser);
    const [message, setMessage] = useState('');
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    React.useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const SUGGESTED_QUESTIONS = [
        t('aiAdvisor.suggestedQuestions.q1'),
        t('aiAdvisor.suggestedQuestions.q2'),
        t('aiAdvisor.suggestedQuestions.q3'),
        t('aiAdvisor.suggestedQuestions.q4')
    ];

    const SAVINGS_OPPORTUNITIES = [
        {
            title: t('aiAdvisor.savings.optAC.title'),
            action: t('aiAdvisor.savings.optAC.action'),
            impact: t('aiAdvisor.savings.impactHigh'),
            savings: t('aiAdvisor.savings.optAC.savings'),
            icon: ThermometerSnowflake,
            color: "text-kashf-light-blue",
            bg: "bg-kashf-blue/10"
        },
        {
            title: t('aiAdvisor.savings.shiftHeater.title'),
            action: t('aiAdvisor.savings.shiftHeater.action'),
            impact: t('aiAdvisor.savings.impactHigh'),
            savings: t('aiAdvisor.savings.shiftHeater.savings'),
            icon: Zap,
            color: "text-amber-400",
            bg: "bg-amber-500/10"
        },
        {
            title: t('aiAdvisor.savings.standbyPower.title'),
            action: t('aiAdvisor.savings.standbyPower.action'),
            impact: t('aiAdvisor.savings.impactLow'),
            savings: t('aiAdvisor.savings.standbyPower.savings'),
            icon: Clock,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10"
        }
    ];

    const MOCK_CHAT = [
        {
            id: 1,
            sender: 'ai',
            message: t('aiAdvisor.mockChat.msg1')
        },
        {
            id: 2,
            sender: 'user',
            message: t('aiAdvisor.mockChat.msg2')
        },
        {
            id: 3,
            sender: 'ai',
            message: t('aiAdvisor.mockChat.msg3')
        }
    ];

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10 h-[calc(100vh-120px)] flex flex-col">
            {/* Header */}
            <PageHeader 
                icon={Bot}
                title={t('aiAdvisor.title')} 
                subtitle={t('aiAdvisor.subtitle')}
            >
                <div className={`flex items-center gap-2 px-3 py-1.5 ${isOnline ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'} border rounded-full`}>
                    {isOnline ? <Wifi className="size-4" /> : <WifiOff className="size-4" />}
                    <span className="text-xs font-medium">
                        {isOnline ? t('aiAdvisor.onlineStatus', 'Online') : t('aiAdvisor.offlineStatus', 'Offline')}
                    </span>
                </div>
            </PageHeader>

            <div className="flex-1 min-h-0 flex justify-center">
                
                {/* Chat Interface */}
                <div className="w-full max-w-4xl bg-kashf-surface border border-kashf-border rounded-2xl flex flex-col overflow-hidden">
                    
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-kashf-surface to-neutral-900/50">
                        {MOCK_CHAT.map((msg) => (
                            <div key={msg.id} className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className="shrink-0">
                                    {msg.sender === 'ai' ? (
                                        <div className="size-10 rounded-full bg-kashf-blue/20 border border-kashf-blue/30 flex items-center justify-center">
                                            <Bot className="size-5 text-kashf-light-blue" />
                                        </div>
                                    ) : (
                                        <UserAvatar user={user} className="size-10" />
                                    )}
                                </div>
                                <div className={`max-w-[80%] rounded-2xl p-4 ${
                                    msg.sender === 'user' 
                                    ? 'bg-kashf-blue text-kashf-bg rounded-tr-sm' 
                                    : 'bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-tl-sm'
                                }`} dir="rtl">
                                    <p className="text-sm leading-relaxed">{msg.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Chat Input Area */}
                    <div className="p-4 border-t border-kashf-border bg-kashf-surface shrink-0">
                        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
                            {SUGGESTED_QUESTIONS.map((q, i) => (
                                <button key={i} className="shrink-0 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-full text-xs text-neutral-300 transition-colors whitespace-nowrap">
                                    {q}
                                </button>
                            ))}
                        </div>
                        <div className="relative mt-2">
                            <input 
                                type="text" 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder={t('aiAdvisor.inputPlaceholder')}
                                className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-xl pl-4 pr-12 py-4 focus:outline-none focus:border-kashf-blue focus:ring-1 focus:ring-kashf-blue transition-all"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-kashf-blue hover:opacity-90 text-kashf-bg rounded-lg transition-opacity">
                                <Send className="size-4" />
                            </button>
                        </div>
                        <p className="text-[10px] text-center text-neutral-500 mt-3 flex items-center justify-center gap-1">
                            <Sparkles className="size-3" />
                            {t('aiAdvisor.disclaimer')}
                        </p>
                    </div>
                </div>



            </div>
        </div>
    );
};

export default AiAdvisorPage;
