var path = require('path');

module.exports = function(fis, isMount, options) {
    var appName = options.name || 'default';
    var deploy = options.deploy;
    var useSmartyPlugin = options.useSmartyPlugin;
    var domain = options.domain || '';

    var matchRulesWithPlugin = {
        '*.{html,ro,tpl}': {
            parser: fis.plugin('rosetta', {
                compileUsage: false
            }),
            useMap: true,
            url: '$1' // 这个比较重要
        },
        'r-*.{ro,html}': {
            packTo: '/static/elements-all.js',
            rExt: '.js'
        },
        '*/Rosetta.js': {
            isMod: false,
            standard: false
        },
        '::packager': {
            spriter: fis.plugin('csssprites', {
                scale: 0.5
            })
        },
        '{*.scss, *.ro:scss, *.sass, *.ro:sass}': {
            parser: fis.plugin('node-sass', {
                // options...
            }),
            rExt: '.css',
            useSprite: true,
            scale: 0.5,
            packTo: '/static/elements-all.css'
        },
        '{*.less, *.ro:less}': {
            parser: fis.plugin('less', {
                // options...
            }),
            rExt: '.css',
            useSprite: true,
            scale: 0.5,
            packTo: '/static/elements-all.css'
        },
        '*.css': {
            packTo: '/static/elements-all.css',
            packOrder: -100
        },
        '*': {
            release: '/static/' + appName + '/$0'
        },
        'map.json': {
            release: '/config/' + appName + '/$0'
        },
        '*.php': {
            release: '$0'
        },
        '*.tpl': {
            release: '/template/' + appName + '/$0'
        }
    };

    var matchRulesWithoutPlugin = {
        '*.{html,ro,tpl}': {
            parser: fis.plugin('rosetta', {
                compileUsage: false
            }),
            useMap: true,
            url: '$1' // 这个比较重要
        },
        'r-*.{ro,html}': {
            rExt: '.js'
        },
        '*/Rosetta.js': {
            isMod: false,
            standard: false
        },
        '::packager': {
            postpackager: fis.plugin('rosetta', {
                allInOne: true,
                left_delimiter: '{%',
                right_delimiter: '%}'
            }),
            spriter: fis.plugin('csssprites', {
                scale: 0.5
            })
        },
        '{*.scss, *.ro:scss, *.sass, *.ro:sass}': {
            parser: fis.plugin('node-sass', {
                // options...
            }),
            rExt: '.css',
            useSprite: true,
            scale: 0.5,
            packTo: '/static/elements-all.css'
        },
        '{*.less, *.ro:less}': {
            parser: fis.plugin('less', {
                // options...
            }),
            rExt: '.css',
            useSprite: true,
            scale: 0.5,
            packTo: '/static/elements-all.css'
        },
        '*.css': {
            packTo: '/static/elements-all.css',
            packOrder: -100
        },
        '*': {
            release: '/static/' + appName + '/$0'
        },
        'map.json': {
            release: '/config/' + appName + '/$0'
        },
        '*.php': {
            release: '$0'
        },
        '*.tpl': {
            release: '/template/' + appName + '/$0'
        }
    };

    var productionMatchRules = {
        '{*.js,*.ro}': {
            // fis-optimizer-uglify-js 插件进行压缩，已内置
            optimizer: fis.plugin('uglify-js')
        },
        '{*.css,*.less,*.sass,*.scss}': {
            // fis-optimizer-clean-css 插件进行压缩，已内置
            optimizer: fis.plugin('clean-css')
        },
        '*.png': {
            // fis-optimizer-png-compressor 插件进行压缩，已内置
            optimizer: fis.plugin('png-compressor')
        },
        '*': {
            domain: domain
        }
    };

    var debugMatchRules = {
        '*.{css,js,html}': {
            useHash: false
        },
        '*': {
            deploy: deploy
        }
    };

    function mount() {
        // smarty
        fis.set('system.localNPMFolder', path.join(__dirname, 'node_modules'));
        if (useSmartyPlugin) {
            fis.require('smarty')(fis);
        }

        fis.set('project.ignore', [
            'node_modules/**',
            'output/**',
            '.git/**',
            'fis-conf.js',
            'upload.py',
            'package.json'
        ]);

        fis.set('project.fileType.text', 'ro');

        if (useSmartyPlugin) {
            fis.util.map(matchRulesWithPlugin, function(selector, rules) {
                fis.match(selector, rules);
            });
        } else {
            fis.util.map(matchRulesWithoutPlugin, function(selector, rules) {
                fis.match(selector, rules);
            });
        }



        var debug = fis.media('debug');
        fis.util.map(debugMatchRules, function(selector, rules) {
            debug.match(selector, rules);
        });

        var production = fis.media('production');
        fis.util.map(productionMatchRules, function(selector, rules) {
            production.match(selector, rules);
        });
    }

    if (isMount !== false) {
        mount();
    }

    return {
        loadPath: path.join(__dirname, 'node_modules'),
        matchRules: matchRules
    }
}
