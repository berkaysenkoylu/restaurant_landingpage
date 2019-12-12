const logoText = document.getElementById('header_logo_text');
const backgroundOverlay = document.getElementById('overlay');
const backgroundImage = document.getElementById('image');
const foregroundContainer = document.getElementById('foreground');

const foregroundChildren = foregroundContainer.children;
let targetSection = 1;
let offset = 300;
let offsetPoint = 50; // This is the point at which logoText disappears or reappears

const checkPoints = [];

for(let i = 1; i < foregroundChildren.length; i++) {
    checkPoints.push(foregroundChildren[i].offsetTop + offset)
}
// console.log(checkPoints)

let initPoint = 0;
let scrollDirection;
let controlPoint;

//console.log(foregroundChildren[1].innerHeight)
let lastSection = 0;
let imageChanged = false;

let currSection = getSection(window.pageYOffset, foregroundChildren);

document.addEventListener("scroll", () => {
    // When scroll down a bit, make logo text disappear
    if(window.pageYOffset > offsetPoint) {
        logoText.classList.add('header__logo--text-disappear');
    }
    else {
        logoText.classList.remove('header__logo--text-disappear');
    }

    // BACKGROUND IMAGE CHANGE
    if(window.pageYOffset < offset) {
        backgroundOverlay.classList.remove('background__overlay--fadeOut');
    }
    
    // console.log(window.pageYOffset + window.innerHeight)
    // Get the direction of page scrolling
    if(window.pageYOffset - initPoint > 0) {
        // console.log("Going down");
        initPoint = window.pageYOffset;
        scrollDirection = 1;
    }
    else {
        // console.log("Going up");
        initPoint = window.pageYOffset;
        scrollDirection = 0;
    }

    controlPoint = window.pageYOffset;
    
    //console.log(currSection)

    // scrollDirection: 1 => Scrolling down
    // scrollDirection: 0 => Scrolling up
    if(scrollDirection === 1) {
        controlPoint = window.pageYOffset + window.innerHeight;

        checkPoints.forEach(pt => {
            if(controlPoint > pt && !imageChanged) {
                // Image activation
                changeBackground();
                // console.log("CHANGE BG IMAGE");
    
                // Set the flag
                imageChanged = true;
            }
        });
    }
    if(scrollDirection === 0) {
        controlPoint = window.pageYOffset;
        checkPoints.forEach(pt => {

            if(controlPoint < pt && !imageChanged) {
                // Image activation
                changeBackground();
                // console.log("CHANGE BG IMAGE");
    
                // Set the flag
                imageChanged = true;
            }
        });
    }
    
    currSection = getSection(controlPoint, foregroundChildren);
    if(lastSection !== currSection) {
        imageChanged = false;
        lastSection = currSection;
    }
    
    // if((window.pageYOffset + window.innerHeight)) {
    //     targetSection++;

    //     console.log("CHANGE SECTION INDEX: ", targetSection)
    // }
    

    // if(window.pageYOffset + window.innerHeight - foregroundChildren[targetSection].offsetTop > offset) {
    //     console.log("CHANGE BG IMAGE")
    // }
});

let toggled = false;
let imageIndex = 0;

// TODO: REMOVE LATER
// document.addEventListener("click", function(){
//     changeBackground();
// });

const changeBackground = () => {
    imageIndex += 1;
    if(imageIndex > 3) {
        imageIndex = 1;
    }

    backgroundOverlay.classList.remove('background__overlay--fadeOut');
    setTimeout(() => {
        backgroundOverlay.classList.add('background__overlay--fadeOut');
        backgroundImage.style.backgroundImage = `linear-gradient(to bottom right, rgba(146, 0, 33, 0.25), rgba(146, 0, 33, 0.15)), url(./img/img${imageIndex}.jpeg)`;
    }, 300);
    

    // if(!toggled){
    //     backgroundOverlay.classList.add('background__overlay--fadeOut');
    //     backgroundImage.style.backgroundImage = `url(../../img/img${imageIndex}.jpeg)`;
    // }else {
    //     backgroundOverlay.classList.remove('background__overlay--fadeOut');
    // }
    // toggled = !toggled;
}


function getSection(scrollYPos, checkpoints) {
    if(scrollYPos > checkpoints[checkpoints.length-1].offsetTop) {
        scrollYPos = checkpoints[checkpoints.length-1].offsetTop;
    }
    let section = 0;
    for(let i = 0; i < checkpoints.length; i++) {
        if(scrollYPos >= checkpoints[i].offsetTop && scrollYPos < checkpoints[i].offsetTop + checkpoints[i].clientHeight) {
            section = i;
        }
    }
    // console.log(section)

    return section;
}

// HEADER MANIPULATIONS
// Since the container residinig in the right handside of the header toolbar is fixed positioned,
// we cannot really set its position relative to its parent container. Therefore; to position `headerRightContainer`
// correctly, we need to find the computed margin-left of the wrapping element, and then reposition the
// container according to that value
const wrapper = document.getElementById('wrapper');
const headerRightContainer = document.getElementById('header-right');

// if(wrapper.offsetWidth === 1300) {
//     headerRightContainer.setAttribute('style', `right: ${(window.innerWidth - headerToolbar.offsetWidth) * 0.05}rem`); // Might be a problem!!! 0.05 ot not
// }
// else {
//     headerRightContainer.setAttribute('style', `right: 2rem`);
// }

let marginLeft;

repositionHeaderRIghtContainer();

window.addEventListener('resize', () => {
    repositionHeaderRIghtContainer()
});

function repositionHeaderRIghtContainer() {
    marginLeft = window.getComputedStyle(wrapper).getPropertyValue('margin-right');
    marginLeft = Number(marginLeft.slice(0, marginLeft.length - 2));
    if(marginLeft > 20 ) {
        headerRightContainer.setAttribute('style', `right: ${(marginLeft) * 0.1}rem`); 
    }
    else {
        headerRightContainer.setAttribute('style', `right: 2rem`); 
    }
}

// If page is refreshed while checkbox is checked, then when the page reloads,
// its value is checked, which we don't want
const burgerMenuToggleButton = document.getElementById('burger-toggle');
burgerMenuToggleButton.checked = false;

// NAVIGATION POPUP
const navPopup = document.getElementById('navigation-popup');
let isOpen = false;

const headerRightChildren = headerRightContainer.children;
const popupChildren = navPopup.children;


function onBurgermenuToggled() {
    isOpen = !isOpen;
    if(isOpen) {
        navPopup.classList.add('navigation__popup--open');
        // navPopup.setAttribute('style', `transform: scaleX(1)`); 
        
        for(let i = 0; i < headerRightChildren.length - 1; i++) {
            headerRightChildren[i].classList.add('hide__buttons');
        }

        for(popupChild of popupChildren) {
            popupChild.classList.remove('navigation__element--hide');

            // To trigger a reflow 
            void popupChild.offsetWidth;

            popupChild.classList.add('navigation__element--reveal');
        }
    }
    else {
        setTimeout(() => {
            navPopup.classList.remove('navigation__popup--open');
            // navPopup.setAttribute('style', `transform: scaleX(0)`); 
        }, 400);
        // navPopup.classList.remove('navigation__popup--open');

        for(let i = 0; i < headerRightChildren.length - 1; i++) {
            headerRightChildren[i].classList.remove('hide__buttons');
        }

        for(popupChild of popupChildren) {
            popupChild.classList.remove('navigation__element--reveal');

            // To trigger a reflow 
            void popupChild.offsetWidth;

            popupChild.classList.add('navigation__element--hide');
        }
    }
}