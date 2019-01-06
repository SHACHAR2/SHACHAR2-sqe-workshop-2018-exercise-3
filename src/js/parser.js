import * as esprima from 'esprima';



let tokens=[]; // array of jason of the diffrent parts of the code
let tokenTypes= {
    'FunctionDeclaration': FunctionDecleration,
    'VariableDeclaration': VariableDeclaration,
    'WhileStatement':WhileStatement,
    'ExpressionStatement':ExpressionStatement,
    'BlockStatement':BlockStatement,
    'IfStatement':IfStatement,
    'ReturnStatement':ReturnStatement,
    'AssignmentExpression':AssignmentExpression,
    'UpdateExpression': UpdateExpression,
    'DoWhileStatement':DoWhileStatement
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
const FirstparseCode = (codeToParse) => {
    let i;
    tokens=[];
    isElse=false;
    //if(codeToParse==''|| codeToParse.length==0 ) {
    if(codeToParse.length==0 ) {
        tokens.push({'Line':'','Type':'','Name':'','Condition':'','Value':''});
        return tokens;}
    let parsedCode=esprima.parseScript(codeToParse,{ loc : true });
    for(i=0;i<parsedCode.body.length;i++){
        tokenTypes[parsedCode.body[i].type](parsedCode.body[i]);}
    return tokens;

};

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
    let funcDecler = {'Line':code.loc.start.line , 'Type': 'function declaration' , 'Name': code.id.name , 'Condition':'' , 'Value':''};
    tokens.push(funcDecler);
    BlockStatement(code.body);
}

function VariableDeclaration (code){
    code=code.declarations;
    let i ;
    for(i=0 ; i<code.length;i++) {
        let tempToken = {'Line': code[i].loc.start.line , 'Type': 'variable declaration' , 'Name': code[i].id.name , 'Condition':'', 'Value':''};
        if(code[i].init==null)
        {
            tempToken.Value=null;
        }
        else
        {
            tempToken.Value=expressions[code[i].init.type](code[i].init);
        }
        tokens.push(tempToken);
    }
}
function ExpressionStatement(code)
{
    tokenTypes[code.expression.type](code.expression);

}
function AssignmentExpression (code)
{
    let tempToken={'Line':code.loc.start.line, 'Type':'assignment expression','Name': expressions[code.left.type](code.left), 'Condition':'', 'Value':''};
    tempToken.Value= expressions[code.right.type](code.right);
    tokens.push(tempToken);
}
function WhileStatement (code){
    let curTest=expressions[code.test.type](code.test);
    let tempToken={'Line':code.loc.start.line, 'Type': 'while statement','Name':'', 'Condition': curTest, 'Value':'', 'End': code.loc.end.line};
    tokens.push(tempToken);
    BlockStatement(code.body);
}

// function that define the test part of an expression
function BinaryExpression(code)
{
    let expression;
    let semiExpression=expressions[code.left.type](code.left);
    if(doNeedBrakets(code.left)) {
        expression='('+semiExpression+')';}
    else {
        expression=expressions[code.left.type](code.left);}
    expression=expression+' '+code.operator+' ';
    semiExpression=expressions[code.right.type](code.right);
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
//V[5],V[mid]
function ComputedMemberExpression(code)
{

    let expression= code.object.name+'[';
    expression=expression+''+expressions[code.property.type](code.property);
    expression=expression+']';
    return expression;
}

function IfStatement(code) {
    let curTest = expressions[code.test.type](code.test);
    let tokenName;
    let alternate= code.alternate!=null;
    if (isElse) {
        tokenName = 'else if statement';
        isElse = false;}
    else
        tokenName = 'if statement';
    let tempToken = {'Line': code.loc.start.line, 'Type': tokenName, 'Name': '', 'Condition': curTest, 'Value': '','End': code.loc.end.line, 'Alternate' : alternate};
    tokens.push(tempToken);
    tokenTypes[code.consequent.type](code.consequent);
    if (code.alternate != null) {
        if (code.alternate.type == 'IfStatement')
            isElse = true;
        else {
            let tempToken = {
                'Line': code.alternate.loc.start.line,'Type': 'else', 'Name': '', 'Condition': '', 'Value': '', 'Color': ''};
            tokens.push(tempToken);}
        tokenTypes[code.alternate.type](code.alternate);}}
function UnaryExpression(code)
{
    if(code.prefix) {
        return code.operator+''+expressions[code.argument.type](code.argument);}
    else
        return expressions[code.argument.type](code.argument)+code.operator;
}

function Literal(code)
{

    return code.raw;
}
function IdentifierExp(code)
{

    return code.name;
}

function ReturnStatement(code)
{
    let tempToken={'Line':code.loc.start.line, 'Type':'return statement','Name':'','Condition':'', 'Value':''};
    tempToken.Value=expressions[code.argument.type](code.argument);
    tokens.push(tempToken);
}
function UpdateExpression(code){
    let tempToken = {'Line': code.loc.start.line, 'Type':'update expression','Name':expressions[code.argument.type](code.argument),'Condition':'','Value':UnaryExpression(code)};
    tokens.push(tempToken);}

function LogicalExpression(code){
    let left=expressions[code.left.type](code.left);
    let right=expressions[code.right.type](code.right);
    if(code.operator=='&&') {
        return left+' and '+right;}
    else{return left+' or '+right;}
}

function DoWhileStatement(code){
    let curTest=expressions[code.test.type](code.test);
    let tempToken={'Line':code.loc.start.line, 'Type': 'Do-while statement','Name':'', 'Condition': curTest, 'Value':''};
    tokens.push(tempToken);
    BlockStatement(code.body);

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
export {FirstparseCode,tokens};
