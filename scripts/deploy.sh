# !/bin/bash
set -e
# 检查Actions目录配置
if [ -z "${PUBLISH_DIR}" ]; then
    echo "【致命错误】：workflows尚未设置 PUBLISH_DIR"
    exit 1
fi

# 检查设置的目录是否存在，不存在直接退出
if [ -d "$(pwd)${PUBLISH_DIR}" ]; then
    echo "【致命错误】：PUBLISH_DIR 尚未生成"
    exit 1
fi

# 检查要发布的分支名称
if [ -z "${PUBLISH_BRANCH}" ]; then
    print_error "【致命错误】：没有发现 PUBLISH_BRANCH"
    exit 1
fi

# 进入到build的目录
cd "${PUBLISH_DIR}" # ./docs/.vuepress/dist

# 为gh-pages 生成CNAME，发现使用别人提供的脚本，生成的竟然是小写的CNAME文件，所以改为小写的，使用脚本写入

# 设置CNAME
if [ -n "${CNAME}" ]; then 
    echo "${CNAME}">CNAME
fi 

# 格式化的输出
function print_error() {
    echo -e "\e[31mERROR: ${1}\e[m"
}

function print_info() {
    echo -e "\e[36mINFO: ${1}\e[m"
}

# 配置仓库地址
if [ -n "${EXTERNAL_REPOSITORY}" ]; then
    PUBLISH_REPOSITORY=${EXTERNAL_REPOSITORY}
else
    PUBLISH_REPOSITORY=${GITHUB_REPOSITORY}
fi

# 配置ssh
if [ -n "${ACCESS_TOKEN_DEPLOY}" ]; then
    echo "设置 ACCESS_TOKEN_DEPLOY"
    SSH_DIR="${HOME}/.ssh"
    mkdir "${SSH_DIR}"
    ssh-keyscan -t rsa github.com >"${SSH_DIR}/known_hosts"
    echo "${ACCESS_TOKEN_DEPLOY}" >"${SSH_DIR}/id_rsa"
    chmod 400 "${SSH_DIR}/id_rsa"
    remote_repo="git@github.com:${PUBLISH_REPOSITORY}.git"
fi

# 跳过配置personal_token 和 github_token
remote_branch="${PUBLISH_BRANCH}"

# 配置git
git init
git checkout --orphan "${remote_branch}" # 积累无数次commit，不算分支

git config user.name "${GITHUB_ACTOR}"
git config user.email "${GITHUB_ACTOR}@users.noreply.github.com"

git remote rm origin || true
git remote add origin "${remote_repo}"

# 更改时间
cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

# git提交
git add .
push_time="$(date '+%Y-%m-%d %H:%M:%S')"
git commit -m "【Deployment success】：${push_time}"

git push origin -f "${PUBLISH_BRANCH}"

print_info "${GITHUB_SHA} 漂亮！部署成功： ${push_time}"