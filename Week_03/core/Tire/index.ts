/**
 * Initialize your data structure here.
 */
class Tire {
    
    root:any
    end:string

    constructor(){
        this.root = Object.create(null)
        this.end = '$'
    }

    insert(word:string) {
        let node = this.root
        for(let c of word){
            if(!(c in node))
                node[c] = Object.create(null)
            node = node[c]
        }
        if(!(this.end in node))
            node[this.end] = 0
        node[this.end]++
    }

    search (word:string) {
        let node = this.root
        for(let c of word){
            if(!(c in node))
                return false
            node = node[c]
        }
        if(!(this.end in node))
            return false
        return true
    }

    startsWith (prefix:string) {
        let node = this.root
        for(let c of prefix){
            if(!(c in node))
                return false
            node = node[c]
        }
        return true
    }

    most() {
        let node = this.root
        let max = 0
        let maxWord = null
        let visit = (node:any,word:string)=>{
            if(node[this.end] && node[this.end]>max){
                max = node[this.end]
                maxWord = word
            }
            for(let p in node)
                visit(node[p],word +p)
        }
        visit(node,'')
        return [maxWord,max]
    };
};

/**
 * Your Trie object will be instantiated and called as such:
 * var obj = new Trie()
 * obj.insert(word)
 * var param_2 = obj.search(word)
 * var param_3 = obj.startsWith(prefix)
 */