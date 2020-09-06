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

for(let token of tokenize("1024 + 10 * 25")){
    console.log(token);
}