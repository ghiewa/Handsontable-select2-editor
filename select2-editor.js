/// select2 plugin
// compatiable handsontable 2.7.0 and select2 4.0.1

(function (Handsontable) {
    "use strict";

    var Select2Editor = Handsontable.editors.TextEditor.prototype.extend();

    Select2Editor.prototype.prepare = function (row, col, prop, td, originalValue, cellProperties) {

        Handsontable.editors.TextEditor.prototype.prepare.apply(this, arguments);

        this.options = {};

        if (this.cellProperties.select2Options) {
            this.options = $.extend(this.options, cellProperties.select2Options);
        }
    };

    Select2Editor.prototype.createElements = function () {
        Handsontable.editors.TextEditor.prototype.createElements.apply(this, arguments);

        var SLT = document.createElement('select');
        SLT.className = 'select2Editor';
        SLT.style = "width: 300px";
        Handsontable.Dom.empty(this.TEXTAREA_PARENT);
        this.TEXTAREA_PARENT.appendChild(SLT);
        this.textarea = SLT;

        this.assignHooks();
    };

    var onSelect2Closed = function () {
        console.info('select close');
        this.setValue('test');
        this.finishEditing();

                $(this.textarea).select2('close');
                this.instance.destroyEditor();
this.instance.listen();
        this.close();
    };

    var onBeforeKeyDown = function (event) {
        var instance = this;
        var that = instance.getActiveEditor();

        var keyCodes = Handsontable.helper.KEY_CODES;

        //console.info('before key down', keyCodes.ENTER, event.keyCode, event.target);
        var ctrlDown = (event.ctrlKey || event.metaKey) && !event.altKey; //catch CTRL but not right ALT (which in some systems triggers ALT+CTRL)

        //Process only events that have been fired in the editor
        if (!$(event.target).hasClass('select2-search__field') || event.isImmediatePropagationStopped) {
            return;
        }

        if (event.keyCode === 17 || event.keyCode === 224 || event.keyCode === 91 || event.keyCode === 93) {
            //when CTRL or its equivalent is pressed and cell is edited, don't prepare selectable text in textarea
            event.stopImmediatePropagation();
            return;
        }

        var target = event.target;

        switch (event.keyCode) {
            case keyCodes.ARROW_RIGHT:
                if (Handsontable.Dom.getCaretPosition(target) !== target.value.length || target.value.length > 0) {
                    event.stopImmediatePropagation();
                } else {
                    $(that.textarea).select2('close');
                }
                break;

            case keyCodes.ARROW_LEFT:
                if (Handsontable.Dom.getCaretPosition(target) !== 0 || target.value.length > 0) {
                    event.stopImmediatePropagation();
                } else {
                    $(that.textarea).select2('close');
                }
                break;

            case keyCodes.ARROW_UP:
                  event.stopImmediatePropagation(); // prevent EditorManager from processing this event
                  event.preventDefault(); // prevent browser from scrolling the page up
                  break;

            case keyCodes.ARROW_DOWN:
              event.stopImmediatePropagation();
              event.preventDefault();
              break;

            case keyCodes.ENTER:
            event.stopImmediatePropagation();
                //console.info('enter');   //TODO
                var selected = that.instance.getSelected();
                var isMultipleSelection = !(selected[0] === selected[2] && selected[1] === selected[3]);
                if ((ctrlDown && !isMultipleSelection) || event.altKey) { //if ctrl+enter or alt+enter, add new line
                    if (that.isOpened()) {
                        that.val(that.val() + '\n');
                        that.focus();
                    } else {
                        that.beginEditing(that.originalValue + '\n')
                    }
                    event.stopImmediatePropagation();
                }
                event.preventDefault(); //don't add newline to field
                break;

            case keyCodes.A:
            case keyCodes.X:
            case keyCodes.C:
            case keyCodes.V:
                if (ctrlDown) {
                    event.stopImmediatePropagation(); //CTRL+A, CTRL+C, CTRL+V, CTRL+X should only work locally when cell is edited (not in table context)
                }
                break;

            case keyCodes.BACKSPACE:
            case keyCodes.DELETE:
            case keyCodes.HOME:
            case keyCodes.END:
                event.stopImmediatePropagation(); //backspace, delete, home, end should only work locally when cell is edited (not in table context)
                break;
            default:
                //console.info(event.keyCode);
        }

    };

    Select2Editor.prototype.open = function (keyboardEvent) {
        this.refreshDimensions();
        this.textareaParentStyle.display = 'block';
        this.instance.addHook('beforeKeyDown', onBeforeKeyDown);
        $(this.textarea).select2(this.options);
            //.on('select2:close', onSelect2Closed.bind(this));

        $(this.textarea).select2('open');

    };

    Select2Editor.prototype.init = function () {
        Handsontable.editors.TextEditor.prototype.init.apply(this, arguments);
    };

    Select2Editor.prototype.close = function () {
        this.instance.removeHook('beforeKeyDown', onBeforeKeyDown);
        this.instance.listen();
        Handsontable.editors.TextEditor.prototype.close.apply(this, arguments);
    };

    Select2Editor.prototype.finishEditing = function(restoreOriginalValue) {
      this.setValue($(this.textarea).val());   // .val() or .text()

      Handsontable.editors.TextEditor.prototype.finishEditing.apply(this, arguments);
    };

    Select2Editor.prototype.assignHooks = function() {
      var _this = this;
      this.instance.addHook('afterDestroy', function() {
        if (_this.textarea) {
          $(_this.textarea).select2('destroy');
        }
      });
    };

    Handsontable.editors.Select2Editor = Select2Editor;
    Handsontable.editors.registerEditor('select2', Select2Editor);

})(Handsontable);
