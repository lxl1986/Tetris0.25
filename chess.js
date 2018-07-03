var W = 8, H = 16;
var SIZE = 8;

var cb = document.getElementById('board');
var shape = {};
/*
	initialize the chess board
*/
function init_cb(){
	cb.style.width=W*SIZE + "px"; 
	cb.style.height=H*SIZE + "px";
	cb.style.backgroundColor = "#abcdef";
	var i, j;
	for(i=0; i<H; i++){
		cb[i]=[];
		for(j=0; j<W; j++){
			cb[i][j] = 0; //nothing in position i,j
		}
	}
}

// shapes
// like others we have seven shapes.
var shapes = [
	[[1,1], [1,1]],
	[[1,1,0], [0,1,1]],
	[[0,1], [1,1], [1,0]],
	[[0,1,1], [1,1,0]],
	[[1,0], [1,1], [0,1]],
	[[1,1,1,1]],
	[[1], [1], [1], [1]],
];
var LEN_SHAPES = shapes.length;

function create_shape(p){
	// var r = p.r;
	// var c = p.c;
	var t = p.t;

	var h = shapes[t].length;
	var w = shapes[t][0].length;

	var i, j, obj, temp_div;

	obj = document.createElement('div');
	obj.style.width=w*SIZE + "px"; 
	obj.style.height=h*SIZE + "px";
	obj.style.position="absolute";

	for(i=0;i<h;i++)
		for(j=0;j<w;j++)
			if(shapes[t][i][j]){
				temp_div = document.createElement('div');
				temp_div.style.width=SIZE + "px"; 
				temp_div.style.height=SIZE + "px";
				temp_div.style.backgroundColor = "green";
				temp_div.style.position="absolute";
				temp_div.style.left=j*SIZE + "px"; 
				temp_div.style.top=i*SIZE + "px";
				obj.appendChild(temp_div);
			}

	return obj;
}

function init_shape(){
	var shape1={};

	shape1.t = parseInt(Math.random() * LEN_SHAPES);	

	//we create the shape1 with type t
	shape1.div = create_shape(shape1);

	//the initial position
	shape1.r = 0; 
	shape1.c = Math.max(0, parseInt(Math.random() * W) - 3);

	//for the shape1, we use the left-bottom part as a reference.
	shape1.div.style.bottom = (H-1-shape1.r) * SIZE + "px";
	shape1.div.style.left = shape1.c * SIZE + "px";	
	return shape1;
}

function left_shape(){
	if(shape.c){
		var h = shapes[shape.t].length;		
		var i, j;
		var cbi, cbj;

		cbi = shape.r;
		cbj = shape.c - 1;
		//test the left, can the shape's left column fit ? 
		j = 0;
		for(i=0;i<h;i++){		
			cbi = shape.r-(h-1)+i;
			if(cbi<0) continue;			
			if(shapes[shape.t][i][j]==1 && cb[cbi][cbj]==1) return;
		}

		shape.c -= 1;
		shape.div.style.left = shape.c * SIZE + "px";
	}
	
}


function UP_shape_rotate(){	
	switch(shape.t){
		case 0:
			break;
		case 1:
			shape.t=2;
			break;
		case 2:
			shape.t=1;
			break;
		case 3:
			shape.t=4;
			break;
		case 4:
			shape.t=3;
			break;
		case 5:
			shape.t=6;
			break;
		case 6:
			shape.t=5;		
	}
	
	//to be fixed: when rotated the shape, the new shape really can rotate?
	cb.removeChild(shape.div);
	shape.div = create_shape(shape);
	shape.div.style.bottom = (H-1-shape.r) * SIZE + "px";
	shape.div.style.left = shape.c * SIZE + "px";
	cb.appendChild(shape.div);
}

function right_shape(){
	//can i right?
	var w = shapes[shape.t][0].length;
	if(shape.c+w < W){
		var h = shapes[shape.t].length;		
		var i, j;
		var cbi, cbj;

		cbi = shape.r;
		cbj = shape.c + w;
		//test the right, can the shape's right column fit ? 
		j = w-1;
		for(i=0;i<h;i++){			
			cbi = shape.r-(h-1)+i;
			if(cbi<0) continue;		
			if(shapes[shape.t][i][j]==1 && cb[cbi][cbj]==1) return;
		}
		shape.c += 1;
		shape.div.style.left = shape.c * SIZE + "px";
	}
}

function down_shape(){
	//can i down?
	var h = shapes[shape.t].length;
	var w = shapes[shape.t][0].length;
	var i, j;
	var cbi, cbj;
	var temp_div;
	var x, y;

		
	for(i=0;i<h;i++)//i=h-1,只测试最后一行不够
		for(j=0;j<w;j++){
			cbi = shape.r+1 - (h-1)+ i;
			cbj = shape.c + j;			
			if(cbi<0) break;		
			if(cbi==H || shapes[shape.t][i][j]==1 && cb[cbi][cbj]==1){
				cbi = shape.r;
				cbj = shape.c;
				for(i=0;i<h;i++)
					for(j=0;j<w;j++){
						if(shapes[shape.t][i][j]==1){
							x = cbi-(h-1)+i;
							if(x<0) {alert("game over"); clearInterval(III);return;}
							y = cbj+j;									
							cb[x][y]=1;
							temp_div = document.createElement('div');
							temp_div.style.width=SIZE + "px"; 
							temp_div.style.height=SIZE + "px";
							temp_div.style.backgroundColor = "#12345678";
							temp_div.style.position="absolute";
							temp_div.style.left=y*SIZE + "px"; 
							temp_div.style.bottom=(H-1-x)*SIZE + "px";
							temp_div.style.transition="all 0.2s";
							cb.appendChild(temp_div);		
						}
					}				
				cb.removeChild(shape.div);
				/*从当前行往上扫描，一行一行*/
				
				cancel_board(shape.r);

				shape = init_shape();
				cb.appendChild(shape.div);
				return;
			}
		}

	shape.r += 1;
	shape.div.style.bottom = (H-1-shape.r) * SIZE + "px";
	
}

function cancel_board(r){
	var i;
	
	for(i=r;i>=0;i--)
		if(! (cb[i].includes(0))) {
			console.log("canceling.");
			cancle_line(i);
			break;
		}

}

function cancle_line(r){
	var divs = document.querySelectorAll('#board div');
	console.log(divs.length);
	var t_divs = [];
	var s;
	var down;
	var n, p;
	var down_divs = [];

	divs.forEach(function(d){
		if(d.style.bottom == (H-1-r) * SIZE + "px")
			t_divs.push(d);
	});

	for(s in t_divs) cb.removeChild(t_divs[s]);
	console.log(divs.length);
	for(s=0;s<W;s++) cb[r][s]=0;

	//一列一列往下挪
	for(s=0;s<W;s++){
		//从消去行，往上找第一个方块
		for(n=r-1;n>-1;n--){
			if(cb[n][s])
				break;
		}
		if(n==-1) continue;

		//往下找第一个空位
		for(p=r+1;p<H;p++){
			if(cb[p][s])
				break;
		}
		p--;
		
		down_divs=[];
		divs.forEach(function(d){
			if(d.style.left == s * SIZE + "px" && parseInt(d.style.bottom)>=(H-1-n)*SIZE)
			down_divs.push(d);
		});

		down_divs.forEach(function(d){
			d.style.bottom = parseInt(d.style.bottom) - (p-n)* SIZE + "px";
		});	

		
		for(down=n; down>-1; down--){
			cb[down+(p-n)][s] = cb[down][s];
		}		
	}
	cancel_board(H-1);
}

function ctl_shape(e){
//	console.log(e);
	switch(e.keyCode){		
		case 37:
			left_shape();
			break;
		case 38:
			UP_shape_rotate();
			break;
		case 39:
			right_shape();
			break;
		case 40:
			down_shape();
			break;
	}
}

document.addEventListener('keydown', ctl_shape);
init_cb();
shape = init_shape();
cb.appendChild(shape.div);

var III = setInterval(down_shape, 1000);

setInterval(function(){
	var i,j;
	var str="";
	for(i=0;i<H;i++){
		for(j=0;j<W;j++){
			str += cb[i][j] + " ";
		}
		str+="<br>";
	}
	cb_data.innerHTML = str;
}, 1000);
