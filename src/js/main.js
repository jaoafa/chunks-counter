(function () {
    'use strict';

    // 座標入力の追加
    var addPoint = document.getElementById('addPoint');
    addPoint.addEventListener('click', function () {
        let form = document.getElementById('chunksCounter');
        let div = document.createElement('div');
        div.classList.add('points');
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
    reset.addEventListener('click', function () {
        var points = document.getElementsByClassName("point");
        for (let i = 0; i < points.length; i++) {
            points[i].value = "";
        }
        document.getElementById('requestTextArea').value = "";
        document.getElementById("calcChunks").click(); // 計算しなおす
    });

    // チャンク数計算
    var calcChunks = document.getElementById('calcChunks');
    calcChunks.addEventListener('click', function () {
        let result = document.getElementById('chunks');
        let XpointsValue = [];
        let ZpointsValue = [];

        var points = getPoints();

        // 面積計算
        let size = 0.0;
        let x1 = 0;
        let x2 = 0;
        let z1 = 0;
        let z2 = 0;
        for (let i = 0; i < points.x.length; i++) {
            if ((i + 1) >= points.x.length) {
                x1 = points.x[i];
                x2 = points.x[0];
                z1 = points.z[i];
                z2 = points.z[0];
            } else {
                x1 = points.x[i];
                x2 = points.x[i + 1];
                z1 = points.z[i];
                z2 = points.z[i + 1];
            }
            size += (x1 * z2) - (x2 * z1);
        }
        if (size < 0) {
            size = size * (-1);
        }
        size = size / 2;
        console.log(size);

        // 辺の長さ計算
        let side = 0.0;
        for (let i = 0; i < points.x.length; i++) {
            if ((i + 1) >= points.x.length) {
                side = side + Math.abs(points.x[i] - points.x[0]) + Math.abs(points.z[i] - points.z[0]);
            } else {
                side = side + Math.abs(points.x[i] - points.x[i + 1]) + Math.abs(points.z[i] - points.z[i + 1]);
            }
        }
        console.log(side);

        // ブロック数計算
        let blocks = size + (side / 2) + 1;
        if (blocks == 1) blocks = 0; // ブロック数が1→0に変える。(未指定の場合には1ブロックになってしまうため)
        console.log(blocks);

        // チャンク数計算
        let chunks = blocks / (16 * 16);
        result.innerText = chunks + " Chunks (" + blocks + " Blocks)";
        
        var chunksmsg = document.getElementById('chunksMessage');
        if (chunks >= 1024) {
            result.style.color = "red";
            chunksmsg.innerHTML = "初期規定チャンク数(1024チャンク)以上です。新規登録の場合は「規定ブロック数を超える明確な理由」が必要です。";
        } else if (Math.round(chunks) !== chunks) {
            result.style.color = "orange";
            chunksmsg.innerHTML = "チャンク数が不適切(整数でない)です。範囲が正確に指定されていない可能性があります。";
        } else if (chunk == 0) {
            result.style.color = "none";
            chunksmsg.innerHTML = "範囲情報を入力してください。";
        }else{
            result.style.color = "none";
            chunksmsg.innerHTML = "特に問題はありません。";
        }
    });

    /**
     * 入力された座標情報を取得
     * @return  {Object}  座標情報
     */
    function getPoints() {
        let data = document.getElementsByClassName('point');
        let points = {
            x: [],
            z: [],
        }
        for (let i = 0; i < data.length; i = i + 2) {
            points.x.push(Number(data[i].value));
            points.z.push(Number(data[i + 1].value));
        }
        return points;
    }
})();