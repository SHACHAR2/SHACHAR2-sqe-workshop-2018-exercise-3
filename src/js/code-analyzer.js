import * as esprima from 'esprima';


let localParams={}; //array for the values of the local varibels
let tempLocals={}; // array to save values of local varibles if we insert into condition
let tempGlobals={}; //array to save values of gobals varibles if we insert into condition
let tokens=[]; // array of jason of the diffrent parts of the code
let globalVaribles={};
let input=[];
let inputIndex=[];
let startFunction;
let endFunction;
let tokenTypes= {
    'FunctionDeclaration': FunctionDecleration,
    'VariableDeclaration': VariableDeclaration,
    'WhileStatement':WhileStatement,
    'ExpressionStatement':ExpressionStatement,
    'BlockStatement':BlockStatement,
    'IfStatement':IfStatement,
    'ReturnStatement':ReturnStatement,
    'AssignmentExpression':AssignmentExpression,
    'UpdateExpression': UpdateExpression
};
let isElse;
let expressions={
    'BinaryExpression':BinaryExpression,
    'MemberExpression':ComputedMemberExpression,
    'Literal':Literal,
    'Identifier':IdentifierExp,
    'UnaryExpression': UnaryExpression,
    'AssignmentExpression':AssignmentExpression,
    'LogicalExpression':LogicalExpression,
    'ArrayExpression':ArrayExpression
};
const parseCode = (codeToParse,inputVector) => {
    let i;
    tokens=[];
    input=[];
    inputIndex={};
    tempGlobals={};
    tempGlobals={};
    isElse=false;
    globalVaribles={};
    startFunction=Number.NEGATIVE_INFINITY;
    endFunction=Number.POSITIVE_INFINITY;
    if(codeToParse.length==0 ) {
        tokens.push({'Line':'','Type':'','Name':'','Condition':'','Value':'', 'Color':''});
        return tokens;}
    Input(inputVector);
    //let parsedCode=esprima.parseScript(codeToParse,{ loc : true });
    let parsedCode=esprima.parseScript(codeToParse,{ loc: true });
    for(i=0;i<parsedCode.body.length;i++){
        tokenTypes[parsedCode.body[i].type](parsedCode.body[i]);}
    return tokens;};
// this function take the input vector and process it to array of strings
function Input (inputVector){
    let i=0;
    let temp= '';
    let count=
        0;
    let array=false;
    inputVector=inputVector.replace('(','');
    inputVector=inputVector.replace(')',',');
    for(i=0;i<inputVector.length;i++){
        if(inputVector[i] == '[')
            array=true;
        if(inputVector[i]== ']')
            array=false;
        if (inputVector[i] == ','  & !array) {
            input[count] = temp;
            count++;
            temp = '';
            continue;}
        temp=temp+inputVector[i];
    }}

function BlockStatement(code)
{
    let i;
    let blockStat = { 'Line':code.loc.start.line,'Type': 'Block statement' , 'Name': '{' , 'Condition':'' , 'Value':'', 'Color':''};
    tokens.push(blockStat);
    blockStat = { 'Line':code.loc.end.line,'Type': 'Block statement' , 'Name': '}' , 'Condition':'' , 'Value':'', 'Color':'' };
    tokens.push(blockStat);
    code=code.body;
    for(i=0 ; i<code.length;i++)
    {
        tokenTypes[code[i].type](code[i]);
    }
}

//const  FunctionDecleration= function(code) {
function FunctionDecleration(code){
    let i;
    startFunction=code.loc.start.line;
    endFunction=code.loc.end.line;
    let funcDecler = {'Line':code.loc.start.line , 'Type': 'function declaration' , 'Name': code.id.name + '(' , 'Condition':'' , 'Value':'', 'Color':''};
    for(i=0; i<code.params.length;i++)
    {
        //Identifier(code.params[i]);
        funcDecler['Name']=funcDecler['Name']+''+ code.params[i].name+'';
        if(i != code.params.length-1) {
            funcDecler['Name']=funcDecler['Name']+',';}
        let name=code.params[i].name;
        globalVaribles[name]=input[i];
        inputIndex[name]=i;}
    funcDecler['Name']=funcDecler['Name']+')';
    tokens.push(funcDecler);
    BlockStatement(code.body);
}

function VariableDeclaration (code){
    code=code.declarations;
    let i;
    for(i=0 ; i<code.length;i++) {
        let tempToken = {'Line': code[i].loc.start.line , 'Type': 'variable declaration' , 'Name': code[i].id.name , 'Condition':'', 'Value':'', 'Color':''};
        if(code[i].init==null)
        {
            tempToken.Value=null;
        }
        else
        {
            tempToken.Value=expressions[code[i].init.type](code[i].init, false);
        }
        tokens.push(tempToken);
        if(startFunction<code[i].loc.start.line & endFunction>code[i].loc.start.line & startFunction!=Number.NEGATIVE_INFINITY)
            localParams[tempToken.Name]=tempToken.Value;
        else
            globalVaribles[tempToken.Name]=tempToken.Value;
    }}

function ExpressionStatement(code)
{
    tokenTypes[code.expression.type](code.expression,false);

}
//check if expression contain local varible and replace it with its value

function AssignmentExpression (code,isName)
{
    let tempToken={'Line':code.loc.start.line, 'Type':'assignment expression','Name': expressions[code.left.type](code.left, true), 'Condition':'', 'Value':'', 'Color':''};
    tempToken.Value= expressions[code.right.type](code.right, isName);
    if(code.left.type=='MemberExpression')
    {
        assimentArray(tempToken);
    }
    if(tempToken.Name in localParams){
        localParams[tempToken.Name]=tempToken.Value;
    }
    if(tempToken.Name in globalVaribles){
        globalVaribles[tempToken.Name]=tempToken.Value;
    }
    tokens.push(tempToken);
}
function assimentArray(tempToken)
{
    let temp=tempToken.Name.split('[');
    let name=temp[0];
    let index=temp[1].split(']')[0];
    let array;
    if (name in localParams){
        array = eval(localParams[name]);
        array[eval(index)]=tempToken.Value;
        localParams[name]=array;
    }
    if(name in globalVaribles){
        array=eval(globalVaribles[name]);
        array[eval(index)]=tempToken.Value;
        globalVaribles[name]=array;
    }
}
function WhileStatement (code){
    let isName=false;
    let curTest=expressions[code.test.type](code.test, isName);
    let color=DeterminedColor(code);
    let tempToken={'Line':code.loc.start.line, 'Type': 'while statement','Name':'', 'Condition': curTest, 'Value':'', 'Color': color};
    tokens.push(tempToken);
    BlockStatement(code.body);
}

// function that define the test part of an expression
function BinaryExpression(code,isName)
{
    let expression;
    //let isName=false;
    let semiExpression=expressions[code.left.type](code.left,isName);
    if(doNeedBrakets(code.left)) {
        expression='('+semiExpression+')';}
    else {
        expression=expressions[code.left.type](code.left, isName);}
    expression=expression+' '+code.operator+' ';
    semiExpression=expressions[code.right.type](code.right, isName);
    if(doNeedBrakets(code.right)) {
        expression=expression+'('+semiExpression+')';}
    else {
        expression=expression+semiExpression;}
    return expression;
}
function doNeedBrakets(code)
{
    if(code.type=='MemberExpression' || code.type=='Literal' || code.type=='Identifier')
        return false;
    else
        return true;

}
function StrindExp(val)
{
    if (typeof val === 'string')
        val= '\''+val+'\'';
    return val;

}
//V[5],V[mid]

function ComputedMemberExpression(code, isName)
{
    let expression= code.object.name+'[';
    let middle=expressions[code.property.type](code.property , isName);
    if(middle == '.length' )
        return code.object.name+middle;
    expression=expression+''+middle;
    expression=expression+']';
    let middleValue=RealValue(middle);
    if(!isName){
        if (code.object.name in localParams) {
            let temp = eval(localParams[code.object.name]);
            let val= temp[eval(middle)];
            return val;}
        if (code.object.name in globalVaribles) {
            let temp = eval(globalVaribles[code.object.name]);
            let val2=temp[middleValue];
            val2=StrindExp(val2);
            return val2;}}
    return expression;}
function RealValue(code)
{
    let copy=code;
    copy=copy.replace('(',' ');
    copy=copy.replace(')',' ');
    // copy=copy.replace('*',' ');
    // copy=copy.replace('+',' ');
    // copy=copy.replace('/',' ');
    let names=[];
    names=copy.split(' ');
    let i;
    for(i=0;i<names.length;i++)
    {
        if(names[i] in globalVaribles)
            return globalVaribles[names[i]];
    }
    return eval(copy);
}
function IfStatement(code) {
    let curTest = expressions[code.test.type](code.test, false);
    let tokenName;

    if (isElse) {
        tokenName = 'else if statement';
        isElse = false;}
    else tokenName = 'if statement';
    let tempToken = {'Line': code.loc.start.line, 'Type': tokenName, 'Name': '','Condition': curTest,'Value': '','Color': ''};
    let color = DeterminedColor(tempToken);
    if (code.alternate != null) {
        Ifconsicquants(color,code);
    }
    else{consequent(color, code);}}
function Ifconsicquants(color, code)
{
    if (color == 'Red') {
        CopytoTemp();
        consequent(color, code);
        CopyfromTemp();
        alternate (color,code);
        CopyfromTemp(); }
    else{
        let localTemp= [];
        localTemp=Copy(localTemp, localParams);
        let globalTemp=[];
        globalTemp= Copy(globalTemp, globalVaribles);
        consequent(color, code);
        CopytoTemp();
        localParams=Copy(localParams, localTemp);
        globalVaribles=Copy(globalVaribles, globalTemp);
        alternate (color,code);
        CopyfromTemp(); }
}
function Copy(array1,array2)
{
    for(var key in array2)
    {
        array1[key]=array2[key];
    }
    return array1;
}

function alternate (color,code)
{
    if(code.alternate.type=='IfStatement')
        isElse=true;
    else{
        let tempToken={'Line':code.alternate.loc.start.line, 'Type':'else' ,'Name':'', 'Condition': '', 'Value':'', 'Color':''};
        tokens.push(tempToken);}
    tokenTypes[code.alternate.type](code.alternate);
}
function consequent(color,code)
{

    tokenTypes[code.consequent.type](code.consequent);

}
function DeterminedColor(tempToken)
{
    let curTest=Test(tempToken);
    for(var key in globalVaribles)
    {
        while ( curTest != curTest.replace(key,globalVaribles[key]))
            curTest=curTest.replace(key,globalVaribles[key]);
    }
    if (eval(curTest)==true) {
        tempToken.Color = 'Green';
    }
    else
        tempToken.Color='Red';
    if(IsItCondition(tempToken.Type))
        tokens.push(tempToken);
    return tempToken.Color;
}
function IsItCondition(type){
    if(type == 'if statement' || type == 'else if statement')
        return true;
    return false;
}
function Test(code){
    if (code.type == 'WhileStatement')
        return expressions[code.test.type](code.test, false);
    return code.Condition;

}

function CopytoTemp()
{
    tempLocals={};
    for(var key in localParams)
    {
        tempLocals[key]=localParams[key];
    }
    tempGlobals={};
    for(var key2 in globalVaribles)
    {
        tempGlobals[key2]=globalVaribles[key2];
    }
}
function CopyfromTemp()
{
    localParams={};
    for(var key in tempLocals)
    {
        localParams[key]=tempLocals[key];
    }
    globalVaribles={};
    for(var key2 in tempGlobals)
    {
        globalVaribles[key2]=tempGlobals[key2];
    }
}

function UnaryExpression(code, isName)
{
    if(code.prefix) {
        return code.operator+''+expressions[code.argument.type](code.argument, isName);}
    else
        return expressions[code.argument.type](code.argument, isName)+code.operator;
}

function Literal(code)
{
    let name=code.raw;
    return name;
}
function IdentifierExp(code, isName)
{

    let name=code.name;
    if(! isName){
        if(name == 'length')
            return '.length';
        if(name in localParams)
            return localParams[name];
    }
    return name;
}

function ReturnStatement(code)
{
    let tempToken={'Line':code.loc.start.line, 'Type':'return statement','Name':'','Condition':'', 'Value':'', 'Color':''};
    tempToken.Value=expressions[code.argument.type](code.argument,false);
    tokens.push(tempToken);
}

function UpdateExpression(code){
    let tempToken = {'Line': code.loc.start.line, 'Type':'update expression','Name':expressions[code.argument.type](code.argument,true),'Condition':'','Value':UnaryExpression(code,false), 'Color':''};
    tokens.push(tempToken);}

function LogicalExpression(code){
    let left=expressions[code.left.type](code.left,false);
    let right=expressions[code.right.type](code.right,false);
    if(code.operator=='&&') {
        return left+' && '+right;}
    else{return left+' || '+right;}
}

function ArrayExpression(code)
{
    let array='[';
    let i;
    for (i=0; i<code.elements.length;i++)
    {
        if(i==0)
            array=array+ expressions[code.elements[0].type](code.elements[i],false);
        else
            array=array+', '+ expressions[code.elements[0].type](code.elements[i],false);
    }
    array=array+']';
    return array;
}

export {parseCode,tokens};
