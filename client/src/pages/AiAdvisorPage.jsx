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
        <div className="space-y-6 max-w-7xl mx-auto pb-10 min-h-[calc(100vh-100px)] flex flex-col relative">
            {/* Header */}
            <PageHeader 
                icon={Bot}
                title={t('aiAdvisor.title')} 
                subtitle={t('aiAdvisor.subtitle')}
            >
                <div className={`flex items-center gap-2 px-3 py-1.5 ${isOnline ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isOnline ? <Wifi className="size-4" /> : <WifiOff className="size-4" />}
                    <span className="text-xs font-medium">
                        {isOnline ? t('aiAdvisor.onlineStatus', 'Online') : t('aiAdvisor.offlineStatus', 'Offline')}
                    </span>
                </div>
            </PageHeader>


            <div className="flex-1 flex justify-center">
                
                {/* Chat Interface */}
                <div className="w-full max-w-3xl flex flex-col px-4 sm:px-0">
                    
                    {/* Chat Messages */}
                    <div className="px-6 pt-6 pb-32 space-y-6">
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
                                <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 sm:p-5 shadow-sm ${
                                    msg.sender === 'user' 
                                    ? 'bg-gradient-to-br from-kashf-light-blue to-kashf-blue text-kashf-bg rounded-tr-sm shadow-kashf-blue/20' 
                                    : 'bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 text-neutral-200 rounded-tl-sm shadow-black/40'
                                }`} dir="rtl">
                                    <p className={`text-sm sm:text-base leading-relaxed ${msg.sender === 'user' ? 'font-medium' : ''}`}>
                                        {msg.message}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Chat Input Area */}
                    <div className="sticky bottom-0 pb-6 pt-12 shrink-0 mt-auto z-20 w-full bg-gradient-to-t from-[#121212] via-[#121212] to-transparent">
                        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-tight snap-x">
                            {SUGGESTED_QUESTIONS.map((q, i) => (
                                <button key={i} className="shrink-0 snap-start px-4 py-2 bg-neutral-900/80 hover:bg-kashf-blue/10 border border-neutral-800 hover:border-kashf-blue/30 rounded-full text-xs text-neutral-300 hover:text-kashf-light-blue transition-all whitespace-nowrap shadow-sm backdrop-blur-md">
                                    {q}
                                </button>
                            ))}
                        </div>
                        <div className="relative group">
                            <input 
                                type="text" 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder={t('aiAdvisor.inputPlaceholder')}
                                className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-2xl ps-6 pe-14 py-4 focus:outline-none focus:border-kashf-blue/50 focus:bg-neutral-800 focus:ring-4 focus:ring-kashf-blue/10 transition-all placeholder:text-neutral-600 shadow-xl"
                            />
                            <button className="absolute end-2 top-1/2 -translate-y-1/2 p-2.5 bg-kashf-blue group-focus-within:bg-kashf-light-blue hover:opacity-90 text-kashf-bg rounded-xl transition-all shadow-md">
                                <Send className="size-4 -ms-0.5 mt-0.5" />
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
