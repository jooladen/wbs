'use client';

import { useState } from 'react';

/**
 * 초등학생도 이해할 수 있는 사용 가이드 컴포넌트
 * - 매우 쉬운 언어로 설명
 * - 많은 이모지 사용
 * - 접었다 펼 수 있음
 */
export default function UserGuide() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-6">
      {/* 가이드 열기/닫기 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-3 px-6 rounded-lg shadow-md transition-colors flex items-center justify-between text-lg"
      >
        <span>📚 사용 방법 가이드 (초등학생용)</span>
        <span className="text-2xl">{isOpen ? '🔽' : '▶️'}</span>
      </button>

      {/* 가이드 내용 */}
      {isOpen && (
        <div className="bg-yellow-50 border-4 border-yellow-400 rounded-lg p-6 mt-2 shadow-lg">
          {/* 1. WBS가 뭐예요? */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-yellow-800 mb-3">🤔 WBS가 뭐예요?</h2>
            <div className="bg-white rounded-lg p-4 text-lg">
              <p className="mb-2">
                <strong>WBS</strong>는 <strong>큰 일을 작은 일로 나누는 것</strong>이에요!
              </p>
              <p className="mb-2">
                예를 들어, <strong>&quot;숙제하기&quot;</strong>라는 큰 일을:
              </p>
              <ul className="ml-6 list-disc space-y-1 text-gray-700">
                <li>1️⃣ 책가방 꺼내기</li>
                <li>2️⃣ 숙제 노트 펴기</li>
                <li>3️⃣ 문제 풀기</li>
                <li>4️⃣ 검사하기</li>
              </ul>
              <p className="mt-2">
                이렇게 작게 나누면 <strong className="text-green-600">더 쉬워요!</strong> 😊
              </p>
            </div>
          </div>

          {/* 2. 버튼 사용법 */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-yellow-800 mb-3">🎮 버튼 사용법</h2>
            <div className="space-y-3">
              {/* 파란색 버튼 */}
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium shadow-sm">
                    ➕ 하위 작업 추가
                  </button>
                  <span className="text-xl">👈 이 파란색 버튼</span>
                </div>
                <p className="text-lg ml-2">
                  → <strong className="text-blue-600">새로운 작은 일을 만들어요</strong> (예: &quot;숙제하기&quot; 안에 &quot;국어 숙제&quot; 추가)
                </p>
              </div>

              {/* 초록색 버튼 */}
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <button className="px-4 py-2 bg-green-500 text-white rounded-md text-sm font-medium shadow-sm">
                    ⬆️ 진행률 +10
                  </button>
                  <span className="text-xl">👈 이 초록색 버튼</span>
                </div>
                <p className="text-lg ml-2">
                  → <strong className="text-green-600">일을 했으면 클릭!</strong> 10%씩 올라가요 (0% → 10% → 20% → ... → 100%)
                </p>
              </div>

              {/* 빨간색 버튼 */}
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <button className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium shadow-sm">
                    🗑️ 삭제
                  </button>
                  <span className="text-xl">👈 이 빨간색 버튼</span>
                </div>
                <p className="text-lg ml-2">
                  → <strong className="text-red-600">필요 없는 일을 지워요</strong> (조심하세요! 지우면 다시 못 돌려요 😱)
                </p>
              </div>
            </div>
          </div>

          {/* 3. 따라해보기 */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-yellow-800 mb-3">✨ 따라해보기</h2>
            <div className="bg-white rounded-lg p-4">
              <ol className="space-y-3 text-lg">
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 text-xl">1️⃣</span>
                  <div>
                    <strong>&quot;프로젝트&quot;</strong> 카드에서
                    <span className="inline-block mx-1 px-2 py-1 bg-blue-500 text-white rounded text-sm">➕ 하위 작업 추가</span>
                    버튼을 눌러보세요
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-green-600 text-xl">2️⃣</span>
                  <div>
                    <strong>&quot;새 작업&quot;</strong>이 생겼어요! 이제 일을 했다고 생각하고
                    <span className="inline-block mx-1 px-2 py-1 bg-green-500 text-white rounded text-sm">⬆️ 진행률 +10</span>
                    을 눌러보세요
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-purple-600 text-xl">3️⃣</span>
                  <div>
                    10번 누르면 <strong className="text-green-600">100%</strong>가 돼요! 완료! 🎉
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-orange-600 text-xl">4️⃣</span>
                  <div>
                    필요 없으면
                    <span className="inline-block mx-1 px-2 py-1 bg-red-500 text-white rounded text-sm">🗑️ 삭제</span>
                    버튼으로 지워요
                  </div>
                </li>
              </ol>
            </div>
          </div>

          {/* 4. 주의사항 */}
          <div>
            <h2 className="text-2xl font-bold text-yellow-800 mb-3">⚠️ 주의할 점!</h2>
            <div className="bg-orange-100 border-2 border-orange-400 rounded-lg p-4">
              <ul className="space-y-2 text-lg">
                <li className="flex gap-2">
                  <span>💡</span>
                  <div>
                    <strong>작은 일들이 있는 큰 일</strong>은 진행률 버튼이 안 눌려요 (자동으로 계산되거든요!)
                  </div>
                </li>
                <li className="flex gap-2">
                  <span>🚫</span>
                  <div>
                    <strong>&quot;프로젝트&quot; (맨 위)</strong>는 절대 못 지워요 (이게 전체 일이니까요!)
                  </div>
                </li>
                <li className="flex gap-2">
                  <span>🎯</span>
                  <div>
                    <strong>진행률</strong>은 0%에서 100%까지만 올라가요 (100% 넘으면 안돼요!)
                  </div>
                </li>
                <li className="flex gap-2">
                  <span>🌳</span>
                  <div>
                    일 안에 일을 <strong>계속 추가</strong>할 수 있어요 (나무처럼 가지가 뻗어요!)
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* 격려 메시지 */}
          <div className="mt-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 text-center">
            <p className="text-xl font-bold text-purple-700">
              🎉 어려워 보여도 천천히 따라하면 할 수 있어요! 화이팅! 💪
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
