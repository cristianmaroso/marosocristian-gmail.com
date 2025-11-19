'use client';

import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { CommunityPost } from '@/lib/types';

interface CommunitySectionProps {
  posts: CommunityPost[];
}

export default function CommunitySection({ posts }: CommunitySectionProps) {
  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case 'recipe':
        return '🍳 Receita';
      case 'progress':
        return '📈 Progresso';
      case 'tip':
        return '💡 Dica';
      case 'question':
        return '❓ Pergunta';
      default:
        return type;
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'recipe':
        return 'bg-orange-100 text-orange-800';
      case 'progress':
        return 'bg-green-100 text-green-800';
      case 'tip':
        return 'bg-blue-100 text-blue-800';
      case 'question':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora há pouco';
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d atrás`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#2D3748]">
          Feed da Comunidade
        </h3>
        <Button
          variant="outline"
          size="sm"
          className="border-[#005A70] text-[#005A70]"
        >
          Criar Post
        </Button>
      </div>

      {posts.map((post) => (
        <Card key={post.id} className="border-none shadow-lg">
          <CardContent className="p-4">
            {/* Header do post */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#005A70] to-[#3ED1A1] rounded-full flex items-center justify-center text-white font-semibold">
                {post.userName.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#2D3748]">{post.userName}</p>
                <p className="text-xs text-[#4A5568]">
                  {formatTimeAgo(post.createdAt)}
                </p>
              </div>
              <Badge
                variant="outline"
                className={getPostTypeColor(post.type)}
              >
                {getPostTypeLabel(post.type)}
              </Badge>
            </div>

            {/* Conteúdo */}
            <p className="text-[#2D3748] mb-3">{post.content}</p>

            {/* Imagem (se houver) */}
            {post.imageUrl && (
              <div className="mb-3 rounded-lg overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt="Post"
                  className="w-full h-48 object-cover"
                />
              </div>
            )}

            {/* Ações */}
            <div className="flex items-center gap-4 pt-3 border-t">
              <button className="flex items-center gap-2 text-[#4A5568] hover:text-[#005A70] transition-colors">
                <Heart className="w-5 h-5" />
                <span className="text-sm">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-[#4A5568] hover:text-[#005A70] transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm">{post.comments}</span>
              </button>
              <button className="flex items-center gap-2 text-[#4A5568] hover:text-[#005A70] transition-colors ml-auto">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* CTA para comunidade completa */}
      <Card className="border-none shadow-lg bg-gradient-to-r from-[#005A70] to-[#3ED1A1] text-white">
        <CardContent className="p-6 text-center">
          <h4 className="font-semibold mb-2">
            Junte-se à Comunidade Completa
          </h4>
          <p className="text-sm text-white/90 mb-4">
            Conecte-se com milhares de pessoas em busca dos mesmos objetivos
          </p>
          <Button className="bg-white text-[#005A70] hover:bg-white/90">
            Explorar Comunidade
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
