/**
 * Created by Administrator on 2017/4/16.
 */
var game2048 = {
    cells:[["0","0","0","0",'0'],["0","0","0","0",'0'],
        ["0","0","0","0",'0'],["0","0","0","0",'0'],["0","0","0","0","0"]],
    scroe:"0",
    aninumb:[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
    canrandom:false,
    init:function() {
        game2048.randomCell();
        game2048.randomCell();
        $("#score").show();
        $("#gameover").hide();
        game2048.paintAll();
    },
    randomCell:function() {
        do{
            var i = parseInt(Math.random()*4);
            var j = parseInt(Math.random()*4);
        }
        while(game2048.cells[i][j]!='0')
        {game2048.cells[i][j]="2";
            id="#c"+i+j;
            $(id).css({"width": "0px","height": "0px"})
                .animate({"width": "180px","height": "180px"},50).animate({"width": "150px","height": "150px"},50);
            setTimeout('function aaa() {  $(id).text("2");}',100);
        }
    },
    paintAll:function () {
        var id;
        var colorclass;
        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                id="#c"+i+j;
                if(game2048.cells[i][j]!="0"){
                    $(id).text(game2048.cells[i][j]).css({"left":""+(j*160+10)+"px","display":"inline-block","top":""+(i*160+80)+"px"});
                $(id).attr('class', "cell n"+$(id).text());}
                else if(game2048.cells[i][j]=="0")
                    $(id).text('0').css({"left":""+(j*160+10)+"px","top":""+(i*160+80)+"px","display":"none"})
                        .attr('class',colorclass);
            }
        }
        console.log(game2048.cells[0]);
        $("#score").text(game2048.scroe);
    },
    moveadd:function () {
        var yuanshi=game2048.cells.concat();
        var nochange=0;
        game2048.canrandom=false;
        var changeornot =game2048.cells.concat();
        for(var i=0;i<4;i++){      //数组每行右移
            var tempcell=['0','0','0','0','0'];
            var num =0;
            for(var j=0;j<4;j++){
                if(game2048.cells[i][j]!='0'){
                    tempcell[num]=game2048.cells[i][j];
                    this.aninumb[i][j]=num;
                    num++;
                }
                else
                    this.aninumb[i][j]=j;
            }
            game2048.cells[i]=tempcell;
        }
        console.log(this.aninumb[0]);
        for(var i=0;i<4;i++) {//  判断右移是否有改变
            for (var j=0;j<4;j++) {
                if(game2048.cells[i][j]!=changeornot[i][j])
                    game2048.canrandom=true;
            }
        }
        for(var i=0;i<4;i++){ //数组每行向右加
            for(var j=0;j<4;j++){
                if(yuanshi[i][j]!="0"){
                    nochange=j;
                    break;
                }
            }
            for(var j=0;j<3;j++){
                if(game2048.cells[i][j]!='0'&&game2048.cells[i][j]==game2048.cells[i][j+1]) {
                    game2048.cells[i][j]=''+parseInt(game2048.cells[i][j])*2;
                    game2048.scroe=''+(parseInt(game2048.scroe)+parseInt(game2048.cells[i][j]));
                    for(var k=j;k<3;k++){
                        if(yuanshi[k+1]!="0"&&k!=nochange-1)
                            this.aninumb[i][k+1]-=1;
                        game2048.cells[i][k+1]=game2048.cells[i][k+2];
                    }
                    game2048.canrandom=true;
                    break;
                }
            }
        }
        console.log(this.aninumb[0]);

    },
    turnright:function() {
        var zhuanzhi=[["0","0","0","0",'0'],["0","0","0","0",'0'],
            ["0","0","0","0",'0'],["0","0","0","0",'0'],["0","0","0","0","0"]];
        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                zhuanzhi[j][3-i] = game2048.cells[i][j];
            }
        }
        game2048.cells=zhuanzhi;
    },
    turnleft:function () {
        game2048.turnright();
        game2048.turnright();
        game2048.turnright();
    },
    miro:function () {
        var mirocells=[["0","0","0","0",'0'],["0","0","0","0",'0'],
            ["0","0","0","0",'0'],["0","0","0","0",'0'],["0","0","0","0","0"]];
        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                mirocells[j][3-i] = game2048.cells[j][i]
            }
        }
        game2048.cells=mirocells;
    },
    keydownmove:function (direction) { //针对按键方向，先对数组做镜像处理或者顺时针转，转到是右移操作
        switch (direction){
            case "right":
                game2048.miro();
                game2048.moveadd();
                game2048.animirro();
                game2048.animatejs("x");
                game2048.miro();
                break;
            case  "left":
                game2048.moveadd();
                game2048.animatejs("x");
                break;
            case  "down":
                game2048.turnright();
                game2048.moveadd();
                game2048.animirro();
                game2048.animatejs("y");
                game2048.turnleft();
                break;
            case  "up":
                game2048.turnright();
                game2048.miro();
                game2048.moveadd();
                game2048.animatejs("y");
                game2048.miro();
                game2048.turnleft();
                break;
        }
        if(game2048.canrandom){
            game2048.randomCell();
        }
        if(game2048.isGameOver()){
            $("#score").hide().text("0");
            setTimeout('$("#gameover").show()',1000);
        }

    },
    isGameOver:function () {
        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                if (game2048.cells[i][j]=='0'||
                    (game2048.cells[i][j] == game2048.cells[i][j+1] ||
                    game2048.cells[i][j] == game2048.cells[i+1][j])){
                    return false;
                }
            }
        }
        game2048.paintAll();
        return true;
    },
    gameRestart:function () {
        game2048.cells=[["0","0","0","0",'0'],["0","0","0","0",'0'],
            ["0","0","0","0",'0'],["0","0","0","0",'0'],["0","0","0","0","0"]];
        game2048.scroe='0';
        game2048.init();
    },
    animirro:function(){
        var temp;
        for(var j=0;j<4;j++) {
            for (var i = 0; i < 2; i++) {
                temp = this.aninumb[j][i];
                this.aninumb[j][i] = 3 - this.aninumb[j][3 - i];
                this.aninumb[j][3 - i] = 3 - temp;
            }
        }
    },
    animatejs:function(direction){
        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++) {
                if ($("#c" + i + j).text() == "0" || $("#c" + i + j).text() == "") {
                    $("#c" + i + j).css({"display": "none"});
                }

                var xy=(direction=="x")?
                    $("#c" + i + j).animate({"left": "" + (this.aninumb[i][j] * 160 + 10) + "px"},50):
                    $("#c" + j + i).animate({"top": "" + (this.aninumb[i][j] * 160 + 80) + "px"},50);

            }
        }
    }
};
$(function () {
    game2048.init();
    $(document).keydown(function(event){
        if (!$("div").is(":animated")) {  //动画中能不能有新动画得到
            switch (event.keyCode) {
                case 37:
                    game2048.keydownmove("left");
                    break;
                case 39:
                    game2048.keydownmove("right");
                    break;
                case 40:
                    game2048.keydownmove("down");
                    break;
                case 38:
                    game2048.keydownmove("up");
                    break;
                case 67:
                    game2048.gameContinue();
                case 82:
                    game2048.gameRestart();
            }
            setTimeout("game2048.paintAll()", 60);
        }
    });
});
