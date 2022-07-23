const beforeAdd = async (git) => {
  return git.exec('config', 'core.sshCommand', 'ssh -i ~/.ssh/id_southburgh');
};

module.exports = beforeAdd;
