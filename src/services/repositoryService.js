import { apiRequest } from './api.js';
import { handleError } from './errorHandler.js';

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
    return handleError(error, '저장소 목록을 불러오는데 실패했습니다.');
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
    return handleError(error, '저장소 검색에 실패했습니다.');
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
    return handleError(error, '저장소 추가에 실패했습니다.');
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
    return handleError(error, '저장소 삭제에 실패했습니다.');
  }
}
