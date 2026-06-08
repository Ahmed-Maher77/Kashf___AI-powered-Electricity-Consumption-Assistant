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
    Lightbulb
} from 'lucide-react';
import UserAvatar from '../components/common/UserAvatar';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/auth/authSlice';

const SUGGESTED_QUESTIONS = [
    "How can I reduce my bill this month?",
    "Why am I consuming more electricity than last May?",
    "Am I going to reach Tier 4?",
    "What appliances are using the most power right now?"
];

const SAVINGS_OPPORTUNITIES = [
    {
        title: "Optimize AC Temperature",
        action: "Set living room AC to 25°C instead of 22°C",
        impact: "High",
        savings: "120 EGP",
        icon: ThermometerSnowflake,
        color: "text-kashf-light-blue",
        bg: "bg-kashf-blue/10"
    },
    {
        title: "Shift Water Heater Usage",
        action: "Turn on 1 hour before use, don't leave it on 24/7",
        impact: "High",
        savings: "95 EGP",
        icon: Zap,
        color: "text-amber-400",
        bg: "bg-amber-500/10"
    },
    {
        title: "Reduce Standby Power",
        action: "Unplug microwave and TV when not in use",
        impact: "Low",
        savings: "25 EGP",
        icon: Clock,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10"
    }
];

const MOCK_CHAT = [
    {
        id: 1,
        sender: 'ai',
        message: "أهلاً بيك في كشف! أنا مساعدك الذكي لترشيد استهلاك الكهرباء. لاحظت إن استهلاكك الأسبوع ده أعلى بـ 15% من الطبيعي. أقدر أساعدك إزاي؟"
    },
    {
        id: 2,
        sender: 'user',
        message: "إيه اللي مزود الاستهلاك كده؟"
    },
    {
        id: 3,
        sender: 'ai',
        message: "من تحليل البيانات، التكييف في فترة الظهر (من 2 لـ 5) بيسحب كهربا كتير جداً. لو قللت استخدامه ساعة واحدة بس أو ظبطت الحرارة على 25 درجة، هتوفر حوالي 45 جنيه وتتجنب الدخول في الشريحة الرابعة."
    }
];

const AiAdvisorPage = () => {
    const { t } = useTranslation();
    const user = useSelector(selectUser);
    const [message, setMessage] = useState('');

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10 h-[calc(100vh-120px)] flex flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Bot className="size-6 text-kashf-light-blue" />
                        AI Energy Advisor
                    </h1>
                    <p className="text-neutral-400 text-sm mt-1">Get personalized recommendations in Egyptian Arabic to lower your bill.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-medium text-emerald-400">AI Online</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                
                {/* Chat Interface */}
                <div className="lg:col-span-2 bg-kashf-surface border border-kashf-border rounded-2xl flex flex-col overflow-hidden">
                    
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
                                    ? 'bg-kashf-blue text-white rounded-tr-sm' 
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
                                placeholder="Ask Kashf about your electricity usage..." 
                                className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-xl pl-4 pr-12 py-4 focus:outline-none focus:border-kashf-blue focus:ring-1 focus:ring-kashf-blue transition-all"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-kashf-blue hover:bg-kashf-light-blue text-white rounded-lg transition-colors">
                                <Send className="size-4" />
                            </button>
                        </div>
                        <p className="text-[10px] text-center text-neutral-500 mt-3 flex items-center justify-center gap-1">
                            <Sparkles className="size-3" />
                            AI responses are generated based on your historical OCR scans and consumption patterns.
                        </p>
                    </div>
                </div>

                {/* Savings Opportunities Sidebar */}
                <div className="bg-kashf-surface border border-kashf-border rounded-2xl p-6 overflow-y-auto hidden lg:block">
                    <div className="flex items-center gap-2 mb-6">
                        <Lightbulb className="size-5 text-amber-400" />
                        <h3 className="text-sm font-bold text-white">Active Opportunities</h3>
                    </div>
                    
                    <div className="space-y-4">
                        {SAVINGS_OPPORTUNITIES.map((opp, i) => {
                            const Icon = opp.icon;
                            return (
                                <div key={i} className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 transition-colors group cursor-pointer">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className={`p-2 rounded-lg ${opp.bg} ${opp.color}`}>
                                            <Icon className="size-4" />
                                        </div>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                            opp.impact === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                                        }`}>
                                            {opp.impact} Impact
                                        </span>
                                    </div>
                                    <h4 className="text-sm font-semibold text-white mb-1">{opp.title}</h4>
                                    <p className="text-xs text-neutral-400 mb-4">{opp.action}</p>
                                    
                                    <div className="flex justify-between items-center pt-3 border-t border-neutral-800">
                                        <span className="text-xs text-neutral-500">Estimated Savings</span>
                                        <span className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                                            <TrendingDown className="size-3" />
                                            {opp.savings}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AiAdvisorPage;
