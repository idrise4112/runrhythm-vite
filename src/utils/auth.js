export const registerUser = (username, password) => {
  const users = JSON.parse(localStorage.getItem("runrhythmUser")) || {};
  if (users[username]) return false;
  users[username] = { password };
  localStorage.setItem("users", JSON.stringify(users));
  return true;
};

export const loginUser = (username, password) => {
  console.log(13231231);
  console.log(username, password);
  const users = JSON.parse(localStorage.getItem("runrhythmUser")) || {};
  console.log(users);

  // const usermatch= users.filter((user)=>user.username===username)
  // if (usermatch.length===0) {
  //   return false
  // }

  return users?.password === password;
};
