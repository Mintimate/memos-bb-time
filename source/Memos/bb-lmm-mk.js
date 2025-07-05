/*
* @Author: Mintimate
* @Date:  2025-06-22 17:31:25
* @Modified from: 木木木木木<https://immmmm.com>
* @Description:
  - 适配新版本的 Memos
  - 删除一些不常用的功能
*/

// 配置对象，使用更严格的默认值和类型检查
const DEFAULT_CONFIG = {
  memos: 'https://demo.usememos.com/',
  emactionApi: 'https://emaction-go.mintimate.cn',
  limit: 10,
  creatorId: '1',
  domId: '#bber',
};

// 合并用户配置
const bbMemo = {
  ...DEFAULT_CONFIG,
  ...(typeof bbMemos !== 'undefined' ? bbMemos : {})
};

// 验证配置
if (!bbMemo.memos || !bbMemo.domId) {
  console.error('Memos配置不完整，请检查 memos 和 domId 参数');
}

// 工具函数
const Utils = {
  // 加载CSS代码
  loadCssCode(code) {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.rel = 'stylesheet';
    style.appendChild(document.createTextNode(code));
    document.head.appendChild(style);
  },

  // 获取URL参数
  getQueryVariable(variable) {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split("=");
      if (pair[0] === variable) {
        return decodeURIComponent(pair[1]);
      }
    }
    return false;
  },

  // 错误处理包装器
  async safeExecute(asyncFn, errorMsg = '操作失败') {
    try {
      return await asyncFn();
    } catch (error) {
      console.error(`${errorMsg}:`, error);
      throw error;
    }
  }
};
const allCSS = `
/* 主容器 */
#bber {
  margin-top: 1rem;
  width: auto !important;
  min-height: 100vh;
  /* 确保容器有足够的内边距 */
  box-sizing: border-box;
}

/* 卡片瀑布流布局 */
.bb-timeline {
  position: relative;
  padding: 0;
  min-height: 100px;
}

.bb-timeline .memo-item {
  position: absolute;
  /* 移除固定宽度，由JS动态设置 */
  transition: all 0.3s ease, opacity 0.5s ease;
  opacity: 0;
}

.bb-timeline .bb-item {
  background: #fff;
  border-radius: 12px;
  padding: 0.6rem;
  box-shadow: 0 3px 5px 0 rgba(0,0,0,0.24), 0 7px 10px 0 rgba(0,0,0,0.19);
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.bb-timeline .bb-item:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  transform: translateY(-2px);
}

/* 内容区域 */
.bb-cont {
  margin-bottom: 0.6rem;
  line-height: 1.5;
}

.bb-cont p {
  margin: 0.3rem 0;
  color: #333;
}

.bb-cont img {
  border-radius: 8px;
  max-width: 100%;
  max-height: 400px;
  height: auto;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s ease;
  /* 添加最小高度避免布局跳跃 */
  min-height: 120px;
  background-color: #f5f5f5;
  /* 图片加载时的占位样式 */
  background-image: linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
                    linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
                    linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
                    linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}

.bb-cont img:hover {
  transform: scale(1.02);
}

/* 标签样式 */
.tag-span {
  display: inline-block;
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.2rem 0.4rem;
  border-radius: 12px;
  font-size: 0.875rem;
  margin: 0.2rem 0.2rem 0.2rem 0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag-span:hover {
  background: #bbdefb;
}

#tag-list .tag-span {
  background: rgba(25, 118, 210, 0.1);
  border: 1px solid #1976d2;
  position: relative;
}

/* 亮色模式特定样式 */
[data-user-color-scheme="light"] .bb-timeline .bb-item {
  background: #fff;
  border-color: #f0f0f0;
  color: #333;
}

[data-user-color-scheme="light"] .bb-cont p {
  color: #333;
}

[data-user-color-scheme="light"] .bb-info {
  color: #666;
}

[data-user-color-scheme="light"] .bb-info a {
  color: #666;
}

[data-user-color-scheme="light"] .bb-tool {
  border-top-color: #f0f0f0;
}

[data-user-color-scheme="light"] .datacount {
  color: #666;
}

[data-user-color-scheme="light"] .datacount:hover {
  color: #1976d2;
}

/* 工具栏 */
.bb-tool {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid #f0f0f0;
  margin-top: 0.75rem;
}

/* 信息区域 */
.bb-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.4rem;
  font-size: 0.875rem;
  color: #666;
}

.bb-info a {
  text-decoration: none;
  color: #666;
}

.bb-info a:hover {
  color: var(--post-link-color);
}

.datatime {
  font-size: 0.875rem;
}

/* 加载按钮 - 风琴样式 */
.bb-load {
  position: relative;
  width: 100%;
  margin: 2rem 0;
  z-index: 10;
}

.bb-load button {
  width: 100%;
  padding: 0.5rem 0;
  background: transparent;
  color: #666;
  border: 2px dashed #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 400;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.5px;
}

.bb-load button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
  transition: left 0.6s ease;
}

.bb-load button:hover {
  border-color: #667eea;
  color: #667eea;
  background: rgba(102, 126, 234, 0.05);
  transform: translateY(-1px);
}

.bb-load button:hover::before {
  left: 100%;
}

.bb-load button:active {
  transform: translateY(0);
  transition: transform 0.1s;
}

.bb-load button:disabled {
  background: transparent;
  color: #ccc;
  border-color: #f0f0f0;
  cursor: not-allowed;
  transform: none;
}

.bb-load button:disabled::before {
  display: none;
}

/* 加载中动画 */
.bb-load button.loading {
  pointer-events: none;
  border-style: solid;
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
  color: #667eea;
}

.bb-load button.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid transparent;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  animation: button-spin 1s linear infinite;
}

@keyframes button-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 图片网格 */
.resimg {
  margin: 0.4rem 0;
}

.resimg img {
  max-height: 300px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s ease;
  /* 添加最小高度避免布局跳跃 */
  min-height: 120px;
  background-color: #f5f5f5;
  border-radius: 8px;
  /* 图片加载时的占位样式 */
  background-image: linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
                    linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
                    linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
                    linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
  background-size: 15px 15px;
  background-position: 0 0, 0 7.5px, 7.5px -7.5px, -7.5px 0px;
}

.resimg img:hover {
  transform: scale(1.02);
}

.resimg.grid {
  display: grid;
  gap: 0.3rem;
  grid-template-columns: repeat(3, 1fr);
}

.resimg.grid-1 {
  grid-template-columns: repeat(1, 1fr);
}

.resimg.grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

.resimg.grid-4 {
  grid-template-columns: repeat(2, 1fr);
}

.resimg figure {
  margin: 0;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  max-height: 250px;
}

.resimg.grid figure.gallery-thumbnail {
  max-height: 200px;
}

.resimg.grid figure.gallery-thumbnail > img.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
}

/* 视频容器 */
.video-wrapper {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  margin: 0.75rem 0;
  border-radius: 8px;
  overflow: hidden;
}

.video-wrapper iframe,
.video-wrapper video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* 加载动画 */
.loader {
  position: relative;
  width: 100%;
  margin: 3rem auto;
  text-align: center;
  z-index: 10;
}

.loader .circular {
  animation: rotate 2s linear infinite;
  width: 60px;
  height: 60px;
  margin: 0 auto;
}

.path {
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  animation: dash 1.5s ease-in-out infinite;
  stroke-linecap: round;
  stroke: #1976d2;
  stroke-width: 2;
}

@keyframes rotate {
  100% { transform: rotate(360deg); }
}

@keyframes dash {
  0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
  50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
  100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
}

/* 暗色主题 */
[data-user-color-scheme="dark"] .bb-cont p {
  color: var(--subtitle-color);
}

[data-user-color-scheme="dark"] .load-btn {
  color: var(--subtitle-color);
}

[data-user-color-scheme="dark"] .bb-timeline .bb-item {
  background: var(--board-bg-color);
  border-color: var(--line-color);
  color: var(--text-color);
}

[data-user-color-scheme="dark"] .tag-span {
  background: rgba(21, 137, 233, 0.2);
  color: var(--post-link-color);
}

[data-user-color-scheme="dark"] .bb-tool {
  border-top-color: var(--line-color);
}

[data-user-color-scheme="dark"] .bb-info {
  color: var(--sec-text-color);
}

[data-user-color-scheme="dark"] .bb-info a {
  color: var(--sec-text-color);
}

[data-user-color-scheme="dark"] .bb-info a:hover {
  color: var(--post-link-color);
}

[data-user-color-scheme="dark"] .datacount {
  color: var(--sec-text-color);
}

[data-user-color-scheme="dark"] .datacount:hover {
  color: var(--post-link-color);
}

:root {
  --start-smile-border-color-default: #e5e5e5;
  --start-smile-border-color-hover-default: #cccccc;
  --start-smile-bg-color-default: #ffffff;
  --start-smile-svg-fill-color-default: #333333;
  --reaction-got-not-reacted-bg-color-default: #ffffff;
  --reaction-got-not-reacted-bg-color-hover-default: #f2f2f2;
  --reaction-got-not-reacted-border-color-default: #e5e5e5;
  --reaction-got-not-reacted-text-color-default: #333333;
  --reaction-got-reacted-bg-color-default: #f2f2f2;
  --reaction-got-reacted-bg-color-hover-default: #e5e5e5;
  --reaction-got-reacted-border-color-default: #42b983;
  --reaction-got-reacted-text-color-default: #42b983;
  --reaction-available-popup-bg-color-default: #ffffff;
  --reaction-available-popup-border-color-default: #dddddd;
  --reaction-available-popup-box-shadow-default: 0 4px 6px rgba(0,0,0,.04);
  --reaction-available-emoji-reacted-bg-color-default: #388bfd1a;
  --reaction-available-emoji-bg-color-hover-default: #f2f2f2;
  --reaction-available-emoji-z-index-default: 100;
  --reaction-available-mask-z-index-default: 80;
}

.reaction-got-reacted {
    background-color: var(--reaction-got-not-reacted-bg-color, var(--reaction-got-not-reacted-bg-color-default));
    border-width: 1px;
    border-style: solid;
    border-color: var(--reaction-got-not-reacted-border-color, var(--reaction-got-not-reacted-border-color-default));
    color: var(--reaction-got-not-reacted-text-color, var(--reaction-got-not-reacted-text-color-default));
}

/* 暗色主题变量覆盖 */
[data-user-color-scheme="dark"] {
  --start-smile-border-color-default: #3b3d42;
  --start-smile-border-color-hover-default: #3b3d42;
  --start-smile-bg-color-default: transparent;
  --start-smile-svg-fill-color-default: #ffffff;
  --reaction-got-not-reacted-bg-color-default: transparent;
  --reaction-got-not-reacted-bg-color-hover-default: #272727;
  --reaction-got-not-reacted-border-color-default: #3b3d42;
  --reaction-got-not-reacted-text-color-default: #ffffff;
  --reaction-got-reacted-bg-color-default: #272727;
  --reaction-got-reacted-bg-color-hover-default: #272727;
  --reaction-got-reacted-border-color-default: #42b983;
  --reaction-got-reacted-text-color-default: #42b983;
  --reaction-available-popup-bg-color-default: #161b22;
  --reaction-available-popup-border-color-default: #30363d;
  --reaction-available-popup-box-shadow-default: 0 4px 6px rgba(0,0,0,.04);
  --reaction-available-emoji-reacted-bg-color-default: #388bfd1a;
  --reaction-available-emoji-bg-color-hover-default: #30363d;

}


/* 移动端响应式样式 */
@media (max-width: 768px) {
  #bber {
    margin-top: 0.5rem !important;
    padding: 0 10px !important;
  }
  
  .bb-timeline {
    padding: 0 !important;
  }
  
  .bb-timeline .bb-item {
    padding: 1rem !important;
    margin-bottom: 1rem !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
    width: 100% !important;
    box-sizing: border-box;
  }
  
  .bb-timeline .bb-item:hover {
    transform: none !important;
    box-shadow: 0 2px 12px rgba(0,0,0,0.15) !important;
  }
  
  .bb-cont {
    margin-bottom: 1rem;
  }
  
  .tag-span {
    font-size: 0.8rem;
    padding: 0.15rem 0.3rem;
  }
  
  .bb-info {
    font-size: 0.8rem;
  }
  
  .bb-tool {
    padding-top: 0.5rem;
    margin-top: 0.5rem;
  }

/* 超小屏幕设备优化 */
@media (max-width: 480px) {
  #bber {
    padding: 0 5px !important;
  }
  
  .bb-timeline .bb-item {
    padding: 0.8rem !important;
    border-radius: 8px !important;
    width: 100% !important;
    box-sizing: border-box;
  }
  
  .bb-cont {
    margin-bottom: 0.8rem;
  }
  
  .bb-cont p {
    margin: 0.2rem 0;
    font-size: 0.95rem;
  }
  
  .tag-span {
    font-size: 0.75rem;
    padding: 0.1rem 0.25rem;
    margin: 0.1rem 0.1rem 0.1rem 0;
  }
  
  .bb-info {
    font-size: 0.75rem;
    margin-top: 0.3rem;
  }
  
  .datatime {
    font-size: 0.75rem;
  }
  
  .bb-tool {
    padding-top: 0.4rem;
    margin-top: 0.4rem;
  }
  
}

`
Utils.loadCssCode(allCSS);

// 状态管理
const AppState = {
  limit: bbMemo.limit, // 每页显示条数
  memos: bbMemo.memos,// 所有数据
  memosOpenId: null,
  mePage: 1,
  offset: 0,
  nextLength: 0,
  nextDom: '', // 下一页数据
  apiV1: '',
  bbDom: bbMemo.domId ? document.querySelector(bbMemo.domId) : null,
  isLoading: false,
  tageFilter: '', // 过滤的标签
  emactionApi: bbMemo.emactionApi,
};
const load = '<div class="bb-load"><button class="load-btn button-load">加载中……</button></div>';
const loading = `<div class="loader"><svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>`;

// 初始化应用
if (AppState.bbDom) {
  Utils.safeExecute(
    () => fetchStatus(),
    '初始化失败'
  ).catch(error => {
    console.error('应用启动失败:', error);
    AppState.bbDom.innerHTML = '<div class="error">加载失败，请刷新页面重试</div>';
  });
}
async function fetchStatus() {
  let statusUrl = AppState.memos+"api/v1";
  let response = await fetch(statusUrl);
  if (response.ok || response.status === 404) {
    AppState.apiV1 = 'v1/'
  }
  let memoOne = Utils.getQueryVariable("memo") || ''
  if(memoOne){
    getMemoOne(memoOne)
  }else{
    newApiV1(AppState.apiV1)
  }

}
function getMemoOne(memoOne){
  let OneDom = `<iframe style="width:100%;height:100vh;" src="${memoOne}" frameBorder="0"></iframe>`
  let ContDom = document.querySelector('.content') || document.querySelector(bbMemo.domId);
  ContDom.innerHTML = OneDom
}

function newApiV1(apiV1){
  getFirstList(apiV1) //首次加载数据
  meNums(apiV1) //加载总数
  AppState.bbDom.innerHTML = loading
}

// 绑定加载更多按钮事件
function bindLoadMoreButton(apiV1) {
  // 等待DOM更新后绑定事件
  setTimeout(() => {
    const loadBtn = document.querySelector("button.button-load");
    if (loadBtn && !loadBtn.hasAttribute('data-bound')) {
      loadBtn.setAttribute('data-bound', 'true'); // 防止重复绑定
      
      const handleClick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        
        const btn = e.target;
        btn.textContent = '';
        btn.classList.add('loading');
        btn.disabled = true;
        
        updateHTMl(AppState.nextDom)

        if(AppState.nextDom.memos.length === 0 || AppState.nextDom.memos.length < AppState.limit){
          btn.classList.remove('loading');
          btn.textContent = '没有更多了';
          btn.disabled = true;
        }
        else {
          // 继续预加载下一页
          getNextList(apiV1 || AppState.apiV1);
        }
      };
      
      loadBtn.addEventListener("click", handleClick);
      
      // 存储处理函数，以便之后可能需要移除
      loadBtn._clickHandler = handleClick;
    }
  }, 100);
}

async function getFirstList(apiV1){
  try {
    AppState.bbDom.insertAdjacentHTML('afterend', load);
    bindLoadMoreButton(apiV1); // 绑定按钮事件
    
    let bbUrl = AppState.memos+"api/"+apiV1+"memos?creatorId="+bbMemo.creatorId+"&filter=creator_id == 1&pageSize="+AppState.limit;
    const response = await fetch(bbUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const resdata = await response.json();
    
    updateHTMl(resdata)
    
    AppState.offset = resdata.nextPageToken

    if (AppState.offset === '' || !resdata.memos || resdata.memos.length === 0){ // 没有下一项数据，隐藏
      const loadBtn = document.querySelector("button.button-load");
      loadBtn.textContent = '没有更多了';
      loadBtn.disabled = true;
      return
    }

    AppState.mePage++
    getNextList(apiV1)
  } catch (error) {
    console.error('获取数据失败:', error);
    AppState.bbDom.innerHTML = '<div class="error">加载失败，请刷新页面重试</div>';
  }
}
//预加载下一页数据
async function getNextList(apiV1){
  try {
    if (AppState.isLoading) return; // 防止重复加载

    // 已经没有下一页数据 => 隐藏并移除事件
    if (AppState.offset === '') {
      const loadBtn = document.querySelector("button.button-load");
      loadBtn.textContent = '没有更多了';
      loadBtn.disabled = true;
      return; // 没有下一项数据，隐藏
    }
    AppState.isLoading = true;
    
    let bbUrl = AppState.memos+"api/"+apiV1+"memos?creatorId="+bbMemo.creatorId+"&pageSize="+AppState.limit+"&pageToken="+AppState.offset;

    // 存在标签过滤
    if (AppState.tageFilter){
      bbUrl = bbUrl + '&filter=tag in ["' + AppState.tageFilter + '"]';
    }

    const response = await fetch(bbUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const resdata = await response.json();
    AppState.nextDom = resdata
    AppState.mePage++
    AppState.offset = resdata.nextPageToken
    
  } catch (error) {
    console.error('预加载下一页失败:', error);
  } finally {
    AppState.isLoading = false;
  }
}
//加载总 Memos 数
function meNums(apiV1){
  let bbLoad = document.querySelector('.bb-load')
}
// 插入 html 
async function updateHTMl(data){
  if (!data || !data.memos) {
    console.error('数据格式错误');
    return;
  }
  
  let result="",resultAll="";
  const TAG_REG = /#([^#\s!.,;:?"'()]+)(?= )/g ///#([^/\s#]+?) /g
  , IMG_REG = /\!\[(.*?)\]\((.*?)\)/g
  , LINK_REG = /\[(.*?)\]\((.*?)\)/g
  , BILIBILI_REG = /<a.*?href="https:\/\/www\.bilibili\.com\/video\/((av[\d]{1,10})|(BV([\w]{10})))\/?".*?>.*<\/a>/g
  , NETEASE_MUSIC_REG = /<a.*?href="https:\/\/music\.163\.com\/.*id=([0-9]+)".*?>.*<\/a>/g
  , QQMUSIC_REG = /<a.*?href="https\:\/\/y\.qq\.com\/.*(\/[0-9a-zA-Z]+)(\.html)?".*?>.*?<\/a>/g
  , QQVIDEO_REG = /<a.*?href="https:\/\/v\.qq\.com\/.*\/([a-z|A-Z|0-9]+)\.html".*?>.*<\/a>/g
  , YOUKU_REG = /<a.*?href="https:\/\/v\.youku\.com\/.*\/id_([a-z|A-Z|0-9|==]+)\.html".*?>.*<\/a>/g
  , YOUTUBE_REG = /<a.*?href="https:\/\/www\.youtube\.com\/watch\?v\=([a-z|A-Z|0-9]{11})\".*?>.*<\/a>/g;
  
  // 确保marked已加载
  if (typeof marked === 'undefined') {
    console.error('marked库未加载');
    return;
  }
  
  marked.setOptions({
    breaks: false,
    smartypants: false,
    langPrefix: 'language-',
    headerIds: false,
    mangle: false
  });

  const memosData = data.memos
  
  for(let i=0;i < memosData.length;i++){
      let bbID = memosData[i].name
      let memoUrl = AppState.memos + bbID
      let bbCont = memosData[i].content + ' '
      let bbContREG = ''

      bbContREG += bbCont.replace(TAG_REG, "")
        .replace(IMG_REG, "")
        .replace(LINK_REG, '<a class="primary" href="$2" target="_blank">$1</a>')


      //标签
      let tagArr = bbCont.match(TAG_REG);
      let bbContTag = '';
      if (tagArr) {
        bbContTag = tagArr.map(t=>{
          return `<span class='tag-span' onclick='getTypeOfMemos(this)'>${t}</span> `;
        }).join('');
        bbContREG =  bbContTag + bbContREG.trim()
      }
            
      bbContREG = marked.parse(bbContREG)
        .replace(BILIBILI_REG, "<div class='video-wrapper'><iframe src='//www.bilibili.com/blackboard/html5mobileplayer.html?bvid=$1&as_wide=1&high_quality=1&danmaku=0' scrolling='no' border='0' frameborder='no' framespacing='0' allowfullscreen='true'></iframe></div>")
        .replace(NETEASE_MUSIC_REG, "<meting-js auto='https://music.163.com/#/song?id=$1'></meting-js>")
        .replace(QQMUSIC_REG, "<meting-js auto='https://y.qq.com/n/yqq/song$1.html'></meting-js>")
        .replace(QQVIDEO_REG, "<div class='video-wrapper'><iframe src='//v.qq.com/iframe/player.html?vid=$1' allowFullScreen='true' frameborder='no'></iframe></div>")
        .replace(YOUKU_REG, "<div class='video-wrapper'><iframe src='https://player.youku.com/embed/$1' frameborder=0 'allowfullscreen'></iframe></div>")
        .replace(YOUTUBE_REG, "<div class='video-wrapper'><iframe src='https://www.youtube.com/embed/$1' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen title='YouTube Video'></iframe></div>")

      //解析 content 内 md 格式图片
      let IMG_ARR = memosData[i].content.match(IMG_REG) || '',IMG_ARR_Grid='';
      if(IMG_ARR){
        let IMG_ARR_Length = IMG_ARR.length,IMG_ARR_Url = '';
        if(IMG_ARR_Length !== 1){let IMG_ARR_Grid = " grid grid-"+IMG_ARR_Length}
        IMG_ARR.forEach(item => {
            let imgSrc = item.replace(/!\[.*?\]\((.*?)\)/g,'$1')
            IMG_ARR_Url += `<figure class="gallery-thumbnail"><img class="img thumbnail-image" loading="lazy" decoding="async" src="${imgSrc}"/></figure>`
        });
        bbContREG += `<div class="resimg${IMG_ARR_Grid}">${IMG_ARR_Url}</div>`
      }

      //解析内置资源文件
      if(memosData[i].resources && memosData[i].resources.length > 0){
        let resourceList = memosData[i].resources;
        let imgUrl='',resUrl='',resImgLength = 0;
        for(let j=0;j < resourceList.length;j++){
          let restype = resourceList[j].type.slice(0,5)
          let resexlink = resourceList[j].externalLink
          // 20240201 filename -> name
          let resLink = resexlink ? resexlink : 
                        AppState.memos+'file/'+(resourceList[j].publicId || resourceList[j].name) +"/"+ resourceList[j].filename + "?thumbnail=1"

          if(restype == 'image'){
            imgUrl += `<figure class="gallery-thumbnail"><img class="img thumbnail-image" src="${resLink}"/></figure>`
            resImgLength = resImgLength + 1 
          }else if(restype == 'video'){
            imgUrl += `<div class="video-wrapper"><video controls><source src="${resLink}" type="video/mp4"></video></div>`
          }else{
            resUrl += `<a target="_blank" rel="noreferrer" href="${resLink}">${resourceList[j].name}</a>`
          }
        }
        if(imgUrl){
          let resImgGrid = ""
          resImgGrid = "grid grid-"+resImgLength          
          bbContREG += `<div class="resimg ${resImgGrid}">${imgUrl}</div>`
        }
        if(resUrl){
          bbContREG += `<p class="bb-source">${resUrl}</p>`
        }
      }
      let memosIdNow = AppState.memos.replace(/https\:\/\/(.*\.)?(.*)\..*/,'id-$2-')
      let emojiReaction = `<emoji-reaction theme="system" class="reaction" endpoint="${AppState.emactionApi}" reacttargetid="${memosIdNow+'memo-'+bbID}" style="line-height:normal;display:inline-flex;"></emoji-reaction>`
      let datacountDOM = ""

      result +=  `<div data-id="memo-${bbID}" class="memo-item">
        <div class="bb-item">

          <div class="bb-cont">
            ${bbContREG}
          </div>
          <div class="bb-tool" style="padding-top:0.5rem;margin-top:0.5rem;">
          ${emojiReaction}
        </div>
          <div class="bb-info">
            <a href="${AppState.memos + bbID}" target="_blank"><span class="datatime">${new Date(memosData[i].displayTime).toLocaleString()}</span></a>
            ${datacountDOM}
          </div>
        </div>
      </div>`
  }// end for
  
  // 检查是否已存在timeline容器
  const existingTimeline = document.querySelector('.bb-timeline');
  let isIncremental = !!existingTimeline;
  
  if (isIncremental) {
    // 增量加载，直接添加新的memo项目
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = result;
    const newItems = tempDiv.querySelectorAll('.memo-item');
    
    newItems.forEach(item => {
      item.style.opacity = '0'; // 初始隐藏，等待布局
      existingTimeline.appendChild(item);
    });
    
    // 更新按钮文本并重新绑定事件
    const loadBtn = document.querySelector('button.button-load');
    if(loadBtn) {
      loadBtn.classList.remove('loading');
      loadBtn.textContent = '加载更多';
      loadBtn.disabled = false;
      // 移除旧的绑定标记，重新绑定事件
      bindLoadMoreButton(AppState.apiV1);
    }
  } else {
    // 首次加载，创建完整结构
    let bbBefore = "<section class='bb-timeline'>"
    let bbAfter = "</section>"
    resultAll = bbBefore + result + bbAfter
    let loaderDom = document.querySelector('.loader') || ""
    if(loaderDom) loaderDom.remove()
    AppState.bbDom.insertAdjacentHTML('beforeend', resultAll);
    
    // 更新按钮文本并重新绑定事件
    const loadBtn = document.querySelector('button.button-load');
    if(loadBtn) {
      loadBtn.classList.remove('loading');
      loadBtn.textContent = '加载更多';
      loadBtn.disabled = false;
      // 移除旧的绑定标记，重新绑定事件
      bindLoadMoreButton(AppState.apiV1);
    }
  }

  //图片灯箱
  window.ViewImage && ViewImage.init('.bb-cont img')
  //相对时间
  window.Lately && Lately.init({ target: '.datatime' });
  
  // 为新添加的图片绑定加载事件
  if (isIncremental) {
    const newItems = document.querySelectorAll('.memo-item[style*="opacity: 0"]');
    newItems.forEach(item => bindImageLoadEvents(item));
  } else {
    bindImageLoadEvents(document.querySelector('.bb-timeline'));
  }
  
  // 等待图片加载完成后再初始化瀑布流布局
  waitForImagesAndLayout(isIncremental);
}

// 移除图片占位样式
function removeImagePlaceholder(img) {
  img.style.backgroundImage = 'none';
  img.style.backgroundColor = 'transparent';
}

// 为新添加的图片绑定加载事件
function bindImageLoadEvents(container) {
  const images = container.querySelectorAll('img');
  let layoutTimeoutId = null;
  
  images.forEach(img => {
    if (img.complete && img.naturalHeight !== 0) {
      removeImagePlaceholder(img);
    } else {
      img.addEventListener('load', function() {
        removeImagePlaceholder(this);
        
        // 图片加载完成后，延迟重新布局以避免频繁重计算
        clearTimeout(layoutTimeoutId);
        layoutTimeoutId = setTimeout(() => {
          initWaterfallLayout(false); // 重新布局所有项目
        }, 100);
      }, { once: true });
      
      img.addEventListener('error', function() {
        removeImagePlaceholder(this);
        // 可以在这里设置错误占位图
        this.style.backgroundColor = '#f0f0f0';
        this.style.backgroundImage = 'none';
        
        // 即使图片加载失败也要重新布局
        clearTimeout(layoutTimeoutId);
        layoutTimeoutId = setTimeout(() => {
          initWaterfallLayout(false);
        }, 100);
      }, { once: true });
    }
  });
}

// 使用分类(Tag)筛选
function getTypeOfMemos(e){
  let tagHtml = `<div id="tag-list"></div>`
  AppState.bbDom.insertAdjacentHTML('beforebegin', tagHtml);
  let tagName = e.innerHTML.replace('#','')
  let domClass = document.getElementById("tag-list")
  window.scrollTo({
    top: domClass.offsetTop - 20,
    behavior: "smooth"
  });
  let tagHtmlNow = `<span class='tag-span' onclick='reLoad()'>${e.innerHTML}</span>`
  document.querySelector('#tag-list').innerHTML = tagHtmlNow
  let bbUrl = AppState.memos+"api/"+AppState.apiV1+"memos?creatorId="+bbMemo.creatorId+"&filter=tag in [\""+tagName+"\"]&pageSize="+AppState.limit;
  // 标签模式，同时重置页面序列
  AppState.tageFilter = tagName
  AppState.mePage = 1
  fetchMemoDOM(bbUrl)
}

async function fetchMemoDOM(bbUrl){
  try {
    AppState.bbDom.innerHTML = loading
    const response = await fetch(bbUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const resdata = await response.json();
    
    if(resdata){
      document.querySelector(bbMemo.domId).innerHTML = ""
      const loadBtn = document.querySelector("button.button-load");
      
      updateHTMl(resdata)

      AppState.offset = resdata.nextPageToken

      if(AppState.offset === '' || !resdata.memos || resdata.memos.length === 0){ // 没有下一项数据，隐藏
          loadBtn.textContent = '没有更多了';
          loadBtn.disabled = true; 
          return
      }

      getNextList(AppState.apiV1)

    }else{
      alert("404 -_-!")
      setTimeout(reLoad(), 1000);
    }
  } catch (error) {
    console.error('获取数据失败:', error);
    AppState.bbDom.innerHTML = '<div class="error">加载失败，请刷新页面重试</div>';
  }
}

function reLoad(){
  let urlThis = location.protocol + '//' + location.host + location.pathname;
  window.location.replace(urlThis)
}

// 瀑布流布局函数
function initWaterfallLayout(onlyNewItems = false) {
  
  const container = document.querySelector('.bb-timeline');
  if (!container) return;
  
  const items = container.querySelectorAll('.memo-item');
  if (items.length === 0) return;
  
  const containerWidth = container.clientWidth;
  const screenWidth = window.innerWidth;
  
  // 响应式设计
  let itemWidth, gap, columns;
  
  if (screenWidth < 997) {
    // 移动端：卡片占满屏幕宽度，根据屏幕大小调整边距
    let horizontalMargin;
    if (screenWidth < 480) {
      horizontalMargin = 5; // 小屏幕设备边距更小
    } else {
      horizontalMargin = 10; // 中等屏幕设备
    }
    
    itemWidth = containerWidth - horizontalMargin;
    gap = 5;
    columns = 1;
    
    // 确保最小宽度
    if (itemWidth < 200) {
      itemWidth = 200;
    }
    
    // 更新所有卡片的宽度
    items.forEach(item => {
      item.style.width = itemWidth + 'px';
    });
  } else {
    // 桌面端：瀑布流布局
    itemWidth = 280;
    gap = 6;
    columns = Math.floor(containerWidth / (itemWidth + gap));
    
    // 限制最大列数
    if (columns > 4) {
      columns = 4;
    }
    
    // 确保至少1列
    if (columns < 1) {
      columns = 1;
    }
    
    // 更新所有卡片的宽度
    items.forEach(item => {
      item.style.width = itemWidth + 'px';
    });
  }
  
  const actualGap = columns === 1 ? gap : (containerWidth - columns * itemWidth) / (columns + 1);
  
  let columnHeights = new Array(columns).fill(actualGap * 0.5);
  
  // 如果是增量加载，获取现有的列高度
  if (onlyNewItems) {
    const existingItems = Array.from(items).filter(item => item.style.opacity !== '0' && item.style.opacity !== '');
    if (existingItems.length > 0) {
      columnHeights = new Array(columns).fill(0);
      existingItems.forEach(item => {
        const left = parseInt(item.style.left);
        const top = parseInt(item.style.top);
        
        if (columns === 1) {
          // 移动端单列布局
          const bottom = top + item.offsetHeight;
          columnHeights[0] = Math.max(columnHeights[0], bottom);
        } else {
          // 桌面端多列布局
          const columnIndex = Math.round(left / (itemWidth + actualGap));
          const bottom = top + item.offsetHeight;
          if (columnIndex >= 0 && columnIndex < columns) {
            columnHeights[columnIndex] = Math.max(columnHeights[columnIndex], bottom);
          }
        }
      });
    }
  }
  
  const itemsToProcess = onlyNewItems ? 
    Array.from(items).filter(item => item.style.opacity === '0' || item.style.opacity === '') : 
    Array.from(items);
  
  itemsToProcess.forEach((item) => {
    // 确保项目有实际内容再进行布局
    if (item.offsetHeight === 0) {
      // 强制重绘以获取正确高度
      item.style.display = 'none';
      item.offsetHeight; // 触发回流
      item.style.display = '';
    }
    
    let left, top, columnIndex;
    
    if (columns === 1) {
      // 移动端单列布局，居中显示
      left = (containerWidth - itemWidth) / 2;
      top = columnHeights[0] + gap;
      columnIndex = 0;
    } else {
      // 桌面端多列布局
      const minHeight = Math.min(...columnHeights);
      columnIndex = columnHeights.indexOf(minHeight);
      left = actualGap + columnIndex * (itemWidth + actualGap);
      top = minHeight + 4;
    }
    
    // 设置位置
    item.style.left = left + 'px';
    item.style.top = top + 'px';
    item.style.opacity = '1';
    
    // 更新列高度
    columnHeights[columnIndex] = top + item.offsetHeight + gap;
  });
  
  // 设置容器高度
  const maxHeight = Math.max(...columnHeights);
  container.style.height = (maxHeight + gap) + 'px';
}

// 防抖函数
function debounceWaterfall() {
  let timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      // 重新布局所有项目，以适应新的屏幕尺寸
      initWaterfallLayout(false);
    }, 150);
  };
}

const debouncedWaterfall = debounceWaterfall();

window.addEventListener('resize', debouncedWaterfall);
window.addEventListener('load', () => {
  initWaterfallLayout();
  // 预加载图片
  const imgObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazyload');
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '100px 0px',
    threshold: 0.1
  });
  
  document.querySelectorAll('img.lazyload').forEach(img => {
    imgObserver.observe(img);
  });
});

// 监听设备方向变化
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    debouncedWaterfall();
  }, 300); // 等待方向变化完成
});

// 等待图片加载完成后执行瀑布流布局
function waitForImagesAndLayout(onlyNewItems = false) {
  const container = document.querySelector('.bb-timeline');
  if (!container) return;
  
  // 获取需要处理的图片
  const targetItems = onlyNewItems ? 
    container.querySelectorAll('.memo-item[style*="opacity: 0"], .memo-item:not([style])') : 
    container.querySelectorAll('.memo-item');
  
  const images = [];
  targetItems.forEach(item => {
    const itemImages = item.querySelectorAll('img');
    itemImages.forEach(img => images.push(img));
  });
  
  if (images.length === 0) {
    // 没有图片，直接执行布局
    setTimeout(() => {
      initWaterfallLayout(onlyNewItems);
      if (!onlyNewItems) {
        window.addEventListener('resize', debouncedWaterfall);
      }
    }, 50);
    return;
  }
  
  let loadedCount = 0;
  const totalImages = images.length;
  
  function checkAllImagesLoaded() {
    loadedCount++;
    if (loadedCount >= totalImages) {
      // 所有图片加载完成，执行布局
      setTimeout(() => {
        initWaterfallLayout(onlyNewItems);
        if (!onlyNewItems) {
          window.addEventListener('resize', debouncedWaterfall);
        }
      }, 50);
    }
  }
  
  images.forEach(img => {
    if (img.complete && img.naturalHeight !== 0) {
      // 图片已经加载完成
      checkAllImagesLoaded();
    } else {
      // 图片还在加载中
      img.addEventListener('load', checkAllImagesLoaded, { once: true });
      img.addEventListener('error', checkAllImagesLoaded, { once: true });
      
      // 如果图片加载时间过长，设置超时
      setTimeout(() => {
        if (!img.complete || img.naturalHeight === 0) {
          console.warn('图片加载超时，强制执行布局:', img.src);
          checkAllImagesLoaded();
        }
      }, 3000); // 3秒超时
    }
  });
  
  // 兜底机制：最多等待5秒
  setTimeout(() => {
    if (loadedCount < totalImages) {
      console.warn('部分图片加载超时，强制执行布局');
      initWaterfallLayout(onlyNewItems);
      if (!onlyNewItems) {
        window.addEventListener('resize', debouncedWaterfall);
      }
    }
  }, 5000);
}
