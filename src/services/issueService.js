import api from './api.js';
import errorHandler from './errorHandler.js';

// 이슈 목록 조회 (저장소별)
async function getRepositoryIssues(repoId, state = '') {
  try {
    let url = `/repositories/${repoId}/issues`;
    if (state) url += `?state=${state}`;
    const response = await api.apiRequest(url);
    return {
      success: true,
      data: response.data || [],
      message: response.message,
    };
  } catch (error) {
    return errorHandler.handleError(
      error,
      '이슈 목록을 불러오는데 실패했습니다.'
    );
  }
}

// 여러 저장소의 이슈를 한 번에 조회 (limit, offset, state, search 지원)
async function getIssuesByRepoIds({
  repoIds = [],
  state = '',
  limit = 20,
  offset = 0,
  search = '',
}) {
  try {
    const params = new URLSearchParams();
    repoIds.forEach((id) => params.append('repoIds', id));
    if (state) params.append('state', state);
    if (search) params.append('search', search);
    params.append('limit', limit);
    params.append('offset', offset);
    const response = await api.apiRequest(`/issues/bulk?${params.toString()}`);
    return {
      success: true,
      data: response.data || [],
      message: response.message,
    };
  } catch (error) {
    return errorHandler.handleError(
      error,
      '이슈 목록을 불러오는데 실패했습니다.'
    );
  }
}

// 최근 본 이슈 목록 조회 (limit, offset 지원)
async function getRecentIssues({ limit = 20, offset = 0 } = {}) {
  try {
    const params = new URLSearchParams();
    params.append('limit', limit);
    params.append('offset', offset);
    const response = await api.apiRequest(
      `/issues/recent?${params.toString()}`
    );
    return {
      success: true,
      data: response.data || [],
      message: response.message,
    };
  } catch (error) {
    return errorHandler.handleError(
      error,
      '최근 본 이슈를 불러오는데 실패했습니다.'
    );
  }
}

// 최근 본 이슈 저장 (userId, issueId)
async function saveRecentIssue(issueId) {
  try {
    const response = await api.apiRequest(`/issues/${issueId}/recent`, {
      method: 'POST',
    });
    return {
      success: true,
      message: response.message,
    };
  } catch (error) {
    return errorHandler.handleError(error, '최근 본 이슈 저장에 실패했습니다.');
  }
}

// 이슈 상세 조회 (repoId, githubIssueNumber)
async function getIssueDetail(repoId, githubIssueNumber) {
  try {
    const response = await api.apiRequest(
      `/repositories/${repoId}/issues/${githubIssueNumber}`
    );
    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    return errorHandler.handleError(
      error,
      '이슈 상세 정보를 불러오는데 실패했습니다.'
    );
  }
}

// 이슈 AI 분석 요청
async function analyzeIssue(repoId, issueNumber) {
  try {
    const response = await api.apiRequest(
      `/issues/${repoId}/${issueNumber}/analyze`,
      {
        method: 'POST',
      }
    );
    return {
      success: true,
      data: response,
      message: response.message || '분석 요청에 성공했습니다.',
    };
  } catch (error) {
    console.error('이슈 분석 요청 실패:', error);
    return errorHandler.handleError(error, '분석 요청에 실패했습니다.');
  }
}

export default {
  getRepositoryIssues,
  getIssuesByRepoIds,
  getRecentIssues,
  saveRecentIssue,
  getIssueDetail,
  analyzeIssue,
};
