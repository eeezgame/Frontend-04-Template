const regexp = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g

const dict = ['Number',"Whitespace","LineTerminator","*","/","+","-"]

function *tokenize(source){
    let result = null
    let lastIndex = 0
    while(true){
        lastIndex = regexp.lastIndex
        result = regexp.exec(source)
        if(!result) break

        if(regexp.lastIndex - lastIndex > result[0].length) break
        
        let token = {
            type: null,
            value: null
        }
        for(let i = 1;i <= dict.length; i++){
            if(result[i])
                token.type = dict[i-1]
        }
        token.value = result[0]
        yield token
    }
    yield {
        type: 'EOF'
    }
}

let source = []
for(let token of tokenize("1 + 2 * 3")){
    if(token.type !== "Whitespace" && token.type !== "LineTerminator")
        source.push(token)
}
console.log(source);

function MultiplicativeExpression(source){

    if(source[0].type === "Number"){
        let node = {
            type:"MultiplicativeExpression",
            children:source[0]
        }
        source[0] = node
        return MultiplicativeExpression(source)
    }

    if(source[0].type === "MultiplicativeExpression" && source[1] && source[1].type === '*'){
        let node = {
            type:"MultiplicativeExpression",
            operator:"*",
            children:[]
        }
        node.children.push(source.shift())
        node.children.push(source.shift())
        node.children.push(source.shift())
        source.unshift(node)
        return MultiplicativeExpression(source)
    }

    if(source[0].type === "MultiplicativeExpression" && source[1] && source[1].type === '/'){
        let node = {
            type:"MultiplicativeExpression",
            operator:"/",
            children:[]
        }
        node.children.push(source.shift())
        node.children.push(source.shift())
        node.children.push(source.shift())
        source.unshift(node)
        return MultiplicativeExpression(source)
    }

    if(source[0].type === "MultiplicativeExpression")
        return source[0]
}
function AdditiveExpression(source){

    if(source[0].type === "MultiplicativeExpression"){
        let node = {
            type:"AdditiveExpression",
            children:source[0]
        }
        source[0] = node
        return AdditiveExpression(source)
    }

    if(source[0].type === "AdditiveExpression" && source[1] && source[1].type === '+'){
        let node = {
            type:"AdditiveExpression",
            operator:"+",
            children:[]
        }
        node.children.push(source.shift())
        node.children.push(source.shift())
        MultiplicativeExpression(source)
        node.children.push(source.shift())
        source.unshift(node)
        return AdditiveExpression(source)
    }

    if(source[0].type === "AdditiveExpression" && source[1] && source[1].type === '-'){
        let node = {
            type:"AdditiveExpression",
            operator:"-",
            children:[]
        }
        node.children.push(source.shift())
        node.children.push(source.shift())
        MultiplicativeExpression(source)
        node.children.push(source.shift())
        source.unshift(node)
        return AdditiveExpression(source)
    }

    if(source[0].type === "AdditiveExpression")
        return source[0]
    MultiplicativeExpression(source)
    return AdditiveExpression(source)
}

function Expression(source){
    if(source[0].type === "AdditiveExpression" && source[1] && source[1].type ==="EOF"){
        let node = {
            type:"Expression",
            children:[source.shift(),source.shift()]
        }
        source.unshift(node)
        return source
    }
    AdditiveExpression(source)
    return Expression(source)
}

console.log(JSON.stringify(Expression(source),null, 2));