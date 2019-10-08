const getXY = (obj, x, y) => {
    let w = obj.width;
    let h = obj.height;
    let d = obj.data;
    let color = [];
    color[0] = obj.data[4 * (y * w + x)];
    color[1] = obj.data[4 * (y * w + x) + 1];
    color[2] = obj.data[4 * (y * w + x) + 2];
    color[3] = obj.data[4 * (y * w + x) + 3];
    return color;
};

const setXY = (obj, x, y, color) => {
    let w = obj.width;
    let h = obj.height;
    let d = obj.data;
    obj.data[4 * (y * w + x)] = color[0];
    obj.data[4 * (y * w + x) + 1] = color[1];
    obj.data[4 * (y * w + x) + 2] = color[2];
    obj.data[4 * (y * w + x) + 3] = color[3];
};

//num:马赛克的程度，数字越大越模糊
const draw = (obj, ctx, width, height, num) => {
    ctx.drawImage(obj, 0, 0, width, height);
    let oImg = ctx.getImageData(0, 0, width, height);
    let w = oImg.width;
    let h = oImg.height;
    //创建一个新的ImageData对象
    let newImg = ctx.createImageData(obj.width, obj.height);
    //等分画布
    let stepW = w / num;
    let stepH = h / num;
    //这里是循环画布的像素点
    for (let i = 0; i < stepH; i++) {
        for (let j = 0; j < stepW; j++) {
            //获取一个小方格的随机颜色，这是小方格的随机位置获取的
            let color = getXY(
                oImg,
                j * num + Math.floor(Math.random() * num),
                i * num + Math.floor(Math.random() * num)
            );
            //这里是循环小方格的像素点，
            for (let k = 0; k < num; k++) {
                for (let l = 0; l < num; l++) {
                    //设置小方格的颜色
                    setXY(newImg, j * num + l, i * num + k, color);
                }
            }
        }
    }
    ctx.putImageData(newImg, 0, 0);
};

export const mosaic = (canvasEl, src, time, callBack) => {
    let ctx = canvasEl.getContext('2d');
    let aImg = new Image(canvasEl.width, canvasEl.height);
    aImg.src = src;
    aImg.onload = () => {
        let intervaltime = 100;
        let order = 0;
        let number = 0;
        let opacity = 1;
        let interval = setInterval(() => {
            if (opacity == 10) {
                order = 0;
            }
            if (opacity == 1) {
                order = 1;
            }
            if (order == 0) {
                opacity = opacity - 1;
            } else {
                opacity = opacity + 1;
            }
            number++;
            if (number == time / intervaltime) {
                opacity = 1;
                clearInterval(interval);
                interval = null;
                ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
                if (callBack) {
                    callBack();
                }
            }
            draw(aImg, ctx, canvasEl.width, canvasEl.height, opacity);
        }, intervaltime);
    };
};
