export function removeAuthStorage() {
  localStorage.removeItem("token");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("username");
  localStorage.removeItem("email");
  localStorage.removeItem("avatarUrl");
};