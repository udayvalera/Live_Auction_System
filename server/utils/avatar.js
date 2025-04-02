function randomAvatarGenerator() {
  const randomId = Math.floor(Math.random() * 100) + 1; // Generate a random number between 1 and 100
  return `https://avatar.iran.liara.run/public/${randomId}`;
}

module.exports = randomAvatarGenerator;
