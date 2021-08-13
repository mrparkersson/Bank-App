'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();

  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////////

//Page Navigation

// document.querySelectorAll('.nav__link').forEach(function(el){
//   el.addEventListener('click', function(e){
//     e.preventDefault();
//    const id = this.getAttribute('href');
//    document.querySelector(id).scrollIntoView({behavior:'smooth'});
//   })
// });

//1. Add event listener to common parent
//2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //Matching strategies
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
///////////////////////////////////////////
////////////////////////////////////////////

//////////////////////////////////////////
/////////////////////////////////////////
////////////////////////////////////////

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  // const s1cords = section1.getBoundingClientRect();
  // // console.log(s1cords);
  // // console.log(e.target.getBoundingClientRect());

  // // console.log('Current X scroll', window.pageXOffset, window.pageYOffset);

  // // console.log('height/width viewport', document.documentElement.clientHeight, document.documentElement.clientWidth);

  // // //scrolling
  // // window.scrollTo(s1cords.left + window.pageXOffset, s1cords.top + window.pageYOffset );

  // window.scrollTo({
  //  left: s1cords.left + window.pageXOffset,
  //    top: s1cords.top + window.pageYOffset,
  //    behavior: 'smooth'
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});

//Tapped COmponponent

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  //Guard Clause
  if (!clicked) return;

  //remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));

  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //Activate tab
  clicked.classList.add('operations__tab--active');

  //Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//Menu fade Animation
const nav = document.querySelector('.nav');

const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = 0.5;
    });
    logo.style.opacity = 0.5;
  }
};

nav.addEventListener('mouseover', function (e) {
  handleHover(e, 0.5);
});

nav.addEventListener('mouseout', function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = 1;
    });
    logo.style.opacity = 1;
  }
});

//sticky navigation

// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);

// window.addEventListener('scroll', function (e){
//   console.log(e);
// if(window.scrollY > initialCoords.top)nav.classList.add('sticky');
//  else nav.classList.remove('sticky')

// })

//sticky navigation: INtersection Observer API

// const obsCallBack = function(entries, observer){
// entries.forEach(entry=> {
//   console.log(entry)
// })
// };

// const obsOptions = {
//   root: null,
//   threshold: [0,0.2],
// }
// const observer = new IntersectionObserver(obsCallBack, obsOptions);
// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//Reveal section

const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//Lazy loading images

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  //replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

//slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

//////////
// document.addEventListener('DOMContentLoaded',function(e){
//   console.log('HTML parsed and DOM tree built!',e)
// });

// window.addEventListener('load',function(e){
//   console.log('Page is fully Loaded',e)
// });

// window.addEventListener('beforeunload',function(e){
//   e.preventDefault();
//   console.log(e);
//   e.returnValue ='';
// })

/////////////////////////////

//rgb(255,255,255);
// const randomInt =(min,max)=> Math.floor(Math.random () * (max -min * 1) + min);

// const randomColor =()=> `rgb(${randomInt(0,255)},${randomInt(0,255)},${randomInt(0,255)})`;

// //nav link
// document.querySelector('.nav__link').addEventListener('click', function(e){

// console.log('heey')
//  //stop propagation
// //  e.stopPropagation();
// })
// //Nav links
// document.querySelector('.nav__links').addEventListener('click', function(e){
//   this.style.backgroundColor = randomColor();
// })
// //nav
// document.querySelector('.nav').addEventListener('click', function(e){
//   this.style.backgroundColor = randomColor();
//   console.log('LINK');
// });

// btnScrollTo.onclick = function (e){
//   section1.scrollIntoView({behavior: 'smooth'})
// };
/////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////

// console.log(document.documentElement)
// console.log(document.head)
// console.log(document.body)

// const header = document.querySelector('.header');
// const allSelection = document.querySelectorAll('.section');
// console.log(allSelection);

// document.getElementById('section--1');
// const allButtons = document.getElementsByTagName('button')

// console.log(allButtons);

// console.log(document.getElementsByClassName('btn'));

// //Creating and inserting elements

// // insertAdjacentHTML

// const message = document.createElement('div');
// message.classList.add('cooke--message');
// message.textContent = 'We use cookies for improved functionality and analytics.';
// message.innerHTML = 'We use cookies for improved functionality and analytics.<button class= "btn btn--close-cookie"> Got it</button>';

// header.append(message);
// // header.append(message);
// // header.append(message.cloneNode(true));
// // header.after(message);

// //Delete Elements

// document.querySelector('.btn--close-cookie').addEventListener('click',function(){
//   message.remove();
// });

// //styles
// message.style.backgroundColor = 'yellow';
// message.style.fontSize ='2rem';
// message.style.width = '100%';

// console.log(getComputedStyle(message).width);

// message.style.height = Number.parseFloat(getComputedStyle(message).height,10) + 30 + 'px';

// document.documentElement.style.setProperty('--color-primary','orangered');

// //Attributes
// const logo =  document.querySelector('.nav__logo');
// console.log(logo.src);
// console.log(logo.alt)

// //Non-standard
// console.log(logo.getAttribute('designer'));

// console.log(logo.getAttribute('src'));

// const link = document.querySelector('.nav__link--btn');
// console.log(link.href);
// console.log(link.getAttribute('href'));

// //Data attributes
// console.log(logo.dataset.versionNumber);

// // Classes
// logo.classList.add('c');
// logo.classList.remove('c');
// logo.classList.toggle('c');
// logo.classList.contains('c');

// const h1 = document.querySelector('h1');
//  //Going downwards: child
//  console.log(h1.querySelectorAll('.highlight'));

//  h1.firstElementChild.style.color = 'white';
//  h1.lastElementChild.style.color = 'orangered';

//  //Going upwards: parents
//  console.log(h1.parentElement)

//  h1.closest('.header').style.background = 'var(--gradient-secondary)';
//  h1.closest('h1').style.background = 'var(--gradient-primary)';

//  //Going sideways
//  console.log(h1.previousElementSibling);
//  console.log(h1.nextElementSibling);

//  console.log(h1.parentElement.children);
//  [...h1.parentElement.children].forEach(function(el){
//    if(el !== h1) el.style.transform = 'scale(0.5)';
//  })

const johanna = {
  apples: 1,
  ideas: 1,
};

console.log(johanna.apples);

class Person {
  constructor(hey, you, him) {
    this.hey = hey;
    this.you = you;
    this.him = him;
  }

  calcPerson() {}
}
