'use client';

import { useState } from 'react';
import { Home, BookOpen, Activity, User } from 'lucide-react';
import DashboardTab from './tabs/DashboardTab';
import DiaryTab from './tabs/DiaryTab';
import ActivitiesTab from './tabs/ActivitiesTab';
import ProfileTab from './tabs/ProfileTab';

type Tab = 'home' | 'diary' | 'activities' | 'profile';

export default function FitVidaApp() {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  return (
    <div className="flex flex-col h-screen bg-[#F7FAFC]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#005A70] to-[#3ED1A1] text-white px-4 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">FitVida Pro</h1>
          <p className="text-sm text-white/90">Seu coach de emagrecimento</p>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {activeTab === 'home' && <DashboardTab />}
        {activeTab === 'diary' && <DiaryTab />}
        {activeTab === 'activities' && <ActivitiesTab />}
        {activeTab === 'profile' && <ProfileTab />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-around items-center h-16">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              activeTab === 'home'
                ? 'text-[#005A70] bg-[#3ED1A1]/10'
                : 'text-[#4A5568] hover:text-[#005A70]'
            }`}
          >
            <Home className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Início</span>
          </button>

          <button
            onClick={() => setActiveTab('diary')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              activeTab === 'diary'
                ? 'text-[#005A70] bg-[#3ED1A1]/10'
                : 'text-[#4A5568] hover:text-[#005A70]'
            }`}
          >
            <BookOpen className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Diário</span>
          </button>

          <button
            onClick={() => setActiveTab('activities')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              activeTab === 'activities'
                ? 'text-[#005A70] bg-[#3ED1A1]/10'
                : 'text-[#4A5568] hover:text-[#005A70]'
            }`}
          >
            <Activity className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Atividades</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              activeTab === 'profile'
                ? 'text-[#005A70] bg-[#3ED1A1]/10'
                : 'text-[#4A5568] hover:text-[#005A70]'
            }`}
          >
            <User className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
