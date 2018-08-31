(function() {
    'use strict';

    // パース正規表現定義
    var Reg = /#([0-9]+) *(\-?[0-9]+) *(\-?[0-9]+) *\(Chunk: *(\-?[0-9]+) *(\-?[0-9]+)\)/;

    // テキスト入力
    // もっと効率化できると思う
    var requestTextArea = document.getElementById('requestTextArea');
    requestTextArea.addEventListener('input', function() {
        var requestText = document.getElementById("requestTextArea");
        
        if (requestText.value == "") {
            // からっぽ
            requestTextArea.style.borderColor = "gray";
            document.getElementById("requestTextAreaMessage").innerHTML = "申請内容をそのままコピペしてください。";
            return;
        }else if (!requestText.value.match(Reg)) {
            // マッチしない→パースできない
            requestTextArea.style.borderColor = "red";
            document.getElementById("requestTextAreaMessage").innerHTML = "範囲の情報が見つかりません。";
            return;
        }

        var reqs = requestText.value.split(/\n/);

        /* 現存する入力欄をすべて消す。動作はするもののnull導入するだけなので気に入らない */
        var points = document.getElementsByClassName("points");
        for ( let i = 0; i < points.length; i++) {
            points[i].innerHTML = null;
        }

        var count = 0;
        reqs.forEach( function( value ) {
            var result = Reg.exec(value);
            if(result == null){
                return;
            }
            var keynum = result[1]; // ex. #1
            var X = result[2]; // ex. -640
            var Z = result[3]; // ex. 655
            var chunkX = result[4]; // ex. -40
            var chunkZ = result[5]; // ex. 40
            
            var addPoint = document.getElementById('addPoint');
            let form = document.getElementById('chunksCounter');
            let div = document.createElement('div');
            div.classList.add('points');
            let xInput = document.createElement('input');
            let zInput = document.createElement('input');

            xInput.setAttribute('type', 'number');
            xInput.classList.add('point', 'xPoint');
            xInput.setAttribute('placeholder', 'x');
            xInput.value = X;
            zInput.setAttribute('type', 'number');
            zInput.classList.add('point', 'zPoint');
            zInput.setAttribute('placeholder', 'z');
            zInput.value = Z;
            div.appendChild(xInput);
            div.appendChild(zInput);
            form.insertBefore(div, addPoint);

            console.log("[requestParser] Added #" + keynum + " : " + X + " " + Z + " (" + chunkX + " " + chunkZ + ")");
            count++;
        });
        document.getElementById("calcChunks").click();

        requestTextArea.style.borderColor = "green";
        document.getElementById("requestTextAreaMessage").innerHTML = "成功し、" + count + "個の座標データを入力しました。";
    });
})();