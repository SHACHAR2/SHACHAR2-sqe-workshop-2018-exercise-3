import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {bigFunc} from './drowGraph';
import {FirstparseCode} from './parser';
import * as viz from 'viz.js';

let evaluateCode;
let code;
let i;

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse =$('#codePlaceholder').val();
        let inputVector = $('#inputPlaceholder').val();
        code=sort(FirstparseCode(codeToParse));
        evaluateCode = sort(parseCode(codeToParse, inputVector));
        code=ColorCodeLines(code, evaluateCode);
        code=CangeRedToWhile(code);
        let temp=bigFunc(code);
        temp =addNumberToNoads(temp);
        document.getElementById('container').innerHTML= viz('digraph{'+temp+'}');

    });
});
function addNumberToNoads(code){
    let tempCode= code.split('\n');
    let i;
    for (i=0; i< tempCode.length;i++){
        if(tempCode[i].includes('label') && !tempCode[i].includes('->') ) {
            let tempLable = tempCode[i].split('label= "');
            tempCode[i] = tempLable[0] + 'label= "' + i + '\n' + tempLable[1];
        }
    }
    return ConnectAll(tempCode);

}

function ConnectAll(code){
    let i;
    let lines=code[0]+'\n';
    for (i=1; i<code.length; i++){
        lines= lines+ code[i]+ '\n';
    }
    return lines;
}
function ColorCodeLines(code, evaluateCode) {
    let color='Green';
    for(i=0; i<evaluateCode.length;i++) {
        if (evaluateCode[i].Color == 'Red') {
            code[i].Color=color;
            color='Red';
            continue;}
        if(evaluateCode[i].Type=='else') {
            color=changeColorIf(color, code ,i );
            continue;}
        if(needCahnge(code,i)) {
            code[i].Color=color;
            color='Green';
            continue;}
        code[i].Color=color;}
    return code;}

function needCahnge(code,i){
    if(evaluateCode[i].Name === '}') {
        if (i + 1 < code.length)
            if (evaluateCode[i + 1].Type == 'else')
                return false;
        return true;
    }
    return false;
}

function changeColorIf(color, code,i)
{
    if(color=='Red'){
        color='Green';
        code[i].Color=color;}
    else if(color=='Green'){
        color='Red';
        code[i].Color=color;
    }
    return color;
}

function sort(array)
{
    let i,j;
    for (i=0; i<array.length-1;i++)
    {
        j=i;
        while(array[j+1].Line<array[j].Line)
        {
            let temp = array[j];
            array[j]=array[j+1];
            array[j+1]=temp;
            j++;
            if(j==array.length-1) {
                break;
            }
        }
    }
    return array;
}

function CangeRedToWhile(code){
    let i;
    for(i=0; i<code.length; i++){
        if (code[i].Color == 'Red')
            code[i].Color='White';
    }
    return code;
}

