import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {bigFunc} from '../src/js/drowGraph';
//import {describe} from 'nyc';



describe('The javascript parser', () => {

    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '[{"Line":"","Type":"","Name":"","Condition":"","Value":"","Color":""}]'
        );

    });
});
describe('The javascript parser', () => {
    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;', '(1)')),
            '[{"Line":1,"Type":"variable declaration","Name":"a","Condition":"","Value":"1","Color":""}]'
        );
    });
});

describe('The javascript parser', () => {
    it('is empty function without varibles correctly ', () => {
        assert.equal(
            JSON.stringify(parseCode('function binarySearch(x){}','(1)')),
            '[{"Line":1,"Type":"function declaration","Name":"binarySearch(x)","Condition":"","Value":"","Color":""},{"Line":1,"Type":"Block statement","Name":"{","Condition":"","Value":"","Color":""},' +
            '{"Line":1,"Type":"Block statement","Name":"}","Condition":"","Value":"","Color":""}]'
        );
    });
});

describe('The javascript parser', () => {
    it('is empty function without varibles correctly ', () => {
        assert.equal(
            JSON.stringify(parseCode('function binarySearch(x){}','([1,2,3])')),
            '[{"Line":1,"Type":"function declaration","Name":"binarySearch(x)","Condition":"","Value":"","Color":""},{"Line":1,"Type":"Block statement","Name":"{","Condition":"","Value":"","Color":""},' +
            '{"Line":1,"Type":"Block statement","Name":"}","Condition":"","Value":"","Color":""}]'
        );
    });
});


describe('The javascript parser', () => {
    it('is empty function with variables correctly ', () => {
        assert.equal(
            JSON.stringify(parseCode('function foo(x, y, z){\n' +
                'let a = x + 1;\n' +
                '    let b = a + y;\n' +
                '    let c = 0;\n' +
                '    if (b < z) {\n' +
                '        c = c + 5;\n' +
                '        return x + y + z + c;\n' +
                '    }} \n', '(1,2,3)')),
            '[{"Line":1,"Type":"function declaration","Name":"foo(x,y,z)","Condition":"","Value":"","Color":""},{"Line":1,"Type":"Block statement","Name":"{","Condition":"","Value":"","Color":""},{"Line":8,"Type":"Block statement","Name":"}","Condition":"","Value":"","Color":""},' +
            '{"Line":2,"Type":"variable declaration","Name":"a","Condition":"","Value":"x + 1","Color":""},{"Line":3,"Type":"variable declaration","Name":"b","Condition":"","Value":"x + 1 + y","Color":""},' +
            '{"Line":4,"Type":"variable declaration","Name":"c","Condition":"","Value":"0","Color":""},{"Line":5,"Type":"if statement","Name":"","Condition":"x + 1 + y < z","Value":"","Color":"Red"},' +
            '{"Line":5,"Type":"Block statement","Name":"{","Condition":"","Value":"","Color":""},{"Line":8,"Type":"Block statement","Name":"}","Condition":"","Value":"","Color":""},{"Line":6,"Type":"assignment expression","Name":"c","Condition":"","Value":"0 + 5","Color":""},' +
            '{"Line":7,"Type":"return statement","Name":"","Condition":"","Value":"((x + y) + z) + 0 + 5","Color":""}]'
        );
    });
});


describe('The javascript parser', () => {
    it('is parsing a simple variable declaration with no value correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a;\n' +
                'function foo(x,y,z){}','(1,2,3)')),
            '[{"Line":1,"Type":"variable declaration","Name":"a","Condition":"","Value":null,"Color":""},{"Line":2,"Type":"function declaration","Name":"foo(x,y,z)","Condition":"","Value":"","Color":""},'+
        '{"Line":2,"Type":"Block statement","Name":"{","Condition":"","Value":"","Color":""},{"Line":2,"Type":"Block statement","Name":"}","Condition":"","Value":"","Color":""}]'
        );
    });});


describe('The javascript parser', () => {
    it('is parsing a simple assigment expression correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function foo(x,y,z) {\n' +
                'let a=0;\n'+
                'a=x+5}','(1,2,3)')),
            '[{"Line":1,"Type":"function declaration","Name":"foo(x,y,z)","Condition":"","Value":"","Color":""},{"Line":1,"Type":"Block statement","Name":"{","Condition"'+
            ':"","Value":"","Color":""},{"Line":3,"Type":"Block statement","Name":"}","Condition":"","Value":"","Color":""},{"Line":2,"Type":"variable declaration","Name":"a","Con'+
            'dition":"","Value":"0","Color":""},{"Line":3,"Type":"assignment expression","Name":"a","Condition":"","Value":"x + 5","Color":""}]');
    });
});

describe('The javascript parser', () => {
    it('is parsing a assigment expression to local and global varibles correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function foo(x,y,z) {\n' +
                'let a=0;\n'+
                'a=5\n'+
                'x=a}','(1,2,3)')),
            '[{"Line":1,"Type":"function declaration","Name":"foo(x,y,z)","Condition":"","Value":"","Color":""},{"Line":1,"Type":"Block statement","Name":"{","Condition"'+
            ':"","Value":"","Color":""},{"Line":4,"Type":"Block statement","Name":"}","Condition":"","Value":"","Color":""},{"Line":2,"Type":"variable declaration","Name":"a","Con'+
            'dition":"","Value":"0","Color":""},{"Line":3,"Type":"assignment expression","Name":"a","Condition":"","Value":"5","Color":""},{"Line":4,"Type":"assignment expression","N'+
            'ame":"x","Condition":"","Value":"5","Color":""}]');
    });
});

describe('The javascript parser', () => {
    it('is parsing a simple while statement with no value correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('while(true){}','(5)')),
            '[{"Line":1,"Type":"while statement","Name":"","Condition":"true","Value":"","Color":"Green"},{"Line":1,"Type":"Block statement","Name":"{","Condition":"","Value":"","Color":""}'+
            ',{"Line":1,"Type":"Block statement","Name":"}","Condition":"","Value":"","Color":""}]'
        );
    });
});

describe('The javascript parser', () => {
    it('is parsing a simple while statement with binary expression in the condition and block statment with two lines correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a=(5+5)*(4+5)','(5)')),
            '[{"Line":1,"Type":"variable declaration","Name":"a","Condition":"","Value":"(5 + 5) * (4 + 5)","Color":""}]'
        );
    });
});
describe('The javascript parser', () => {
    it('is parsing a simple if statment correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('if(2==2){}','(2)')),
            '[{"Line":1,"Type":"if statement","Name":"","Condition":"2 == 2","Value":"","Color":"Green"},'+
            '{"Line":1,"Type":"Block statement","Name":"{","Condition":"","Value":"","Color":""}'+
            ',{"Line":1,"Type":"Block statement","Name":"}","Condition":"","Value":"","Color":""}]'
        );
    });
});
describe('The javascript parser', () => {
    it('is parsing a else if statment correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('if(2==2){\n' +
                    'let a=mid[5]+1;}\n' +
                    'else if(7<5){\n' +
                    'let i=0;}','(2)')),
            '[{"Line":1,"Type":"if statement","Name":"","Condition":"2 == 2","Value":"","Color":"Green"},' +
            '{"Line":1,"Type":"Block statement","Name":"{","Condition":"","Value":"","Color":""},'+
            '{"Line":2,"Type":"Block statement","Name":"}","Condition":"","Value":"","Color":""},'+
            '{"Line":2,"Type":"variable declaration","Name":"a","Condition":"","Value":"mid[5] + 1","Color":""},' +
            '{"Line":3,"Type":"else if statement","Name":"","Condition":"7 < 5","Value":"","Color":"Red"},' +
            '{"Line":3,"Type":"Block statement","Name":"{","Condition":"","Value":"","Color":""},'+
            '{"Line":4,"Type":"Block statement","Name":"}","Condition":"","Value":"","Color":""},' +
            '{"Line":4,"Type":"variable declaration","Name":"i","Condition":"","Value":"0","Color":""}]'
        );
    });
});
describe('The javascript parser', () => {
    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = null;', '(1)')),
            '[{"Line":1,"Type":"variable declaration","Name":"a","Condition":"","Value":"null","Color":""}]'
        );
    });
});

describe('The javascript parser', () => {
    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = -1;', '(1)')),
            '[{"Line":1,"Type":"variable declaration","Name":"a","Condition":"","Value":"-1","Color":""}]'
        );
    });
});
describe('The javascript parser', () => {
    it('is parsing a simple if statment correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('if((2==2) && (3==3)){}','(2)')),
            '[{"Line":1,"Type":"if statement","Name":"","Condition":"2 == 2 && 3 == 3","Value":"","Color":"Green"},' +
            '{"Line":1,"Type":"Block statement","Name":"{","Condition":"","Value":"","Color":""},' +
            '{"Line":1,"Type":"Block statement","Name":"}","Condition":"","Value":"","Color":""}]'
        );
    });
});
describe('The javascript parser', () => {
    it('is parsing a simple if statment correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('if((2==2) || (3==3)){}','(2)')),
            '[{"Line":1,"Type":"if statement","Name":"","Condition":"2 == 2 || 3 == 3","Value":"","Color":"Green"},' +
                '{"Line":1,"Type":"Block statement","Name":"{","Condition":"","Value":"","Color":""},' +
                '{"Line":1,"Type":"Block statement","Name":"}","Condition":"","Value":"","Color":""}]'
        );
    });
});


describe('The javascript parser', () => {
    it('is parsing a assigment expression to local and global varibles correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function foo(x,y,z) {\n' +
                'let a=0;\n'+
                'a=\'king\'\n'+
                'if(a == x[0]){\n' +
                '    return y + x * 2\n' +
                '  }}','([\'nir\',1,2],2,3)')).replace(/\s/g,''),
            ('[{"Line":1,"Type":"function declaration","Name":"foo(x,y,z)","Condition":"","Value":"","Color":""},{"Line":1,"Type":"Block statement","Name":"{","Condition"'+
            ':"","Value":"","Color":""},{"Line":6,"Type":"Block statement","Name":"}","Condition":"","Value":"","Color":""},{"Line":2,"Type":"variable declaration","Name":"a","Con'+
            'dition":"","Value":"0","Color":""},{"Line":3,"Type":"assignment expression","Name":"a","Condition":"","Value":"\'king\'","Color":""},{"Line":4,"Type":"if statement","Name'+
        '":"","Condition":"\'king\' == \'nir\'","Value":"","Color":"Red"},{"Line":4,"Type":"Block statement","Name":"{","Condition":"","Value":"","Color":""},{"Line":6,"Type":"Block'+
        'statement","Name":"}","Condition":"","Value":"","Color":""},{"Line":5,"Type":"return statement","Name":"","Condition":"","Value":"y + (x * 2)","Color":""}]').replace(/\s/g,''));
    });
});

describe('The javascript parser', () => {
    it('is parsing a assigment expression to local and global varibles correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function foo(x,y,z) {\n' +
                'let a=5;\n'+
                'return a}','(1,2,3)')),
            '[{"Line":1,"Type":"function declaration","Name":"foo(x,y,z)","Condition":"","Value":"","Color":""},{"Line":1,"Type":"Block statement","Name":"{","Condition"'+
    ':"","Value":"","Color":""},{"Line":3,"Type":"Block statement","Name":"}","Condition":"","Value":"","Color":""},{"Line":2,"Type":"variable declaration","Name":"a","Con'+
        'dition":"","Value":"5","Color":""},{"Line":3,"Type":"return statement","Name":"","Condition":"","Value":"5","Color":""}]');
    });
});

describe('The javascript parser', () => {
    it('is parsing a assigment expression to local and global varibles correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function foo(x,y,z) {\n' +
                'let a=5;\n' +
                'a++;\n'+
                'return a}','(1,2,3)')),
            '[{"Line":1,"Type":"function declaration","Name":"foo(x,y,z)","Condition":"","Value":"","Color":""},{"Line":1,"Type":"Block statement","Name":"{","Condition"'+
            ':"","Value":"","Color":""},{"Line":4,"Type":"Block statement","Name":"}","Condition":"","Value":"","Color":""},{"Line":2,"Type":"variable declaration","Name":"a","Con'+
            'dition":"","Value":"5","Color":""},{"Line":3,"Type":"update expression","Name":"a","Condition":"","Value":"5++","Color":""},{"Line":4,"Type":"return statement","Name":'+
            '"","Condition":"","Value":"5","Color":""}]');
    });
});

describe('The javascript parser', () => {
    it('is parsing a assigment expression to local and global varibles correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function foo(x,y,z) {\n' +
                'let a=5;\n' +
                'let b =2;\n'+
                'if(b>a)\n'+
                '{'+
                'a=-1;\n'+
                 '}\n'+
                'return a}','(1,2,3)')),
            '[{"Line":1,"Type":"function declaration","Name":"foo(x,y,z)","Condition":"","Value":"","Color":""},{"Line":1,"Type":"Block statement","Name":"{","Condition"'+
            ':"","Value":"","Color":""},{"Line":7,"Type":"Block statement","Name":"}","Condition":"","Value":"","Color":""},{"Line":2,"Type":"variable declaration","Name":"a","Con'+
            'dition":"","Value":"5","Color":""},{"Line":3,"Type":"variable declaration","Name":"b","Condition":"","Value":"2","Color":""},{"Line":4,"Type":"if statement","Name":""'+
            ',"Condition":"2 > 5","Value":"","Color":"Red"},{"Line":5,"Type":"Block statement","Name":"{","Condition":"","Value":"","Color":""},{"Line":6,"Type":"Block statement","N'+
            'ame":"}","Condition":"","Value":"","Color":""},{"Line":5,"Type":"assignment expression","Name":"a","Condition":"","Value":"-1","Color":""},{"Line":7,"Type":"return sta'+
            'tement","Name":"","Condition":"","Value":"-1","Color":""}]');
    });
});

describe('The javascript parser', () => {
    it('is parsing a assigment expression to local and global varibles correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function foo(x,y,z) {\n' +
                'if(x>y){\n'+
                'let a= x+y+5;\n'+
                '}\n'+
                'else {\n'+
                 'let b=x*z;\n'+
                  '}\n'+
                'a++;\n'+
                'return a}','(1,2,3)')),
            '[{"Line":1,"Type":"function declaration","Name":"foo(x,y,z)","Condition":"","Value":"","Color":""},{"Line":1,"Type":"Block statement","Name":"{","Condition"'+
            ':"","Value":"","Color":""},{"Line":9,"Type":"Block statement","Name":"}","Condition":"","Value":"","Color":""},{"Line":2,"Type":"if statement","Name":"","Condition":'+
            '"x > y","Value":"","Color":"Red"},{"Line":2,"Type":"Block statement","Name":"{","Condition":"","Value":"","Color":""},{"Line":4,"Type":"Block statement","Name":"}","C'+
            'ondition":"","Value":"","Color":""},{"Line":3,"Type":"variable declaration","Name":"a","Condition":"","Value":"(x + y) + 5","Color":""},{"Line":5,"Type":"else","Name":'+
            '"","Condition":"","Value":"","Color":""},{"Line":5,"Type":"Block statement","Name":"{","Condition":"","Value":"","Color":""},{"Line":7,"Type":"Block statement","Name"'+
            ':"}","Condition":"","Value":"","Color":""},{"Line":6,"Type":"variable declaration","Name":"b","Condition":"","Value":"x * z","Color":""},{"Line":8,"Type":"update expres'+
            'sion","Name":"a","Condition":"","Value":"-1++","Color":""},{"Line":9,"Type":"return statement","Name":"","Condition":"","Value":"-1","Color":""}]');});
});

describe('The javascript parser', () => {
    it('is parsing a assigment expression to local and global varibles correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function foo(x,y,z) {\n' +
                'let a=[\'nir\',1,2];\n'+
                'a[1]=0}','([\'nir\'],2,3)')),
            '[{"Line":1,"Type":"function declaration","Name":"foo(x,y,z)","Condition":"","Value":"","Color":""},'+
            '{"Line":1,"Type":"Block statement","Name":"{","Condition":"","Value":"","Color":""},'+
            '{"Line":3,"Type":"Block statement","Name":"}","Condition":"","Value":"","Color":""},'+
            '{"Line":2,"Type":"variable declaration","Name":"a","Condition":"","Value":"[\'nir\', 1, 2]","Color":""},'+
        '{"Line":3,"Type":"assignment expression","Name":"a[1]","Condition":"","Value":"0","Color":""}]');
    });
});

describe('The javascript parser', () => {
    it('is parsing a simple if statment correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function foo(x,y){\n' +
                'let a=[1,2,3];\n' +
                'a[0]=x[1+x[y]];\n' +
                'return a[0];}'
                , '([1,2,3],0)')),
            '[{"Line":1,"Type":"function declaration","Name":"foo(x,y)","Condition":"","Value":"","Color":""},{"Line":1,"Type":"Block statement","Name":"{","Condition":"","Value":"","Color":""},{"Line":4,"Type"'+
        ':"Block statement","Name":"}","Condition":"","Value":"","Color":""},{"Line":2,"Type":"variable declaration","Name":"a","Condition":"","Value":"[1, 2, 3]","Color":""},{"Line":3,"Type":"assignment expression","Name":"'+
            'a[0]","Condition":"","Value":3,"Color":""},{"Line":4,"Type":"return statement","Name":"","Condition":"","Value":3,"Color":""}]'
        );
    });
});

describe('The javascript parser', () => {
    it('is parsing a simple if statment correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function foo(x,y,z)\n' +
                '{\n' +
                'let c;\n' +
                'if(x.length == 3 && y== \'hello\') \n' +
                '{}\n' +
                '}','([1,2,3], \'hello\' ,1)')),
            '[{"Line":1,"Type":"function declaration","Name":"foo(x,y,z)","Condition":"","Value":"","Color":""},'+
            '{"Line":2,"Type":"Block statement","Name":"{","Condition":"","Value":"","Color":""},'+
            '{"Line":6,"Type":"Block statement","Name":"}","Condition":"","Value":"","Color":""},'+
            '{"Line":3,"Type":"variable declaration","Name":"c","Condition":"","Value":null,"Color":""},'+
            '{"Line":4,"Type":"if statement","Name":"","Condition":"x.length == 3 && y == \'hello\'","Value":"","Color":"Green"},'+
            '{"Line":5,"Type":"Block statement","Name":"{","Condition":"","Value":"","Color":""},'+
            '{"Line":5,"Type":"Block statement","Name":"}","Condition":"","Value":"","Color":""}]'
        );
    });
});


describe('The javascript parser', () => {
    it('is parsing a simple if statment correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function foo(x){\n' +
                'let a=[1,2,3];\n' +
                'let b=1;\n' +
                'a[0]=x[b+x[0]];\n' +
                'return a[0];}'
                , '([1,2,3])')), '[{"Line":1,"Type":"function declaration","Name":"foo(x)","Condition":"","Value":"","Color":""},' +
            '{"Line":1,"Type":"Block statement","Name":"{","Condition":"","Value":"","Color":""},' +
            '{"Line":5,"Type":"Block statement","Name":"}","Condition":"","Value":"","Color":""},' +
            '{"Line":2,"Type":"variable declaration","Name":"a","Condition":"","Value":"[1, 2, 3]","Color":""},' +
            '{"Line":3,"Type":"variable declaration","Name":"b","Condition":"","Value":"1","Color":""},' +
            '{"Line":4,"Type":"assignment expression","Name":"a[0]","Condition":"","Value":3,"Color":""},' +
            '{"Line":5,"Type":"return statement","Name":"","Condition":"","Value":3,"Color":""}]'
        );
    });
});

describe('The javascript parser', () => {
    it('is parsing a simple if statment correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function foo(x){\n' +
                'let a=[1,2,3];\n' +
                'let b=1;\n' +
                'x[0]=x[b+x[0]];\n' +
                'return a[0];}'
                , '([1,2,3])')),
            '[{"Line":1,"Type":"function declaration","Name":"foo(x)","Condition":"","Value":"","Color":""},' +
            '{"Line":1,"Type":"Block statement","Name":"{","Condition":"","Value":"","Color":""},' +
            '{"Line":5,"Type":"Block statement","Name":"}","Condition":"","Value":"","Color":""},' +
            '{"Line":2,"Type":"variable declaration","Name":"a","Condition":"","Value":"[1, 2, 3]","Color":""},' +
            '{"Line":3,"Type":"variable declaration","Name":"b","Condition":"","Value":"1","Color":""},' +
            '{"Line":4,"Type":"assignment expression","Name":"x[0]","Condition":"","Value":3,"Color":""},' +
            '{"Line":5,"Type":"return statement","Name":"","Condition":"","Value":1,"Color":""}]'
        );
    });
});

describe('The javascript parser', () => {

    let code=[];
    code= [{'Line':1,'Type':'function declaration','Name':'foo(x,y,z)','Condition':'','Value':'','Color':'green'},
        {'Line':1,'Type':'Block statement','Name':'{','Condition':'','Value':'','Color':'green'},
        {'Line':2,'Type':'variable declaration','Name':'b','Condition':'','Value':'2','Color':'green'},
        {'Line':3,'Type':'assignment expression','Name':'a','Condition':'','Value':'1','Color':'green'},
        {'Line':3,'Type':'Block statement','Name':'}','Condition':'','Value':'','Color':'green'}];
    it('is parsing an empty function correctly', () => {
        assert.equal(bigFunc(code),'n0 [ label= "b= 2\na= 1\n" , shape= "box" , style =  filled  ,  fillcolor= green ]\n');
    });
});

describe('The javascript parser', () => {

    let code = [];
    code=parserCode();
    it('is parsing an If correctly', () => {
        assert.equal (bigFunc(code).replace(/\s/g,'') ,('n0[label="a=x+1b=a+yc=0",shape="box",style=filled,fillcolor=green]n1[label="b<z",shape="diamond",style=filled,fillcolor=green]n2[label="c=c+5",shape="box",style=filled,fillcolor='+
        'white]n3[label="b<(z*2)",shape="diamond",style=filled,fillcolor=red]n4[label="c=(c+x)+5",shape="box",style=filled,fillcolor=green]n5[label="c=(c+z)+5",shape="box",style=filled,fillcolor=red]n6[labe'+
        'l="returnc",shape="box",style=filled,fillcolor=green]n0->n1[label=""]n1->n2[label="T"]n1->n3[label="F"]n3->n4[label="T"]n3->n5[label="F"]').replace(/\s/g,''));


    });
});

function parserCode(){
    return [{'Line': 1, 'Type': 'function declaration', 'Name': 'foo', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 1, 'Type': 'Block statement', 'Name': '{', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 2, 'Type': 'variable declaration', 'Name': 'a', 'Condition': '', 'Value': 'x + 1', 'Color': 'Green'},
        {'Line': 3, 'Type': 'variable declaration', 'Name': 'b', 'Condition': '', 'Value': 'a + y', 'Color': 'Green'},
        {'Line': 4, 'Type': 'variable declaration', 'Name': 'c', 'Condition': '', 'Value': '0', 'Color': 'Green'},
        {'Line': 6, 'Type': 'if statement', 'Name': '', 'Condition': 'b < z', 'Value': '', 'Color': 'Green', 'End': 12},
        {'Line': 6, 'Type': 'Block statement', 'Name': '{', 'Condition': '', 'Value': '', 'Color': 'White'},
        {'Line': 7, 'Type': 'assignment expression', 'Name': 'c', 'Condition': '', 'Value': 'c + 5', 'Color': 'White'},
        {'Line': 8, 'Type': 'Block statement', 'Name': '}', 'Condition': '', 'Value': '', 'Color': 'White'},
        {'Line': 8, 'Type': 'else if statement',  'Name': '','Condition': 'b < (z * 2)',  'Value': '',  'Color': 'Red', 'End': 12},
        {'Line': 8, 'Type': 'Block statement', 'Name': '{', 'Condition': '', 'Value': '', 'Color': 'Green'},
        { 'Line': 9,  'Type': 'assignment expression', 'Name': 'c', 'Condition': '', 'Value': '(c + x) + 5',  'Color': 'Green'},
        {'Line': 10, 'Type': 'Block statement', 'Name': '}', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 10, 'Type': 'else', 'Name': '', 'Condition': '', 'Value': '', 'Color': 'Red'},
        {'Line': 10, 'Type': 'Block statement', 'Name': '{', 'Condition': '', 'Value': '', 'Color': 'White'},
        { 'Line': 11, 'Type': 'assignment expression','Name': 'c', 'Condition': '', 'Value': '(c + z) + 5',  'Color': 'Red'},
        {'Line': 12, 'Type': 'Block statement', 'Name': '}', 'Condition': '', 'Value': '', 'Color': 'White'},
        {'Line': 14, 'Type': 'return statement', 'Name': '', 'Condition': '', 'Value': 'c', 'Color': 'Green'},
        {'Line': 15, 'Type': 'Block statement', 'Name': '}', 'Condition': '', 'Value': '', 'Color': 'Green'}];}

describe('The javascript parser', () => {

    let code=[];
    code= [{'Line': 1, 'Type': 'function declaration', 'Name': 'foo', 'Condition': '', 'Value': '','Color':'Green'},
        {'Line': 1, 'Type': 'Block statement', 'Name': '{', 'Condition': '', 'Value': '','Color':'Green'},
        {'Line': 2, 'Type': 'variable declaration', 'Name': 'a', 'Condition': '', 'Value': '5','Color':'Green'},
        {'Line': 3, 'Type': 'while statement', 'Name': '', 'Condition': 'a < 10', 'Value': '','Color':'Green'},
        {'Line': 3, 'Type': 'Block statement', 'Name': '{', 'Condition': '', 'Value': '','Color':'Green'},
        {'Line': 4, 'Type': 'assignment expression', 'Name': 'a', 'Condition': '', 'Value': 'a + 1','Color':'Green'},
        {'Line': 5, 'Type': 'Block statement', 'Name': '}', 'Condition': '', 'Value': '','Color':'Green'},
        {'Line': 6, 'Type': 'Block statement', 'Name': '}', 'Condition': '', 'Value': '','Color':'Green'}];
    it('is parsing an empty function correctly', () => {
        assert.equal(bigFunc(code) ,'n0 [ label= "a= 5\n" , shape= "box" , style =  filled  ,  fillcolor= green ]\nn1 [ label= "NULL" , shape= "box" , style =  filled  ,  fillcolor= green ]\nn2 [ label= "a < 10" , shape= "diamond" , style =  filled  ,  fillcolor= green ]\nn3 [ label= "a= a + 1\n" , shape= "box" , style =  filled  ,  fillcolor= green ]\nn0 -> n1 [label = "" ] \nn1 -> n2 [label = "" ] \nn2 -> n3 [label = "T" ] \n');
    });
});


describe('The javascript parser', () => {

    let code=[];
    code= [{'Line': 1, 'Type': 'function declaration', 'Name': 'foo', 'Condition': '', 'Value': '','Color':'Green'},
        {'Line': 1, 'Type': 'Block statement', 'Name': '{', 'Condition': '', 'Value': '','Color':'Green'},
        {'Line': 2, 'Type': 'variable declaration', 'Name': 'a', 'Condition': '', 'Value': null,'Color':'Green'},
        {'Line': 3, 'Type': 'return statement', 'Name': '', 'Condition': '', 'Value': 'x','Color':'Green'},
        {'Line': 4,'Type': 'variable declaration', 'Name': 'b', 'Condition': '', 'Value': 'y + 1','Color':'Green'},
        {'Line': 5, 'Type': 'update expression', 'Name': 'a', 'Condition': '','Value': 'a++','Color':'Green'},
        {'Line': 6, 'Type': 'Block statement', 'Name': '}', 'Condition': '', 'Value': '','Color':'Green'}];
    it('is parsing an empty function correctly', () => {
        assert.equal(bigFunc(code), 'n0 [ label= "a\n" , shape= "box" , style =  filled  ,  fillcolor= green ]\nn1 [ label= " returnx" , shape= "box" , style =  filled  ,  fillcolor= green ]\nn2 [ label= "b= y + 1\na++\n" , shape= "box" , style =  filled  ,  fillcolor='+
        ' green ]\nn0 -> n1 [label = "" ] \nn1 -> n2 [label = "" ] \n');
    });
});

describe('The javascript parser', () => {
    let code=code2();
    it('is parsing an empty function correctly', () => {
        assert.equal(bigFunc(code).replace(/\s/g,''), ('n0 [ label= "a= x + 1\nb= y + 2\n" , shape= "box" , style =  filled  ,  fillcolor= green ]\nn1 [ label= "a > b" , shape= "diamond" , style =  filled  ,  fillcolor= green ]\nn2 [ labe'+
        'l= "a= a + 1\n" , shape= "box" , style =  filled  ,  fillcolor= white ]\nn3 [ label= "b > a" , shape= "diamond" , style =  filled  ,  fillcolor= green ]\nn4 [ label= "b= b + 1\n" , shape= "box" , s'+
       'tyle =  filled  ,  fillcolor= green ]\nn5 [ label= "b > a", shape= "diamond" , style =  filled  ,  fillcolor= green ]\nn6 [ label= "b= b + 1\n" , shape= "box", style =  filled  ,  fillcolor= green ]'+
'\nn7 [ label= " returnx" , shape= "box" , style =  filled  ,  fillcolor= green ]\nn0 -> n1 [label = "" ] \nn1 -> n2 [label = "T" ] \nn1 -> n3 [label = "F" ] \nn3 -> n4 [label = "T" ] \nn4 -> n5 [lab'+
        'el = "" ] \nn5 -> n6 [label = "T" ] \n').replace(/\s/g,''));
    });});

function code2(){
    return  [{'Line': 1, 'Type': 'function declaration', 'Name': 'foo', 'Condition': '', 'Value': '','Color' : 'Green'},
        {'Line': 1, 'Type': 'Block statement', 'Name': '{', 'Condition': '', 'Value': '', 'Color' : 'Green'},
        {'Line': 2, 'Type': 'variable declaration', 'Name': 'a', 'Condition': '', 'Value': 'x + 1', 'Color': 'Green'},
        {'Line': 3, 'Type': 'variable declaration', 'Name': 'b', 'Condition': '', 'Value': 'y + 2', 'Color': 'Green'},
        {'Line': 4, 'Type': 'if statement', 'Name': '', 'Condition': 'a > b', 'Value': '', 'Color': 'Green',Alternate: true},
        {'Line': 4, 'Type': 'Block statement', 'Name': '{', 'Condition': '', 'Value': '', 'Color': 'White' },
        {'Line': 5, 'Type': 'assignment expression', 'Name': 'a', 'Condition': '', 'Value': 'a + 1', 'Color': 'White'},
        {'Line': 6, 'Type': 'Block statement', 'Name': '}', 'Condition': '', 'Value': '', 'Color': 'White'},
        {'Line': 7, 'Type': 'else if statement', 'Name': '', 'Condition': 'b > a', 'Value': '', 'Color': 'Green',Alternate: false},
        {'Line': 7, 'Type': 'Block statement', 'Name': '{', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 8, 'Type': 'assignment expression', 'Name': 'b', 'Condition': '', 'Value': 'b + 1', 'Color': 'Green'},
        {'Line': 9, 'Type': 'if statement', 'Name': '', 'Condition': 'b > a', 'Value': '', 'Color': 'Green',Alternate: false},
        {'Line': 9, 'Type': 'Block statement', 'Name': '{', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 10, 'Type': 'assignment expression', 'Name': 'b', 'Condition': '', 'Value': 'b + 1', 'Color': 'Green'},
        {'Line': 11, 'Type': 'Block statement', 'Name': '}', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 12, 'Type': 'Block statement', 'Name': '}', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 13, 'Type': 'return statement', 'Name': '', 'Condition': '', 'Value': 'x', 'Color': 'Green'},
        {'Line': 14, 'Type': 'Block statement', 'Name': '}', 'Condition': '', 'Value': '', 'Color': 'Green'}];
}

describe('The javascript parser', () => {
    let code=checkingWhileCode();
    it('is parsing an empty function correctly', () => {
        assert.equal(bigFunc(code).replace(/\s/g,''), ('n0[label="a=x+1b=y+2",shape="box",style=filled,fillcolor=green]n1[label="a>b",shape="diamond",style=filled,fillcolor=green]n2[label="a=a+1",shape="box",style=filled,fillcolor=gre'+
        'en]n3[label="NULL",shape="box",style=filled,fillcolor=green]n4[label="a>x",shape="diamond",style=filled,fillcolor=green]n5[label="a=a+2",shape="box",style=filled,fillcolor=green]n6[label="returnx'+
        '",shape="box",style=filled,fillcolor=green]n0->n1[label=""]n1->n2[label="T"]n2->n3[label=""]n3->n4[label=""]n4->n5[label="T"]').replace(/\s/g,''));
    });});

function checkingWhileCode(){
    return [{'Line': 1, 'Type': 'function declaration', 'Name': 'foo', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 1, 'Type': 'Block statement', 'Name': '{', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 2, 'Type': 'variable declaration', 'Name': 'a', 'Condition': '', 'Value': 'x + 1', 'Color': 'Green'},
        {'Line': 3, 'Type': 'variable declaration', 'Name': 'b', 'Condition': '', 'Value': 'y + 2', 'Color': 'Green'},
        {'Line': 4, 'Type': 'if statement', 'Name': '', 'Condition': 'a > b', 'Value': '', 'Color': 'Green',Alternate: false},
        {'Line': 4, 'Type': 'Block statement', 'Name': '{', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 5, 'Type': 'assignment expression', 'Name': 'a', 'Condition': '', 'Value': 'a + 1', 'Color': 'Green'},
        {'Line': 6, 'Type': 'while statement', 'Name': '', 'Condition': 'a > x', 'Value': '', 'Color': 'Green'},
        {'Line': 6, 'Type': 'Block statement', 'Name': '{', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 7, 'Type': 'assignment expression', 'Name': 'a', 'Condition': '', 'Value': 'a + 2', 'Color': 'Green'},
        {'Line': 8, 'Type': 'Block statement', 'Name': '}', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 9, 'Type': 'Block statement', 'Name': '}', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 10, 'Type': 'return statement', 'Name': '', 'Condition': '', 'Value': 'x', 'Color': 'Green'},
        {'Line': 11, 'Type': 'Block statement', 'Name': '}', 'Condition': '', 'Value': '', 'Color': 'Green'}];
}

describe('The javascript parser', () => {
    let code=checkingifElse();
    it('is parsing an empty function correctly', () => {
        assert.equal(bigFunc(code).replace(/\s/g,''), ('n0[label="x>y",shape="diamond",style=filled,fillcolor=green]n1[label="x=x+1",shape="box",style=filled,fillcolor=green]n2[label="y=y+1",shape="box",style=filled,fillcolor=white]n3'+
            '[label="a=a+2b=b+2",shape="box",style=filled,fillcolor=green]n0->n1[label="T"]n0->n2[label="F"]').replace(/\s/g,''));
    });});
function checkingifElse(){
    return [{'Line': 1, 'Type': 'function declaration', 'Name': 'foo', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 1, 'Type': 'Block statement', 'Name': '{', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 2, 'Type': 'if statement', 'Name': '', 'Condition': 'x > y', 'Value': '', 'Color': 'Green','Alternate': true},
        {'Line': 2, 'Type': 'Block statement', 'Name': '{', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 3, 'Type': 'assignment expression', 'Name': 'x', 'Condition': '', 'Value': 'x + 1', 'Color': 'Green'},
        {'Line': 4, 'Type': 'Block statement', 'Name': '}', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 5, 'Type': 'else', 'Name': '', 'Condition': '', 'Value': '', 'Color': 'White'},
        {'Line': 5, 'Type': 'Block statement', 'Name': '{', 'Condition': '', 'Value': '', 'Color': 'White'},
        {'Line': 6, 'Type': 'assignment expression', 'Name': 'y', 'Condition': '', 'Value': 'y + 1', 'Color': 'White'},
        {'Line': 7, 'Type': 'Block statement', 'Name': '}', 'Condition': '', 'Value': '', 'Color': 'White'},
        {'Line': 8, 'Type': 'variable declaration', 'Name': 'a', 'Condition': '', 'Value': 'a + 2', 'Color': 'Green'},
        {'Line': 9, 'Type': 'variable declaration', 'Name': 'b', 'Condition': '', 'Value': 'b + 2', 'Color': 'Green'},
        {'Line': 10, 'Type': 'Block statement', 'Name': '}', 'Condition': '', 'Value': '', 'Color': 'Green'}];
}

describe('The javascript parser', () => {
    let code=checkingif();
    it('is parsing an empty function correctly', () => {
        assert.equal(bigFunc(code).replace(/\s/g,''), ('n0[label="x>y",shape="diamond",style=filled,fillcolor=green]n1[label="x=x+1y=y+2b=x",shape="box",style=filled,fillcolor=green]n0->n1[label="T"]'.replace(/\s/g,'')));
    });});
function checkingif(){
    return [{'Line': 1, 'Type': 'function declaration', 'Name': 'foo', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 1, 'Type': 'Block statement', 'Name': '{', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 2, 'Type': 'if statement', 'Name': '', 'Condition': 'x > y', 'Value': '', 'Color': 'Green','Alternate': false},
        {'Line': 2, 'Type': 'Block statement', 'Name': '{', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 3, 'Type': 'assignment expression', 'Name': 'x', 'Condition': '', 'Value': 'x + 1', 'Color': 'Green'},
        {'Line': 4, 'Type': 'assignment expression', 'Name': 'y', 'Condition': '', 'Value': 'y + 2', 'Color': 'Green'},
        {'Line': 5, 'Type': 'variable declaration', 'Name': 'b', 'Condition': '', 'Value': 'x', 'Color': 'Green'},
        {'Line': 6, 'Type': 'Block statement', 'Name': '}', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 7, 'Type': 'Block statement', 'Name': '}', 'Condition': '', 'Value': '', 'Color': 'Green'}];
}


describe('The javascript parser', () => {
    let code=checkifInsideWhile();
    it('is parsing an empty function correctly', () => {
        assert.equal(bigFunc(code).replace(/\s/g,''), ('n0[label="NULL",shape="box",style=filled,fillcolor=green]n1[label="x>y",shape="diamond",style=filled,fillcolor=green]n2[label="a=3",shape="box",style=filled,fillcolor=green]n3[la\n' +
            'bel="a>6",shape="diamond",style=filled,fillcolor=green]n4[label="b=6",shape="box",style=filled,fillcolor=white]n5[label="x=x+1",shape="box",style=filled,fillcolor=green]n6[label="",shape="circle\n' +
            '",style=filled,fillcolor=green]n7[label="returnz",shape="box",style=filled,fillcolor=green]n0->n1[label=""]n1->n2[label="T"]n2->n3[label=""]n3->n4[label="T"]n3->n5[label="F"]n6->n7[label=""]n4\n' +
            '->n6[]n5->n6[]').replace(/\s/g,''));
    });});
function checkifInsideWhile(){
    return [{'Line': 1, 'Type': 'function declaration', 'Name': 'foo', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 1, 'Type': 'Block statement', 'Name': '{', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 2, 'Type': 'while statement', 'Name': '', 'Condition': 'x > y', 'Value': '', 'Color': 'Green'},
        {'Line': 2, 'Type': 'Block statement', 'Name': '{', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 3, 'Type': 'variable declaration', 'Name': 'a', 'Condition': '', 'Value': '3', 'Color': 'Green'},
        {'Line': 4, 'Type': 'if statement', 'Name': '', 'Condition': 'a > 6', 'Value': '', 'Color': 'Green','Alternate': true,'End': 9},
        {'Line': 4, 'Type': 'Block statement', 'Name': '{', 'Condition': '', 'Value': '', 'Color': 'White'},
        {'Line': 5, 'Type': 'variable declaration', 'Name': 'b', 'Condition': '', 'Value': '6', 'Color': 'White'},
        {'Line': 6, 'Type': 'Block statement', 'Name': '}', 'Condition': '', 'Value': '', 'Color': 'White'},
        {'Line': 7, 'Type': 'else', 'Name': '', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 7, 'Type': 'Block statement', 'Name': '{', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 8, 'Type': 'assignment expression', 'Name': 'x', 'Condition': '', 'Value': 'x + 1', 'Color': 'Green'},
        {'Line': 9, 'Type': 'Block statement', 'Name': '}', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 10, 'Type': 'Block statement', 'Name': '}', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 11, 'Type': 'return statement', 'Name': '', 'Condition': '', 'Value': 'z', 'Color': 'Green'},
        {'Line': 12, 'Type': 'Block statement', 'Name': '}', 'Condition': '', 'Value': '', 'Color': 'Green'}];
}


describe('The javascript parser', () => {
    let code=checkWhile();
    it('is parsing an empty function correctly', () => {
        assert.equal(bigFunc(code).replace(/\s/g,''), ('n0[label="NULL",shape="box",style=filled,fillcolor=green]n1[label="x>y",shape="diamond",style=filled,fillcolor=green]n2[label="a=3",shape="box",style=filled,fillcolor=green]n3[la'
        +'bel="returnz",shape="box",style=filled,fillcolor=green]n0->n1[label=""]n1->n2[label="T"]n1->n3[label="F"]n2->n0[label=""]').replace(/\s/g,''));
    });});
function checkWhile(){
    return [{'Line': 1, 'Type': 'function declaration', 'Name': 'foo', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 1, 'Type': 'Block statement', 'Name': '{', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 2, 'Type': 'while statement', 'Name': '', 'Condition': 'x > y', 'Value': '', 'Color': 'Green', 'End': 4},
        {'Line': 2, 'Type': 'Block statement', 'Name': '{', 'Condition': '', 'Value': '','Color': 'Green'},
        {'Line': 3, 'Type': 'variable declaration', 'Name': 'a', 'Condition': '', 'Value': '3', 'Color': 'Green'},
        {'Line': 4, 'Type': 'Block statement', 'Name': '}', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 5, 'Type': 'return statement', 'Name': '', 'Condition': '', 'Value': 'z', 'Color': 'Green'},
        {'Line': 6, 'Type': 'Block statement', 'Name': '}', 'Condition': '', 'Value': '', 'Color': 'Green'}];
}

describe('The javascript parser', () => {
    let code=checkWhileInTheEnd();
    it('is parsing an empty function correctly', () => {
        assert.equal(bigFunc(code).replace(/\s/g,''), ('n0[label="NULL",shape="box",style=filled,fillcolor=green]n1[label="x>y",shape="diamond",style=filled,fillcolor=green]n2[label="a=3",shape="box",style=filled,fillcolor=green]n0->n'+
        '1[label=""]n1->n2[label="T"]n2->n0[label=""]').replace(/\s/g,''));
    });});
function checkWhileInTheEnd(){
    return [{'Line': 1, 'Type': 'function declaration', 'Name': 'foo', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 1, 'Type': 'Block statement', 'Name': '{', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 2, 'Type': 'while statement', 'Name': '', 'Condition': 'x > y', 'Value': '', 'Color': 'Green','End': 4},
        {'Line': 2, 'Type': 'Block statement', 'Name': '{', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 3, 'Type': 'variable declaration', 'Name': 'a', 'Condition': '', 'Value': '3', 'Color': 'Green'},
        {'Line': 4, 'Type': 'Block statement', 'Name': '}', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 5, 'Type': 'Block statement', 'Name': '}', 'Condition': '', 'Value': '', 'Color': 'Green'}];
}
describe('The javascript parser', () => {
    let code=checkIfAsLastLine();
    it('is parsing an empty function correctly', () => {
        assert.equal(bigFunc(code).replace(/\s/g,''), ('n0[label="x>y",shape="diamond",style=filled,fillcolor=green]').replace(/\s/g,''));
    });});
function checkIfAsLastLine(){
    return [{'Line': 1, 'Type': 'function declaration', 'Name': 'foo', 'Condition': '', 'Value': '','Color': 'Green'},
        {'Line': 1, 'Type': 'Block statement', 'Name': '{', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 2, 'Type': 'if statement', 'Name': '', 'Condition': 'x > y', 'Value': '', 'Color': 'Green','Alternate': false,'End': 3},
        {'Line': 2, 'Type': 'Block statement', 'Name': '{', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 3, 'Type': 'Block statement', 'Name': '}', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 4, 'Type': 'Block statement', 'Name': '}', 'Condition': '', 'Value': '', 'Color': 'Green'}];
        
}
describe('The javascript parser', () => {
    let code=JustIfAndWhile();
    it('is parsing an empty function correctly', () => {
        assert.equal(bigFunc(code).replace(/\s/g,''), ('n0[label="x>y",shape="diamond",style=filled,fillcolor=green]n1[label="NULL",shape="box",style=filled,fillcolor=green]n2[label="x>y",shape="diamond",style=filled,fillcolor=green]n' +
            '0->n1[label="T"]n1->n2[label=""]n2->n3[label="F"]n2->n1[label=""]').replace(/\s/g,''));
    });});
function JustIfAndWhile(){
    return [{'Line': 1, 'Type': 'function declaration', 'Name': 'foo', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 1, 'Type': 'Block statement', 'Name': '{', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 2, 'Type': 'if statement', 'Name': '', 'Condition': 'x > y', 'Value': '', 'Color': 'Green','Alternate': false, 'End': 5 },
        {'Line': 2, 'Type': 'Block statement', 'Name': '{', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 3, 'Type': 'while statement', 'Name': '', 'Condition': 'x > y', 'Value': '', 'Color': 'Green', 'End': 4},
        {'Line': 3, 'Type': 'Block statement', 'Name': '{', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 4, 'Type': 'Block statement', 'Name': '}', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 5, 'Type': 'Block statement', 'Name': '}', 'Condition': '', 'Value': '', 'Color': 'Green'},
        {'Line': 6, 'Type': 'Block statement', 'Name': '}', 'Condition': '', 'Value': '', 'Color': 'Green'}];

}
