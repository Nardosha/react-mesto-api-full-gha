export const checkResponse = (response) => {
  if (response.ok) {
    return response.json();
  }
  return Promise.reject(response);
};
