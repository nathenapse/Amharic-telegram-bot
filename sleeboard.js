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
        finalText = sub + entry;
        if (scope['_scope']) {
          maxInserted = 1;
        } else {
          maxInserted = maxInserted < entry.length ? entry.length : maxInserted;
        }
      }
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
     * Get Character from Event
     * @param event
     * @returns {*}
     */
/*    function getChar(event) {
      if (event.which == null) {
        return String.fromCharCode(event.keyCode); // IE
      } else if (event.which != 0 && event.charCode != 0) {
        return String.fromCharCode(event.which);   // the rest
      } else {
        return null; // special key
      }
    }
*/

    /**
     * Add Event to Field
     */
/*    function addEvent(select) {
      Array.prototype.map.call(document.querySelectorAll(select), browserSensitiveAddEvent);
    }
*/
    /**
     * Support ie8 when adding event
     * @param target
     */
/*    function browserSensitiveAddEvent(target) {
      if (target.addEventListener) {
        target.addEventListener('keypress', pressEventHandler);
        target.addEventListener('keydown', keyDownEventHandler);
        target.addEventListener('focusout', focusOutEventHandler);
      } else if (target.attachEvent) {
        target.attachEvent('keypress', pressEventHandler);
        target.attachEvent('keydown', keyDownEventHandler);
        target.attachEvent('focusout', focusOutEventHandler);
      }
    }
*/
    /**
     * Remove Events from Field
     */
/*    function removeEvent(select) {
      Array.prototype.map.call(document.querySelectorAll(select), browserSensitiveRemoveEvent);
    }
*/
    /**
     * Support ie8 when removing event
     * @param target
     */
/*    function browserSensitiveRemoveEvent(target) {
      if (target.removeEventListener) {
        target.removeEventListener('keypress', pressEventHandler);
        target.removeEventListener('keydown', keyDownEventHandler);
        target.removeEventListener('focusout', focusOutEventHandler);
      } else if (target.detachEvent) {
        target.detachEvent('keypress', pressEventHandler);
        target.detachEvent('keydown', keyDownEventHandler);
        target.detachEvent('focusout', focusOutEventHandler);
      }
    }
*/
    /**
     * KeyDown Event Handler
     * Change scope if key down in ignore key
     * @param event
     */
 /*   function keyDownEventHandler(event) {
      if (ignoreKeyCodes.indexOf(event.keyCode) !== -1) {
        scope = lang;
      }
    }
*/
    /**
     * Focus Out Event Handler
     * Change scope if focus out
     */
/*    function focusOutEventHandler() {
      scope = lang;
    }
*/
    /**
     * Key press Event Handler
     * @param event
     */
    function handler(text) {
      var result = text.split('');
      result.forEach(char => {

        if (char) {
          var symbol = getSymbolFromScope(char);
          writeOnField(symbol);
          shrinkScope(char);
        }
      })
      return finalText;
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
        return handler(text)
     }

  };

module.exports = sleeboard()
