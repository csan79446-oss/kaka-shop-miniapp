import React, { useState } from 'react';
import {
  Cloud,
  Send,
  ExternalLink,
  Copy,
  Check,
  Layers,
  Terminal,
  Smartphone,
  Globe,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Bot,
  Laptop,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminDeployGuide: React.FC = () => {
  const { language } = useApp();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'telegram' | 'vercel' | 'faq'>('telegram');

  const currentDevUrl = window.location.origin;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const vercelConfig = `{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}`;

  return (
    <div className="space-y-4 animate-fade-in text-xs sm:text-sm pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-600 to-[#2481cc] text-white p-5 rounded-3xl shadow-sm space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg">
              {language === 'km'
                ? 'មគ្គុទ្ទេសក៍ភ្ជាប់ Telegram Bot & Deploy Vercel'
                : 'Telegram Bot & Vercel Deployment Guide'}
            </h3>
            <p className="text-xs text-sky-100">
              {language === 'km'
                ? 'ការណែនាំលម្អិតមួយជំហានម្តងៗ ងាយស្រួលយល់ និងអនុវត្តបានភ្លាមៗ'
                : 'Step-by-step beginner friendly guide to launch your Telegram MiniApp'}
            </p>
          </div>
        </div>
      </div>

      {/* Live Public URL Card */}
      <div className="bg-white dark:bg-[#17212b] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-emerald-500" />
            <span>{language === 'km' ? 'អាសយដ្ឋាន WebApp បច្ចុប្បន្នរបស់អ្នក (Current URL):' : 'Your Live WebApp URL:'}</span>
          </span>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>ONLINE</span>
          </span>
        </div>

        <div className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-xs">
          <span className="truncate flex-1 text-[#2481cc] font-semibold">{currentDevUrl}</span>
          <button
            onClick={() => copyToClipboard(currentDevUrl, 'url')}
            className="p-1.5 px-3 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center gap-1 font-sans text-xs"
            title="ចម្លង URL"
          >
            {copiedKey === 'url' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 font-medium">ចម្លងរួច</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>ចម្លង Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Guide Tab Switcher */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('telegram')}
          className={`flex-1 py-2 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'telegram'
              ? 'bg-white dark:bg-[#17212b] text-[#2481cc] shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>{language === 'km' ? '១. ភ្ជាប់ Telegram Bot' : '1. Telegram Bot'}</span>
        </button>

        <button
          onClick={() => setActiveTab('vercel')}
          className={`flex-1 py-2 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'vercel'
              ? 'bg-white dark:bg-[#17212b] text-[#2481cc] shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{language === 'km' ? '២. Deploy លើ Vercel' : '2. Deploy Vercel'}</span>
        </button>

        <button
          onClick={() => setActiveTab('faq')}
          className={`flex-1 py-2 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'faq'
              ? 'bg-white dark:bg-[#17212b] text-[#2481cc] shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{language === 'km' ? 'សំណួរញឹកញាប់' : 'FAQ'}</span>
        </button>
      </div>

      {/* TAB 1: TELEGRAM BOT SETUP */}
      {activeTab === 'telegram' && (
        <div className="bg-white dark:bg-[#17212b] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-[#2481cc]" />
              <span>
                {language === 'km'
                  ? 'របៀបភ្ជាប់ទៅ Telegram Bot ជាមួយ @BotFather (៤ ជំហាន)'
                  : 'How to connect MiniApp via @BotFather'}
              </span>
            </h4>
            <a
              href="https://t.me/BotFather"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#2481cc] hover:underline flex items-center gap-1"
            >
              <span>បើក @BotFather</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-3.5">
            {/* Step 1 */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#2481cc] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  1
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {language === 'km' ? 'បើក Telegram រួចស្វែងរក @BotFather' : 'Open Telegram and find @BotFather'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 pl-8">
                {language === 'km'
                  ? 'ចុច Start ហើយផ្ញើពាក្យបញ្ជាបង្កើត Bot ថ្មីមួយ៖'
                  : 'Start the chat and send the command to create a new bot:'}
              </p>
              <div className="pl-8 flex items-center gap-2">
                <code className="p-1.5 px-3 bg-slate-200 dark:bg-slate-800 rounded-lg font-mono text-xs text-slate-900 dark:text-white font-bold">
                  /newbot
                </code>
                <button
                  onClick={() => copyToClipboard('/newbot', 'cmd_newbot')}
                  className="p-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-1 text-slate-600 hover:text-slate-900"
                >
                  {copiedKey === 'cmd_newbot' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy</span>
                </button>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#2481cc] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  2
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {language === 'km' ? 'ដាក់ឈ្មោះ និង Username របស់ Bot' : 'Set Bot Name & Username'}
                </span>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 pl-8 space-y-1.5">
                <p>
                  • <strong>ឈ្មោះ Bot (Display Name):</strong> ដាក់ឈ្មោះដូចជា <code>KAKA Shop</code>
                </p>
                <p>
                  • <strong>Username:</strong> ត្រូវតែបញ្ចប់ដោយពាក្យ <code>bot</code> (ឧទាហរណ៍៖ <code>kaka_shop_app_bot</code>)
                </p>
                <p className="text-[11px] text-amber-600 dark:text-amber-400">
                  💡 @BotFather នឹងផ្ញើ HTTP API Token មួយមកឱ្យបង សូមរក្សាទុកវាឱ្យមានសុវត្ថិភាព។
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#2481cc] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  3
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {language === 'km' ? 'ដាក់ប៊ូតុង Menu បើកហាង (Set Menu Button)' : 'Set Menu Button to Open Store'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 pl-8">
                {language === 'km'
                  ? 'ផ្ញើពាក្យបញ្ជាខាងក្រោមទៅកាន់ @BotFather ដើម្បីដាក់ប៊ូតុង Menu ជាប់ជានិច្ចនៅជ្រុងខាងឆ្វេងក្រោម៖'
                  : 'Send this command to set the persistent Menu button in Telegram:'}
              </p>
              <div className="pl-8 flex items-center gap-2">
                <code className="p-1.5 px-3 bg-slate-200 dark:bg-slate-800 rounded-lg font-mono text-xs text-slate-900 dark:text-white font-bold">
                  /setmenubutton
                </code>
                <button
                  onClick={() => copyToClipboard('/setmenubutton', 'cmd_menu')}
                  className="p-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-1 text-slate-600 hover:text-slate-900"
                >
                  {copiedKey === 'cmd_menu' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy</span>
                </button>
              </div>
              <div className="pl-8 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <p>1. ជ្រើសរើស Bot របស់អ្នក</p>
                <p>2. បញ្ចូល Link URL របស់ App (ចម្លង Link ខាងលើ ឬ Vercel URL)</p>
                <p>3. ដាក់ឈ្មោះប៊ូតុង ឧទាហរណ៍៖ <code>🛍️ បើកហាងទំនិញ</code> ឬ <code>Open Store</code></p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  4
                </span>
                <span className="font-semibold text-emerald-900 dark:text-emerald-300">
                  {language === 'km' ? 'រួចរាល់! សាកល្បងបើកក្នុង Telegram' : 'Done! Test Launch in Telegram'}
                </span>
              </div>
              <p className="text-xs text-emerald-800 dark:text-emerald-200 pl-8">
                {language === 'km'
                  ? 'ឥឡូវនេះចូលទៅកាន់ Bot របស់អ្នកក្នុង Telegram ហើយចុចប៊ូតុង "🛍️ បើកហាងទំនិញ" ឬ "Start" នោះហាង KAKA Shop នឹងបង្ហាញឡើងលើអេក្រង់ទូរស័ព្ទភ្លាមៗ!'
                  : 'Now open your bot in Telegram and tap the Menu button. Your MiniApp is ready to accept orders!'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VERCEL DEPLOYMENT */}
      {activeTab === 'vercel' && (
        <div className="bg-white dark:bg-[#17212b] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-black dark:text-white" />
              <span>
                {language === 'km' ? 'របៀប Deploy លើ Vercel ដោយឥតគិតថ្លៃ (៤ ជំហាន)' : 'Deploy on Vercel (100% Free)'}
              </span>
            </h4>
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#2481cc] hover:underline flex items-center gap-1"
            >
              <span>ចូល Vercel.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-3.5">
            {/* Step 1: GitHub */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  1
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {language === 'km' ? 'ដាក់កូដចូលទៅកាន់ GitHub Repository' : 'Push code to your GitHub Repository'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 pl-8">
                {language === 'km'
                  ? 'បង្កើត Repository ថ្មីមួយនៅលើ GitHub (ឧទាហរណ៍៖ kaka-shop-miniapp) ហើយ Push កូដរបស់គម្រោងនេះឡើង។'
                  : 'Create a new GitHub repository and upload your project code.'}
              </p>
            </div>

            {/* Step 2: Vercel Import */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  2
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {language === 'km' ? 'ចូល Vercel.com ហើយជ្រើសរើស "Import Project"' : 'Login to Vercel and Import Project'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 pl-8">
                {language === 'km'
                  ? 'ចូលទៅកាន់ vercel.com ដោយប្រើគណនី GitHub រួចចុចប៊ូតុង "Add New..." ➜ "Project" ហើយជ្រើសរើស Repository របស់បង។'
                  : 'Log in with GitHub on Vercel, click "Add New..." -> "Project", and select your repository.'}
              </p>
            </div>

            {/* Step 3: Vercel Settings */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  3
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {language === 'km' ? 'ការកំណត់ Build & Output Settings' : 'Build & Output Settings'}
                </span>
              </div>
              <div className="pl-8 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                <p>• <strong>Framework Preset:</strong> <code>Vite</code> (ប្រព័ន្ធនឹងស្គាល់ដោយស្វ័យប្រវត្តិ)</p>
                <p>• <strong>Build Command:</strong> <code>npm run build</code></p>
                <p>• <strong>Output Directory:</strong> <code>dist</code></p>
                <p>• <strong>Environment Variables (បើមាន AI Gemini):</strong> បញ្ចូល <code>GEMINI_API_KEY</code></p>
              </div>
            </div>

            {/* Step 4: Complete */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  4
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {language === 'km' ? 'ចុចប៊ូតុង "Deploy"' : 'Click Deploy'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 pl-8">
                {language === 'km'
                  ? 'រង់ចាំប្រហែល ៣០ វិនាទី នោះ Vercel នឹងផ្តល់ Link វេបសាយអន្តរជាតិមាន HTTPS ដូចជា https://kaka-shop.vercel.app ដោយឥតគិតថ្លៃ!'
                  : 'Wait ~30s. Vercel will give you a free, permanent HTTPS URL (e.g., https://kaka-shop.vercel.app)!'}
              </p>
            </div>
          </div>

          {/* Vercel Configuration File (vercel.json) */}
          <div className="p-3 bg-slate-900 text-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-emerald-400 font-bold">vercel.json (ត្រូវបានដាក់បញ្ចូលក្នុង Project រួចស្រេច)</span>
              <button
                onClick={() => copyToClipboard(vercelConfig, 'vjson')}
                className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
              >
                {copiedKey === 'vjson' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy</span>
              </button>
            </div>
            <pre className="text-[10px] font-mono text-slate-300 overflow-x-auto">
              {vercelConfig}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: FAQ */}
      {activeTab === 'faq' && (
        <div className="bg-white dark:bg-[#17212b] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#2481cc]" />
            <span>{language === 'km' ? 'សំណួរដែលសួរញឹកញាប់ (FAQ)' : 'Frequently Asked Questions'}</span>
          </h4>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 space-y-1">
              <p className="font-semibold text-slate-900 dark:text-white">
                {language === 'km' ? '❓ តើអតិថិជនត្រូវទាញយក App ថ្មីផ្សេងទេ?' : 'Do customers need to install an app?'}
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                {language === 'km'
                  ? 'មិនបាច់ទេ! អតិថិជនគ្រាន់តែបើក Telegram ហើយចុចលើ Bot នោះផ្ទាំងហាងនឹងលោតឡើងមកផ្ទាល់តែម្តង (Seamless WebApp)។'
                  : 'No installation required! It runs natively inside Telegram on iOS, Android, and Desktop.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 space-y-1">
              <p className="font-semibold text-slate-900 dark:text-white">
                {language === 'km' ? '❓ តើខ្ញុំអាចប្រើ Domain ផ្ទាល់ខ្លួនបានទេ?' : 'Can I use my own custom domain?'}
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                {language === 'km'
                  ? 'បានចាស! Vercel អនុញ្ញាតឱ្យបងភ្ជាប់ Domain ផ្ទាល់ខ្លួនដូចជា www.kakashop.com ដោយឥតគិតថ្លៃ និងមាន SSL Certificate ស្វ័យប្រវត្តិ។'
                  : 'Yes! Vercel supports free custom domains with automated SSL HTTPS certificates.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 space-y-1">
              <p className="font-semibold text-slate-900 dark:text-white">
                {language === 'km' ? '❓ តើការភ្ជាប់នេះគិតថ្លៃសេវាប្រចាំខែទេ?' : 'Are there any monthly subscription fees?'}
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                {language === 'km'
                  ? 'ឥតគិតថ្លៃ ១០០%! ទាំង Telegram Bot API និង Vercel Hobby Tier គឺផ្តល់ជូនឥតគិតថ្លៃសម្រាប់ការប្រើប្រាស់ជាទូទៅ។'
                  : '100% Free! Both Telegram Bot API and Vercel Hobby tier are free to use.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
