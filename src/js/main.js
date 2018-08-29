(function() {
    'use strict';

    // 座標入力の追加
    var addPoint = document.getElementById('addPoint');
    addPoint.addEventListener('click', function() {
        let form = document.getElementById('chunksCounter');
        let div = document.createElement('div');
        let xInput = document.createElement('input');
        let zInput = document.createElement('input');

        xInput.setAttribute('type', 'number');
        xInput.classList.add('point', 'xPoint');
        xInput.setAttribute('placeholder', 'x');
        zInput.setAttribute('type', 'number');
        zInput.classList.add('point', 'zPoint');
        zInput.setAttribute('placeholder', 'z');
        div.appendChild(xInput);
        div.appendChild(zInput);
        form.insertBefore(div, addPoint);
    });

    // リセットボタン
    var reset = document.getElementById('reset');
    reset.addEventListener('click', function() {
        var points = document.getElementsByClassName("point");
        for ( let i = 0; i < points.length; i++ ) {
            points[i].value = "";
        }
    });

    // チャンク数計算
    var calcChunks = document.getElementById('calcChunks');
    calcChunks.addEventListener('click', function() {
        var points = document.getElementsByClassName('point');
        let result = document.getElementById('chunks');
        let XpointsValue = [];
        let ZpointsValue = [];
        
        // 座標データ取得
        for ( let i = 0; i < points.length; i = i + 2 ) {
            XpointsValue.push(Number(points[i].value));
            ZpointsValue.push(Number(points[i+1].value));
        }

        // 面積計算
        let size = 0.0;
        let x1 = 0;
        let x2 = 0;
        let z1 = 0;
        let z2 = 0;
        for ( let i = 0; i < XpointsValue.length; i++ ) {
            if ( (i + 1) >= XpointsValue.length) {
                x1 = XpointsValue[i];
                x2 = XpointsValue[0];
                z1 = ZpointsValue[i];
                z2 = ZpointsValue[0];
            } else {
                x1 = XpointsValue[i];
                x2 = XpointsValue[i + 1];
                z1 = ZpointsValue[i];
                z2 = ZpointsValue[i + 1];
            }
            size += ( x1 * z2 ) - ( x2 * z1 );
        }
        if ( size < 0 ) {
            size = size * (-1);
        }
        size = size / 2;
        console.log(size);

        // 辺の長さ計算
        let side = 0.0;
        for ( let i = 0; i < XpointsValue.length; i++ ) {
            if ( (i + 1) >= XpointsValue.length) {
                side = side + Math.abs(XpointsValue[i] - XpointsValue[0]) + Math.abs(ZpointsValue[i] - ZpointsValue[0]);
            } else {
                side = side + Math.abs(XpointsValue[i] - XpointsValue[i + 1]) + Math.abs(ZpointsValue[i] - ZpointsValue[i + 1]);
            }
        }
        console.log(side);

        // ブロック数計算
        let blocks = size + (side / 2) + 1;
        console.log(blocks);

        // チャンク数計算
        let chunks = blocks / (16 * 16);
        result.innerText = chunks;
    });
})();