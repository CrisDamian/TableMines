var Neighbors8 = [[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1]];
// Table Data
var	tHeight=10;
var	tWidth=10;
var	nMines=10;
var	nSteped;
var	mTable;
var tRef;
var visible;

// Cand se apasa pe butonul StartMines se incepe jocul.
$("document").ready(function(){
	$("#tmde").click(function(){checkSet("#tmde")});
	$("#tmdm").click(function(){checkSet("#tmdm")});
	$("#tmdh").click(function(){checkSet("#tmdh")});
    $("#StartMines").click(StartMines);
});

// Setarea Jocului
function checkSet(checkId){
	$(".tmd").empty();
	$(".tmd").append($('#Faces .hide').clone())
	$(checkId).empty();
	$(checkId).append($('#Faces .flag').clone());
	switch(checkId){
		case "#tmde":
			tHeight=10;tWidth=10;nMines=10;
		break;
		case "#tmdm":
			tHeight=15;tWidth=15;nMines=20;
		break;
		case "#tmdh":
			tHeight=20;tWidth=20;nMines=30;
		break;
	}
}
// Inceputul Jocului
function StartMines(){
	nSteped = 0;
    if (tWidth > 20) tHeight = 20;
	else tHeight = tWidth; 
	
	$('.tmd').off('click');
	$("#StartMines").remove();
	
	//Introduc bordura de sus a tabelului Html
	cRow=$('<tr></tr>');
	$(cRow).appendTo('#MinedTable');
	for(var i=0;i<tWidth+2;i++){
		cCol=$('<td></td>');
		cCol.appendTo(cRow);
		$('#Faces .up').clone().appendTo(cCol);
	}
	
    // Se genereaza un tabel 
	tRef= new Array(tHeight);
    for(var i=0; i<tHeight; i++){
		
		tRef[i]= Array(tWidth);
		
		// Generez un rand ca obiect JQuery
		cRow= $('<tr></tr>');
		//Inserez in tabelul HTML
        $(cRow).appendTo('#MinedTable');
		
		//Bordura stanga a tabelului HTML
		$('#Faces .left').clone().appendTo(cRow);
		
        //Introduc celulele
		for(var j=0; j<tWidth; j++){
			cCell = mkCell(i,j);
			//Inserez in randul HTML
			$(cCell).appendTo(cRow);
			// Memorez in matrici
			tRef[i][j]=cCell;
        }
		//Bordura dreapta a tabelului HTML
		$('#Faces .right').clone().appendTo(cRow);	
    }
	
	//Introduc bordura de jos a tabelului Html
	cRow=$('<tr></tr>');
	$(cRow).appendTo('#MinedTable');
	for(var i=0;i<tWidth+2;i++){
		cCol=$('<td></td>');
		cCol.appendTo(cRow);
		$('#Faces .down').clone().appendTo(cCol);
	}
	
	// Starea de vizibil
	visible = new Array(tHeight*tWidth);
	
	// Se seteaza toate patratele ca libere
	mTable= new Array(tHeight);
	var freeCell = new Array(tHeight*tWidth);
	k=0;
	for(var i=0; i<tHeight; i++){
		mTable[i]= Array(tWidth);
		for(var j=0; j<tWidth;  j++){
			mTable[i][j]=0;
			visible[k]=false;
			freeCell[k++]=[i,j];
		}
	}
	// Introduce minele in patratele libere
	for(var i=0; i<nMines; i++){
		//Alege la intamplare un patrat
		index = Math.floor(Math.random()*freeCell.length);
		var a = freeCell[index][0];
		var b = freeCell[index][1];
		//Introduce mina
		mTable[a][b] = -1;
		
		// Actualizeaza numerele
		for(var k in Neighbors8){
		
			x= a+Neighbors8[k][0];
			y= b+Neighbors8[k][1];
			
			if( x>=0 && y>=0 
				&& x< tHeight
				&& y< tWidth
				&& mTable[x][y] >= 0
			){mTable[x][y]+=1}	
			
		}
		//Scotate de pe lista
		freeCell[index]=freeCell[freeCell.length-1];
		freeCell.pop();
	}
}


//Functia ce creeaza un patrat din tabel
function mkCell(i,j){
		// Generez un patrat ca obiect JQuery
			cCell=$('<td class="MCell"></td>');
			$(cCell).append($("#Faces .hide").clone());
			$(cCell).data('mine','false');
		// Evenimente
			$(cCell).click(function(){stepOnCell(i,j); ckWin();});
		// Inserez celula in tabel
			return cCell;
}

function showCell(i,j){
			var CellObj = tRef[i][j];
			$(CellObj).empty();
			$(CellObj).off('click');
			switch(mTable[i][j]){
				case -1:
					$(CellObj).append($('#Faces .mine').clone());
				break;
				case 0:
					$(CellObj).append($('#Faces .empty').clone());
				break;
				default:
					$(CellObj).append('<pre> '+ mTable[i][j] +' </pre>');
			}
			return mTable[i][j];
}

function stepOnCell(i,j){
	if(i<0 || j<0 || i>=tHeight || j>=tWidth)return;
	if(visible[i*tWidth+j])return;
	visible[i*tWidth+j]=true;
	switch(showCell(i,j)){
		case -1:
			loseGame();
			break;
		case 0:
			nSteped++;
			for(k in Neighbors8)
				stepOnCell(i+Neighbors8[k][0],j+Neighbors8[k][1]);
			break;
		default:
			nSteped++;
			break;
	}

}

function ckWin(){
	if(tHeight*tWidth-nMines-nSteped <= 0){
		for(i in mTable)
			for(j in mTable[i])
				if(!visible[i][j])
					showCell(i,j);
		$("#TableMines").append("<p><b>You won !!</b></p>");
	}
}

function loseGame(){
	for(i in mTable)
		for(j in mTable[i])
			if(!visible[i][j])
				showCell(i,j);
	$("#TableMines").append("<p><b>You lost !!</b></p>");
}


