'use client';

import { runWbsTests } from '@/tests/wbsTest';

/**
 * WBS 애플리케이션 메인 페이지
 * - 콘솔 테스트를 실행하는 버튼 제공
 * - UI 컴포넌트는 최소한으로 유지
 */
export default function Home() {
  const handleRunTests = () => {
    console.clear();
    runWbsTests();
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          WBS Application
        </h1>

        <p className="text-gray-600 mb-6">
          Work Breakdown Structure with Immutable State Management
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-sm text-blue-700">
            <strong>사용 방법:</strong>
          </p>
          <ol className="list-decimal list-inside text-sm text-blue-700 mt-2 space-y-1">
            <li>아래 버튼을 클릭하여 테스트를 실행하세요</li>
            <li>브라우저 개발자 도구를 여세요 (F12)</li>
            <li>Console 탭에서 테스트 결과를 확인하세요</li>
          </ol>
        </div>

        <button
          onClick={handleRunTests}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          🚀 Run WBS Tests
        </button>

        <div className="mt-6 p-4 bg-gray-100 rounded">
          <p className="text-xs text-gray-600">
            <strong>테스트 항목:</strong>
          </p>
          <ul className="text-xs text-gray-600 mt-2 space-y-1">
            <li>✓ 기본 트리 생성 및 Progress 자동 계산</li>
            <li>✓ 깊은 중첩 (3레벨 트리)</li>
            <li>✓ Progress 업데이트 및 상위 전파</li>
            <li>✓ 노드 제거 및 Progress 재계산</li>
            <li>✓ Title 업데이트 (Progress 불변 확인)</li>
            <li>✓ Immutability 검증</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
