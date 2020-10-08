function match(input,state = 0){
    let result = input
    let count = 0;
    for(let c of input){
        if(state === 0 && c === 'a'){
            result = input.slice(++count,input.length)
            return match(result,1)
        }
        if(state === 1 ){
            if(c === 'b' && count === 0){
                return true
            }else{
                result = input.slice(++count,input.length)
                return match(result,0)
            }
        }
        count++
    }
}