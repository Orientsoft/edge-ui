const USER = '__user__';

export const setCurrentUser = (user) => {
  if (user) {
    sessionStorage.setItem(USER, JSON.stringify(user));
  }
  return !!user;
};

export const getCurrentUser = () => {
  let user = sessionStorage.getItem(USER);

  try {
    user = JSON.parse(user);
  } catch (e) {
    user = null;
  }
  return user;
};

export const removeCurrentUser = () => sessionStorage.removeItem(USER);
