###实例
<div class="m-banner" data-event="carousel">
        <ul class="mod">
            <li>
                <a href="#">
                    <img src="http://ww1.sinaimg.cn/large/51a2bfdagw1egtrbr14chj20go09d75q.jpg" alt="伊丽莎白" />
                </a>
            </li>
            <li>
                <a href="#">
                    <img src="http://ww1.sinaimg.cn/large/51a2bfdagw1egtrbqgzcvj20go09djt0.jpg" alt="艾斯" />
                </a>
            </li>
            <li>
                <a href="#">
                    <img src="http://ww4.sinaimg.cn/mw690/51a2bfdagw1egtrbpzzbcj20go09d762.jpg" alt="张歆艺" />
                </a>
            </li>
            <li>
                <a href="#">
                    <img src="http://ww2.sinaimg.cn/mw690/51a2bfdagw1egtrbply51j20go09dab2.jpg" alt="杨蓉" />
                </a>
            </li>
            <li>
                <a href="#">
                    <img src="http://ww2.sinaimg.cn/mw690/51a2bfdagw1egtrbp668pj20go09dq3w.jpg" alt="托尼托尼乔巴" />
                </a>
            </li>
        </ul>
</div>
##结构说明

###html
```html
<div class="m-banner" data-event="carousel">
    <ul class="mod">
        <li>
            <a href="#"><img src="http://ww1.sinaimg.cn/large/51a2bfdagw1egtrbr14chj20go09d75q.jpg" alt="伊丽莎白" /></a>
        </li>
        <li>
            <a href="#"><img src="http://ww1.sinaimg.cn/large/51a2bfdagw1egtrbqgzcvj20go09djt0.jpg" alt="艾斯" /></a>
        </li>
        <li>
            <a href="#"><img src="http://ww4.sinaimg.cn/mw690/51a2bfdagw1egtrbpzzbcj20go09d762.jpg" alt="张歆艺" /></a>
        </li>
        <li>
            <a href="#"><img src="http://ww2.sinaimg.cn/mw690/51a2bfdagw1egtrbply51j20go09dab2.jpg" alt="杨蓉" /></a>
        </li>
        <li>
            <a href="#"><img src="http://ww2.sinaimg.cn/mw690/51a2bfdagw1egtrbp668pj20go09dq3w.jpg" alt="托尼托尼乔巴" /></a>
        </li>
    </ul>
</div>
```
1. __data-event="carousel"__: data api事件,表示调用carousel事件.
2. __class="mod"__: 轮播主体结构.js会读取子元素进行横排轮播
3. mod 子元素内的内容自定义,任意编辑
4. js会自动生成上一页下一页以及下标.可以自行隐藏.

##参数说明
_data-event="carousel"_ 里添加 **data-set='{"key":"value"}'** json格式可以设置更多参数.

#### auto
设置是否自动轮播 默认 _true_. 可选参数 _false_.
#### outTime 
配置轮播切换时间 默认 4000ms 可以更改为任意数字.
####ebox
配置进行轮播的主体 默认为第一个子元素.可以自己任意更改为 选择器 比如 ".list"

例子:配置静态轮播
```html
<dd data-event="carousel"  data-set='{"auto":"false","ebox":".m-sales-list > ul"}' >
...
</dd>
```

##设计简介
轮播算是当下网页最常见的元素之一了. <br />
这个插件的宗旨是弄一个体验良好的轮播,所以考虑了很多细节.<br />
比如 高级浏览器下用css3来控制动画的过渡.并启用硬件加速属性.<br />
js只控制了css没办法控制的部分. 所以更多的发挥空间留给使用者.<br />
你可以只通过修改css就配置自己需要的轮播.
