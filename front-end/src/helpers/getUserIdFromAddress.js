export const getUserIdFromAddress = () => {
  const urlParams = new URLSearchParams(window.location.search);
  let userId = urlParams.get("user_id");

  return userId;
};
