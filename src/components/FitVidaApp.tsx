'use client';

import { useState, useEffect } from 'react';
import { Home, BookOpen, Activity, User } from 'lucide-react';
import DashboardTab from './tabs/DashboardTab';
import DiaryTab from './tabs/DiaryTab';
import ActivitiesTab from './tabs/ActivitiesTab';
import ProfileTab from './tabs/ProfileTab';
import AuthPage from './AuthPage';
import { getCurrentUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

type Tab = 'home' | 'diary' | 'activities' | 'profile';

export default function FitVidaApp() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão atual
    checkUser();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuthSuccess={checkUser} />;
  }

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
        {activeTab === 'home' && <DashboardTab userId={user.id} />}
        {activeTab === 'diary' && <DiaryTab userId={user.id} />}
        {activeTab === 'activities' && <ActivitiesTab userId={user.id} />}
        {activeTab === 'profile' && <ProfileTab userId={user.id} userEmail={user.email} />}
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
