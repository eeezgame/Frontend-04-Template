const regexp = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g

const dict = ['Number',"Whitespace","LineTerminator","*","/","+","-"]

function tokenize(source){
    let result = null
    while(true){
        result = regexp.exec(source)
        if(!result) break
        
        for(let i = 1;i <= dict.length; i++){
            if(result[i])
                console.log(dict[i-1]);
        }
        console.log(result);
    }
}

tokenize("1024 + 10 * 25")