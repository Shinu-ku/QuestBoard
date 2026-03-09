exports.addXP = (user, amount) => {
  user.xp += amount;

  const newLevel = Math.floor(user.xp / 100) + 1;

  const leveledUp = newLevel > user.level;

  user.level = newLevel;

  return {
    xp: user.xp,
    level: user.level,
    leveledUp
  };
};
