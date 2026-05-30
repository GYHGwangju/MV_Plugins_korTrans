//=============================================================================
// FontLoad.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.1 2019/09/15 パラメータの型指定機能に対応
// 1.1.0 2017/03/11 本体v1.3.5(コミュニティ版)で機能しなくなる問題を修正
// 1.0.0 2016/06/02 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 폰트 불러오기
 * @author triacontane
 *
 * @param FontName1
 * @text 폰트 이름 1
 * @desc 폰트 이름
 * @default
 *
 * @param FontUrl1
 * @text 폰트 URL 1
 * @desc 폰트 파일 경로. 예: fonts/XXX.ttf
 * @default
 *
 * @param FontName2
 * @text 폰트 이름 2
 * @desc 폰트 이름
 * @default
 *
 * @param FontUrl2
 * @text 폰트 URL 2
 * @desc 폰트 파일 경로. 예: fonts/XXX.ttf
 * @default
 *
 * @param FontName3
 * @text 폰트 이름 3
 * @desc 폰트 이름
 * @default
 *
 * @param FontUrl3
 * @text 폰트 URL 3
 * @desc 폰트 파일 경로. 예: fonts/XXX.ttf
 * @default
 *
 * @param FontName4
 * @text 폰트 이름 4
 * @desc 폰트 이름
 * @default
 *
 * @param FontUrl4
 * @text 폰트 URL 4
 * @desc 폰트 파일 경로. 예: fonts/XXX.ttf
 * @default
 *
 * @param FontName5
 * @text 폰트 이름 5
 * @desc 폰트 이름
 * @default
 *
 * @param FontUrl5
 * @text 폰트 URL 5
 * @desc 폰트 파일 경로. 예: fonts/XXX.ttf
 * @default
 *
 * @param FontName6
 * @text 폰트 이름 6
 * @desc 폰트 이름
 * @default
 *
 * @param FontUrl6
 * @text 폰트 URL 6
 * @desc 폰트 파일 경로. 예: fonts/XXX.ttf
 * @default
 *
 * @param FontName7
 * @text 폰트 이름 7
 * @desc 폰트 이름
 * @default
 *
 * @param FontUrl7
 * @text 폰트 URL 7
 * @desc 폰트 파일 경로. 예: fonts/XXX.ttf
 * @default
 *
 * @param FontName8
 * @text 폰트 이름 8
 * @desc 폰트 이름
 * @default
 *
 * @param FontUrl8
 * @text 폰트 URL 8
 * @desc 폰트 파일 경로. 예: fonts/XXX.ttf
 * @default
 *
 * @param FontName9
 * @text 폰트 이름 9
 * @desc 폰트 이름
 * @default
 *
 * @param FontUrl9
 * @text 폰트 URL 9
 * @desc 폰트 파일 경로. 예: fonts/XXX.ttf
 * @default
 *
 * @param FontName10
 * @text 폰트 이름 10
 * @desc 폰트 이름
 * @default
 *
 * @param FontUrl10
 * @text 폰트 URL 10
 * @desc 폰트 파일 경로. 예: fonts/XXX.ttf
 * @default
 *
 * @param WaitLoadComplete
 * @text 로드 완료까지 대기
 * @desc 폰트의 로드가 완료되고 나서 게임을 시작합니다.
 * @default false
 * @type boolean
 *
 * @help 지정한 URL의 폰트를 지정한 이름으로 불러옵니다.
 * 로드만 하면 되므로, 기본적으로는 다른 플러그인이나
 * 스크립트와 조합해서 사용합니다.
 * 
 * 원래는 3개의 폰트만 불러올 수 있도록 설계했지만,
 *        플러그인을 번역하면서 최대 10개까지 확장했습니다.
 * 
 * 각 폰트 URL의 형식은 fonts/XXX.ttf와 같이,
 *          게임 폴더에서의 상대 경로로 지정합니다.
 *
 * 이 플러그인은 MIT 라이선스하에 배포됩니다.
 *
 * 이용약관:
 *  원작자(triacontane)의 허락 없이 수정, 재배포가 가능하며,
 *  이용 형태(상업적 이용, R-18 게임 등)에 제한이 없습니다.
 *  이 플러그인은 온전히 여러분의 것입니다.
 */

(function() {
    'use strict';
    var pluginName    = 'FontLoad';

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value === null ? '' : value;
    };

    var getParamBoolean = function(paramNames) {
        var value = (getParamOther(paramNames) || '').toUpperCase();
        return value === 'ON' || value === 'TRUE';
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramFonts = [], idString;
    for (var i = 1; i <= 10; i++) {
        idString = String(i);
        paramFonts[i] = {};
        paramFonts[i].url = getParamString(['FontUrl' + idString]);
        paramFonts[i].name = getParamString(['FontName' + idString]);
    }
    var paramWaitLoadComplete = getParamBoolean(['WaitLoadComplete']);

    //=============================================================================
    // Scene_Boot
    //  必要なフォントをロードします。
    //=============================================================================
    var _Scene_Boot_isGameFontLoaded = Scene_Boot.prototype.isGameFontLoaded;
    Scene_Boot.prototype.isGameFontLoaded = function() {
        if (!_Scene_Boot_isGameFontLoaded.apply(this)) {
            return false;
        }
        if (!this._customFontLoading) {
            this.loadCustomFonts();
        }
        return this.isCustomFontLoaded();
    };

    Scene_Boot.prototype.loadCustomFonts = function() {
        paramFonts.forEach(function(fontInfo) {
            if (fontInfo.name && fontInfo.url) {
                Graphics.loadFont(fontInfo.name, fontInfo.url);
            }
        }.bind(this));
        this._customFontLoading = true;
    };

    Scene_Boot.prototype.isCustomFontLoaded = function() {
        return !paramWaitLoadComplete || paramFonts.every(function(fontInfo) {
            return !fontInfo.name || !fontInfo.url || Graphics.isFontLoaded(fontInfo.name);
        }.bind(this));
    };
})();

