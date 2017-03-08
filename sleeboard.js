  'use strict';

const am = require('./am.js');
  var sleeboard = function () {
    if (!(this instanceof sleeboard)) {
      return new sleeboard()
    }

      getInputJson();

    var lang,
      scope,
      maxInserted = 0,
      ignoreKeyCodes = [8, 10, 18, 35, 36, 37, 38, 39, 40, 127];

    var finalText = '';
    /**
     * Write the Symbol to the right position on input
     * FIXME: caret gets hidden when overflow
     * @param vm
     * @param entry
     */
    function writeOnField(entry) {
      if (entry) {
        maxInserted = scope['_scope'] ? 0 : maxInserted;
        var sub = finalText.substring(0, finalText.length - (maxInserted));
        if (scope['_scope']) {
          maxInserted = 1;
        } else {
          maxInserted = maxInserted < entry.length ? entry.length : maxInserted;
        }
        return  sub + entry;
      }
      return '';
    }


    /**
     * Shrink Scope for Performance
     * @param char
     */
    function shrinkScope(char) {
      if (scope[char]) {
        scope = scope[char]['next'] ? scope[char]['next'] : lang;
      } else {
        scope = lang;
      }
    }

    /**
     * Get Symbol from Character
     * @param char
     * @returns {*}
     */
    function getSymbolFromScope(char) {
      scope = scope ? scope : lang;
      if (scope[char]) {
        return scope[char]['value'];
      } else if (lang[char]) {
        scope = lang;
        return scope[char]['value'];
      } else {
        scope = lang;
        return char;
      }
    }

    /**
     * handler
     * @param text
     */
    function handler(text) {
      var splitString = text.split('');
      splitString.forEach(char => {

        if (char) {
          var symbol = getSymbolFromScope(char);
          finalText = writeOnField(symbol);
          shrinkScope(char);
        }
      })
      var keyvalue = [];
      if(!scope['_scope']){
        var example = finalText.slice(0, -1);
        keyvalue = Object.keys(scope).map((key)=>{
         var chars = key;
         var scopeCopy = scope;
         var value = scopeCopy[key].value
         while(!scopeCopy[key].value){
          scopeCopy = scopeCopy[key].next
          key = Object.keys(scopeCopy)[0]
          chars = chars + key
          value = scopeCopy[key].value
         }
         var result = example+value
         return {chars, result}
        })
        keyvalue.unshift({chars: '', result: finalText})
      }else {
        keyvalue.unshift({chars: '', result: finalText})
      }
      return keyvalue;
    }

    /**
     * Request server for json
     */
    function getInputJson() {
      lang = am
      lang['_scope'] = 'all';
    }

    /**
     * Change Input Type
     * @param fileName
     */
     this.getAmharic = function(text){
        finalText = ""
	getInputJson()
	scope = lang
        return handler(text)
     }

  };

module.exports = sleeboard()
