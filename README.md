# Kinetic slider with rgb and displacement effects

A fully customizable webgl slider based on PixiJs and Gsap. 

## Main features :

* Swipe left or right to navigate between slides (the intensity of the effect is based on cursor swipping velocity)
* Regular prev / next navigation
* Background displacement effect (on images and / or texts)
* Cursor displacement effect (on images and / or texts)
* Background image rgb split effect
* Titles and subtitles rgb split effect
 
### Demos links on codepen :

* Demo 1 on [codepen](https://codepen.io/hmongouachon/pen/QWbLpzW) 
* Demo 2 on [codepen](https://codepen.io/hmongouachon/pen/jOPNBdP) 
* Demo 3 on [codepen](https://codepen.io/hmongouachon/pen/eYNOvxB) 

Edit 2021-03-23 : Demos are temporarily broken because of CORS issue w/ codepen

## Markups :

```
<!-- slider -->
<div id="rgbKineticSlider" class="rgbKineticSlider"></div>

<!-- slider nav -->
<nav>
    <a href="#" class="main-nav prev" data-nav="previous">Prev <span></span></a>
    <a href="#" class="main-nav next" data-nav="next">Next <span></span></a>
</nav>
```

## Plugin init :

```
// images setup
const images = [
     "img/nature-01.jpg",
     "img/nature-02.jpg",
     "img/nature-03.jpg",
];

// content setup
const texts = [
    ["Earth", "Surface gravity: 9.807 m/s²"],
    ["Mars", "Surface gravity: 3.711 m/s²"],
    ["Venus", "Surface gravity: 8.87 m/s²"],
]

// init plugin 
rgbKineticSlider = new rgbKineticSlider();

```


## Plugin parameters

```
// images and content sources
slideImages: images, // array of images >demo size : 1920 x 1080
itemsTitles: texts, // array of titles / subtitles

// displacement images sources
backgroundDisplacementSprite: 'img/map-9.jpg', // slide displacement image 
cursorDisplacementSprite: 'img/displace-circle.png', // cursor displacement image

// cursor displacement effect 
cursorImgEffect : true, // enable cursor effect
cursorTextEffect : false, // enable cursor text effect
cursorScaleIntensity : 0.65, // cursor effect intensity
cursorMomentum : 0.14, // lower is slower

// swipe 
swipe: true, // enable swipe
swipeDistance : window.innerWidth * 0.4, // swipe distance - ex : 580
swipeScaleIntensity: 2, // scale intensity during swipping

// slide transition
slideTransitionDuration : 1, // transition duration
transitionScaleIntensity : 30, // scale intensity during transition
transitionScaleAmplitude : 160, // scale amplitude during transition

// regular navigation
nav: true, // enable navigation
navElement: '.main-nav', // set nav class


// image rgb effect
imagesRgbEffect : false, // enable img rgb effect
imagesRgbIntensity : 0.9, // set img rgb intensity
navImagesRgbIntensity : 80, // set img rgb intensity for regular nav 

// texts settings
textsDisplay : true, // show title
textsSubTitleDisplay : true, // show subtitles
textsTiltEffect : true, // enable text tilt
googleFonts : ['Playfair Display:700', 'Roboto:400'], // select google font to use
buttonMode : false, // enable button mode for title
textsRgbEffect : true, // enable text rgb effect
textsRgbIntensity : 0.03, // set text rgb intensity
navTextsRgbIntensity : 15, // set text rgb intensity for regular nav

textTitleColor : 'white', // title color
textTitleSize : 125, // title size
mobileTextTitleSize : 125, // title size
textTitleLetterspacing : 3, // title letterspacing

textSubTitleColor : 'white', // subtitle color ex : 0x000000
textSubTitleSize : 21, // subtitle size
mobileTextSubTitleSize : 21, // mobile subtitle size
textSubTitleLetterspacing : 2, // subtitle letter spacing
textSubTitleOffsetTop : 90, // subtitle offset top
mobileTextSubTitleOffsetTop : 90, // mobile subtitle offset top

```



## Credits & dependencies

[PixiJs](http://www.pixijs.com/)

[Pixi Filters](https://github.com/pixijs/pixi-filters) (Collection of community-authored custom display filters for PixiJS)

[Gsap](https://greensock.com/gsap/)

[Google web font loader](https://developers.google.com/fonts/docs/webfont_loader)

[imageLoaded](https://imagesloaded.desandro.com/)

Images from [Unsplash](https://unsplash.com/)

(Much) inspired by [Liquid Distortion Effects](https://tympanus.net/codrops/2017/10/10/liquid-distortion-effects/).

## License
This resource can be used freely if integrated or build upon in personal or commercial projects such as websites, web apps and web templates intended for sale. It is not allowed to take the resource "as-is" and sell it, redistribute, re-publish it, or sell "pluginized" versions of it. Free plugins built using this resource should have a visible mention and link to the original work. Always consider the licenses of all included libraries, scripts and images used.






