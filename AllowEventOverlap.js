//=============================================================================
// AllowEventOverlap.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/05/27 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 이벤트의 겹침 허용 플러그인
 * @author Triacontane
 *
 * @help 이벤트끼리가 맵상의 같은 위치로 이동하는 것을 허용합니다.
 *
 * 이 플러그인에는 플러그인 매개변수가 없습니다.
 *
 * MIT 라이센스 하에 공개됩니다.
 */

(function () {
    'use strict';
    var pluginName = 'AllowEventOverlap';

    var _Game_Event_isCollidedWithEvents = Game_Event.prototype.isCollidedWithEvents;
    Game_Event.prototype.isCollidedWithEvents = function(x, y) {
        var result = _Game_Event_isCollidedWithEvents.apply(this, arguments);
        if (result) {
            if (!this.isNormalPriority()) return false;
            var events = $gameMap.eventsXyNt(x, y);
            return events.some(function (event) {
                return event.isNormalPriority();
            });
        }
        return result;
    };
})();

