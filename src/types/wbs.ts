/**
 * WBS 노드 타입 정의
 * - 트리 구조로 무한 depth 지원
 * - 각 노드는 자신의 progress와 children 배열을 가짐
 */
export interface WbsNode {
  id: string;           // 노드 고유 식별자
  title: string;        // 작업 제목
  progress: number;     // 진행률 (0-100)
  children: WbsNode[];  // 자식 노드 배열 (무한 depth 지원)
}

/**
 * 노드 업데이트용 Payload 타입
 * - id와 children는 직접 수정할 수 없음
 * - title과 progress만 업데이트 가능
 */
export type NodeUpdatePayload = Partial<Omit<WbsNode, 'id' | 'children'>>;
