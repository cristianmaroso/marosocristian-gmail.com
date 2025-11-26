'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  Crown, 
  Settings, 
  TrendingUp, 
  Users, 
  Award,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { mockUser, userAchievements, communityPosts } from '@/lib/mock-data';
import { calculateWeightProgress } from '@/lib/utils-fitvida';
import { PREMIUM_FEATURES } from '@/lib/constants';
import PremiumDialog from '../dialogs/PremiumDialog';
import CommunitySection from '../widgets/CommunitySection';
import { signOut } from '@/lib/auth';
import { toast } from 'sonner';
import { getUserProfile, getUserGoals, UserProfile, UserGoals } from '@/lib/database';

interface ProfileTabProps {
  userId: string;
  userEmail: string;
}

export default function ProfileTab({ userId, userEmail }: ProfileTabProps) {
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [goals, setGoals] = useState<UserGoals | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    try {
      const [profileData, goalsData] = await Promise.all([
        getUserProfile(userId),
        getUserGoals(userId)
      ]);
      setProfile(profileData);
      setGoals(goalsData);
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      toast.error('Erro ao carregar dados do perfil');
    } finally {
      setLoading(false);
    }
  };

  const weightProgress = goals ? calculateWeightProgress({
    currentWeight: goals.weight,
    targetWeight: goals.target_weight,
    startWeight: goals.weight // Assuming start weight is current for now
  }) : { current: 0, target: 0, remaining: 0, percentage: 0 };

  const unlockedAchievements = userAchievements.filter(a => a.unlockedAt);
  const inProgressAchievements = userAchievements.filter(a => !a.unlockedAt);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logout realizado com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao fazer logout');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Perfil do usuário */}
      <Card className="border-none shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-[#005A70] to-[#3ED1A1] rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : userEmail.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-[#2D3748]">
                  {profile?.name || 'Usuário'}
                </h2>
                {mockUser.isPremium && (
                  <Badge className="bg-gradient-to-r from-[#005A70] to-[#3ED1A1] text-white">
                    <Crown className="w-3 h-3 mr-1" />
                    PRO
                  </Badge>
                )}
              </div>
              <p className="text-sm text-[#4A5568]">{userEmail}</p>
            </div>
          </div>

          {/* Stats rápidos */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#005A70]">
                {goals?.weight || 0}kg
              </p>
              <p className="text-xs text-[#4A5568]">Peso Atual</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#3ED1A1]">
                {goals?.target_weight || 0}kg
              </p>
              <p className="text-xs text-[#4A5568]">Meta</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#005A70]">
                {unlockedAchievements.length}
              </p>
              <p className="text-xs text-[#4A5568]">Conquistas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Premium CTA */}
      {!mockUser.isPremium && (
        <Card className="border-none shadow-lg bg-gradient-to-r from-[#005A70] to-[#3ED1A1] text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-6 h-6" />
                  <h3 className="text-lg font-bold">Upgrade para PRO</h3>
                </div>
                <p className="text-sm text-white/90 mb-3">
                  Desbloqueie recursos avançados e acelere seus resultados
                </p>
                <Button
                  onClick={() => setShowPremiumDialog(true)}
                  className="bg-white text-[#005A70] hover:bg-white/90"
                >
                  Ver Planos
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-[#E2E8F0]">
          <TabsTrigger value="achievements">Conquistas</TabsTrigger>
          <TabsTrigger value="community">Comunidade</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        {/* Tab de Conquistas */}
        <TabsContent value="achievements" className="space-y-4 mt-4">
          {/* Conquistas desbloqueadas */}
          {unlockedAchievements.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[#2D3748]">
                Desbloqueadas ({unlockedAchievements.length})
              </h3>
              {unlockedAchievements.map((achievement) => (
                <Card key={achievement.id} className="border-none shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#005A70] to-[#3ED1A1] rounded-full flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#2D3748]">
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-[#4A5568]">
                          {achievement.description}
                        </p>
                      </div>
                      <Badge className="bg-[#3ED1A1] text-white">
                        ✓
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Conquistas em progresso */}
          {inProgressAchievements.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[#2D3748]">
                Em Progresso ({inProgressAchievements.length})
              </h3>
              {inProgressAchievements.map((achievement) => (
                <Card key={achievement.id} className="border-none shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#E2E8F0] rounded-full flex items-center justify-center">
                        <Award className="w-6 h-6 text-[#4A5568]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#2D3748]">
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-[#4A5568] mb-2">
                          {achievement.description}
                        </p>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-[#4A5568]">
                            <span>Progresso</span>
                            <span>
                              {achievement.progress}/{achievement.target}
                            </span>
                          </div>
                          <Progress
                            value={(achievement.progress / achievement.target) * 100}
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tab de Comunidade */}
        <TabsContent value="community" className="mt-4">
          <CommunitySection posts={communityPosts} />
        </TabsContent>

        {/* Tab de Configurações */}
        <TabsContent value="settings" className="space-y-3 mt-4">
          <Card className="border-none shadow-lg">
            <CardContent className="p-0">
              <button className="w-full flex items-center justify-between p-4 hover:bg-[#F7FAFC] transition-colors">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-[#4A5568]" />
                  <span className="text-[#2D3748]">Dados Pessoais</span>
                </div>
                <ChevronRight className="w-5 h-5 text-[#4A5568]" />
              </button>
              <div className="border-t" />
              <button className="w-full flex items-center justify-between p-4 hover:bg-[#F7FAFC] transition-colors">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-[#4A5568]" />
                  <span className="text-[#2D3748]">Metas e Objetivos</span>
                </div>
                <ChevronRight className="w-5 h-5 text-[#4A5568]" />
              </button>
              <div className="border-t" />
              <button className="w-full flex items-center justify-between p-4 hover:bg-[#F7FAFC] transition-colors">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-[#4A5568]" />
                  <span className="text-[#2D3748]">Preferências</span>
                </div>
                <ChevronRight className="w-5 h-5 text-[#4A5568]" />
              </button>
              <div className="border-t" />
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors text-red-600"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="w-5 h-5" />
                  <span>Sair</span>
                </div>
                <ChevronRight className="w-5 h-5" />
              </button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog Premium */}
      <PremiumDialog
        open={showPremiumDialog}
        onClose={() => setShowPremiumDialog(false)}
      />
    </div>
  );
}