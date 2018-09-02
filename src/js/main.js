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
    
        // 座標情報取得
        const points = getPoints('point');
        // ブロック数計算
        const blocks = calcBlockNumber(points);

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
     * @param   {string}  クラス名
     * @return  {Object}  座標情報
     */
    function getPoints(className) {
        let data = document.getElementsByClassName(className);
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

    /**
     * 座標情報から指定範囲内のブロック数を計算
     * @param   {Object}  座標情報
     * @return  {number}  ブロック数
     */
    function calcBlockNumber(points) {
        let size = 0;       // 面積
        let side = 0;       // 辺の長さ
        let blocks = 0;     // ブロック数

        let x1 = 0;         // 1点目のX座標値
        let x2 = 0;         // 2点目のX座標値
        let z1 = 0;         // 1点目のZ座標値
        let z2 = 0;         // 2点目のZ座標値

        /* 図形の面積を計算 */
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
            // 外積を計算して加算
            size += (x1 * z2) - (x2 * z1);
        }
        size = size / 2;
        size = Math.abs(size);

        /* 図形の辺の長さを計算 */
        for (let i = 0; i < points.x.length; i++) {
            if ((i + 1) >= points.x.length) {
                side = side
                     + Math.abs(points.x[i] - points.x[0])
                     + Math.abs(points.z[i] - points.z[0]);
            } else {
                side = side
                     + Math.abs(points.x[i] - points.x[i + 1])
                     + Math.abs(points.z[i] - points.z[i + 1]);
            }
        }

        /* ブロック数を計算 */
        if (size > 0) {
            // ブロック数 = 面積 + (辺の長さ / 2) + 1
            blocks = size + (side / 2) + 1;
        }
        return blocks;
    }
})();