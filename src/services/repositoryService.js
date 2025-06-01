import { apiRequest } from './api.js';

// 사용자 트래킹 저장소 목록 조회
export async function getUserRepositories() {
  try {
    const response = await apiRequest('/repositories/tracked');
    return {
      success: true,
      data: response.repositories || [],
      message: response.message,
    };
  } catch (error) {
    console.error('저장소 목록 조회 오류:', error);
    return {
      success: false,
      data: [],
      message: error.message || '저장소 목록을 불러오는데 실패했습니다.',
    };
  }
}

// 저장소 검색
export async function searchRepositories(query) {
  try {
    const response = await apiRequest(
      `/repositories/search?query=${encodeURIComponent(query)}`
    );
    return {
      success: true,
      data: response.repositories || [],
      message: response.message,
    };
  } catch (error) {
    console.error('저장소 검색 오류:', error);
    return {
      success: false,
      data: [],
      message: error.message || '저장소 검색에 실패했습니다.',
    };
  }
}

// 저장소 트래킹 추가
export async function addRepositoryToTracking(githubRepoId) {
  try {
    const response = await apiRequest('/repositories/tracked', {
      method: 'POST',
      body: JSON.stringify({ githubRepoId }),
    });
    return {
      success: true,
      data: response.repositories || [],
      message: response.message,
    };
  } catch (error) {
    console.error('저장소 추가 오류:', error);
    return {
      success: false,
      data: [],
      message: error.message || '저장소 추가에 실패했습니다.',
    };
  }
}

// 저장소 트래킹 삭제
export async function removeRepositoryFromTracking(githubRepoId) {
  try {
    const response = await apiRequest(
      `/repositories/tracked?githubRepoId=${githubRepoId}`,
      {
        method: 'DELETE',
      }
    );
    return {
      success: true,
      message: response.message,
    };
  } catch (error) {
    console.error('저장소 삭제 오류:', error);
    return {
      success: false,
      message: error.message || '저장소 삭제에 실패했습니다.',
    };
  }
}

// ===== 새로 추가: 저장소 분석 관련 API =====

// 저장소 분석 시작
export async function analyzeRepository(repoUrl) {
  try {
    const response = await apiRequest('/repositories/analyze', {
      method: 'POST',
      body: JSON.stringify({ repoUrl }),
    });
    return {
      success: true,
      data: response.data || {},
      message: response.message,
    };
  } catch (error) {
    console.error('저장소 분석 시작 오류:', error);
    return {
      success: false,
      data: null,
      message: error.message || '저장소 분석 시작에 실패했습니다.',
    };
  }
}

// 저장소 분석 상태 조회
export async function getAnalysisStatus(repositoryId) {
  try {
    const response = await apiRequest(
      `/repositories/${repositoryId}/analysis-status`
    );
    return {
      success: true,
      data: response.data || {},
      message: response.message,
    };
  } catch (error) {
    console.error('분석 상태 조회 오류:', error);
    return {
      success: false,
      data: null,
      message: error.message || '분석 상태 조회에 실패했습니다.',
    };
  }
}

// 분석 중인 저장소 목록 조회
export async function getAnalyzingRepositories() {
  try {
    const response = await apiRequest('/repositories/analyzing');
    return {
      success: true,
      data: response.repositories || [],
      message: response.message,
    };
  } catch (error) {
    console.error('분석 중인 저장소 조회 오류:', error);
    return {
      success: false,
      data: [],
      message: error.message || '분석 중인 저장소 조회에 실패했습니다.',
    };
  }
}

// 최근 분석 완료된 저장소 목록 조회
export async function getRecentlyAnalyzedRepositories() {
  try {
    const response = await apiRequest('/repositories/recent');
    return {
      success: true,
      data: response.repositories || [],
      message: response.message,
    };
  } catch (error) {
    console.error('최근 분석 완료 저장소 조회 오류:', error);
    return {
      success: false,
      data: [],
      message: error.message || '최근 분석 완료 저장소 조회에 실패했습니다.',
    };
  }
}
