function match(input,state = 0){
    for(let i = 0, l = input.length;i<l;i++){
        if(state === 0 && input[i] === 'a'){
            return match(input.slice(++i,l),1)
        }

        if(state === 1 ){
            if(input[0] === 'b'){
                return match(input.slice(++i,l),2)
            }
            else{
                return match(input.slice(i,l),0)
            }
        }

        if(state === 2 ){
            if(input[0] === 'c'){
                return match(input.slice(++i,l),3)
            }
            else{
                return match(input.slice(i,l),0)
            }
        }

        if(state === 3 ){
            if(input[0] === 'd'){
                return match(input.slice(++i,l),4)
            }
            else{
                return match(input.slice(i,l),0)
            }
        }
        
        if(state === 4 ){
            if(input[0] === 'e'){
                return match(input.slice(++i,l),5)
            }
            else{
                return match(input.slice(i,l),0)
            }
        }

        if(state === 5 ){
            if(input[0] === 'f'){
                return true
            }
            else{
                return match(input.slice(i,l),0)
            }
        }
    }
}