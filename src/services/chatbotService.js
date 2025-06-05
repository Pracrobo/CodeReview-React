import { apiRequest } from './api.js';

// 대화(conversation) 조회 또는 생성 (GET)
export async function getOrCreateConversation({ repoId, userId, accessToken }) {
  return apiRequest(
    `/chatbot/conversation?repoId=${encodeURIComponent(repoId)}&userId=${encodeURIComponent(userId)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

// 메시지 저장 (GET)
export async function saveChatMessage({ conversationId, senderType, content, accessToken }) {
  return apiRequest('/chatbot/message', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      conversationId, // camelCase
      senderType,     // camelCase, 'User' 또는 'Agent'
      content,
    }),
  });
}