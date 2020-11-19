## 拖拽事件解决方案

```
$el.addEventListener('mousedown',event =>{
    console.log('mousedown')
    let startX = event.clientX, startY = event.clientY
    let move = event =>{
    	console.log('move')
    }
    let up = event =>{
        console.log('mouseup')
        document.removeEventListener('mousemove',move)
        document.removeEventListener('mouseup',up)
    }
    document.addEventListener('mousemove',move)
    document.addEventListener('mouseup',up)
})
```



## 记录event.mousemove鼠标移动距离

```
event:mousedown
	let startX = event.clientX, startY = event.clientY
	let move = event =>{
        let x = event.clientX - startX, y = event.clientY - startY
   	}
```



## 取余处理循环