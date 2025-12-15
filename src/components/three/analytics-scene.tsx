'use client';

import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Stars } from '@react-three/drei';
import { FloatingCard } from './floating-card';
import { CHART_COLORS, formatNumber, formatPercent, formatCurrency } from '@/lib/constants';
import type { AnalyticsData } from '@/services/analytics-service';

// Scene configuration
const CAMERA_CONFIG = { position: [0, 0, 8] as [number, number, number], fov: 50 };
const BACKGROUND_GRADIENT = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';

// Card layout positions (row, column based)
const CARD_POSITIONS: Record<string, [number, number, number]> = {
  views: [-3, 1.2, 0],
  likes: [0, 1.2, 0],
  shares: [3, 1.2, 0],
  engagement: [-1.5, -1.2, 0],
  revenue: [1.5, -1.2, 0],
};

// Float animation speeds per card
const FLOAT_SPEEDS: Record<string, number> = {
  views: 1.5,
  likes: 1.8,
  shares: 1.3,
  engagement: 1.6,
  revenue: 1.4,
};

interface AnalyticsSceneProps {
  data: AnalyticsData;
}

interface CardData {
  id: string;
  title: string;
  value: string;
  change: number;
  color: string;
  position: [number, number, number];
  speed: number;
}

export function AnalyticsScene({ data }: AnalyticsSceneProps) {
  const { summary } = data;

  // Memoize card data to prevent recalculation on each render
  const cards = useMemo<CardData[]>(
    () => [
      {
        id: 'views',
        title: 'Total Views',
        value: formatNumber(summary.totalViews.value),
        change: summary.totalViews.changePercent,
        color: CHART_COLORS.views,
        position: CARD_POSITIONS.views,
        speed: FLOAT_SPEEDS.views,
      },
      {
        id: 'likes',
        title: 'Total Likes',
        value: formatNumber(summary.totalLikes.value),
        change: summary.totalLikes.changePercent,
        color: CHART_COLORS.likes,
        position: CARD_POSITIONS.likes,
        speed: FLOAT_SPEEDS.likes,
      },
      {
        id: 'shares',
        title: 'Total Shares',
        value: formatNumber(summary.totalShares.value),
        change: summary.totalShares.changePercent,
        color: CHART_COLORS.shares,
        position: CARD_POSITIONS.shares,
        speed: FLOAT_SPEEDS.shares,
      },
      {
        id: 'engagement',
        title: 'Engagement Rate',
        value: formatPercent(summary.engagementRate.value),
        change: summary.engagementRate.changePercent,
        color: CHART_COLORS.engagement,
        position: CARD_POSITIONS.engagement,
        speed: FLOAT_SPEEDS.engagement,
      },
      {
        id: 'revenue',
        title: 'Revenue',
        value: formatCurrency(summary.revenue.value),
        change: summary.revenue.changePercent,
        color: CHART_COLORS.revenue,
        position: CARD_POSITIONS.revenue,
        speed: FLOAT_SPEEDS.revenue,
      },
    ],
    [summary]
  );

  return (
    <div style={{ width: '100%', height: '400px', borderRadius: '16px', overflow: 'hidden' }}>
      <Canvas camera={CAMERA_CONFIG} style={{ background: BACKGROUND_GRADIENT }}>
        {/* Lighting setup */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#667eea" />
        <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.5} />

        {/* Background stars */}
        <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />

        {/* Render floating cards from data */}
        {cards.map((card) => (
          <Float key={card.id} speed={card.speed} rotationIntensity={0.2} floatIntensity={0.5}>
            <FloatingCard
              position={card.position}
              title={card.title}
              value={card.value}
              change={card.change}
              color={card.color}
            />
          </Float>
        ))}

        {/* Camera controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
}
