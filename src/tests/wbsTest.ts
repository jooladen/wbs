import { useWbsStore } from '@/store/wbsStore';
import { WbsNode } from '@/types/wbs';

/**
 * 트리 구조를 시각적으로 출력하는 헬퍼 함수
 */
function printTree(node: WbsNode | null, indent = 0): string {
  if (!node) return '(empty)';

  const prefix = '  '.repeat(indent);
  let result = `${prefix}${node.title} (id: ${node.id}, progress: ${node.progress.toFixed(1)}%)\n`;

  for (const child of node.children) {
    result += printTree(child, indent + 1);
  }

  return result;
}

/**
 * WBS Store 테스트 스위트
 * - 6가지 시나리오를 순차적으로 테스트
 * - 각 테스트는 console.group으로 구분하여 출력
 */
export function runWbsTests() {
  console.log('%c=== WBS Store Test Suite ===', 'color: #4CAF50; font-size: 20px; font-weight: bold');
  console.log('');

  // ⭐ 매번 최신 상태를 가져오는 헬퍼 함수
  // Zustand의 getState()는 현재 시점의 상태를 반환하므로
  // 상태가 변경될 때마다 다시 호출해야 합니다!
  const getStore = () => useWbsStore.getState();

  // ========================================
  // Test 1: 기본 트리 생성 및 자동 계산
  // ========================================
  console.group('📋 Test 1: 기본 트리 생성 및 Progress 자동 계산');

  const rootNode: WbsNode = {
    id: 'root',
    title: 'Project Root',
    progress: 0,
    children: []
  };

  getStore().setRoot(rootNode);
  console.log('✓ 루트 노드 생성');
  console.log(printTree(getStore().root));

  // 3개의 자식 노드 추가 (25%, 50%, 75%)
  getStore().addNode('root', {
    id: 'task-1',
    title: 'Task 1',
    progress: 25,
    children: []
  });

  getStore().addNode('root', {
    id: 'task-2',
    title: 'Task 2',
    progress: 50,
    children: []
  });

  getStore().addNode('root', {
    id: 'task-3',
    title: 'Task 3',
    progress: 75,
    children: []
  });

  console.log('✓ 3개 자식 노드 추가 (25%, 50%, 75%)');
  console.log(printTree(getStore().root));

  const expectedProgress1 = (25 + 50 + 75) / 3;
  const actualProgress1 = getStore().root?.progress || 0;

  console.log(`Expected root progress: ${expectedProgress1.toFixed(1)}%`);
  console.log(`Actual root progress: ${actualProgress1.toFixed(1)}%`);

  if (Math.abs(actualProgress1 - expectedProgress1) < 0.1) {
    console.log('%c✅ Test 1 PASSED', 'color: #4CAF50; font-weight: bold');
  } else {
    console.log('%c❌ Test 1 FAILED', 'color: #f44336; font-weight: bold');
  }

  console.groupEnd();
  console.log('');

  // ========================================
  // Test 2: 깊은 중첩 (3레벨)
  // ========================================
  console.group('🌳 Test 2: 깊은 중첩 (3레벨 트리)');

  // 새로운 루트로 시작
  const deepRootNode: WbsNode = {
    id: 'deep-root',
    title: 'Deep Root',
    progress: 0,
    children: []
  };

  getStore().setRoot(deepRootNode);

  // Level 1: Child A 추가
  getStore().addNode('deep-root', {
    id: 'child-a',
    title: 'Child A',
    progress: 0,
    children: []
  });

  // Level 2: Child A에 2개의 grandchildren 추가
  getStore().addNode('child-a', {
    id: 'grandchild-a1',
    title: 'Grandchild A1',
    progress: 100,
    children: []
  });

  getStore().addNode('child-a', {
    id: 'grandchild-a2',
    title: 'Grandchild A2',
    progress: 50,
    children: []
  });

  // Level 1: Child B 추가
  getStore().addNode('deep-root', {
    id: 'child-b',
    title: 'Child B',
    progress: 100,
    children: []
  });

  console.log('✓ 3레벨 트리 생성 완료');
  console.log(printTree(getStore().root));

  const childA = getStore().getNodeById('child-a');
  const deepRoot = getStore().root;

  const expectedChildAProgress = (100 + 50) / 2; // 75
  const expectedDeepRootProgress = (75 + 100) / 2; // 87.5

  console.log(`Expected Child A progress: ${expectedChildAProgress}%`);
  console.log(`Actual Child A progress: ${childA?.progress.toFixed(1)}%`);
  console.log(`Expected Deep Root progress: ${expectedDeepRootProgress}%`);
  console.log(`Actual Deep Root progress: ${deepRoot?.progress.toFixed(1)}%`);

  if (
    childA &&
    Math.abs(childA.progress - expectedChildAProgress) < 0.1 &&
    deepRoot &&
    Math.abs(deepRoot.progress - expectedDeepRootProgress) < 0.1
  ) {
    console.log('%c✅ Test 2 PASSED', 'color: #4CAF50; font-weight: bold');
  } else {
    console.log('%c❌ Test 2 FAILED', 'color: #f44336; font-weight: bold');
  }

  console.groupEnd();
  console.log('');

  // ========================================
  // Test 3: Progress 업데이트 및 전파
  // ========================================
  console.group('🔄 Test 3: Progress 업데이트 및 상위 전파');

  console.log('Before update:');
  console.log(printTree(getStore().root));

  // Grandchild A1의 progress를 100% → 0%로 변경
  getStore().updateNode('grandchild-a1', { progress: 0 });

  console.log('✓ Grandchild A1 progress: 100% → 0%');
  console.log('After update:');
  console.log(printTree(getStore().root));

  const childAAfter = getStore().getNodeById('child-a');
  const deepRootAfter = getStore().root;

  const expectedChildAProgressAfter = (0 + 50) / 2; // 25
  const expectedDeepRootProgressAfter = (25 + 100) / 2; // 62.5

  console.log(`Expected Child A progress: ${expectedChildAProgressAfter}%`);
  console.log(`Actual Child A progress: ${childAAfter?.progress.toFixed(1)}%`);
  console.log(`Expected Deep Root progress: ${expectedDeepRootProgressAfter}%`);
  console.log(`Actual Deep Root progress: ${deepRootAfter?.progress.toFixed(1)}%`);

  if (
    childAAfter &&
    Math.abs(childAAfter.progress - expectedChildAProgressAfter) < 0.1 &&
    deepRootAfter &&
    Math.abs(deepRootAfter.progress - expectedDeepRootProgressAfter) < 0.1
  ) {
    console.log('%c✅ Test 3 PASSED', 'color: #4CAF50; font-weight: bold');
  } else {
    console.log('%c❌ Test 3 FAILED', 'color: #f44336; font-weight: bold');
  }

  console.groupEnd();
  console.log('');

  // ========================================
  // Test 4: 노드 제거
  // ========================================
  console.group('🗑️ Test 4: 노드 제거 및 Progress 재계산');

  console.log('Before removal:');
  console.log(printTree(getStore().root));

  // Grandchild A2 제거
  getStore().removeNode('grandchild-a2');

  console.log('✓ Grandchild A2 제거됨');
  console.log('After removal:');
  console.log(printTree(getStore().root));

  const childAAfterRemoval = getStore().getNodeById('child-a');
  const deepRootAfterRemoval = getStore().root;

  // Child A는 이제 자식이 1개 (grandchild-a1: 0%)만 있으므로 progress = 0%
  // Deep Root = (0 + 100) / 2 = 50%
  const expectedChildAProgressAfterRemoval = 0;
  const expectedDeepRootProgressAfterRemoval = (0 + 100) / 2; // 50

  console.log(`Expected Child A progress: ${expectedChildAProgressAfterRemoval}%`);
  console.log(`Actual Child A progress: ${childAAfterRemoval?.progress.toFixed(1)}%`);
  console.log(`Expected Deep Root progress: ${expectedDeepRootProgressAfterRemoval}%`);
  console.log(`Actual Deep Root progress: ${deepRootAfterRemoval?.progress.toFixed(1)}%`);
  console.log(`Child A children count: ${childAAfterRemoval?.children.length}`);

  if (
    childAAfterRemoval &&
    childAAfterRemoval.children.length === 1 &&
    Math.abs(childAAfterRemoval.progress - expectedChildAProgressAfterRemoval) < 0.1 &&
    deepRootAfterRemoval &&
    Math.abs(deepRootAfterRemoval.progress - expectedDeepRootProgressAfterRemoval) < 0.1
  ) {
    console.log('%c✅ Test 4 PASSED', 'color: #4CAF50; font-weight: bold');
  } else {
    console.log('%c❌ Test 4 FAILED', 'color: #f44336; font-weight: bold');
  }

  console.groupEnd();
  console.log('');

  // ========================================
  // Test 5: Title 업데이트 (Progress 불변 확인)
  // ========================================
  console.group('✏️ Test 5: Title 업데이트 (Progress 불변 확인)');

  const childBBefore = getStore().getNodeById('child-b');
  const progressBefore = childBBefore?.progress;

  console.log('Before title update:');
  console.log(`Child B title: "${childBBefore?.title}"`);
  console.log(`Child B progress: ${progressBefore}%`);

  // Child B의 title만 변경
  getStore().updateNode('child-b', { title: 'Child B (Updated)' });

  const childBAfter = getStore().getNodeById('child-b');
  const progressAfter = childBAfter?.progress;

  console.log('After title update:');
  console.log(`Child B title: "${childBAfter?.title}"`);
  console.log(`Child B progress: ${progressAfter}%`);

  if (
    childBAfter &&
    childBAfter.title === 'Child B (Updated)' &&
    progressBefore === progressAfter
  ) {
    console.log('%c✅ Test 5 PASSED', 'color: #4CAF50; font-weight: bold');
  } else {
    console.log('%c❌ Test 5 FAILED', 'color: #f44336; font-weight: bold');
  }

  console.groupEnd();
  console.log('');

  // ========================================
  // Test 6: Immutability 검증
  // ========================================
  console.group('🔒 Test 6: Immutability 검증');

  const rootBeforeUpdate = getStore().root;
  console.log('Original root reference:', rootBeforeUpdate);

  // 하위 노드 업데이트
  getStore().updateNode('grandchild-a1', { progress: 50 });

  const rootAfterUpdate = getStore().root;
  console.log('New root reference:', rootAfterUpdate);

  // 참조가 달라야 함 (새 객체가 생성되었음)
  const rootReferenceDifferent = rootBeforeUpdate !== rootAfterUpdate;

  console.log(`Root reference changed: ${rootReferenceDifferent}`);

  // 변경되지 않은 브랜치는 참조가 유지되어야 함
  const childBBeforeUpdate = rootBeforeUpdate?.children.find(c => c.id === 'child-b');
  const childBAfterUpdate = rootAfterUpdate?.children.find(c => c.id === 'child-b');
  const unchangedBranchSameReference = childBBeforeUpdate === childBAfterUpdate;

  console.log(`Unchanged branch (Child B) reference maintained: ${unchangedBranchSameReference}`);

  // 변경된 브랜치는 참조가 달라야 함
  const childABeforeUpdate = rootBeforeUpdate?.children.find(c => c.id === 'child-a');
  const childAAfterUpdate = rootAfterUpdate?.children.find(c => c.id === 'child-a');
  const changedBranchDifferentReference = childABeforeUpdate !== childAAfterUpdate;

  console.log(`Changed branch (Child A) reference changed: ${changedBranchDifferentReference}`);

  console.log('Final tree:');
  console.log(printTree(getStore().root));

  if (rootReferenceDifferent && unchangedBranchSameReference && changedBranchDifferentReference) {
    console.log('%c✅ Test 6 PASSED - Immutability 보장됨!', 'color: #4CAF50; font-weight: bold');
  } else {
    console.log('%c❌ Test 6 FAILED', 'color: #f44336; font-weight: bold');
  }

  console.groupEnd();
  console.log('');

  // ========================================
  // 최종 요약
  // ========================================
  console.log('%c=== All Tests Completed ===', 'color: #4CAF50; font-size: 16px; font-weight: bold');
  console.log('모든 테스트가 완료되었습니다. 위의 결과를 확인하세요.');
}
