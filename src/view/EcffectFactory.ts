/**
 * Created by seethinks@gmail.com on 2016/8/11.
 */
// 粒子工厂，预制各种粒子效果
class EcffectFactory {

    private static _instance: EcffectFactory;
    public Ecffect_End: string = "ecffectEnd"

    public static getInstance(): EcffectFactory {
        if (!this._instance) {
            this._instance = new EcffectFactory();
        }
        return this._instance;
    }

    /**
     * 创建黄色星星
     * @param liveSec 存在时间
     */
    public createStar(liveSec: number = 500, p: egret.Point = null, completeFunc:Function): void {
        var system: particle.ParticleSystem;
        var texture = RES.getRes("common.star01");
        var config = RES.getRes("star01_json");
        system = new particle.GravityParticleSystem(texture, config);
        system.x = p.x;
        system.y = p.y;
        system.start(liveSec);
        LayerManager.TopLayer.addChild(system);
        TweenMax.to(system, liveSec / (liveSec - 100), {
            onComplete: function (): void {
                var spr: egret.Sprite = new egret.Sprite();
                spr.touchEnabled = false;
                spr.graphics.beginFill(0xffffff, 0)
                spr.graphics.drawRect(0, 0, 300, 300)
                spr.graphics.endFill();
                spr.x = p.x - system.x * .5;
                spr.y = p.y - system.y * .5;
                LayerManager.TopLayer.addChild(spr);
                LayerManager.TopLayer.removeChild(system);
                TweenMax.to(system, .01, {
                    onComplete: function (): void {
                        LayerManager.TopLayer.removeChild(spr);
                    }
                });
            }
        })
    }

    public createMoreStar(liveSec: number = 500, p: egret.Point = null): void {
        var l: number = Math.random() * 8 + 8;
        var timer: egret.Timer = new egret.Timer(120, l);
        timer.addEventListener(egret.TimerEvent.TIMER, function (): void {
            var sw: number = LayerManager.stage.stageWidth * .5;
            var sh: number = LayerManager.stage.stageHeight * .5;
            this.createStar(liveSec, new egret.Point(Math.random() * sw + sw * .5, Math.random() * sh + sh * .5));
        }, this)
        timer.start();
    }

    /**
     * 创建蓝色星星
     * @param liveSec 存在时间
     */
    public createStarBlue(): particle.ParticleSystem {
        var system: particle.ParticleSystem;
        var texture = RES.getRes("common.star02");
        var config = RES.getRes("star02_json");
        system = new particle.GravityParticleSystem(texture, config);
        system.start(100000);
        return system;
    }

    /**
     * 创建蓝色的光晕
     */
    public createBuleLight(): egret.MovieClip {
        var data = RES.getRes("light01.json");
        var txtr = RES.getRes("light01.png");
        var mcFactory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, txtr);
        var light01: egret.MovieClip = new egret.MovieClip(mcFactory.generateMovieClipData("light01"));
        light01.once(egret.Event.COMPLETE, function (): void {
            light01.parent.removeChild(light01)
            light01 = null;
        }, this)
        light01.play();
        return light01;
    }

    /**
     * 创建橙色升级的光晕
     */
    public createOrangeLight(): egret.MovieClip {
        var data = RES.getRes("light02.json");
        var txtr = RES.getRes("light02.png");
        var mcFactory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, txtr);
        var light02: egret.MovieClip = new egret.MovieClip(mcFactory.generateMovieClipData("light02"));
        light02.once(egret.Event.COMPLETE, function (): void {
            light02.parent.removeChild(light02)
            light02 = null;
        }, this)
        light02.play();
        return light02;
    }

    /**
     * 返回一个光圈(蓝色或者红色)
     * param type = 1 或者 2 -- 1是蓝色，2是橙色
     */
    public createLightRound(type: number = 1): egret.Bitmap {
        var lightRound: egret.Bitmap = new egret.Bitmap();
        lightRound.texture = RES.getRes("common.lightRound0" + type);
        lightRound.anchorOffsetX = lightRound.width * .5;
        lightRound.anchorOffsetY = lightRound.height * .5;
        lightRound.x = lightRound.width * .5;
        lightRound.y = lightRound.height * .5;
        let func: Function = function (evt: egret.Event) {
            lightRound.rotation += 2;
        };
        var loopIndex: number = MainLoopManager.addCallBack(func, lightRound)
        lightRound.once(egret.Event.REMOVED, function (): void {
            //TweenMax.killTweensOf(tn)
            MainLoopManager.removeCallBack(loopIndex);
        }, this);

//        var tn:TweenMax = TweenMax.to(lightRound, 3, {
//            rotation: 360, repeat: -1,
//            ease: Linear.easeNone
//        });

        return lightRound;
    }

    /**
     * 创建胡牌后的闪电
     * @returns {egret.MovieClip}
     */
    public createHeLight(fuc: Function): egret.Sprite {
        var constain: egret.Sprite;
        constain = new egret.Sprite();
        var mcLoading: egret.MovieClip;
        var data = RES.getRes("heLight.json");
        var txtr = RES.getRes("heLight.png");

        var mcFactory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, txtr);
        SoundManager.getInstance().playEffect("Snd_heLight");
        var mcFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, txtr);

        mcLoading = new egret.MovieClip(mcFactory.generateMovieClipData("heLight"));
        mcLoading.addEventListener(egret.Event.COMPLETE, function (): void {
            fuc();
            mcLoading.parent.removeChild(mcLoading);
        }, this);
        mcLoading.play(1);
        mcLoading.x = -140;
        mcLoading.y = -340;
        constain.addChild(mcLoading);
        return constain;
    }

    /**
     * 创建胡牌后的牌移动到胡牌人手牌的效果
     * @returns {egret.MovieClip}
     */
    public createHeCardMove(fuc: Function): egret.Sprite {
        var container: egret.Sprite = new egret.Sprite();
        var mcLoading: egret.MovieClip;
        var data = RES.getRes("heCardMove.json");
        var txtr = RES.getRes("heCardMove.png");
        var mcFactory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, txtr);
        mcLoading = new egret.MovieClip(mcFactory.generateMovieClipData("heCardMove"));
        mcLoading.addEventListener(egret.Event.COMPLETE, function (): void {
            fuc();
            mcLoading.parent.removeChild(mcLoading)
        }, this);
        mcLoading.play(1);
        mcLoading.x = -110;
        mcLoading.y = -200;

        container.addChild(mcLoading);
        return container;
    }


    public createParticle(parent: any, particleName: string, p: egret.Point = null, liveSec: number = 500): void {
        var system: particle.ParticleSystem;
        var texture = RES.getRes(particleName + ".png");
        var config = RES.getRes(particleName + ".json");
        system = new particle.GravityParticleSystem(texture, config);
        system.x = p.x;
        system.y = p.y;
        system.start(liveSec);
        parent.addChild(system);
        TweenMax.to(system, liveSec / 1000 + .2, {
            onComplete: function (): void {
                var spr: egret.Sprite = new egret.Sprite();
                spr.touchEnabled = false;
                spr.graphics.beginFill(0xffffff, 0)
                spr.graphics.drawRect(0, 0, 500, 300)
                spr.graphics.endFill();
                spr.x = p.x - system.x * .5;
                spr.y = p.y - system.y;
                parent.addChild(spr);
                parent.removeChild(system);
                TweenMax.to(system, .1, {
                    onComplete: function (): void {
                        parent.removeChild(spr);
                    }
                });
            }
        })
    }

    /**
     * 胡牌后的大番出现特殊效果
     * @param fontName
     * @returns {egret.DisplayObjectContainer}
     */
    public createFont(fontName: string, fuc: Function = null): egret.DisplayObjectContainer {
        var container: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
        var bg: egret.Bitmap = new egret.Bitmap();
        bg.texture = RES.getRes("game.hu_font_bg");
        container.addChild(bg);
        bg.anchorOffsetY = bg.height * .5;
        bg.y = bg.height * .5;
        bg.scaleY = .1;
        TweenMax.to(bg, 0.5, {scaleY: 1});

        fuc = fuc || function () {
            };

        var he_light: egret.Bitmap = new egret.Bitmap();
        he_light.texture = RES.getRes("game.he_light");
        he_light.x = bg.width * .5 - he_light.width * .5;
        he_light.y = bg.height * .5 - he_light.height * .5;
        he_light.alpha = 0;
        TweenMax.to(he_light, 0.4, {alpha: .7, yoyo: true, repeat: -1})
        container.addChild(he_light);

        var font: egret.Bitmap = new egret.Bitmap();
        font.texture = RES.getRes("game." + fontName);
        font.anchorOffsetX = font.width * .5;
        font.anchorOffsetY = font.height * .5;
        font.x = bg.width * .5;
        font.y = bg.height - font.height * .75;
        font.scaleX = font.scaleY = 2;
        font.alpha = 0;
        TweenMax.to(font, 0.5, {scaleY: 1, scaleX: 1, alpha: 1, ease: Back.easeInOut})

        this.createParticle(container, "heXing", new egret.Point(font.x, font.y), 2000);
        container.addChild(font);

        egret.setTimeout(function () {
            TweenMax.to(font, 0.2, {scaleY: 2, scaleX: 2, alpha: 0});
            TweenMax.to(bg, 0.3, {
                alpha: 0, onComplete: function () {
                    fuc();
                    container.dispatchEventWith("ecffectEnd")
                }
            });
            TweenMax.to(he_light, 0.2, {alpha: 0});
        }, this, 2600);

        return container;
    }
}
