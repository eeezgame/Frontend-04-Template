"use strict";
/**
 * Initialize your data structure here.
 */
var Tire = /** @class */ (function () {
    function Tire() {
        this.root = Object.create(null);
        this.end = '$';
    }
    Tire.prototype.insert = function (word) {
        var node = this.root;
        for (var _i = 0, word_1 = word; _i < word_1.length; _i++) {
            var c = word_1[_i];
            if (!(c in node))
                node[c] = Object.create(null);
            node = node[c];
        }
        if (!(this.end in node))
            node[this.end] = 0;
        node[this.end]++;
    };
    Tire.prototype.search = function (word) {
        var node = this.root;
        for (var _i = 0, word_2 = word; _i < word_2.length; _i++) {
            var c = word_2[_i];
            if (!(c in node))
                return false;
            node = node[c];
        }
        if (!(this.end in node))
            return false;
        return true;
    };
    Tire.prototype.startsWith = function (prefix) {
        var node = this.root;
        for (var _i = 0, prefix_1 = prefix; _i < prefix_1.length; _i++) {
            var c = prefix_1[_i];
            if (!(c in node))
                return false;
            node = node[c];
        }
        return true;
    };
    Tire.prototype.most = function () {
        var _this = this;
        var node = this.root;
        var max = 0;
        var maxWord = null;
        var visit = function (node, word) {
            if (node[_this.end] && node[_this.end] > max) {
                max = node[_this.end];
                maxWord = word;
            }
            for (var p in node)
                visit(node[p], word + p);
        };
        visit(node, '');
        return [maxWord, max];
    };
    ;
    return Tire;
}());
;
/**
 * Your Trie object will be instantiated and called as such:
 * var obj = new Trie()
 * obj.insert(word)
 * var param_2 = obj.search(word)
 * var param_3 = obj.startsWith(prefix)
 */ 
