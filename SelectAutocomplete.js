$.widget("custom.SelectAutocomplete", {
    _create: function () {
        this.wrapper = $("<span>")
                .addClass("custom-combobox col-md-12")
                .insertAfter(this.element)
                .css("display", "table");
        this.element.hide();
        this._createAutocomplete();
        this._createShowAllButton();
    },
    _createAutocomplete: function () {
        var selected = this.element.children(":selected"),
                value = selected.val() ? selected.text() : "";
        this.input = $("<input>")
                .appendTo(this.wrapper)
                .val(value)
                .attr("title", "")
                .css("display", "table-cell")
                .css("border-radius", "4px 0 0 4px")
                .addClass("form-control")
                .autocomplete({
                    delay: 0,
                    minLength: 0,
                    source: $.proxy(this, "_source")
                })
                .tooltip({
                    tooltipClass: "ui-state-highlight"
                });
        this._on(this.input, {
            autocompleteselect: function (event, ui) {
                ui.item.option.selected = true;
                this._trigger("select", event, {
                    item: ui.item.option
                });
            },
            autocompletechange: "_removeIfInvalid"
        });
    },
    _createShowAllButton: function () {
        var input = this.input,
                wasOpen = false;

        this.button = $("<span></span>")
                .insertAfter(input)
                .css("display", "table-cell")
                .css("vertical-align", "middle");

        $("<a>")
                .attr("title", "Mostrar Todo")
                .tooltip()
                .appendTo(this.wrapper)
                .button({
                    icons: {
                        primary: "ui-icon-triangle-1-s"
                    },
                    text: false
                })
                .removeClass("ui-corner-all")
                .addClass("custom-combobox-toggle ui-corner-right")
                .mousedown(function () {
                    wasOpen = input.autocomplete("widget").is(":visible");
                })
                .click(function () {
                    input.focus();
// Close if already visible
                    if (wasOpen) {
                        return;
                    }
// Pass empty string as value to search for, displaying all results
                    input.autocomplete("search", "");
                });

        $("<button> </button>")
                .appendTo(this.button)
                .attr("tabIndex", -1)
                .attr("title", "Mostrar Todo")
                .css("border-radius", "0 4px 4px 0")
                .css('padding', '6px 6px')
                .css('border-left', 'none')
                .removeClass("ui-corner-all")
                .addClass("btn btn-default")
                .html("<span class='caret'></span>")
                .width("1px")
                .click(function (event) {
                    event.preventDefault();
                    // close if already visible
                    if (input.autocomplete("widget").is(":visible")) {
                        input.autocomplete("close");
                        return;
                    }
                    // pass empty string as value to search for, displaying all results
                    input.autocomplete("search", "");
                    input.focus();
                });

    },
    _source: function (request, response) {
        var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
        response(this.element.children("option").map(function () {
            var text = $(this).text();
            if (this.value && (!request.term || matcher.test(text)))
                return {
                    label: text,
                    value: text,
                    option: this
                };
        }));
    },
    _removeIfInvalid: function (event, ui) {
// Selected an item, nothing to do
        if (ui.item) {
            return;
        }
// Search for a match (case-insensitive)
        var value = this.input.val(),
                valueLowerCase = value.toLowerCase(),
                valid = false;
        this.element.children("option").each(function () {
            if ($(this).text().toLowerCase() === valueLowerCase) {
                this.selected = valid = true;
                return false;
            }
        });
// Found a match, nothing to do
        if (valid) {
            return;
        }
// Remove invalid value
        this.input
                .val("")
                .attr("title", value + " didn't match any item")
                .tooltip("open");
        this.element.val("");
        this._delay(function () {
            this.input.tooltip("close").attr("title", "");
        }, 2500);
        this.input.autocomplete("instance").term = "";
    },
    _destroy: function () {
        this.wrapper.remove();
        this.element.show();
    }
});


$(".SelectAutocomplete").SelectAutocomplete();
