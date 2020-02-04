(function() {

    window.rgbKineticSlider = function(options) {

        ///////////////////////////////    

        //  OPTIONS

        /////////////////////////////// 

        options = options || {};
        options.slideImages = options.hasOwnProperty('slideImages') ? options.slideImages : [];
        options.itemsTitles = options.hasOwnProperty('itemsTitles') ? options.itemsTitles : [];
        options.backgroundDisplacementSprite = options.hasOwnProperty('backgroundDisplacementSprite') ? options.backgroundDisplacementSprite : '';
        options.cursorDisplacementSprite = options.hasOwnProperty('cursorDisplacementSprite') ? options.cursorDisplacementSprite : '';
        options.cursorImgEffect = options.hasOwnProperty('cursorImgEffect') ? options.cursorImgEffect : true;
        options.cursorTextEffect = options.hasOwnProperty('cursorTextEffect') ? options.cursorTextEffect : true;
        options.cursorScaleIntensity = options.hasOwnProperty('cursorScaleIntensity') ? options.cursorScaleIntensity : 0.25;
        options.cursorMomentum = options.hasOwnProperty('cursorMomentum') ? options.cursorMomentum : 0.14;
        options.swipe = options.hasOwnProperty('swipe') ? options.swipe : true;
        options.swipeDistance = options.hasOwnProperty('swipeDistance') ? options.swipeDistance : 500;
        options.slideTransitionDuration = options.hasOwnProperty('slideTransitionDuration') ? options.slideTransitionDuration : 1;
        options.transitionScaleIntensity= options.hasOwnProperty('transitionScaleIntensity') ? options.transitionScaleIntensity : 40;
        options.transitionScaleAmplitude= options.hasOwnProperty('transitionScaleAmplitude') ? options.transitionScaleAmplitude : 300;
        options.swipeScaleIntensity= options.hasOwnProperty('swipeScaleIntensity') ? options.swipeScaleIntensity : 0.3;
        options.transitionSpriteRotation= options.hasOwnProperty('transitionSpriteRotation') ? options.transitionSpriteRotation : 0;
        options.nav = options.hasOwnProperty('nav') ? options.nav : true;
        options.textsRgbEffect = options.hasOwnProperty('textsRgbEffect') ? options.textsRgbEffect : true;
        options.imagesRgbEffect = options.hasOwnProperty('imagesRgbEffect') ? options.imagesRgbEffect : false; 
        options.textsSubTitleDisplay = options.hasOwnProperty('textsSubTitleDisplay') ? options.textsSubTitleDisplay : false;
        options.textsDisplay = options.hasOwnProperty('textsDisplay') ? options.textsDisplay : false; 
        options.textsTiltEffect = options.hasOwnProperty('textsTiltEffect') ? options.textsTiltEffect : true; 
        options.googleFonts = options.hasOwnProperty('googleFonts') ? options.googleFonts : ['Roboto:400'];
        options.buttonMode = options.hasOwnProperty('buttonMode') ? options.buttonMode : true;
        options.textTitleColor = options.hasOwnProperty('textTitleColor') ? options.textTitleColor : 'white'; 
        options.textTitleSize = options.hasOwnProperty('textTitleSize') ? options.textTitleSize : 125;
        options.mobileTextTitleSize = options.hasOwnProperty('mobileTextTitleSize') ? options.mobileTextTitleSize : 45;
        options.textTitleLetterspacing = options.hasOwnProperty('textTitleLetterspacing') ? options.textTitleLetterspacing : 3; 
        options.textSubTitleColor = options.hasOwnProperty('textSubTitleColor') ? options.textSubTitleColor : 'white'; 
        options.textSubTitleSize = options.hasOwnProperty('textSubTitleSize') ? options.textSubTitleSize : 21; 
        options.mobileTextSubTitleSize = options.hasOwnProperty('mobileTextSubTitleSize') ? options.mobileTextSubTitleSize : 14;
        options.textSubTitleLetterspacing = options.hasOwnProperty('textSubTitleLetterspacing') ? options.textSubTitleLetterspacing : 3; 
        options.textSubTitleOffsetTop = options.hasOwnProperty('textSubTitleOffsetTop') ? options.textSubTitleOffsetTop : 120; 
        options.mobileTextSubTitleOffsetTop = options.hasOwnProperty('mobileTextSubTitleOffsetTop') ? options.mobileTextSubTitleOffsetTop : 40; 
        options.textsRgbIntensity = options.hasOwnProperty('textsRgbIntensity') ? options.textsRgbIntensity : 0.09;
        options.navTextsRgbIntensity = options.hasOwnProperty('navTextsRgbIntensity') ? options.navTextsRgbIntensity : 10; 
        options.imagesRgbIntensity = options.hasOwnProperty('imagesRgbIntensity') ? options.imagesRgbIntensity : 0.9;
        options.navImagesRgbIntensity= options.hasOwnProperty('navImagesRgbIntensity') ? options.navImagesRgbIntensity : 100;

        ///////////////////////////////    

        //  PIXI letS

        ///////////////////////////////

        let imgWidth = 1920;
        let imgHeight = 1080;

        // remove pixi message in console
        PIXI.utils.skipHello();

        const renderer = new PIXI.autoDetectRenderer(imgWidth,imgHeight, {
            transparent: true,
            autoResize: true,
            resolution: devicePixelRatio,
        }); 

        const canvas = document.getElementById("rgbKineticSlider");
        const stage = new PIXI.Container();
        const mainContainer = new PIXI.Container();
        const imagesContainer = new PIXI.Container();
        const textsContainer = new PIXI.Container();
        const textsSubContainer = new PIXI.Container();

        // displacement variables used for slides transition 
        const dispSprite = new PIXI.Sprite.from(options.backgroundDisplacementSprite );
        const dispFilter = new PIXI.filters.DisplacementFilter(dispSprite);

        // displacement variables used for cursor moving effect
        const dispSprite_2 = PIXI.Sprite.from(options.cursorDisplacementSprite);
        const dispFilter_2 = new PIXI.filters.DisplacementFilter(dispSprite_2);

        // colors filters
        const splitRgb = new PIXI.filters.RGBSplitFilter;
        const splitRgbImgs = new PIXI.filters.RGBSplitFilter;
        
        // main elements
        let render; // pixi render
        let mainLoopID; // raf

        let slideImages;
        let slideTexts;
        let slideTextsSub;

        // slide index
        let currentIndex = 0;
        // swipping flag
        let is_swipping = false;
        let drag_start = 0;
        // transition flag
        let is_playing = false;
        // movig flag
        let is_moving = false;
        // load flag
        let is_loaded = false;

        // set some variables for mouseposition and moving effect
        let posx = 0,
            posy = 0,
            vx = 0,
            vy = 0,
            kineX = 0,
            kineY = 0;

        // include the web-font loader script dynamically
        (function() {
            let wf = document.createElement('script');
            wf.src = (document.location.protocol === 'https:' ? 'https' : 'http') +
                '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
            wf.type = 'text/javascript';
            wf.async = 'true';
            let s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(wf, s);
        }());

        ///////////////////////////////    

        //  Build pixi scene

        ///////////////////////////////

        function build_scene() {

            // append render to canvas
            canvas.appendChild(renderer.view);

            // set dispFilter to the stage
            stage.filters = [dispFilter];
            // stage.scale.set(2)

            // enable cursorInteractive on mainContainer
            mainContainer.interactive = true;

            // apply rgbsplit effect on texts
            if(options.textsRgbEffect == true) {

                textsContainer.filters = [splitRgb];
                textsSubContainer.filters = [splitRgb];

                // set rgbSplitFilter to 0
                splitRgb.red = [0, 0];
                splitRgb.green = [0, 0];
                splitRgb.blue = [0, 0];
            }

            if(options.cursorTextEffect == true) {
                textsContainer.filters = [dispFilter_2, splitRgb];
                textsSubContainer.filters = [dispFilter_2, splitRgb];
            }
            
            // apply rgbsplit effect on imgs
            if( (options.imagesRgbEffect == true) && (options.cursorImgEffect == true ) ) {

                if(options.cursorImgEffect  == true) {
                    imagesContainer.filters = [dispFilter_2, splitRgbImgs];
                }

                else {
                    imagesContainer.filters = [splitRgbImgs];
                }
                
                splitRgbImgs.red = [0, 0];
                splitRgbImgs.green = [0, 0];
                splitRgbImgs.blue = [0, 0];

            }

            else {
                if(options.cursorImgEffect  == true) {
                    imagesContainer.filters = [dispFilter_2];
                }
            }

            // Displacement sprites and filters set up
            dispSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
            dispFilter.autoFit = false;
            dispFilter.padding = 0;
            dispSprite_2.anchor.set(0.5);
            dispFilter_2.scale.x = 0;
            dispFilter_2.scale.y = 0;
            
            // renderer settings
            renderer.view.style.objectFit = 'cover';
            renderer.view.style.width = '100%';
            renderer.view.style.height = '100%';
            renderer.view.style.top = '50%';
            renderer.view.style.left = '50%';
            renderer.view.style.webkitTransform = 'translate( -50%, -50% ) scale(1.15)';
            renderer.view.style.transform = 'translate( -50%, -50% ) scale(1.15)';
            

            //  Add children to the main container
            mainContainer.addChild(imagesContainer, textsContainer, textsSubContainer, dispSprite_2);

            // Add children to the stage = canvas
            stage.addChild(mainContainer, dispSprite);

            // pixi render animation
            render = new PIXI.Ticker();
            render.autoStart = true;
            render.add(function(delta) {
                renderer.render(stage);
            });
        }

        
        ///////////////////////////////    

        //  Build pixi img elements

        ///////////////////////////////

        function build_imgs() {

            for (let i = 0; i < options.slideImages.length; i++) {
                
                // get texture from image
                texture = new PIXI.Texture.from(options.slideImages[i]);
                // set sprite from texture
                imgSprite = new PIXI.Sprite(texture);

                // center img
                imgSprite.anchor.set(0.5);
                imgSprite.x = renderer.width / 2;
                imgSprite.y = renderer.height / 2;
                
                // hide all imgs
                TweenMax.set(imgSprite, {
                    alpha: 0
                });

                // add img to the canvas
                imagesContainer.addChild(imgSprite);
            }

            slideImages = imagesContainer.children;
        }


        ///////////////////////////////    

        //  Build pixi texts elements

        ///////////////////////////////

        let titleSize;
        let subtitleSize;
        let subtitleOffsetTop;

        function build_texts() {
            
            // make sure array is not empty
            if(options.itemsTitles.length > 0) {

                // build  titles
                if( options.textsDisplay == true) {
                    
                    // set mobile font size based on window size
                    if(window.innerWidth < 768) {
                        titleSize = options.mobileTextTitleSize ;
                        subtitleSize = options.mobileTextSubTitleSize;
                        subtitleOffsetTop = options.mobileTextSubTitleOffsetTop; 
                    }
                    else {
                        titleSize = options.textTitleSize ;
                        subtitleSize = options.textSubTitleSize;
                        subtitleOffsetTop = options.textSubTitleOffsetTop; 
                    }

                    for (let i = 0; i < options.itemsTitles.length; i++) {
                        // get font family value from options array
                        // we need to separate font-family and font-weight from titles and subtitles
                        // ['Playfair Display:700', 'Roboto:400']
                        // for first array, get string before :
                        let font_1 = options.googleFonts[0].split(':')[0];
                        let word_wrap;

                        if(window.innerWidth < 768) {
                            word_wrap = window.innerWidth * 1.5;
                        }

                        else {
                            word_wrap = window.innerWidth / 2
                        }

                        // get string after :
                        let fontWeight_1 = options.googleFonts[0].split(":").pop();
                        textTitles = new PIXI.Text(options.itemsTitles[i][0], {
                            fontFamily: font_1,
                            fontSize: titleSize,
                            fontWeight: fontWeight_1,
                            fill:  options.textTitleColor,
                            align: 'left',
                            padding : 0, // todo : make it optionnable
                            wordWrap: true, // todo : make it optionnable
                            wordWrapWidth: word_wrap, // todo : make it optionnable
                            letterSpacing: options.textTitleLetterspacing,
                        });
                        
                        // texts centering
                        textTitles.anchor.set(0.5);
                        textTitles.x = renderer.width / 2;
                        textTitles.y = renderer.height / 2;

                        textsContainer.addChild(textTitles);
                        
                        // hide all titles on init
                        TweenMax.set(textTitles, {
                            alpha: 0
                        });

                        if(options.buttonMode == true) {

                            textTitles.interactive = true;
                            textTitles.buttonMode = true;

                            // Pointers normalize touch and mouse
                            textTitles.on('pointerdown', onClick);

                            function onClick() {
                                // do something on click
                            }
                        }
                    }

                    slideTexts = textsContainer.children;
                    
                    // build subtitles
                    if( options.textsSubTitleDisplay == true) {

                        for (let i = 0; i < options.itemsTitles.length; i++) {
                            // get font family value from options array
                            // we need to separate font-family and font-weight from titles and subtitles
                            // ['Playfair Display:700', 'Roboto:400']
                            // for second array, get string before :
                            let font_2 = options.googleFonts[1].split(':')[0];
                            // get string after :
                            let fontWeight_2 = options.googleFonts[1].split(":").pop();
                            let word_wrap;

                            if(window.innerWidth < 768) {
                                word_wrap = renderer.width / 1.5
                            }

                            else {
                                word_wrap = renderer.width / 2
                            }
                            
                            textTitles2 = new PIXI.Text(options.itemsTitles[i][1], {
                                fontFamily: font_2,
                                fontSize: subtitleSize,
                                fontWeight: fontWeight_2,
                                fill: options.textSubTitleColor,
                                align: 'left',
                                wordWrap: true,
                                wordWrapWidth: word_wrap,
                                letterSpacing: options.textSubTitleLetterspacing,
                            });
                            
                            // texts centering
                            textTitles2.anchor.set(0.5);
                            textTitles2.x = textTitles.x;
                             textTitles2.y = textTitles.y + subtitleOffsetTop;
                            textsSubContainer.addChild(textTitles2);
                            
                            // hide all subtitles on init
                            TweenMax.set(textTitles2, {
                                alpha: 0
                            });
                        }

                        slideTextsSub = textsSubContainer.children;
                    }
                }
            }
            
        }

        ///////////////////////////////    

        //  Slide transition effect

        ///////////////////////////////

        function slideTransition(next) {

            // center displacement
            dispSprite.anchor.set(0.5);
            dispSprite.x = renderer.view.width / 2;
            dispSprite.y = renderer.view.height / 2;
            
            // set timeline with callbacks
            timelineTransition = new TimelineMax({
                onStart: function() {

                    // update playing flag
                    is_playing = true;
                    // update draging flag
                    is_swipping = false;

                    dispSprite.rotation = 0;
                },

                onComplete: function() {
                    
                    // reset rgb values
                    if(options.textsRgbEffect == true) {
                        splitRgb.red = [0, 0];
                        splitRgb.green = [0, 0];
                        splitRgb.blue = [0, 0];
                    }

                    if(options.imagesRgbEffect == true) {
                        splitRgbImgs.red = [0, 0];
                        splitRgbImgs.green = [0, 0];
                        splitRgbImgs.blue = [0, 0];
                    }
                    

                    // update flags
                    is_playing = false;
                    is_swipping = false;

                    // after the first transition
                    // will prevent first animation transition
                    is_loaded = true

                    // set new index
                    currentIndex = next;
                },

                onUpdate: function() {

                    dispSprite.rotation =  options.transitionSpriteRotation; // frequency
                    dispSprite.scale.set( timelineTransition.progress() * options.transitionScaleIntensity);

                    if( is_loaded === true) {
                        
                        // rgb shift effect for navigation transition
                        // if text rgb effect is enable
                        if(options.textsRgbEffect == true) {

                            // on first half of transition
                            // match splitRgb values with timeline progress / from 0 to x
                            if(timelineTransition.progress() < 0.5) {
                                splitRgb.red = [timelineTransition.progress() * options.navTextsRgbIntensity, 0];
                                splitRgb.green = [0, 0];
                                splitRgb.blue = [(- ( timelineTransition.progress() )), 0];
                            }
                            // on second half of transition
                            // match splitRgb values with timeline progress / from x to 0
                            else {
                                splitRgb.red = [-(options.navTextsRgbIntensity - timelineTransition.progress() * options.navTextsRgbIntensity), 0];
                                splitRgb.green = [0, 0];
                                splitRgb.blue = [( (options.navTextsRgbIntensity - timelineTransition.progress() * options.navTextsRgbIntensity)), 0];
                            }
                        }
                        
                        // if img rgb effect is enable
                        if(options.imagesRgbEffect == true) {

                            // on first half of transition
                            // match splitRgb values with timeline progress / from 0 to x
                            if(timelineTransition.progress() < 0.5) {
                                splitRgbImgs.red = [-timelineTransition.progress() * options.navImagesRgbIntensity, 0];
                                splitRgbImgs.green = [0, 0];
                                splitRgbImgs.blue = [ ( timelineTransition.progress() ), 0];
                            }
                            
                            // on second half of transition
                            // match splitRgb values with timeline progress / from x to 0
                            else {
                                splitRgbImgs.red = [-(options.navImagesRgbIntensity - timelineTransition.progress() * options.navImagesRgbIntensity), 0];
                                splitRgbImgs.green = [0, 0];
                                splitRgbImgs.blue = [( (options.navImagesRgbIntensity - timelineTransition.progress() * options.navImagesRgbIntensity)), 0];

                            }
                        }
                    }
                }
            });
            
            // make sure timeline is finish
            timelineTransition.clear();
            if (timelineTransition.isActive() ) {
                return;
            }

            var scaleAmp;

            // prevent first animation transition
            if( is_loaded === false) {
                scaleAmp = 0;
            }
            // the first transition is done > applly effect
            else {
                scaleAmp = options.transitionScaleAmplitude;
            }
            
            // if titles and subtitles are active
            if( (options.textsSubTitleDisplay  == true) && (options.textsDisplay == true) && (options.itemsTitles.length > 0) ) {

                timelineTransition
                    .to(dispFilter.scale, options.slideTransitionDuration, {
                        x: scaleAmp,
                        y: scaleAmp,
                        ease: Power2.easeIn
                    })
                    .to([slideImages[currentIndex], slideTexts[currentIndex], slideTextsSub[currentIndex]], options.slideTransitionDuration, {
                            alpha: 0,
                            ease: Power2.easeOut
                        }, options.slideTransitionDuration * 0.5)
                    .to([slideImages[next], slideTexts[next], slideTextsSub[next]], options.slideTransitionDuration, {
                            alpha: 1,
                            ease: Power2.easeOut
                        }, options.slideTransitionDuration * 0.5)
                    .to(dispFilter.scale, options.slideTransitionDuration, {
                        x: 0,
                        y: 0,
                        ease: Power1.easeOut
                    }, options.slideTransitionDuration);
            }

            // if subtitles inactive and title active
            else if( (options.textsSubTitleDisplay  == false) && (options.textsDisplay == true) && (options.itemsTitles.length > 0))  {

                timelineTransition
                    .to(dispFilter.scale, options.slideTransitionDuration, {
                        x: scaleAmp,
                        y: scaleAmp,
                        ease: Power2.easeIn
                    })
                    .to([slideImages[currentIndex], slideTexts[currentIndex]], options.slideTransitionDuration, {
                            alpha: 0,
                            ease: Power2.easeOut
                        }, options.slideTransitionDuration * 0.5)
                    .to([slideImages[next], slideTexts[next]], options.slideTransitionDuration, {
                            alpha: 1,
                            ease: Power2.easeOut
                        }, options.slideTransitionDuration * 0.5)
                    .to(dispFilter.scale, options.slideTransitionDuration, {
                        x: 0,
                        y: 0,
                        ease: Power1.easeOut
                    }, options.slideTransitionDuration);
            }
            
            else {
                timelineTransition
                    .to(dispFilter.scale, options.slideTransitionDuration , {
                        x: scaleAmp,
                        y: scaleAmp,
                        ease: Power2.easeIn
                    })
                    .to(slideImages,  options.slideTransitionDuration, {
                            alpha: 0,
                            ease: Power2.easeOut
                        }, options.slideTransitionDuration * 0.5)
                    .to([slideImages[next]], options.slideTransitionDuration, {
                            alpha: 1,
                            ease: Power2.easeOut
                        }, options.slideTransitionDuration * 0.5)
                    .to(dispFilter.scale, options.slideTransitionDuration, {
                        x: 0,
                        y: 0,
                        ease: Power1.easeOut
                    }, options.slideTransitionDuration);
            }
        };

        ///////////////////////////////    

        //  Mouse move event

        ///////////////////////////////

        function cursorInteractive() {

            // mousemove event
            // because pixi stage has a 1.15 scale factor,
            // we need to use native listener in order to get the real mouse coordinates (not affected by scale)
            window.addEventListener("mousemove", onPointerMove);
            window.addEventListener("touchmove", onTouchMove);

            // track user mouse position
            function onPointerMove(e) {
                posx = e.clientX;
                posy = e.clientY;
            }

            function onTouchMove(e) {
                posx = e.touches[0].clientX;
                posy = e.touches[0].clientY;
            }
            
            // enable raf loop
            mainLoop();
        }

        
        ///////////////////////////////    

        //  Main loop for animations

        ///////////////////////////////

        function mainLoop() {
            
            // enable raf animation
            mainLoopID = requestAnimationFrame(mainLoop);

            // if user is out of screen
             if(posy <= 0 || posx <= 0 || (posx >=  (window.innerWidth - 2 ) || posy >= (window.innerHeight - 2 ))) {

                is_moving = false;
                // re-init values
                posx = vx = window.innerWidth / 2;
                posy = vy = window.innerHeight / 2;             
                kineX = kineY = newkineX = newkineY = 0;

            }

            else {
                 is_moving = true;
            }

            // get mouse position with momentum
            vx += ((posx - vx) * options.cursorMomentum);
            vy += ((posy - vy) * options.cursorMomentum);
    
            // update kineX / kineY based on posx / posy and vx / vy
            kineX = Math.floor(posx - vx);
            kineY = Math.floor(posy - vy);

            // enable text tilt effect
            if(options.textsTiltEffect == true) {
                tilt( currentIndex, kineX, kineY )
            }

            // if flag has changed 
            if( is_moving === true ) {
                // update cursor displacement sprite positions on cursor moving
                dispSprite_2.x = vx;
                dispSprite_2.y = vy ;

                TweenMax.to(dispFilter_2.scale, 0.5, {
                        x: kineX * options.cursorScaleIntensity,
                        y: kineY *  options.cursorScaleIntensity,
                        ease: Power4.easeOut
                });
            }

            // make background displacement follow mouse position on transition events
            if ((is_playing)) {
                dispSprite.x = vx;
                dispSprite.y = vy;
            }
     
            // if user is swipping 
            if (is_swipping) {
                
                // update slide displacement sprite positions
                dispSprite.x = vx;
                dispSprite.y = vy;
                // move displacement filter to cursor position 
                dispFilter.x = vx;
                dispFilter.y = vy;
                // map displacement filter scale value with user swipping intensity
                dispFilter.scale.x = kineX * (options.swipeScaleIntensity);
                dispFilter.scale. y = kineY * (options.swipeScaleIntensity);

                // if text rgb effect enable
                if(options.textsRgbEffect == true) {
                    splitRgb.red = [(kineX * options.textsRgbIntensity), 0];
                    splitRgb.green = [0, 0];
                    splitRgb.blue = [(-kineX * options.textsRgbIntensity), 0];
                }
                // if img rgb effect enable
                if(options.imagesRgbEffect == true) {
                    splitRgbImgs.red = [(kineX * options.imagesRgbIntensity), 0];
                    splitRgbImgs.green = [0, 0];
                    splitRgbImgs.blue = [(-kineX * options.imagesRgbIntensity), 0];
                } 
            }
        }

        ///////////////////////////////    

        //  Drag / swipe event

        ///////////////////////////////

        function swipe() {

            if(options.swipe == true) {

                mainContainer
                        .on('pointerdown', onDragStart)
                        .on('pointerup', onDragEnd)
                        .on('pointermove', onDragMove)
            
                // drag start
                function onDragStart(event) {
                    
                    if (is_playing) {
                        return;
                    }
                    
                    // get event position as data
                    this.data = event.data;
                    drag_start = this.data.getLocalPosition(this.parent);

                    // this.drag = true;
                    is_swipping = true;

                    // disable rgbSplit effect
                    if(options.textsRgbEffect == true) {
                        splitRgb.red = [0, 0];
                        splitRgb.green = [0, 0];
                        splitRgb.blue = [0, 0];
                    }

                    if(options.imagesRgbEffect == true) {
                        splitRgbImgs.red = [0, 0];
                        splitRgbImgs.green = [0, 0];
                        splitRgbImgs.blue = [0, 0];
                    }
                }
                
                // drag end
                function onDragEnd() {
                    
                    // make sure slide transition is not playing
                    if (is_playing) {
                        return;
                    }
                    
                    // disable rgbSplit effect
                    if(options.textsRgbEffect == true) {
                        splitRgb.red = [0, 0];
                        splitRgb.green = [0, 0];
                        splitRgb.blue = [0, 0];
                    }

                    if(options.imagesRgbEffect == true) {
                        splitRgbImgs.red = [0, 0];
                        splitRgbImgs.green = [0, 0];
                        splitRgbImgs.blue = [0, 0];
                    }

                    // reset displacement filter scale value to 0
                    TweenMax.to(dispFilter.scale, 0.5, {
                        x: 0,
                        y: 0,
                        ease: Power4.easeOut
                    });

                    // update dispFilter position 
                    TweenMax.to(dispFilter, 0.5, {
                        x: vx,
                        y: vy,
                        ease: Power4.easeOut
                    });

                    // update swiping flag
                    this.data = null;
                    is_swipping = false; 
                }

                // drag move > swipe
                function onDragMove() {
                    
                    // make sure slide transition is completed and user is swipping
                    if (is_playing) {
                        return;
                    }

                    if (is_swipping) {

                        // get the new position
                        let newPosition = this.data.getLocalPosition(this.parent);
                        
                        // if user swipe the screen from left to right : next slide
                        if ((drag_start.x - newPosition.x) < - options.swipeDistance) {
                            if (currentIndex >= 0 && currentIndex < options.slideImages.length - 1) {
                                slideTransition(currentIndex + 1);
                            } else {
                                slideTransition(0);
                            }
                        }
                        
                        // if user swipe from right to left : prev slide
                        if ((drag_start.x - newPosition.x) > options.swipeDistance) {
                            if (currentIndex > 0 && currentIndex < options.slideImages.length) {
                                slideTransition(currentIndex - 1);
                            } else {
                                slideTransition(options.slideImages.length - 1);
                            }
                        }
                    }
                }
            }
        }

        ///////////////////////////////    

        //  Texts tilt effect

        ///////////////////////////////

        function tilt(currentIndex, kineX, kineY) {

            if(options.itemsTitles.length > 0) {

                if( options.textsDisplay == true) {

                    TweenMax.to(slideTexts[currentIndex], 2, {
                        x: (renderer.width / 2) - (kineX * 0.1),
                        y: (renderer.height / 2) - (kineY * 0.2),
                        ease: Expo.easeOut
                    });

                    if( options.textsSubTitleDisplay == true) {
                        TweenMax.to(slideTextsSub[currentIndex], 2, {
                            x: (renderer.width / 2) - (kineX * 0.25),
                            y: (renderer.height / 2 + subtitleOffsetTop) - (kineY * 0.2),
                            ease: Expo.easeOut
                        });
                    }
                }
            }
        }

        ///////////////////////////////    

        //  navigation 

        ///////////////////////////////

        if(options.nav == true) {

            let nav = document.querySelectorAll('.main-nav');

            for (let i = 0; i < nav.length; i++) {

                let navItem = nav[i];

                navItem.onclick = function(event) {

                    // Make sure the previous transition has ended
                    if (is_playing) {
                        return false;
                    }

                    const active = document.querySelector('.active');

                    if(active){
                        active.classList.remove('active');
                    }
                      this.classList.add('active');

                    if (this.getAttribute('data-nav') === 'next') {
                        if (currentIndex >= 0 && currentIndex < options.slideImages.length - 1) {
                            slideTransition(currentIndex + 1);
                        } else {
                            slideTransition(0);
                        }
                    } else {
                        if (currentIndex > 0 && currentIndex < options.slideImages.length) {
                            slideTransition(currentIndex - 1);
                        } else {
                            slideTransition(options.slideImages.length - 1);
                        }
                    }
                    return false;
                }
            }
        }

        ///////////////////////////////    

        //  init 

        ///////////////////////////////

        function init() {
            
            // re init renderer on ready
            renderer.resize(imgWidth,imgHeight);

            // construct
            build_scene();
            build_imgs();
            resizeTexts();

            // interactivity
            cursorInteractive();
            swipe();
            slideTransition(currentIndex);
            
            // Listen for window resize events
            window.addEventListener('resize', resizeTexts);
            function resizeTexts() {
                // build_imgs();
                if(window.innerWidth < 768) {
                    build_texts();
                    renderer.render(stage);
                }

                else {
                    build_texts();
                    renderer.render(stage);
                }
                
            }
        };

        // Load them google fonts before starting...!
        window.WebFontConfig = {
            google: {
                families: options.googleFonts
            },

            active: function() { 
                // load the stage images 
                imagesLoaded(images, function() {
                    document.body.classList.remove('loading');
                    // init slider
                    init();
                });
            }
        };
    };
})();








