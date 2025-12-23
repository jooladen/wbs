import { create } from 'zustand';
import { WbsNode, NodeUpdatePayload } from '@/types/wbs';

/**
 * Progress 계산 함수
 * - 자식이 없으면: 노드 자신의 progress 반환
 * - 자식이 있으면: 모든 자식의 progress 평균 계산
 */
function calculateProgress(node: WbsNode): number {
  if (node.children.length === 0) {
    return node.progress;
  }

  const sum = node.children.reduce((acc, child) => acc + child.progress, 0);
  return sum / node.children.length;
}

/**
 * 재귀적으로 노드를 업데이트하는 함수
 * - Immutable 방식: 변경이 발생한 노드부터 루트까지 새 객체 생성
 * - 변경되지 않은 브랜치는 기존 참조 유지 (structural sharing)
 */
function updateNodeRecursive(
  node: WbsNode,
  targetId: string,
  payload: NodeUpdatePayload
): WbsNode {
  // 타겟 노드를 찾았다!
  if (node.id === targetId) {
    // 새 객체를 생성하고 payload를 병합
    const updatedNode = { ...node, ...payload };

    // progress가 변경되지 않았고 자식이 있다면 재계산
    if (payload.progress === undefined && updatedNode.children.length > 0) {
      updatedNode.progress = calculateProgress(updatedNode);
    }

    return updatedNode;
  }

  // 자식이 없으면 이 경로에는 타겟이 없음
  if (node.children.length === 0) {
    return node;
  }

  // 자식들을 재귀적으로 탐색
  let hasChange = false;
  const newChildren = node.children.map(child => {
    const updatedChild = updateNodeRecursive(child, targetId, payload);

    // 참조 비교로 변경 감지 (immutability의 핵심!)
    if (updatedChild !== child) {
      hasChange = true;
    }

    return updatedChild;
  });

  // 자식 중 하나가 변경되었다면 이 노드도 새로 생성
  if (hasChange) {
    const newNode = {
      ...node,
      children: newChildren,
      progress: calculateProgress({ ...node, children: newChildren })
    };
    return newNode;
  }

  // 이 경로에는 변경사항 없음 - 기존 참조 반환
  return node;
}

/**
 * 재귀적으로 노드를 추가하는 함수
 * - parentId를 찾아서 children 배열에 newNode 추가
 * - 상위 노드들의 progress를 자동 재계산
 */
function addNodeRecursive(
  node: WbsNode,
  parentId: string,
  newNode: WbsNode
): WbsNode {
  // 부모 노드를 찾았다!
  if (node.id === parentId) {
    const newChildren = [...node.children, newNode];
    return {
      ...node,
      children: newChildren,
      progress: calculateProgress({ ...node, children: newChildren })
    };
  }

  // 자식이 없으면 이 경로에는 부모가 없음
  if (node.children.length === 0) {
    return node;
  }

  // 자식들을 재귀적으로 탐색
  let hasChange = false;
  const newChildren = node.children.map(child => {
    const updatedChild = addNodeRecursive(child, parentId, newNode);

    if (updatedChild !== child) {
      hasChange = true;
    }

    return updatedChild;
  });

  // 자식 중 하나가 변경되었다면 이 노드도 새로 생성하고 progress 재계산
  if (hasChange) {
    return {
      ...node,
      children: newChildren,
      progress: calculateProgress({ ...node, children: newChildren })
    };
  }

  return node;
}

/**
 * 재귀적으로 노드를 제거하는 함수
 * - targetId를 찾아서 제거
 * - 상위 노드들의 progress를 자동 재계산
 */
function removeNodeRecursive(node: WbsNode, targetId: string): WbsNode {
  // 자식이 없으면 이 경로에는 타겟이 없음
  if (node.children.length === 0) {
    return node;
  }

  // 직접 자식 중에 타겟이 있는지 확인
  const newChildren = node.children.filter(child => child.id !== targetId);

  // 직접 자식 중 하나를 제거함
  if (newChildren.length !== node.children.length) {
    // 모든 자식이 제거된 경우
    if (newChildren.length === 0) {
      return {
        ...node,
        children: []
        // progress는 그대로 유지
      };
    }

    // 일부 자식만 제거된 경우 - progress 재계산
    return {
      ...node,
      children: newChildren,
      progress: calculateProgress({ ...node, children: newChildren })
    };
  }

  // 자식의 자식들을 재귀적으로 탐색
  let hasChange = false;
  const recursivelyUpdatedChildren = newChildren.map(child => {
    const updatedChild = removeNodeRecursive(child, targetId);

    if (updatedChild !== child) {
      hasChange = true;
    }

    return updatedChild;
  });

  // 하위 어딘가에서 제거가 발생했다면 이 노드도 새로 생성하고 progress 재계산
  if (hasChange) {
    return {
      ...node,
      children: recursivelyUpdatedChildren,
      progress: calculateProgress({ ...node, children: recursivelyUpdatedChildren })
    };
  }

  return node;
}

/**
 * ID로 노드를 찾는 유틸리티 함수
 * - 트리를 순회하며 targetId를 가진 노드 검색
 */
function findNodeById(node: WbsNode | null, targetId: string): WbsNode | null {
  if (!node) return null;

  if (node.id === targetId) {
    return node;
  }

  for (const child of node.children) {
    const found = findNodeById(child, targetId);
    if (found) return found;
  }

  return null;
}

/**
 * Zustand Store 타입 정의
 */
interface WbsStore {
  root: WbsNode | null;

  // Actions
  setRoot: (root: WbsNode) => void;
  addNode: (parentId: string, node: WbsNode) => void;
  updateNode: (id: string, payload: NodeUpdatePayload) => void;
  removeNode: (id: string) => void;

  // Utility
  getNodeById: (id: string) => WbsNode | null;
}

/**
 * WBS Store 생성
 * - Zustand를 사용한 전역 상태 관리
 * - 모든 상태 변경은 immutable 방식으로 처리
 */
export const useWbsStore = create<WbsStore>((set, get) => ({
  root: null,

  /**
   * 루트 노드 설정
   */
  setRoot: (root: WbsNode) => {
    set({ root });
  },

  /**
   * 노드 추가
   * - parentId를 찾아서 children에 새 노드 추가
   * - 부모부터 루트까지 progress 자동 재계산
   */
  addNode: (parentId: string, node: WbsNode) => {
    const { root } = get();
    if (!root) {
      console.warn('Root is null. Set root first.');
      return;
    }

    const newRoot = addNodeRecursive(root, parentId, node);

    if (newRoot === root) {
      console.warn(`Parent node with id "${parentId}" not found.`);
      return;
    }

    set({ root: newRoot });
  },

  /**
   * 노드 업데이트
   * - id를 찾아서 payload로 업데이트
   * - 변경된 노드부터 루트까지 새 객체 생성
   * - progress 자동 재계산
   */
  updateNode: (id: string, payload: NodeUpdatePayload) => {
    const { root } = get();
    if (!root) {
      console.warn('Root is null. Set root first.');
      return;
    }

    const newRoot = updateNodeRecursive(root, id, payload);

    if (newRoot === root) {
      console.warn(`Node with id "${id}" not found.`);
      return;
    }

    set({ root: newRoot });
  },

  /**
   * 노드 제거
   * - id를 찾아서 제거
   * - 부모부터 루트까지 progress 자동 재계산
   */
  removeNode: (id: string) => {
    const { root } = get();
    if (!root) {
      console.warn('Root is null. Set root first.');
      return;
    }

    // 루트 자체를 제거하려는 경우
    if (root.id === id) {
      set({ root: null });
      return;
    }

    const newRoot = removeNodeRecursive(root, id);

    if (newRoot === root) {
      console.warn(`Node with id "${id}" not found.`);
      return;
    }

    set({ root: newRoot });
  },

  /**
   * ID로 노드 조회
   */
  getNodeById: (id: string) => {
    const { root } = get();
    return findNodeById(root, id);
  },
}));
