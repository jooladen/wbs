'use client';

import { useWbsStore } from '@/store/wbsStore';
import { WbsNode as WbsNodeType } from '@/types/wbs';

interface Props {
  node: WbsNodeType;
  depth: number;
}

export default function WbsNode({ node, depth }: Props) {
  const { root, addNode, updateNode, removeNode } = useWbsStore();

  // 들여쓰기: non-breaking space를 depth * 4번 반복
  const indent = '\u00A0'.repeat(depth * 4);

  /**
   * 하위 작업 추가 핸들러
   * - 타임스탬프 + 랜덤 문자열로 고유 ID 생성
   * - 새 작업 노드를 현재 노드의 자식으로 추가
   */
  const handleAddSubtask = () => {
    const newId = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    addNode(node.id, {
      id: newId,
      title: '새 작업',
      progress: 0,
      children: []
    });
  };

  /**
   * 진행률 +10 핸들러
   * - 자식이 있는 노드는 진행률을 직접 변경할 수 없음 (자동 계산됨)
   * - 진행률은 최대 100%까지만 증가
   */
  const handleIncreaseProgress = () => {
    if (node.children.length > 0) {
      alert('하위 작업이 있는 노드는 직접 진행률을 변경할 수 없습니다');
      return;
    }
    updateNode(node.id, {
      progress: Math.min(node.progress + 10, 100)
    });
  };

  /**
   * 삭제 핸들러
   * - 루트 노드는 삭제할 수 없음
   */
  const handleDelete = () => {
    if (node.id === root?.id) {
      alert('루트 노드는 삭제할 수 없습니다');
      return;
    }
    removeNode(node.id);
  };

  return (
    <div className="mb-2" style={{ marginLeft: `${depth * 24}px` }}>
      <div className="bg-white border-2 border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
        {/* 제목과 진행률 */}
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-lg font-semibold text-gray-800">{node.title}</h3>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
            {node.progress.toFixed(1)}%
          </span>
        </div>

        {/* 버튼들 */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleAddSubtask}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium shadow-sm transition-colors flex items-center gap-1"
          >
            ➕ 하위 작업 추가
          </button>
          <button
            onClick={handleIncreaseProgress}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm font-medium shadow-sm transition-colors flex items-center gap-1"
          >
            ⬆️ 진행률 +10
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm font-medium shadow-sm transition-colors flex items-center gap-1"
          >
            🗑️ 삭제
          </button>
        </div>
      </div>

      {/* 자식 노드들 */}
      {node.children.map(child => (
        <WbsNode key={child.id} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}
