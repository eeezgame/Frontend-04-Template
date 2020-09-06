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
for(let token of tokenize("10 * 25 / 2")){
    if(token.type !== "Whitespace" && token.type !== "LineTerminator")
        source.push(token)
}
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

console.log(JSON.stringify(MultiplicativeExpression(source),null, 2));