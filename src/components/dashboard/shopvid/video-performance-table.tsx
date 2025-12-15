'use client';

import type { VideoAnalytics } from '@/services/analytics-service';
import {
  cardStyle,
  sectionTitleStyle,
  tableStyle,
  tableHeaderCellStyle,
  tableRowStyle,
  tableCellStyle,
  badgeStyle,
} from '@/lib/styles';
import { COLORS, formatPercent } from '@/lib/constants';

interface VideoPerformanceTableProps {
  videos: VideoAnalytics[];
  title?: string;
}

const TABLE_HEADERS = ['Video', 'Views', 'Likes', 'Shares', 'Engagement'] as const;
const ENGAGEMENT_THRESHOLD = 10;

export function VideoPerformanceTable({
  videos,
  title = 'Video Performance Details',
}: VideoPerformanceTableProps) {
  return (
    <div style={cardStyle}>
      <h3 style={sectionTitleStyle}>{title}</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${COLORS.border}`, textAlign: 'left' }}>
              {TABLE_HEADERS.map((header) => (
                <th key={header} style={tableHeaderCellStyle}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {videos.map((video, index) => (
              <tr key={video.videoId} style={tableRowStyle(index)}>
                <td style={{ ...tableCellStyle, fontWeight: 500 }}>{video.title}</td>
                <td style={tableCellStyle}>{video.views.toLocaleString()}</td>
                <td style={tableCellStyle}>{video.likes.toLocaleString()}</td>
                <td style={tableCellStyle}>{video.shares.toLocaleString()}</td>
                <td style={tableCellStyle}>
                  <span style={badgeStyle(video.engagement >= ENGAGEMENT_THRESHOLD)}>
                    {formatPercent(video.engagement)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
