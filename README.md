Handsontable-select2-editor
===========================

Handsontable Select2 Editor. Forked from https://github.com/trebuchetty/Handsontable-select2-editor

Here is a jsfiddle of this editor working with Select2 4.0.1 and Handsontable 0.27.0

Using this custom editor

```JAVASCRIPT
var optionsList = [{id: 1, text: 'jsmith'}, {id: 2, text: 'wjones'}, ...];
var columnsList = [{
                    data: 0,
                    editor: 'select2',
                    renderer: customDropdownRenderer,
                    width: '200px',
                    select2Options: {
                        ajax: {
                            url: "http://127.0.0.1:8181/api/items",
                            dataType: 'json',
                            delay: 250,
                            data: function (params) {
                              return {
                                _filters: '{"Glid":' + '"' + params.term + '"}', // search term
                                _page: params.page,
                                _perPage: 30
                              };
                            },

                            processResults: function (data, params) {
                              params.page = params.page || 1;

                              return {
                                results: $.map(data, function(obj) {
                                    return { id: obj.Glid, text: obj.CustomerRef };
                                })
                              };
                            },
                            cache: true
                        },
                        //data: optionsList,

                        //dropdownAutoWidth: true,
                        width: 'resolve',
                        escapeMarkup: function (markup) { return markup; },
						            templateResult: formatRepo,
                        templateSelection: formatRepoSelection
                    }
                  },
                ...
                ];


this.$container = $("#container");
this.$container.handsontable({
    data: [...],
    columns: columnsList
    });
```


License

(The MIT License)

Copyright (c) 2013 Sean Riordon <trebuchetty@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
