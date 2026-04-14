// 섹션 제목 색 채우기
let h2s = document.querySelectorAll("section h2");

function titleFill() {
  h2s.forEach((i) => {
    let h2Top = i.getBoundingClientRect().top;
    let h2UpPoint = window.innerHeight * 0.6; // 화면 30% 지점

    if (h2Top < h2UpPoint) {
      i.classList.add("active"); // 화면 30% 지점에 도달하면
    } else {
      i.classList.remove("active"); // 위로 올라가면 제거
    }
  });
}

window.addEventListener("scroll", titleFill);
window.addEventListener("resize", titleFill);

//

// about 섹션
let about = document.querySelector("#about");
let aboutAniOnce = false;

// about_상단 소개 줄나누기
let introduce = new SplitType("#about .introduce", {
  types: "lines",
});
console.log(introduce);

function introduceReLine() {
  if (introduce) {
    introduce.revert(); // 기존 split 제거
  }
  introduce = new SplitType("#about .introduce", {
    types: "lines",
  });

  introduce.lines.forEach((line) => {
    line.classList.add("up");
  });
}
window.addEventListener("resize", () => {
  introduceReLine();
});

// about_상단 순차 애니메이션
let aboutObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        let photo = about.querySelector(".photo");
        photo.classList.add("active");

        introduce.lines.forEach((line, index) => {
          setTimeout(() => {
            line.classList.add("up");
          }, index * 400);
        });

        let lineEndTime = (introduce.lines.length - 1) * 400 + 400;
        setTimeout(() => {
          if (!aboutAniOnce) {
            middleAni(); // GSAP 실행
          }
        }, lineEndTime);
      }
    });
  },
  {
    root: null,
    threshold: 0,
    rootMargin: "-40% 0px -40% 0px",
  },
);
let aboutTop = about.querySelector(".top");
aboutObserver.observe(about);

// about_중앙 파트 이벤트
function middleAni() {
  aboutAniOnce = true;
  // 공통 타임라인
  let aboutTime = gsap.timeline();

  // 학력
  document.querySelectorAll("#about .edu .box").forEach((item) => {
    let boxLine = item.querySelector(".boxLine");
    let ps = item.querySelectorAll("p");

    aboutTime.add(() => item.classList.add("on"));

    aboutTime.to(
      boxLine,
      {
        height: "100%",
        duration: 1,
        onComplete: () => {
          item.classList.add("done");
        },
      },
      "0.8",
    );
    aboutTime.fromTo(
      ps,
      { x: -20, opacity: 0 },
      {
        x: 10,
        opacity: 1,
        duration: 0.35,
        stagger: 0.5,
        ease: "back.out(1.6)",
      },
      "1",
    );
  });

  // 자격증
  document.querySelectorAll("#about .certi .box").forEach((item) => {
    let boxLine = item.querySelector(".boxLine");
    let ps = item.querySelectorAll("p");

    aboutTime.add(() => item.classList.add("on"), "+=0.5");

    aboutTime.to(
      boxLine,
      {
        height: "100%",
        duration: 2,
        onComplete: () => {
          item.classList.add("done");
          about.classList.add("on");
          dropImg();
        },
      },
      "2.8",
    );
    aboutTime.fromTo(
      ps,
      { x: -20, opacity: 0 },
      {
        x: 10,
        opacity: 1,
        duration: 0.35,
        stagger: 0.5,
        ease: "back.out(1.6)",
      },
      "3",
    );
  });
}

// about_하단 이미지
let aboutImgs = document.querySelectorAll("#about .bottom li");

// 인덱스 섞기
let randomIndex = [...Array(aboutImgs.length).keys()];
randomIndex.sort(() => Math.random() - 0.5);

let completedCount = 0;

function dropImg() {
  // 섞인 순서대로 애니메이션
  randomIndex.forEach((originalIndex, newIndex) => {
    let items = aboutImgs[originalIndex];
    let groupIndex = Math.floor(newIndex / 2.5);

    let t1 = gsap.timeline({
      delay: groupIndex * 0.3,
      onComplete: () => {
        completedCount++;
        gsap.set(items, { clearProps: "all" });

        // 심플리 스크롤 추가
        if (completedCount === randomIndex.length) {
          setTimeout(() => {
            $("#about .bottom").simplyScroll({
              speed: 1,
              // speed: 0.5,
              pauseOnHover: false,
              pauseOnTouch: false,
              autoMode: "loop",
              manualMode: "loop",
              duplicateContent: true,
            });
          }, 500);
        }
      },
    });

    // 떨어지는 애니메이션
    t1.fromTo(
      items,
      { y: -500, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        rotation: 360 + Math.random() * 360,
        duration: 1,
        ease: "power2.in", // 가속 효과
      },
    )

      .to(items, {
        y: -120,
        duration: 0.4,
        ease: "power2.out",
      })
      .to(items, {
        y: 0,
        duration: 0.4,
        ease: "power2.in",
      })

      .to(items, {
        y: -60,
        duration: 0.3,
        ease: "power2.out",
      })
      .to(items, {
        y: 0,
        duration: 0.3,
        ease: "power2.in",
      })

      .to(items, {
        y: -25,
        duration: 0.2,
        ease: "power2.out",
      })
      .to(items, {
        y: 0,
        duration: 0.2,
        ease: "power2.in",
      })

      .to(items, {
        y: -8,
        duration: 0.15,
        ease: "power2.out",
      })
      .to(items, {
        y: 0,
        duration: 0.15,
        ease: "power2.in",
      });
  });
}

//

// project_텍스트 박스 안 효과 적용
$(window).on("scroll resize", function () {
  $("#project .projectList").each(function (index) {
    let proListTop = $(this).offset().top - $(window).scrollTop();
    let proListPoint = window.innerHeight * 0.5;

    let textBox = $(this).find(".textBox");
    let filter = $(this).find(".contain > a");

    if (proListPoint > proListTop && !$(this).hasClass("animated")) {
      $(this).addClass("animated");
      $(this).find(".subTitle").addClass("down");

      if (index % 2 == 0) {
        // 홀수번째 프로젝트
        $(textBox)
          .find("h3")
          .stop(true, true)
          .delay(500)
          .animate({ "margin-left": "0px", opacity: "1" }, function () {
            $(textBox)
              .find("p")
              .stop(true, true)
              .animate({ "margin-left": "0px", opacity: "1" }, function () {
                $(textBox).find(".process").addClass("on");
                $(filter).css({ filter: "brightness(105%)" });
              });
          });
      } else {
        // 짝수번째 프로젝트
        $(textBox)
          .find("h3")
          .stop(true, true)
          .delay(500)
          .animate(
            {
              "margin-left": window.innerWidth <= 720 ? "0px" : "",
              "margin-right": window.innerWidth > 720 ? "0px" : "",
              opacity: 1,
            },
            function () {
              $(textBox)
                .find("p")
                .stop(true, true)
                .animate(
                  {
                    "margin-left": window.innerWidth <= 720 ? "0px" : "",
                    "margin-right": window.innerWidth > 720 ? "0px" : "",
                    opacity: 1,
                  },
                  function () {
                    $(textBox).find(".process").addClass("on");
                    $(filter).css({ filter: "brightness(105%)" });
                  },
                );
            },
          );
      }
    } else if (proListPoint <= proListTop && $(this).hasClass("animated")) {
      // 애니메이션 초기화
      $(this).removeClass("animated");
      $(this).find(".subTitle").removeClass("down");

      if (index % 2 == 0) {
        // 홀수번째 프로젝트
        $(textBox).find("h3").delay(500).css({
          "margin-left": "-50px",
          opacity: "0",
        });
        $(textBox).find("p").css({
          "margin-left": "-50px",
          opacity: "0",
        });
        $(textBox).find(".process").removeClass("on");
        $(filter).css({ filter: "brightness(70%)" });
      } else {
        // 짝수번째 프로젝트
        $(textBox)
          .find("h3")
          .delay(500)
          .css({
            "margin-left": window.innerWidth <= 720 ? "-50px" : "",
            "margin-right": window.innerWidth > 720 ? "-50px" : "",
            opacity: 0,
          });
        $(textBox)
          .find("p")
          .css({
            "margin-left": window.innerWidth <= 720 ? "-50px" : "",
            "margin-right": window.innerWidth > 720 ? "-50px" : "",
            opacity: 0,
          });
        $(textBox).find(".process").removeClass("on");
        $(filter).css({ filter: "brightness(70%)" });
      }
    }
  });
});

// project_커서 따라다니기
$(function () {
  $(document).on("mousemove", function (e) {
    $("#cursor").css({ left: e.clientX + "px", top: e.clientY + "px" });
  });

  $(".projectList .contain a").on("mouseenter", function () {
    $("#cursor").addClass("on");
  });
  $(".projectList .contain a").on("mouseleave", function () {
    $("#cursor").removeClass("on");
  });
});

//

// work 섹션

// ─────────────────────────────────────────────
// 1. 브레이크포인트
// ─────────────────────────────────────────────
const BP = {
  desktop: window.matchMedia("(min-width: 1220px)"),
  tablet: window.matchMedia("(min-width: 720px) and (max-width: 1219px)"),
  mobile: window.matchMedia("(max-width: 719px)"),
};

// ─────────────────────────────────────────────
// 2. DOM
// ─────────────────────────────────────────────
const workSection = document.querySelector("#work");
const workWrap = document.querySelector("#work .wrap");
const workList = document.querySelector("#work .workList");
const cards = document.querySelectorAll("#work .card");
const cardCount = cards.length;

// ─────────────────────────────────────────────
// 3. 공유 상태
// ─────────────────────────────────────────────
const state = {
  currentRotation: 0,
  lastScrollRotation: 0,
  isDragging: false,
  hasDragged: false,
  startX: 0,
  startY: 0,
  dragStartRotation: 0,
};

// ─────────────────────────────────────────────
// 4. 모드별 설정
// ─────────────────────────────────────────────
const modeConfig = {
  desktop: {
    rotateAxis: "Y",
    translateZ: 500,
    cardTranslateZ: 400,
    clamp: null,
  },
  tablet: {
    rotateAxis: "Y",
    translateZ: 500,
    cardTranslateZ: 600,
    clamp: [-60, 60],
  },
  mobile: {
    rotateAxis: "X",
    translateZ: 500,
    cardTranslateZ: 250,
    clamp: null,
  },
};

// ─────────────────────────────────────────────
// 5. 유틸리티
// ─────────────────────────────────────────────

function applyTransform(rotation) {
  const { clamp, rotateAxis, translateZ } = modeConfig[currentSize];

  if (clamp) rotation = Math.max(clamp[0], Math.min(clamp[1], rotation));

  workList.style.transform = `translateZ(${translateZ}px) rotate${rotateAxis}(${rotation}deg)`;
}

function getAngle() {
  if (currentSize === "tablet") return 120 / (cardCount - 1);
  return 360 / cardCount;
}

function snapRotation(rotation) {
  return Math.round(rotation / getAngle()) * getAngle();
}
// function snapRotation(rotation) {
//   const angle = getAngle(); // 한 번만 호출해서 변수에 저장
//   return Math.round(rotation / angle) * angle;
// }

function shortestPath(from, to) {
  let diff = ((to - from + 180) % 360) - 180;
  if (diff < -180) diff += 360;
  return from + diff;
}

// ─────────────────────────────────────────────
// 6. 카드 배치
// ─────────────────────────────────────────────
function layoutCards() {
  const angle = getAngle();
  const { rotateAxis, cardTranslateZ } = modeConfig[currentSize];

  cards.forEach((card, i) => {
    let cardAngle;

    if (currentSize === "desktop") cardAngle = i * angle;
    if (currentSize === "tablet") cardAngle = -60 + (cardCount - 1 - i) * angle;
    if (currentSize === "mobile") cardAngle = i * angle;

    card.style.transform = `rotate${rotateAxis}(${cardAngle}deg) translateZ(-${cardTranslateZ}px)`;
  });
}

// ─────────────────────────────────────────────
// 7. 카드 클릭
// ─────────────────────────────────────────────
function attachCardClicks() {
  const angle = getAngle();
  const handlers = [];

  cards.forEach((card, i) => {
    const handler = () => {
      if (state.hasDragged) return;

      let target;
      if (currentSize === "desktop")
        target = shortestPath(state.currentRotation, -(i * angle));

      if (currentSize === "tablet") {
        // target = Math.max(
        //   -60,
        //   Math.min(60, -(-60 + (cardCount - 1 - i) * angle)),
        // );
        let tabletAngle = -60 + (cardCount - 1 - i) * angle;
        target = Math.max(-60, Math.min(60, -tabletAngle));

        console.log(tabletAngle);
        console.log(target);

        console.log("currentSize:", currentSize);
        console.log("state.currentRotation 적용 전:", state.currentRotation);

        //  state.lastScrollRotation = state.currentRotation + 60;
      }

      if (currentSize === "mobile")
        target = shortestPath(state.currentRotation, -(i * angle));

      state.currentRotation = target;
      workList.style.transition = "0.5s transform ease-out";
      applyTransform(state.currentRotation);

      console.log("state.currentRotation 적용 후:", state.currentRotation);
    };
    card.addEventListener("click", handler);
    handlers.push(handler);
  });

  return () =>
    cards.forEach((card, i) => card.removeEventListener("click", handlers[i]));
}

// ─────────────────────────────────────────────
// 8. 스크롤
// ─────────────────────────────────────────────
function createScrollHandler() {
  return () => {
    if (isResizing) return;

    const rect = workSection.getBoundingClientRect();
    if (rect.top >= window.innerHeight || rect.bottom <= 0) return;
    if (currentSize === "tablet" && rect.top > 100) return;

    const sectionHeight = rect.height - window.innerHeight;
    const scrollProgress = Math.abs(rect.top) / sectionHeight;

    let scrollRotation;
    if (currentSize === "desktop") scrollRotation = scrollProgress * 360;
    if (currentSize === "tablet") scrollRotation = scrollProgress * 120; // 0~120 기준
    if (currentSize === "mobile") scrollRotation = (1 - scrollProgress) * 360; // 반대 방향

    const delta = scrollRotation - state.lastScrollRotation;
    state.currentRotation += delta;
    state.lastScrollRotation = scrollRotation;

    if (currentSize === "tablet") {
      applyTransform(state.currentRotation);
    } else {
      applyTransform(snapRotation(state.currentRotation));
    }
  };
}

// ─────────────────────────────────────────────
// 9. 드래그
// ─────────────────────────────────────────────
function createDragHandlers() {
  const onMouseDown = (e) => {
    state.isDragging = true;
    state.hasDragged = false;
    state.startX = e.clientX;
    state.startY = e.clientY;
    state.dragStartRotation = state.currentRotation;
    workList.style.transition = "none";
    workWrap.style.cursor = "grabbing";
    e.preventDefault();
  };

  const onMouseMove = (e) => {
    if (!state.isDragging) return;

    let raw;
    if (currentSize === "desktop") raw = (e.clientX - state.startX) * -0.3;
    if (currentSize === "tablet") raw = (e.clientX - state.startX) * -0.3;
    if (currentSize === "mobile") raw = (e.clientY - state.startY) * 0.3;

    if (!state.hasDragged && Math.abs(raw) < 10) return;
    state.hasDragged = true;

    state.currentRotation = state.dragStartRotation + raw;
    applyTransform(state.currentRotation);
  };

  const onMouseUp = () => {
    if (!state.isDragging) return;
    state.isDragging = false;
    workList.style.transition = "0.5s transform ease-out";
    workWrap.style.cursor = "grab";

    if (state.hasDragged) {
      state.currentRotation = snapRotation(state.currentRotation);
      applyTransform(state.currentRotation);
    }

    // mouseup 직후 발생하는 click이 hasDragged=true를 볼 수 있도록 한 틱 뒤에 초기화
    setTimeout(() => {
      state.hasDragged = false;
    }, 0);
  };

  return { onMouseDown, onMouseMove, onMouseUp };
}

// ─────────────────────────────────────────────
// 10. 이벤트 등록 / 해제
// ─────────────────────────────────────────────
function attachEvents(onScroll, drag) {
  // tablet: workWrap이 pointer-events:none → mousedown을 workSection에서 수신
  const dragTarget = currentSize === "tablet" ? workSection : workWrap;

  window.addEventListener("scroll", onScroll);
  dragTarget.addEventListener("mousedown", drag.onMouseDown);
  window.addEventListener("mousemove", drag.onMouseMove);
  window.addEventListener("mouseup", drag.onMouseUp);

  return () => {
    window.removeEventListener("scroll", onScroll);
    dragTarget.removeEventListener("mousedown", drag.onMouseDown);
    window.removeEventListener("mousemove", drag.onMouseMove);
    window.removeEventListener("mouseup", drag.onMouseUp);
  };
}

// ─────────────────────────────────────────────
// 11. 디바이스 감지 & 모드 전환
// ─────────────────────────────────────────────
let currentSize = null;
let workClean = null;
let isResizing = false;
let resizeTimer = null;

function getDeviceSize() {
  if (BP.desktop.matches) return "desktop";
  if (BP.tablet.matches) return "tablet";
  return "mobile";
}

function handleDeviceChange() {
  const nextSize = getDeviceSize();
  if (currentSize === nextSize) return;
  if (workClean) {
    workClean();
    workClean = null;
  }
  currentSize = nextSize;
  workClean = initMode();
}

BP.desktop.addEventListener("change", handleDeviceChange);
BP.tablet.addEventListener("change", handleDeviceChange);
BP.mobile.addEventListener("change", handleDeviceChange);
handleDeviceChange();

// ─────────────────────────────────────────────
// 12. 모드 초기화
// ─────────────────────────────────────────────
function initMode() {
  console.log(`▶ ${currentSize} mode`);

  // tablet 진입 시: 첫 카드(-60도)가 보이도록 초기화
  // workWrap pointer-events:none → 클릭이 카드까지 통과
  if (currentSize === "tablet") {
    state.currentRotation = -60;
    state.lastScrollRotation = 0;
    applyTransform(state.currentRotation);
    workWrap.style.pointerEvents = "none";
  }

  layoutCards();

  const removeCardClicks = attachCardClicks();
  const onScroll = createScrollHandler();
  const drag = createDragHandlers();
  const removeEvents = attachEvents(onScroll, drag);

  return () => {
    removeCardClicks();
    removeEvents();
    workWrap.style.pointerEvents = "";
  };
}

// ─────────────────────────────────────────────
// 13. 리사이즈
// ─────────────────────────────────────────────
window.addEventListener("resize", () => {
  isResizing = true;
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    isResizing = false;
    syncScrollRotation();
  }, 200);
});

// ─────────────────────────────────────────────
// 14. syncScrollRotation — 리사이즈 후 스크롤 위치 재동기화
// ─────────────────────────────────────────────
function syncScrollRotation() {
  const rect = workSection.getBoundingClientRect();
  const sectionHeight = rect.height - window.innerHeight;
  if (sectionHeight <= 0) return;

  const p = Math.abs(rect.top) / sectionHeight;

  let scrollRotation;
  if (currentSize === "desktop") scrollRotation = p * 360;
  if (currentSize === "tablet") scrollRotation = p * 120;
  if (currentSize === "mobile") scrollRotation = (1 - p) * 360;

  if (currentSize === "tablet") {
    state.currentRotation = scrollRotation - 60; // 0~120 → -60~60
  } else {
    state.currentRotation = scrollRotation;
  }

  state.lastScrollRotation = scrollRotation;
  applyTransform(state.currentRotation);
}

// work_모달창
$("#work li").on("click", function () {
  $("#work .workModal").slideDown(700);

  let i = $(this).index();
  $("#work .workModal .modalText").eq(i).css({ display: "flex" });

  $("body").addClass("modalOpen");
  $(".fixNavi").css({ display: "none" });
});

$("#work .workModal .close").on("click", function (e) {
  e.stopPropagation(); // li까지 버블링 차단
  $("#work .workModal").slideUp();
  $("body").removeClass("modalOpen");
  $("#work .workModal .modalText").slideUp();
  $(".fixNavi").css({ display: "block" });
});

// design 섹션
gsap.registerPlugin(ScrollTrigger);

// desing_이미지 프리뷰
let designUl = document.querySelector("#design ul");
let designPreview = document.querySelector("#design .preview");
let designPreviewImg = document.querySelector("#design .preview img");

designUl.addEventListener(
  "mouseenter",
  (e) => {
    let designLi = e.target.closest("li.on");
    if (!designLi) return;

    let designLiImg = designLi.querySelector("img");
    designPreviewImg.src = designLiImg.src;

    // 이미지 비율에 맞춰 크기 조절
    previewSize(designLiImg);
    designPreview.classList.add("on");
  },
  true,
);

designUl.addEventListener("mousemove", (e) => {
  let designLi = e.target.closest("li.on");
  if (!designLi) return;

  let previewWidth = designPreview.offsetWidth;
  let screenWidth = window.innerWidth;

  let left = e.clientX;

  // 오른쪽 공간 부족하면 왼쪽으로
  if (left + previewWidth > screenWidth) {
    left = e.clientX - previewWidth;
  }

  designPreview.style.left = left + "px";
  designPreview.style.top = e.clientY + "px";
});

designUl.addEventListener(
  "mouseleave",
  (e) => {
    let designLi = e.target.closest("li.on");
    if (!designLi) return;

    designPreview.classList.remove("on");
  },
  true,
);

// 또는 li들이 서로 인접해있을 경우를 대비한 추가 처리
designUl.addEventListener("mouseover", (e) => {
  let designLi = e.target.closest("li.on");
  if (!designLi || !designLi.classList.contains("on")) {
    designPreview.classList.remove("on");
  }
});

// 이미지 비율에 따라 프리뷰 크기 조절
function previewSize(img) {
  let ratio = img.naturalWidth / img.naturalHeight;

  // 가로가 긴 이미지 (ratio > 1)
  if (ratio > 1) {
    designPreview.style.width = "clamp(450px,50%,600px)";
    // designPreview.style.height = 'auto';
  }

  // 세로가 긴 이미지 (ratio < 1)
  else if (ratio < 1) {
    designPreview.style.width = "clamp(330px,40%,450px)";
    // designPreview.style.height = '500px';
  }

  // 정사각형에 가까운 이미지
  else {
    designPreview.style.width = "clamp(350px,40%,450px)";
    // designPreview.style.height = 'auto';
  }
}

// design_이미지 기본 위치
ScrollTrigger.matchMedia({
  "(min-width:720px)": function () {
    gsap.set($("#design li").eq(0), {
      y: "-270vh",
      x: "-5vw",
      scale: 0.6,
      ease: "none",
    }); // 라스트 최종 : -300vh
    gsap.set(
      $("#design li").eq(1),
      { y: "-230vh", x: "10vw", scale: 1, ease: "none" }, // 라스트 최종 : -270vh
      "-=95%",
    );
    gsap.set(
      $("#design li").eq(3),
      { y: "-350vh", x: "20vw", scale: 0.4, ease: "none" }, // -200vh 20vw
      "-=85%", // -=85%
    );
    gsap.set(
      $("#design li").eq(2),
      { y: "-230vh", x: "-5vw", scale: 0.8, ease: "none" }, // -200vw 1vw // 라스트 최종 : -250vh
      "-=85%",
    );
    gsap.set(
      $("#design li").eq(5),
      { y: "-360vh", x: "0vw", scale: 0.5, ease: "none" }, // -180vh
      "-=85%",
    );
    gsap.set(
      $("#design li").eq(4),
      { y: "-300vh", x: "-30vw", scale: 1, ease: "none" }, // -150vh -20vw
      "-=95%",
    );
    // eq 345는 기존에서 y값을 -100vh 더 넣었음
    // eq 전체에 y값을 -50vh 추가로 더 넣었음

    // design_이미지 스크롤 트리거
    let endY = window.innerHeight * 2.7;
    let again = false;
    gsap
      .timeline({
        scrollTrigger: {
          trigger: "#design",
          // start: "top top",
          start: "top 20%",
          // end: "bottom bottom",
          // end: "bottom 95%",
          // end: `bottom-=${endY} bottom`, // 그나마 이거

          // end: "+=2400",
          end: `+=${endY}`,
          pin: "#design .pin p",
          pinSpacing: false,
          scrub: 1,
          // toggleActions: "play none reverse none",
          // markers: true,

          onUpdate: (self) => {
            let designLis = document.querySelectorAll("#design li");

            let rect = designUl.getBoundingClientRect();
            if (
              // rect.bottom < 0 ||
              rect.top > window.innerHeight &&
              self.direction === -1
            ) {
              designLis.forEach((li) => li.classList.remove("on"));
              again = true;
              console.log("again1");
            }
            if (again && self.direction === 1 && self.progress >= 1) {
              console.log("again2");
              designLis.forEach((li) => li.classList.add("on"));

              again = false;
            }
          },

          onLeave: () => {
            gsap.set("#design .pin p", { opacity: 0, display: "none" });
            console.log("leave");
          },
          onEnterBack: () => {
            gsap.set("#design .pin p", { opacity: 0.5, display: "block" });
            console.log("tq");
          },
        },
      })
      .to("#design .pin p", {
        opacity: 0.5,
        duration: 0.1,
      })
      .to($("#design li").eq(0), {
        y: 0,
        x: 0,
        scale: 1,
        ease: "none",

        onComplete: () => {
          document.querySelector("#design li:nth-child(1)").classList.add("on");
        },
        onReverseComplete: () => {
          document
            .querySelector("#design li:nth-child(1)")
            .classList.remove("on");
        },
      })
      .to(
        $("#design li").eq(1),
        {
          y: 0,
          x: 0,
          scale: 1,
          ease: "none",
          onComplete: () => {
            document
              .querySelector("#design li:nth-child(2)")
              .classList.add("on");
          },
          onReverseComplete: () => {
            document
              .querySelector("#design li:nth-child(2)")
              .classList.remove("on");
          },
        },
        "-=95%",
      )
      .to(
        $("#design li").eq(3),
        {
          y: 0,
          x: 0,
          scale: 1,
          ease: "none",
          onComplete: () => {
            document
              .querySelector("#design li:nth-child(4)")
              .classList.add("on");
          },
          onReverseComplete: () => {
            document
              .querySelector("#design li:nth-child(4)")
              .classList.remove("on");
          },
        },
        "-=85%",
      )
      .to(
        $("#design li").eq(2),
        {
          y: 0,
          x: 0,
          scale: 1,
          ease: "none",
          onComplete: () => {
            document
              .querySelector("#design li:nth-child(3)")
              .classList.add("on");
          },
          onReverseComplete: () => {
            document
              .querySelector("#design li:nth-child(3)")
              .classList.remove("on");
          },
        },
        "-=85%",
      )
      .to(
        $("#design li").eq(5),
        {
          y: 0,
          x: 0,
          scale: 1,
          ease: "none",
          onComplete: () => {
            document
              .querySelector("#design li:nth-child(6)")
              .classList.add("on");
          },
          onReverseComplete: () => {
            document
              .querySelector("#design li:nth-child(6)")
              .classList.remove("on");
          },
        },
        "-=85%",
      )
      .to(
        $("#design li").eq(4),
        {
          y: 0,
          x: 0,
          scale: 1,
          ease: "none",
          onComplete: () => {
            document
              .querySelector("#design li:nth-child(5)")
              .classList.add("on");

            // ScrollTrigger.refresh(); // 🌹👻
            ScrollTrigger.getAll().forEach((trigger) => {
              if (trigger.trigger === document.querySelector("#contact")) {
                trigger.refresh();
              }
            });
          },
          onReverseComplete: () => {
            document
              .querySelector("#design li:nth-child(5)")
              .classList.remove("on");

            ScrollTrigger.getAll().forEach((trigger) => {
              if (trigger.trigger === document.querySelector("#contact")) {
                trigger.refresh();
              }
            });
          },
        },
        "-=95%",
      )
      .from($("#design ul"), { opacity: 1 });
  },
  "(max-width: 720px)": function () {
    gsap
      .timeline({
        scrollTrigger: {
          // trigger: "._s._about .s4",
          trigger: "#design",
          start: "-5% top",
          // toggleActions: "play reverse play reverse",
          toggleActions: "play complete play reset",
          // markers: true,
        },
      })
      .to("#design .pin p", {
        opacity: 0.5,
        duration: 0.1,
      })
      .from("#design li", {
        opacity: 0,
        y: 60,
        duration: 0.4,
        stagger: 0.3,
        clearProps: "all",
        onStart: () => {
          $("#design li").addClass("on");
          console.log("li 애니메이션 시작!");
        },
      });
  },
});

//
//
//

// }

//
//
//
//

// contact 섹션
let keywords = document.querySelectorAll("#contact .keywords p");
let container = document.querySelector("#contact .keywords");
let containerWidth = container.offsetWidth;
let containerHeight = container.offsetHeight;

// contact_키워드 단어 속성 지정
keywords.forEach((p) => {
  let fontSize = Math.floor(Math.random() * 50) + 13;
  p.style.fontSize = `${fontSize}px`;

  // 이동 거리 5~10px
  let distance = Math.random() * 40 + 10;

  // 방향 랜덤 (0~3)
  let direction = Math.floor(Math.random() * 4);

  let x = 0;
  let y = 0;

  switch (direction) {
    case 0:
      y = -distance;
      break; // 위
    case 1:
      y = distance;
      break; // 아래
    case 2:
      x = -distance;
      break; // 왼쪽
    case 3:
      x = distance;
      break; // 오른쪽
  }

  p.style.transform = `translate(${x}px, ${y}px)`;
});

// contact_반투명 사각형 랜덤 배치
let blockBox = document.querySelector("#contact .boxs");
let blocks = document.querySelectorAll("#contact .block");

let blockRect = blockBox.getBoundingClientRect();

let total = blocks.length;
let cols = Math.ceil(Math.sqrt(total));
let rows = Math.ceil(total / cols);

let cellW = blockRect.width / cols;
let cellH = blockRect.height / rows;

// 칸 목록 생성
let cells = [];
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    cells.push({ r, c });
  }
}

// block 초기 위치 저장
let blockData = [];

// 랜덤 섞기
cells.sort(() => Math.random() - 0.5);

blocks.forEach((block, i) => {
  let { r, c } = cells[i];

  let size = Math.random() * 100 + 70; // 100~180px

  let x = c * cellW + Math.random() * (cellW - size);
  let y = r * cellH + Math.random() * (cellH - size);

  block.style.width = `${size}px`;
  block.style.height = `${size * 0.5}px`;
  block.style.left = `${x}px`;
  block.style.top = `${y}px`;

  blockData.push({
    el: block,
    x: block.offsetLeft,
    y: block.offsetTop,
  });
});

// contact_카드 이동 거리
let contactCard = document.querySelector("#contact .card");
let contactCardStart = window.innerWidth; // 화면 오른쪽 밖
let contactCardEnd = (window.innerWidth - contactCard.offsetWidth) / 2;

// 스크롤 따라 움직임
let contact = document.querySelector("#contact");
let contactWrap = contact.querySelector(".wrap");

let contactHeight = contact.offsetHeight;
let lastScrollY = window.scrollY;
let blockOffset = 0;

let cardReady = false;
let cardReadyTimer = null;

let contactTrigger = gsap.timeline({
  scrollTrigger: {
    trigger: "#contact",
    // trigger: "#contact .wrap",

    start: "top bottom",
    // end: "+=800", // contact 끝까지
    // end: "bottom bottom", // contact 끝까지
    // end: "80% bottom", // contact 끝까지
    end: () => "+=" + window.innerHeight,
    // end: () => "+=" + (contactWrap.offsetHeight - contactCard.offsetHeight),

    scrub: true, // 스크롤과 연동
    // scrub: 3, // 스크롤과 연동
    // snap: 1,
    // toggleActions: "play none none reverse",
    // invalidateOnRefresh: true, // ✅ 추가
    // markers: true,

    onUpdate: (self) => {
      if (self.progress >= 0.99) {
        cardReadyTimer ??= setTimeout(() => {
          cardReady = true;
        }, 300);
      } else {
        clearTimeout(cardReadyTimer);
        cardReadyTimer = null;
        cardReady = false;
      }
    },
  },
});

contactTrigger
  .to(
    "#contact .block",
    {
      x: -30, // 이동 거리
      ease: "none",
    },
    0,
  )
  .fromTo(
    // contactCard,
    "#contact .cardWrap",
    { x: window.innerWidth }, // 화면 오른쪽 밖
    {
      x: 0, // 중앙
    },
    0,
  );

// contacat_카드 마우스 이벤트
contactCard.addEventListener("mouseenter", () => {
  if (cardReady) {
    contactCard.classList.add("ani");
  }
});

contactCard.addEventListener("mouseleave", () => {
  contactCard.classList.remove("ani");
});
//
//
//
//
//

//

// fix navi
let fixLi = $(".fixNavi li");
let sections = $("section");

let naviIndex = -1;

$(window).on("scroll", function () {
  let scrollMid = $(this).scrollTop() + $(window).height() / 2;

  sections.each(function (i) {
    let sectionTop = $(this).offset().top;
    let sectionBottom = sectionTop + $(this).outerHeight();

    if (scrollMid >= sectionTop && scrollMid < sectionBottom) {
      if (naviIndex !== i) {
        naviIndex = i;
        $(".fixNavi li").removeClass("on");
        $(".fixNavi li").eq(i).addClass("on");
      }
      return false; // 🔥 여기서 멈춤
    }
  });
});

// 클릭 이동
fixLi.on("click", function () {
  let i = $(this).index();
  let targetTop = sections.eq(i).offset().top;

  $("html, body").animate({ scrollTop: targetTop }, 600, function () {
    // contact 섹션(마지막)일 때만 refresh
    if (i === sections.length - 1) {
      ScrollTrigger.refresh();

      // 전체 refresh 대신 contact 트리거만 업데이트
      // ScrollTrigger.getAll().forEach((trigger) => {
      //   if (trigger.trigger === document.querySelector("#contact")) {
      //     // trigger.refresh();
      //     trigger.progress(1, false);
      //   }
      // });
    }
  });
});

// about 절반 지나면 버튼 등장 ---> 할말 고민

// $(window).on("scroll", function () {
//   let scroll = $(window).scrollTop();
//   let aboutHeight = $("#about").outerHeight();
//   if (scroll > aboutHeight / 3) {
//     $(".fixNavi").css({ display: "block" });
//   } else {
//     $(".fixNavi").css({ display: "none" });
//   }
// });
