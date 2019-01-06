
let graph;
let lines;
let count;
let code;
let connections;
let ifs;
let whiles;
let insideIf;
let v;
let endIfs;
let fewIfs;
let endIfsLines;
let lineTypes= {
    'function declaration': FunctionDeceleration,
    'else if statement':IfStatement,
    'if statement':IfStatement,
    'else':Else,
    'Block statement':BlockStatement,
    'return statement':ReturnStatement,
    'assignment expression':Expression,
    'variable declaration': Expression,
    'while statement': WhileStatement,
    'update expression':Expression
};

const bigFunc=(parsed)=> {
    count=0;
    lines='';
    let i=0;
    ifs=[];
    connections='';
    code=parsed;
    whiles=[];
    graph='';
    insideIf=false;
    endIfs=[];
    fewIfs=false;
    endIfsLines=[];
    lineTypes[code[i].Type](i,code);
    graph=lines+connections;
    return graph;
};

function FunctionDeceleration(i,code){
    lineTypes[code[i+1].Type](i+1,code);
}

function IfStatement(i,code){
    InsetToEndIfs(i,code);
    fewIfs=insideIf&&true;
    insideIf=true;
    if(code[i].Type == 'else if statement') {
        connections= connections +'n'+ ifs[ifs.length-1]+ ' -> n'+(count)+ ' [label = "F" ] \n';
        ifs.pop();
        ifs.push(count);}
    ifs.push(count);
    lines = lines + 'n'+count+' '+'[ '+'label= '+ '"'+ code[i].Condition+'" , shape= "diamond" , style =  filled  ,  fillcolor= '+ code[i].Color.toLowerCase() + ' ]' + '\n';
    if(code[i+2].Name != '}')
        connections= connections +'n'+ count+ ' -> n'+(count+1)+ ' [label = "T" ] \n';
    count++;
    lineTypes[code[i+1].Type](i+1,code);
}

function InsetToEndIfs(i,code){
    if(code[i].Alternate)
        endIfsLines.push(code[i].End);
}



function BlockStatement(i,code) {
    if (i + 1 < code.length) {
        if (code[i].Name == '}') {
            if (code[i].Line===endIfsLines[endIfsLines.length-1]) {
                endIfsLines.pop();
                lines = lines + 'n' + count + ' ' + '[ ' + 'label= ' + '"" , shape= "circle" , style =  filled  ,  fillcolor= green  ]' + '\n';
                connectionEmptyCircle();
                let j;
                for(j=0;j<endIfs.length;j++) {
                    connections = connections + 'n' + endIfs[j] + ' -> n' + count + ' [] \n';}
                endIfs=[];
                count++;
                insideIf = false;
                ifs = [];}
            fewIf();
            endWhile(i,code);
        }
        lineTypes[code[i + 1].Type](i + 1, code);}}

function connectionEmptyCircle(){
    //if(!(whiles.length>0 &&code[i].Line == whiles[whiles.length-1].End) && i+1!=code.length && i+2!=code.length)
    // {
    connections = connections + 'n' + count + ' -> n' + (count + 1) + ' [label = "" ] \n';
    // }
}
function fewIf(){
    if(fewIfs) {
        fewIfs=false;
        ifs.pop();}
}
function endWhile(i,code)
{
    if(whiles.length>0)
    {
        if (code[i].Line == whiles[whiles.length-1].End)
        {
            if(i+2 < code.length)
                connections = connections + 'n' + (whiles[whiles.length-1].count+1) + ' -> n' + (count) + ' [label = "F" ] \n';
            connections = connections + 'n' + +(count-1) + ' -> n' + whiles[whiles.length-1].count + ' [label = "" ] \n';
            whiles.pop();
        }
    }
}

function Expression(i,code)
{
    let lable=CreatLable(i,code);
    while(i+1<code.length && (NeedToConcatLables(i,code)))
    {
        i=i+1;
        lable=lable+CreatLable(i,code);}
    lines = lines + 'n'+count+' '+'[ '+'label= '+ '"'+ lable+'" , shape= "box" , style =  filled  ,  fillcolor= '+ code[i].Color.toLowerCase() + ' ]' + '\n';
    AddConnections(i,code);
    count=count+1;
    lineTypes[code[i + 1].Type](i + 1, code);
}
function CreatLable(i,code){
    let lable;
    if(code[i].Type=='update expression'){
        lable=code[i].Value+'\n';
        return lable;
    }
    if(code[i].Value == null){
        lable= code[i].Name+ '\n';
    }
    else
    {
        lable= code[i].Name + '= '+code[i].Value+'\n';
    }
    return lable;
}
function NeedToConcatLables(i,code)
{
    if( code[i+1].Type=== 'assignment expression' || code[i+1].Type==='variable declaration'||code[i+1].Type=='update expression' )
        return true;
    return false;
}
function AddConnections(i,code){
    if(insideIf && code[i+1].Name == '}'){
        //if(!NeedToConcatLables(i,code))
        endIfs.push(count);
        return;
    }
    if(AddConnectionToExpression(i,code) )
        connections= connections +'n'+ count+ ' -> n'+(count+1)+ ' [label = "" ] \n';
}
function AddConnectionToExpression(i,code){
    return !(code[i+1].Name == '}' && i+2==code.length) && (whiles.length==0 || code[i+1].Name!='}');
}



function ReturnStatement(i, code)
{
    lines = lines + 'n'+count+' '+'[ '+'label= '+ '" return'+ code[i].Value+'" , shape= "box" , style =  filled  ,  fillcolor= '+ code[i].Color.toLowerCase() + ' ]' + '\n';
    if(!(code[i+1].Name == '}' && i+2==code.length) )
        connections= connections +'n'+ count+ ' -> n'+(count+1)+ ' [label = "" ] \n';
    count++;
    lineTypes[code[i + 1].Type](i + 1, code);
}

function Else(i,code){
    connections= connections +'n'+ ifs[ifs.length-1]+ ' -> n'+(count)+ ' [label = "F" ] \n';
    ifs.pop();
    lineTypes[code[i + 1].Type](i + 1, code);
}

function WhileStatement(i, code){
    whiles.push({'count':count, 'End': code[i].End});
    lines = lines + 'n'+count+' '+'[ '+'label= '+ '"NULL" , shape= "box" , style =  filled  ,  fillcolor= '+ code[i].Color.toLowerCase() + ' ]' + '\n';
    connections= connections +'n'+ count+ ' -> n'+(count+1)+ ' [label = "" ] \n';
    count++;
    lines = lines + 'n'+count+' '+'[ '+'label= '+ '"'+ code[i].Condition+'" , shape= "diamond" , style =  filled  ,  fillcolor= '+ code[i].Color.toLowerCase() + ' ]' + '\n';
    if(!IsEnd(i+1 , code)){
        connections= connections +'n'+ count+ ' -> n'+(count+1)+ ' [label = "T" ] \n';
    }
    count++;
    lineTypes[code[i + 1].Type](i + 1, code);
}
//check if all the next lines is just {,}
function IsEnd(i, code){
    while (i< code.length){
        if(code[i].Type!='Block statement')
            return false;
        i++;
    }
    return true;
}
export {bigFunc,v};