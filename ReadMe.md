仿制设计师网站 ignordone.space

主要元素描述
图片背景url:https://www.ignoredone.space/wp-content/uploads/2025/02/网页首页使用-scaled-e1756810226577.webp
中间大号文字,小字副标题
右上角搜索框及搜索按钮
左侧中部由组件栏（内有4个按钮）
右下角了解更多按钮
页内鼠标重绘为浅灰色圆形,与可交换按钮接触变幻为填充圆形

页面样式
矢量icon
圆角矩形，毛玻璃
圆形
图片背景被树状栅格加浅度不透明波动变幻：在背景上，竖向切分成多个块，从左向右一次高亮整个块，同时该块背景像屏幕内方向稍微旋转，高亮转移至下一块时复位

创建页面骨架元素
```html
<body>

    <main>
        <div class="bg-img">
            <img src="https://www.ignoredone.space/wp-content/uploads/2025/02/网页首页使用-scaled-e1756810226577.webp"
                alt="background">
        </div>

        <div class="search-bar">
            <input type="text">
            <button>搜索</button>
        </div>

        <div class="left-tool-bar">
            <div class="icon">1</div>
            <div class="icon">2</div>
            <div class="icon">3</div>
            <div class="icon">4</div>
        </div>

        <div class="learnmore">
            <button>...</button>
        </div>
    </main>

</body>
```
1,2,3,4暂时没有设计功能。

个人about信息
表格形式
位于head元素下，默认显示，点击其他位置消失，点击about按钮重新显示
学号,兴趣,梦想,理念...
```html
<!-- 个人介绍表格 - 位于body标签顶部 -->
<div class="profile-table">
    <h2 class="profile-title">个人介绍</h2>
    <table>
        <tr>
            <th>姓名</th>
            <td>秋实</td>
        </tr>
        <tr>
            <th>学号</th>
            <td>3-26</td>
        </tr>
        <tr>
            <th>目标职业</th>
            <td>UI/UX 设计师</td>
        </tr>
        <tr>
            <th>专长</th>
            <td>网页设计、移动应用设计、交互设计</td>
        </tr>
        <tr>
            <th>经验</th>
            <td>0年+</td>
        </tr>
        <tr>
            <th>简介</th>
            <td>专注于创建美观且用户友好的数字体验</td>
        </tr>
    </table>
</div>
```


设计样式
实现毛玻璃效果，半透明背景，圆角边框，居中定位，响应式表格
```css
/* 个人介绍表格样式 */
.profile-table {
    position: absolute;
    top: 40px;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    max-width: 800px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    padding: 30px;
    color: white;
    z-index: 15;
    opacity: 1; /* 默认显示 */
}

.profile-table table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
}

.profile-table th,
.profile-table td {
    padding: 15px 20px;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* 表格标题 */
.profile-title {
    text-align: center;
    margin-bottom: 20px;
    font-size: 1.8rem;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
}

/* 响应式表格 */
@media (max-width: 768px) {
    .profile-table {
        width: 90%;
        padding: 20px;
        top: 100px;
    }
}
```

标题的淡入动画
```css
/* 淡入动画 */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translate(-50%, -50%) translateY(30px);
    }

    to {
        opacity: 1;
        transform: translate(-50%, -50%) translateY(0);
    }
}

```


使用简单的JavaScript实现按钮的交互，点击显示表格
```Javascript
// 获取表格和about按钮元素
const profileTable = document.querySelector('.profile-table');
const aboutButton = document.getElementById('about-button');

// 初始状态：表格显示，about按钮正常显示
if (profileTable && aboutButton) {
    // 点击页面其他位置隐藏表格
    document.addEventListener('click', (e) => {
        // 排除表格和about按钮本身
        if (!profileTable.contains(e.target) && e.target !== aboutButton) {
            profileTable.style.display = 'none';
        }
    });
    
    // 点击about按钮显示表格
    aboutButton.addEventListener('click', () => {
        profileTable.style.display = 'block';
    });
}
```

设置合适的 position: absolute 和 z-index 值，确保表格在正确的位置显示，不会被其他元素遮挡。