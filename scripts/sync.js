const git = require('simple-git')();
const open = require('open');

(async () => {
  const history = await git.log()
  const latestSync = history.all.find(v => /^sync #\w{7}\s.+$/i.test(v.message)).message
  const latestSyncHash = latestSync.match(/#(\w+)\s/)[1]
  open(`https://github.com/vuejs/docs/compare/${latestSyncHash}...master`)
})()
