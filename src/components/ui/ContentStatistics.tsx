import React, { useMemo } from 'react';
import { Content, ContentType } from '../../types';

interface ContentStatisticsProps {
  contents: Content[];
  contentTypes: ContentType[];
}

export const ContentStatistics: React.FC<ContentStatisticsProps> = ({ contents, contentTypes }) => {
  // Calculate statistics
  const stats = useMemo(() => {
    if (!contents.length) return null;

    // Total word count
    const totalWordCount = contents.reduce((sum, content) => sum + content.length, 0);

    // Most used content type
    const typeCount: Record<number, number> = {};
    contents.forEach(content => {
      const typeId = content.content_type.id;
      typeCount[typeId] = (typeCount[typeId] || 0) + 1;
    });

    const mostUsedTypeId = Object.entries(typeCount)
      .sort((a, b) => b[1] - a[1])[0]?.[0];

    const mostUsedType = contentTypes.find(type => type.id === parseInt(mostUsedTypeId || '0'));

    // Most used tone
    const toneCount: Record<string, number> = {};
    contents.forEach(content => {
      const tone = content.tone;
      toneCount[tone] = (toneCount[tone] || 0) + 1;
    });

    const mostUsedTone = Object.entries(toneCount)
      .sort((a, b) => b[1] - a[1])[0]?.[0];

    // Average word count
    const averageWordCount = Math.round(totalWordCount / contents.length);

    // Content created this month
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const contentsThisMonth = contents.filter(content => {
      const date = new Date(content.created_at);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    });

    // Content created today
    const today = now.setHours(0, 0, 0, 0);
    const contentsToday = contents.filter(content => {
      const date = new Date(content.created_at);
      return date.setHours(0, 0, 0, 0) === today;
    });

    return {
      totalContent: contents.length,
      totalWordCount,
      mostUsedType: mostUsedType?.name || 'N/A',
      mostUsedTone: mostUsedTone ? mostUsedTone.charAt(0).toUpperCase() + mostUsedTone.slice(1) : 'N/A',
      averageWordCount,
      contentsThisMonth: contentsThisMonth.length,
      contentsToday: contentsToday.length
    };
  }, [contents, contentTypes]);

  if (!stats) return null;

  return (
    <div className="card mb-8">
      <h2 className="text-lg font-medium text-text-primary mb-4">Content Statistics</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-secondary rounded-md p-3">
          <p className="text-xs text-text-secondary mb-1">Total Content</p>
          <p className="text-xl font-bold text-text-primary">{stats.totalContent}</p>
        </div>

        <div className="bg-secondary rounded-md p-3">
          <p className="text-xs text-text-secondary mb-1">Total Words</p>
          <p className="text-xl font-bold text-text-primary">{stats.totalWordCount.toLocaleString()}</p>
        </div>

        <div className="bg-secondary rounded-md p-3">
          <p className="text-xs text-text-secondary mb-1">Created This Month</p>
          <p className="text-xl font-bold text-text-primary">{stats.contentsThisMonth}</p>
        </div>

        <div className="bg-secondary rounded-md p-3">
          <p className="text-xs text-text-secondary mb-1">Created Today</p>
          <p className="text-xl font-bold text-text-primary">{stats.contentsToday}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-secondary rounded-md p-3">
          <p className="text-xs text-text-secondary mb-1">Most Used Content Type</p>
          <p className="text-text-primary font-medium">{stats.mostUsedType}</p>
        </div>

        <div className="bg-secondary rounded-md p-3">
          <p className="text-xs text-text-secondary mb-1">Most Used Tone</p>
          <p className="text-text-primary font-medium">{stats.mostUsedTone}</p>
        </div>

        <div className="bg-secondary rounded-md p-3">
          <p className="text-xs text-text-secondary mb-1">Average Word Count</p>
          <p className="text-text-primary font-medium">{stats.averageWordCount.toLocaleString()} words</p>
        </div>
      </div>
    </div>
  );
};