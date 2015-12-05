/*
 * Copyright 2015 Alexander Pustovalov
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

function isVisible(element){
    let invisibleParent = false;
    if ($(element).css("display") === "none") {
        invisibleParent = true;
    } else {
        $(element).parents().each(function (i, el) {
            if ($(el).css("display") === "none") {
                invisibleParent = true;
                return false;
            }
            return true;
        });
    }
    return !invisibleParent;
}

let ComponentOverlay = {
    options(datum) {
        if (arguments.length > 0 && datum) {
            this._options = datum;
            this.createWidget();
            //
        } else {
            return this._options;
        }
    },
    createWidget() {
        this.jElement().css({
            'position': 'absolute',
            'left': 0, top: 0,
            'width': '100%',
            'height': '1px',
            'z-index': 1035,
            'box-shadow': '0 0 3px 2px #ffffff',
            'border': '1px solid #428bca',
            'background-color': 'rgba(0, 194, 255, 0.10)'
        });
            //.addClass("umy-grid-basic-overlay umy-grid-basic-overlay-selected");
        //this._buttonGroup = $("<div style='position: absolute; table-layout: fixed; display: table; z-index: 1051; width: 500px';></div>");
        //var buttonGroupRow = $("<div class='umyproto-button-group' style='display: table-row; width: 100%; white-space: nowrap;'></div>")
        //    .appendTo(this._buttonGroup);

        this._buttonGroup = $('<div style="position: absolute; z-index: 1051;" class="umyproto-button-group"></div>');

        this._closeBtn = $("<button type='button' class='umyproto-button umyproto-button-small umyproto-button-danger'>" +
        "<span class='umyproto-icon-times'></span>" +
        "</button>").appendTo(this._buttonGroup);
        this._closeBtn.on("click.umyOverlay", (function (callback) {
            return function (e) {
                e.preventDefault();
                e.stopPropagation();
                if(callback){
                    callback(e);
                }
            }
        }(this._options.onClose)));

        for (let i = 0; i < this._options.buttons.length; i++) {
            let item = $("<button type='button' class='umyproto-button umyproto-button-small'></button>");
            if(this._options.buttons[i].menu && this._options.buttons[i].menu.length > 0){
                let itemGroup = $("<div class='umyproto-button-dropdown' data-umyproto-dropdown='{mode:\"click\"}'></div>");
                //style='box-shadow: -1px 1px 3px 1px #CCC, 1px 1px 3px 1px #CCC;'
                let menu = $("<div class='umyproto-dropdown umyproto-dropdown-small' ></div>");
                let menuList = $("<ul class='umyproto-nav umyproto-nav-dropdown'></ul>");
                for(let x = 0; x < this._options.buttons[i].menu.length; x++){
                    let menuItemWrapper = null;
                    if(this._options.buttons[i].menu[x].label === '_divider'){
                        menuItemWrapper = $("<li class='umyproto-nav-divider'></li>");
                        menuItemWrapper.appendTo(menuList);
                    } else {
                        menuItemWrapper = $("<li></li>");
                        let menuItem = $("<a href='#' class='umyproto-text-bold' >" + this._options.buttons[i].menu[x].label + "</a>");
                        menuItem.on("click.umyOverlayMenuItem", (function (callback) {
                            return function (e) {
                                e.preventDefault();
                                //e.stopPropagation();
                                if (callback) {
                                    callback(e);
                                }
                            }
                        }(this._options.buttons[i].menu[x].onClick)));
                        menuItem.appendTo(menuItemWrapper);
                        menuItemWrapper.appendTo(menuList);
                    }
                }
                menuList.appendTo(menu);
                item.appendTo(itemGroup);
                menu.appendTo(itemGroup);
                itemGroup.appendTo(this._buttonGroup);
            } else {
                item.appendTo(this._buttonGroup);
            }
            if (this._options.buttons[i].btnClass) {
                item.addClass(this._options.buttons[i].btnClass);
            }
            if(this._options.buttons[i].tooltip){
                item.attr({
                    //'data-umyproto-tooltip': '{delay: 1500}',
                    'title': this._options.buttons[i].tooltip
                });
            }
            if(this._options.buttons[i].onClick){
                item.on("click.umyOverlay", (function (callback) {
                    return function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        if (callback) {
                            callback(e);
                        }
                    }
                }(this._options.buttons[i].onClick)));
            }
            if (this._options.buttons[i].label) {
                item.append("<span>" + this._options.buttons[i].label + "</span>");
            }
            if (this._options.buttons[i].icon) {
                item.append("<span class='" + this._options.buttons[i].icon + "'></span>");
            }
            //

            // clearing
            item = null;
        }
        let self = this;

        $(this._options.pageFrameWindow).on("resize.componentOverlay", function (e) {
            if (e.target != self.domElement()) {
                e.stopPropagation();
                self.refresh();
            }
        });

        $(this._options.pageFrameWindow).on("scroll.componentOverlay", function (e) {
            if (e.target != self.domElement()) {
                e.stopPropagation();
                self.refresh();
            }
        });

        this.jElement().on("click.umyOverlay", (function(callback){
            return function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (callback) {
                    callback(e);
                }
            }
        })(this._options.onClick));

        return this;
    },
    destroy() {
        this.$domNode = null;
        window.clearTimeout(this._timeOutId);
        this._timeOutId = null;
        if(this.$highlightOverlay){
            this.$highlightOverlay.remove();
            this.$highlightOverlay = null;
        }
        if (this._buttonGroup) {
            this._closeBtn.off();
            this._closeBtn = null;
            this._buttonGroup.removeData();
            this._buttonGroup.remove();
            this._buttonGroup = null;

        }
        $(this._options.pageFrameWindow).off("resize.componentOverlay").off("scroll.componentOverlay");
        this._options = null;
        this.jElement().off("click.umyOverlay");
        this.jElement().removeData();
        this.jElement().remove();
    },
    append(domNode) {
        this.$domNode = $(domNode);
//            umy.workspace.$toolbarOverlaySection.append(this._toolbarGroup);
//        umy.workspace._umyTreeviewPanel.$panelContent.append(this._toolbarGroup);
        this.jElement().appendTo(this.$domNode[0].ownerDocument.body);
        this._buttonGroup.appendTo(this.$domNode[0].ownerDocument.body);
        this.refresh();

        //this.highlightComponent();

        //$(this._component.sortableElement()[0].ownerDocument.body).animate({
        //    scrollTop: this.jElement().offset().top
        //}, 300);
//            $(this._component.sortableElement()[0].ownerDocument.body).scrollTop(this.jElement().offset().top);
        //
        this.startRefreshCycle(15000);
        //var self = this;
        //var top = self.jElement().offset().top > 300 ? 700 : -1;
        //console.log("Overlay top: " + top);
        //var scrollTimeOutId = window.setTimeout(function(){
        //    if(top > 0){
        //        $(self._component.sortableElement()[0].ownerDocument.body).animate({
        //            scrollTop: top
        //        }, 300);
        //    }
        //    window.clearTimeout(scrollTimeOutId);
        //}, 500);
    },
    startRefreshCycle(count) {
        let self = this;
        this._autoRefreshCount = 1;
        let f = function () {
            if (self && self._autoRefreshCount && self._autoRefreshCount <= count) {
                self.refresh();
                self._timeOutId = setTimeout(f, 500);
                self._autoRefreshCount++;
            }
        };
        f();
    },
    highlightComponent() {
        if (isVisible(this.$domNode) && !this.$highlightOverlay) {
            this.$highlightOverlay = $("<div></div>")
                .appendTo(this.$domNode);
            //
            let pos = this.$domNode.offset();
            // workaround for jQuery offset - it doesn't get margin values of the first relative element in the body
            let $bodyChildren = $(this.$domNode[0].ownerDocument.body).children().filter(function () {
                let position = $(this).css("position");
                return position != "fixed";
            });
            let firstElementMargin = 0;
            if ($bodyChildren.length > 0) {
                firstElementMargin = parseInt($bodyChildren.first().css("margin-top"));
            }
            this.$highlightOverlay.css({
                'position': 'absolute',
                'top': (pos.top - 2 - firstElementMargin) + 'px',
                'left': pos.left + 'px',
                'width': this.$domNode.outerWidth() + 'px',
                'height': this.$domNode.outerHeight() + 'px',
                'z-index': 1035,
                'box-shadow': '0 0 3px 2px #ffffff',
                'border': '1px solid #428bca',
                'background-color': 'rgba(0, 194, 255, 0.10)'
            });
            //this.$highlightOverlay.on('click', (function (callback) {
            //    return function (e) {
            //        e.preventDefault();
            //        e.stopPropagation();
            //        alert(callback);
            //        callback(e);
            //    }
            //}(this._options.onClose)));
            //var timeOutId = setTimeout(function () {
            //    $overlay.remove();
            //    $overlay = null;
            //    window.clearTimeout(timeOutId);
            //}, 500);
        }
    },
    refresh() {
        if (this.$domNode) {
            //console.log(this._component);
            //console.log(umy.commons.isVisible(this._component.sortableElement()));
            if (isVisible(this.$domNode)) {
                let marginTop = parseInt(this.$domNode.css("margin-top"));
                let marginLeft = parseInt(this.$domNode.css("margin-left"));
                let height = this.$domNode.outerHeight();
                let width = this.$domNode.outerWidth();
                let pos = null;
                let clientWidth = this.$domNode[0].ownerDocument.body.clientWidth;
                // workaround for jQuery offset - it doesn't get margin values of the first relative element in the body
                let $bodyChildren = $(this.$domNode[0].ownerDocument.body).children().filter(function () {
                    let position = $(this).css("position");
                    return position != "fixed";
                });
                let firstElementMargin = 0;
                if ($bodyChildren.length > 0) {
                    firstElementMargin = parseInt($bodyChildren.first().css("margin-top"));
                }
                //
                pos = this.$domNode.offset();
                if (pos) {
                    // check if overlay has to be shown on the topmost component
                    if ((pos.top - 40) > 0) {
                        // overlay can be shown in normal mode
                        this.jElement().css({
                            "top": (pos.top - firstElementMargin) + "px",
                            "left": pos.left + "px"
                        });
                        if ((pos.left + 400) < clientWidth) {
                            this._buttonGroup.css({
                                "top": "auto",
                                "bottom": "calc(100% - " + (pos.top - 4 - firstElementMargin) + "px)",
                                "left": pos.left + "px",
                                "right": "auto"
                            });
                        } else {
                            this._buttonGroup.css({
                                "top": "auto",
                                "left": "auto",
                                "bottom": "calc(100% - " + (pos.top - 4 - firstElementMargin) + "px)",
                                "right": "calc(100% - " + (pos.left + width) + "px)"
                            });
                        }
                    } else {
                        // check the component's height, a less height allows to show overlay buttons under component
                        // instead of the top line of component
                        if (height > 60) {
                            // overlay should be placed under top line of component
                            this.jElement().css({
                                "top": (pos.top) + "px",
                                "left": pos.left + "px"
                            });
                            if ((pos.left + 400) < clientWidth) {
                                this._buttonGroup.css({
                                    "bottom": "auto",
                                    "top": (pos.top + 4 - firstElementMargin) + "px",
                                    "left": pos.left + "px",
                                    "right": "auto"
                                });
                            } else {
                                this._buttonGroup.css({
                                    "bottom": "auto",
                                    "left": "auto",
                                    "top": (pos.top + 4 - firstElementMargin) + "px",
                                    "right": "calc(100% - " + (pos.left + width) + "px)"
                                });
                            }
                        } else {
                            // overlay should be placed under bottom line of component
                            this.jElement().css({
                                "top": (pos.top) + "px",
                                "left": pos.left + "px"
                            });
                            if ((pos.left + 400) < clientWidth) {
                                this._buttonGroup.css({
                                    "bottom": "auto",
                                    "top": (pos.top + height + 4 - firstElementMargin) + "px",
                                    "left": pos.left + "px",
                                    "right": "auto"
                                });
                            } else {
                                this._buttonGroup.css({
                                    "bottom": "auto",
                                    "left": "auto",
                                    "top": (pos.top + height + 4 - firstElementMargin) + "px",
                                    "right": "calc(100% - " + (pos.left + width) + "px)"
                                });
                            }
                        }
                    }
                }
                this.jElement().css({
                    "width": width + "px",
                    "height": height + "px"
                });
            } else {
                this.jElement().hide();
                this._buttonGroup.hide();
            }
        }
    }
};

export default ComponentOverlay;
