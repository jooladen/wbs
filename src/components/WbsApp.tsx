'use client';

import { useEffect } from 'react';
import { useWbsStore } from '@/store/wbsStore';
import WbsNode from './WbsNode';
import UserGuide from './UserGuide';

/**
 * WBS 애플리케이션 메인 컴포넌트
 * - 샘플 데이터로 루트 노드 초기화
 * - 프로젝트 전체 진행률 표시
 * - WbsNode 컴포넌트를 재귀적으로 렌더링
 */
export default function WbsApp() {
  const { root, setRoot } = useWbsStore();

  /**
   * 컴포넌트 마운트 시 샘플 WBS 데이터로 초기화
   * - 루트: '프로젝트'
   * - 자식: '기획', '개발', '테스트' (각 0% 진행률)
   */
  useEffect(() => {
    if (!root) {
      setRoot({
        id: 'root',
        title: '프로젝트',
        progress: 0,
        children: [
          { id: 'plan', title: '기획', progress: 0, children: [] },
          { id: 'dev', title: '개발', progress: 0, children: [] },
          { id: 'test', title: '테스트', progress: 0, children: [] }
        ]
      });
    }
  }, [root, setRoot]);

  // 초기화 중이면 로딩 표시
  if (!root) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-4xl font-bold text-indigo-700 mb-4">📋 WBS 작업 관리</h1>

          {/* 프로젝트 진행률 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-700">프로젝트 전체 진행률</span>
              <span className="text-2xl font-bold text-indigo-600">{root.progress.toFixed(1)}%</span>
            </div>

            {/* 진행률 바 */}
            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500 flex items-center justify-center"
                style={{ width: `${root.progress}%` }}
              >
                {root.progress > 10 && (
                  <span className="text-white text-xs font-bold">{root.progress.toFixed(0)}%</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 사용 가이드 */}
        <UserGuide />

        {/* WBS 트리 */}
        <div className="space-y-2">
          <WbsNode node={root} depth={0} />
        </div>
      </div>
    </div>
  );
}
