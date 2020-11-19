import { createElement } from './framework.js'
import { Carousel } from './carousel.js'
let d = [
    "https://hearthstone.nosdn.127.net/a/images/2020/11/13/034e0c26139ce9a06f0a33aec7778bc7.png",
    "https://hearthstone.nosdn.127.net/a/images/2020/11/13/67b1092b81783b238f35262e7e979c06.png",
    "https://hearthstone.nosdn.127.net/a/images/2020/10/23/593aad7871a0513006ee9fbc6e3e9ad2.jpg",
    "https://hearthstone.nosdn.127.net/a/images/2020/10/23/3d240a0c663ea214aae3c108874e1673.jpg",
]
let a = 
<Carousel id='c' src={d}>
</Carousel>

// document.body.appendChild(a)
a.mountTo(document.body)