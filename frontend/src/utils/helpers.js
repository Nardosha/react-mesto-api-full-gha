export const checkResponse = (response) => {
  if (response.ok) {
    return response.json();
  }
  console.log('response', response);
  return Promise.reject(`Error ${response.message || response.status}`);
};
