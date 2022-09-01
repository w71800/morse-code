var morseCode = "A:.-/B:-.../C:-.-./D:-../E:./F:..-./G:--./H:..../I:../J:.---/K:-.-/L:.-../M:--/N:-./O:---/P:.--./Q:--.-/R:.-./S:.../T:-/U:..-/V:...-/W:.--/X:-..-/Y:-.--/Z:--.."

// 先透過指定字元將各個英文字分開
var morseList = morseCode.split("/")

// 然後分割好的各個字母和密碼的組合拆開做成一個個物件，並放入新的陣列
var codeObjArray = [] 
for(i=0;i<morseList.length;i++){  
  codeObjArray[i] = {
    alphabet: morseList[i].split(":")[0],
    morse: morseList[i].split(":")[1]
  }
}

// 將翻譯清單渲染出來
for(i=0;i<codeObjArray.length;i++){
  var nowItem = $("<li>"+codeObjArray[i].alphabet+"<span> "+codeObjArray[i].morse+"</span></li>")
  $("ul").append(nowItem)
}

// 在字母與密碼的清單中用 for 迴圈搜索對應的輸入字母相對應的密碼，並且把它傳出來。
function findCode(letter){
  for(i=0;i<codeObjArray.length;i++){
    if(letter == codeObjArray[i].alphabet){
      return(codeObjArray[i].morse)
    }
  }
  // 如果跑完一輪都沒有搜尋到對應的，則傳回原先的引數。
  return(letter)
}

// 相反過來，由密碼來搜尋字母
function findLetter(code){
  for(i=0;i<codeObjArray.length;i++){
    if(code == codeObjArray[i].morse){
      return(codeObjArray[i].alphabet)
    }
  }
  // 如果跑完一輪都沒有搜尋到對應的，則傳回原先的引數。
  return(code)
}

// 搜索丟進去的文本中的每個字元，看看有沒有對應的密碼。找到的密碼就會放入空字串裡面等待被組合
function translateToMorse(text){
  text = text.toUpperCase()
  var NowResult = ""
  for(let i=0;i<text.length;i++){
    NowResult = NowResult+findCode(text[i])+" "
  }
  return NowResult
}
// 別忘記字串本身會被當作陣列來處理喔～
// ＊我發現沒辦法逆順序回去搜尋，會被中斷。例如說能夠找 AB 但不能找 BA
// ＊例如說如果去抓 DCBA 的話，只會抓到 D 的轉換結果，而這個結果會被套至 A 上，變成 A 轉換結果是 D 的密碼

// 相反過來是透過密碼轉換回文本
// 只差在資料一開始是先切割成陣列
function translateToEng(text){
  text = text.split(" ")
  var NowResult = ""
  for(let i=0;i<text.length;i++){
    NowResult = NowResult+findLetter(text[i])
  }
  return NowResult
}

// 按下翻譯鍵時，輸出欄的視覺效果
function bgcEffect(outputWindow){
  $(outputWindow).css("background-color","#292B73").animate({
    backgroundColor: "FFF"},500)
}

// 按按鍵將英文文本轉譯成密碼的功能
$("#btnMorse").click(function(){
  var userInput = $("#input").val()
  var InputTrans = translateToMorse(userInput)
  $("#output").val(InputTrans)
  bgcEffect($("#output"))
  $(".symbol").toggleClass("rotate")
})

// 跟上面相反，將密碼轉譯回去英文文本的功能
$("#btnEng").click(function(){
  var userInput = $("#output").val()
  var InputTrans = translateToEng(userInput)
  $("#input").val(InputTrans)
  bgcEffect($("#input"))
  $(".symbol").toggleClass("rotate")
})

// 即時修正使用者數入文字
$("#input").keyup(function(){
  var userInput = $("#input").val()
  var NewInput = userInput.toUpperCase().split(" ").join("")
  $("#input").val(NewInput)
})

// 播放的函數，我覺得比較難
function play(inputCode,nowIndex){
  var singleCharcter = inputCode[nowIndex]
  var nextPlay = 0  
  $(".showResult span").removeClass("highlight")
  // $(".showResult span:nth-child("+nowIndex+1+")").addClass("highlight")
  // eq 有指定第幾個的功用
  $(".showResult span").eq(nowIndex).addClass("highlight")
  if(singleCharcter === "."){
    $("audio.short")[0].play()
    nextPlay = 500
    console.log(nowIndex)
  }
  else if(singleCharcter === "_"){
    $("audio.long")[0].play()
    nextPlay = 1500
    console.log(nowIndex)
  }
  else{
    nextPlay = 500
  }
  console.log(singleCharcter,nextPlay)
  if(nowIndex < inputCode.length){
    setTimeout(function(){
      play(inputCode,nowIndex+1)
    },nextPlay)
  }
  else{
    $(".showResult").empty()
  }
}

$("#btnPlay").click(function(){
  var codeToPlay = $("#output").val()
  for(let i=0;i<codeToPlay.length;i++){
    $(".showResult").append("<span>"+codeToPlay[i]+"</span>")
  }
  play(codeToPlay,0)
})

// function highlightCode(inputCode,nowIndex){
//   // 目標是把InputCode加工成帶有span標籤的形式
//   // <div>..._<span>_</span>.__</div>
//   // 下一個就會是 <div>...__<span>.</span>__</div>
//   // 這邊是將字元陣列中跑到的該 index 的字元的值改寫成 span 形式，以得到一個改寫過的矩陣
//   // var lastIndexCode = inputCode[nowIndex]
//   // inputCode[nowIndex-1] = lastIndexCode
//   inputCode[nowIndex].replace(inputCode[nowIndex],"<span>"+inputCode[nowIndex]+"</span>")
//   console.log(inputCode)
//   var highlightHTML = $("<div>"+inputCode+"</div>")
//   $(".showResult").empty()
//   $(".showResult").append(highlightHTML)
// }

// function playCode(){
//   var userOutput = $("#output").val()
//   var result = userOutput.split(" ").join("")
//   $(".showResult").text(result)
//   for(i=0;i<result.length;i++){
//     // 加上黃色的 span
//     var chosenCode = $("<span style='color: #FFB637'></span>")
//     if(result[i] === "."){
//       // 播放.的聲音
//     }
//     else{
//       // 播放-的聲音
//     }
//   }
// }