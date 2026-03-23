// about 섹션
let about = document.querySelector("#about");
let aboutAniOnce = false;

// 줄 나누기
let introduce = new SplitType("#about .introduce", {
  // types: "words, lines",
  types: "lines", // ?????? tlqkf
});
console.log(introduce);

function introduceReLine() {
  if (introduce) {
    // introduce.lines.forEach((line, index) => {
    //   if (line.classList.contains("up")) {
    //     wasAnimated.push(index);
    //   }
    // });
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

//

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

        let lineEndTime = (introduce.lines.length - 1) * 400 + 400; // 400은 애니메이션 효과 예상 시간
        setTimeout(() => {
          if (!aboutAniOnce) {
            middleAni(); // 👈 GSAP 실행
          }
        }, lineEndTime);
      }
    });
  },
  {
    root: null, // 뷰포트 기준
    // threshold: 0.9,
    threshold: 0,
    rootMargin: "-40% 0px -40% 0px",
  },
);
let aboutTop = about.querySelector(".top");
aboutObserver.observe(about);

// 학력 부분 이벤트
function middleAni() {
  aboutAniOnce = true;
  // 공통 타임라인
  let aboutTime = gsap.timeline();

  // 학력
  document.querySelectorAll("#about .edu .box").forEach((item) => {
    let boxLine = item.querySelector(".boxLine");
    let ps = item.querySelectorAll("p");

    // item.classList.add("on");
    aboutTime.add(() => item.classList.add("on"));

    aboutTime.to(
      boxLine,
      {
        height: "100%",
        duration: 1,
        onComplete: () => {
          item.classList.add("done"); // 애니메이션 끝난 후 클래스 추가
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
          item.classList.add("done"); // 애니메이션 끝난 후 클래스 추가
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

//
//
//

// about 이미지 떨어뜨리기

let aboutImgs = document.querySelectorAll("#about .bottom li");

// 0~9 인덱스를 섞기
// let randomIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
let randomIndex = [...Array(aboutImgs.length).keys()];
randomIndex.sort(() => Math.random() - 0.5);

let completedCount = 0; // 👈 루프 밖에 선언

// 각 물체마다 2~3개씩 동시에 떨어지는 애니메이션
// aboutImgs.forEach((item) => {

function dropImg() {
  // // 🔥 bottom의 실제 너비 계산
  // let aboutBottom = document.querySelector("#about .bottom");
  // let aboutBottomWid = aboutBottom.offsetWidth;

  // 섞인 순서대로 애니메이션
  randomIndex.forEach((originalIndex, newIndex) => {
    let items = aboutImgs[originalIndex]; // 섞인 순서로 가져옴
    let groupIndex = Math.floor(newIndex / 2.5);

    // // 🔥 이미지의 너비를 고려한 랜덤 x 위치 계산
    // let imgWidth = items.offsetWidth;
    // let maxX = aboutBottomWid - imgWidth; // 이미지가 벗어나지 않는 최대 x 위치
    // let randomX = Math.random() * maxX; // 0 ~ maxX 사이의 랜덤 위치

    // 타임라인 생성
    let t1 = gsap.timeline({
      delay: groupIndex * 0.3, // 그룹별로 1.2초 간격
      onComplete: () => {
        completedCount++; // 👈 완료 카운트 증가

        // items.style.transform = "rotate(0)"; // 얘도 좀 이상함... 개별로 rotate 0 만들고 싶은데 그룹으로 적용되고, 어떤건(아마도 마지막놈) 적용이 안되고 계속 누워있음
        gsap.set(items, { rotation: 0 });
        //  gsap.set(items, { clearProps: "transform" });

        // 마지막 아이템만 simplyScroll 초기화
        if (completedCount === randomIndex.length) {
          // 👈 여기!
          setTimeout(() => {
            //   requestAnimationFrame(() => {
            // requestAnimationFrame(() => {
            $("#about .bottom").simplyScroll({
              speed: 1,
              // speed: 0.5,
              pauseOnHover: false,
              pauseOnTouch: false,
              autoMode: "loop",
              manualMode: "loop", // loop로 변경!
              // frameRate: 10, // 추가 - 부드러운 애니메이션
              duplicateContent: true,
            });
          }, 500);
        }
      // )}
      },
    });

    // 1. 떨어지는 애니메이션 (가속)
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

      // 2. 첫 번째 큰 바운스
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

      // 3. 두 번째 중간 바운스
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

      // 4. 세 번째 작은 바운스
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

      // 5. 마지막 미세 바운스
      .to(items, {
        y: -8,
        duration: 0.15,
        ease: "power2.out",
      })
      .to(items, {
        y: 0,
        duration: 0.15,
        ease: "power2.in",

        onComplete: () => {
          // gsap.to(item, {
          //   // rotation: 0,
          // });
        },
      });
  });
}
// });

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// project 섹션
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
window.addEventListener("resize", titleFill); // 리사이즈 대응

//  project_커서 따라다니기
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

// project_텍스트 박스 안 효과 적용
$(window).on("scroll resize", function () {
  $("#project .projectList").each(function (index) {
    let proListTop = $(this).offset().top - $(window).scrollTop();
    let proListPoint = window.innerHeight * 0.5; // 화면 30%

    let textBox = $(this).find(".textBox");
    let filter = $(this).find(".contain > a");

    if (proListPoint > proListTop && !$(this).hasClass("animated")) {
      $(this).addClass("animated");
      $(this).find(".subTitle").addClass("down");

      if (index % 2 == 0) {
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
      $(this).removeClass("animated");
      $(this).find(".subTitle").removeClass("down");

      if (index % 2 == 0) {
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

//
//
//
//
//
//
//
//
//
//
//
// work 섹션

// // 카드 누르면 이동하기
// let card = document.querySelectorAll("#work .card");

// card.forEach((i, index) => {
//   i.addEventListener("click", () => {
//     // 클릭한 카드가 정면(40도)에 오도록 회전
//     // let targetAngle = 40 - index * angle;
//     let targetAngle = -(index * angle);

//     // let diff = ((to - from + 180) % 360) - 180;
//     // return from + diff;
//     // 최단 경로 계산 (음수 처리 개선)
//     let diff = targetAngle - currentRotation;
//     diff = ((diff + 180) % 360) - 180;
//     if (diff < -180) diff += 360; // 음수 모듈로 보정

//     currentRotation += diff;

//     // 새로운 기본값으로 설정!
//     // baseRotation = currentRotation;

//     // workList.style.transform = `translateZ(500px) rotateX(0deg) rotateY(${currentRotation}deg)`; 🟡
//     workList.style.transform = `translateZ(500px) rotateY(0deg) rotateX(${currentRotation}deg)`;
//     // 🟡
//   });
// });
//
//
//

// console.log(card);

// // 실험용!!! 🟡
// // 변경 (120도 범위에 배치)
// let totalAngle = 120; // 전체 범위를 120도로 제한
// let angle2 = totalAngle / (cardCount - 1); // 첫 카드~마지막 카드 사이를 균등 분할

// // 카드 위치 자동 설정
// cards.forEach((i, index) => {
//   // let angleFirst = index * angle; 🟡
//   let angleFirst = -60 + index * angle; // -60도부터 +60도까지 (총 120도)

//   i.style.transform = `rotateY(${angleFirst}deg) translateZ(-600px)`; // 🟡
//   // i.style.transform = `rotateX(${angleFirst}deg) translateZ(-400px)`;
// });

// let targetRotation = 0; // 목표 회전값
// let currentCardIndex = 0; // 현재 카드 인덱스 (0~4)
// const totalCards = 5;
// let isDragging = false;
// let workSection = document.querySelector("#work");
// let workWrap = document.querySelector("#work .wrap");
// let currentRotation = 0; // 현재 회전 각도 (이게 유일한 기준점)

// let hasDragged = false; // 실제로 드래그했는지 체크

// // 스크롤 이벤트
// let lastScrollRotation = 0; // 마지막 스크롤 회전값 저장

// window.addEventListener("scroll", () => {
//   //   if (isDragging) return;

//   let rect = workSection.getBoundingClientRect();

//   if (rect.top < window.innerHeight && rect.bottom > 0) {
//     let sectionHeight = rect.height - window.innerHeight;
//     let scrollProgress = Math.abs(rect.top) / sectionHeight;

//     // 스크롤 진행도를 회전 각도로 변환
//     // let scrollRotation = scrollProgress * 360; // 🟡

//     // 🔥 방향 반전: 1 - scrollProgress
//     let scrollRotation = (1 - scrollProgress) * totalAngle - 60;
//     // 스크롤 내릴수록 scrollProgress 증가 → (1 - scrollProgress) 감소 → 각도 감소 → 오른쪽으로

//     // 스크롤 차이를 현재 각도에 더함 (이어서 회전)
//     let rotationDelta = scrollRotation - lastScrollRotation;
//     currentRotation += rotationDelta;
//     lastScrollRotation = scrollRotation;

//     // 72도 단위로 스냅
//     let snappedRotation = Math.round(currentRotation / angle) * angle;
//     workList.style.transform = `translateZ(500px) rotateX(0deg) rotateY(${snappedRotation}deg)`; // 🟡
//     // workList.style.transform = `translateZ(500px) rotateY(0deg) rotateX(${snappedRotation}deg)`; // 🟡
//   }
// });

// // 드래그 이벤트
// let startX = 0;
// let dragStartRotation = 0;

// workWrap.addEventListener("mousedown", (e) => {
//   // 🌹카드를 직접 클릭한 경우 드래그 무시
//   //   if (e.target.closest(".card")) {
//   //     return;
//   //   }
//   //   hasDragged = false; // 초기화
//   //

//   isDragging = true;
//   startX = e.clientX;
//   dragStartRotation = currentRotation; // 현재 각도 저장
//   workList.style.transition = "none";
//   workWrap.style.cursor = "grabbing";
//   e.preventDefault();
// });

// window.addEventListener("mousemove", (e) => {
//   if (!isDragging) return;

//   let deltaX = e.clientX - startX;
//   let rotationDelta = deltaX * -0.3;

//   // 🌹5px 이상 움직였을 때만 드래그로 인정
//   //   if (Math.abs(deltaX) > 5) {
//   //     hasDragged = true;
//   //   }
//   //

//   // 드래그 시작 각도에서 이어서 회전
//   currentRotation = dragStartRotation + rotationDelta;

//   // 🔥 -60 ~ 60도로 제한
//   currentRotation = Math.max(-60, Math.min(60, currentRotation)); // 🟡

//   workList.style.transform = `translateZ(500px) rotateX(0deg) rotateY(${currentRotation}deg)`; // 🟡
//   // workList.style.transform = `translateZ(500px) rotateY(0deg) rotateX(${currentRotation}deg)`; // 🟡
// });

// window.addEventListener("mouseup", () => {
//   if (!isDragging) return;

//   isDragging = false;
//   workList.style.transition = "0.5s transform ease-out";
//   workWrap.style.cursor = "grab";

//   // 🌹실제로 드래그한 경우만 스냅
//   //   if (hasDragged) {
//   //
//   // 가장 가까운 카드로 스냅
//   // let snappedRotation = Math.round(currentRotation / 72) * 72;
//   let snappedRotation = Math.round(currentRotation / angle) * angle;
//   currentRotation = snappedRotation;

//   workList.style.transform = `translateZ(500px) rotateX(0deg) rotateY(${currentRotation}deg)`; // 🟡
//   // workList.style.transform = `translateZ(500px) rotateY(0deg) rotateX(${currentRotation}deg)`; // 🟡
//   //   }
// });

// work modal
$("#work li").on("click", function () {
  $("#work .workModal").slideDown(800);

  let i = $(this).index();
  $("#work .workModal .modalText").eq(i).css({ display: "flex" });

  //   scrollTop = $(window).scrollTop();
  $("body").addClass("modalOpen");
  $(".fixNavi").css({ display: "none" });
});

$("#work .workModal .close").on("click", function () {
  $("#work .workModal").slideUp();
  $("body").removeClass("modalOpen");
  $("#work .workModal .modalText").slideUp();
  $(".fixNavi").css({ display: "block" });
});
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// work 반응형

// 1️⃣ breakpoint 정의 (가독성용)
let Desktop = window.matchMedia("(min-width: 1220px)");
let Tablet = window.matchMedia("(min-width: 720px) and (max-width: 1219px)");
let Mobile = window.matchMedia("(max-width: 719px)");
console.log(Tablet);
//
let isResizing = false;
let resizeTimer = null;

// let card = document.querySelectorAll("#work .card");

let workSection = document.querySelector("#work");
let workWrap = document.querySelector("#work .wrap");
let workList = document.querySelector("#work .workList");
let cards = document.querySelectorAll("#work .card");

let currentAngle = 40; // 초기 각도 (CSS의 초기값과 맞춤)
let cardCount = cards.length; // 카드 개수
let targetRotation = 0; // 목표 회전값
let currentCardIndex = 0; // 현재 카드 인덱스 (0~4)
// const totalCards = 5;
let isDragging = false;
let currentRotation = 0; // 현재 회전 각도 (이게 유일한 기준점)
let lastScrollRotation = 0; // 마지막 스크롤 회전값 저장

// 2️⃣ 현재 디바이스 상태 판별 함수
function getDeviceSize() {
  if (Desktop.matches) return "desktop";
  if (Tablet.matches) return "tablet";
  return "mobile";
}

//3️⃣ 상태 변경 시 실행될 로직
let currentSize = null;
let workClean = null;

function handleDeviceChange() {
  let nextSize = getDeviceSize();

  if (currentSize === nextSize) return; // 중복 실행 방지

  if (workClean) {
    workClean();
    workClean = null;
  }

  currentSize = nextSize;

  switch (currentSize) {
    case "desktop":
      // nowDesktop();
      workClean = nowDesktop(); // 🔥 cleanup 함수 저장
      break;
    case "tablet":
      // nowTablet();
      workClean = nowTablet();
      break;
    case "mobile":
      // nowMobile();
      workClean = nowMobile();
      break;
  }
}

// 4️⃣ media query change 이벤트 연결
Desktop.addEventListener("change", handleDeviceChange);
Tablet.addEventListener("change", handleDeviceChange);
Mobile.addEventListener("change", handleDeviceChange);

// 최초 1회 실행
handleDeviceChange();

// 5️⃣ 각 디바이스별 처리 함수 예시

function nowDesktop() {
  console.log("desktop mode");

  // 카드 누르면 이동하기
  cards.forEach((i, index) => {
    i.addEventListener("click", () => {
      // 클릭한 카드가 정면(40도)에 오도록 회전
      // let targetAngle = 40 - index * angle;
      let targetAngle = -(index * angle);

      // 최단 경로 계산 (음수 처리 개선)
      let diff = targetAngle - currentRotation;
      diff = ((diff + 180) % 360) - 180;
      if (diff < -180) diff += 360; // 음수 모듈로 보정

      currentRotation += diff;

      // 새로운 기본값으로 설정!
      // baseRotation = currentRotation;

      workList.style.transform = `translateZ(500px) rotateX(0deg) rotateY(${currentRotation}deg)`;
    });
  });

  let angle = 360 / cardCount; // 카드당 각도 자동 계산

  // 카드 위치 자동 설정
  cards.forEach((i, index) => {
    let angleFirst = index * angle;
    i.style.transform = `rotateY(${angleFirst}deg) translateZ(-400px)`; // 로테이트y? 로테이트x?
  });

  let hasDragged = false; // 실제로 드래그했는지 체크

  // 스크롤 이벤트
  // window.addEventListener("scroll", () => {
  let onScroll = () => {
    //   if (isDragging) return;
    if (isResizing) return; // 🔴 핵심

    let rect = workSection.getBoundingClientRect();

    if (rect.top < window.innerHeight && rect.bottom > 0) {
      let sectionHeight = rect.height - window.innerHeight;
      let scrollProgress = Math.abs(rect.top) / sectionHeight;

      // 스크롤 진행도를 회전 각도로 변환
      let scrollRotation = scrollProgress * 360;

      // 스크롤 차이를 현재 각도에 더함 (이어서 회전) // 🟡
      let rotationDelta = scrollRotation - lastScrollRotation; //👻
      currentRotation += rotationDelta; //👻
      // lastScrollRotation = scrollRotation;

      //   currentRotation = scrollRotation; //👻
      lastScrollRotation = scrollRotation;

      // 72도 단위로 스냅
      let snappedRotation = Math.round(currentRotation / angle) * angle;
      workList.style.transform = `translateZ(500px) rotateX(0deg) rotateY(${snappedRotation}deg)`;
    }
  };

  // 드래그 이벤트
  let startX = 0;
  let dragStartRotation = 0;

  // workWrap.addEventListener("mousedown", (e) => {
  let onMouseDown = (e) => {
    isDragging = true;
    startX = e.clientX;
    dragStartRotation = currentRotation; // 현재 각도 저장
    workList.style.transition = "none";
    workWrap.style.cursor = "grabbing";
    e.preventDefault();
  };

  // window.addEventListener("mousemove", (e) => {
  let onMouseMove = (e) => {
    if (!isDragging) return;

    let deltaX = e.clientX - startX;
    let rotationDelta = deltaX * -0.3;

    // 드래그 시작 각도에서 이어서 회전
    currentRotation = dragStartRotation + rotationDelta;

    workList.style.transform = `translateZ(500px) rotateX(0deg) rotateY(${currentRotation}deg)`;
  };

  // window.addEventListener("mouseup", () => {
  let onMouseUp = () => {
    if (!isDragging) return;

    isDragging = false;
    workList.style.transition = "0.5s transform ease-out";
    workWrap.style.cursor = "grab";

    // 🌹실제로 드래그한 경우만 스냅
    //   if (hasDragged) {
    //
    // 가장 가까운 카드로 스냅
    // let snappedRotation = Math.round(currentRotation / 72) * 72;
    let snappedRotation = Math.round(currentRotation / angle) * angle;
    currentRotation = snappedRotation;

    workList.style.transform = `translateZ(500px) rotateX(0deg) rotateY(${currentRotation}deg)`;
    //   }
  };

  // 이벤트 등록
  window.addEventListener("scroll", onScroll);
  workWrap.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);

  //   return function cleanup() {
  //   window.removeEventListener("scroll", onScroll);
  //   window.removeEventListener("mousemove", onMouseMove);
  // };
  // 🔥 cleanup 함수 반환
  return function cleanup() {
    window.removeEventListener("scroll", onScroll);
    workWrap.removeEventListener("mousedown", onMouseDown);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };
}

function nowTablet() {
  //
  //
  let totalAngle = 120; // 전체 범위를 120도로 제한
  let angle = totalAngle / (cardCount - 1); // 첫 카드~마지막 카드 사이를 균등 분할
  //
  //

  // 카드 누르면 이동하기
  cards.forEach((i, index) => {
    i.addEventListener("click", () => {
      // 🔥 카드의 실제 배치 각도 계산
      let cardAngle = -60 + (cardCount - 1 - index) * angle;

      // 클릭한 카드가 정면(40도)에 오도록 회전
      // let targetAngle = 40 - index * angle;
      // let targetAngle = -(index * angle);
      console.log("tab", angle);

      // 🔥 해당 카드를 0도(중앙)로 가져오기 위한 회전값
      // let targetRotation = -cardAngle;
      let targetAngle = -cardAngle;

      // 최단 경로 계산 (음수 처리 개선) 🔥
      // let diff = targetAngle - currentRotation;
      // diff = ((diff + 180) % 360) - 180;
      // if (diff < -180) diff += 360; // 음수 모듈로 보정

      // -60 ~ 60도로 clamp 🔥
      targetAngle = Math.max(-60, Math.min(60, targetAngle));

      // currentRotation += diff; 🔥
      currentRotation = targetAngle;

      // 새로운 기본값으로 설정!
      // baseRotation = currentRotation;

      // clamp
      currentRotation = Math.max(-60, Math.min(60, currentRotation));
      updateRotation();
    });
  });

  //
  //
  // let totalAngle = 120; // 전체 범위를 120도로 제한
  // let angle = totalAngle / (cardCount - 1); // 첫 카드~마지막 카드 사이를 균등 분할
  //
  //

  // 🟡🟡🟡
  // 🔥 여기 추가 (진입 시 초기화) // 🟡🟡🟡
  // currentRotation = 0;
  // lastScrollRotation = 0;

  currentRotation = -totalAngle / 2;
  lastScrollRotation = currentRotation;
  updateRotation();
  console.log(currentRotation);
  // 🔥 여기 추가 (강제로 첫 카드 중앙)
  // workList.style.transform = "translateZ(400px) rotateX(0deg) rotateY(-60deg)";
  function updateRotation() {
    workList.style.transform = `translateZ(500px) rotateX(0deg) rotateY(${currentRotation}deg)`;
  }
  // 🟡🟡🟡

  // 카드 위치 자동 설정
  cards.forEach((i, index) => {
    // let angleFirst = -60 + index * angle; // -60도부터 +60도까지 (총 120도) // 🟡🟡🟡
    let angleFirst = -60 + (cardCount - 1 - index) * angle;

    i.style.transform = `rotateY(${angleFirst}deg) translateZ(-600px)`;
  });

  // let targetRotation = 0; // 목표 회전값
  // let currentCardIndex = 0; // 현재 카드 인덱스 (0~4)
  // const totalCards = 5;
  // let isDragging = false; // 🟡
  // let currentRotation = 0; // 현재 회전 각도 (이게 유일한 기준점)  // 🟡
  // let hasDragged = false; // 실제로 드래그했는지 체크
  // 🟡

  // 스크롤 이벤트
  // let lastScrollRotation = 0; // 마지막 스크롤 회전값 저장
  // 🟡

  // window.addEventListener("scroll", () => {
  // let rect = workSection.getBoundingClientRect();

  // if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
  //   console.log("들어옴");
  // } else {
  //   console.log("나감");
  // }
  let workActive = false;

  let onScroll = () => {
    //   if (isDragging) return;

    if (isResizing) return; // 🔴 핵심

    let rect = workSection.getBoundingClientRect();

    if (rect.top <= 100 && rect.bottom > 0) {
      // console.log("실행!");
      workActive = true;
    } else {
      // console.log("대기");
      workActive = false;
    }

    if (
      workActive &&
      rect.top < window.innerHeight &&
      rect.bottom > 0
    ) // 🟡🟡🟡
    {
      let sectionHeight = rect.height - window.innerHeight;
      let scrollProgress = Math.abs(rect.top) / sectionHeight;

      // 스크롤 진행도를 회전 각도로 변환
      // 🔥 방향 반전: 1 - scrollProgress
      // let scrollRotation = (1 - scrollProgress) * totalAngle - 60; // 🟡🟡
      // 스크롤 내릴수록 scrollProgress 증가 → (1 - scrollProgress) 감소 → 각도 감소 → 오른쪽으로
      // let scrollRotation = scrollProgress * totalAngle + startAngle;
      // let scrollRotation = scrollProgress * 360; // 🟡🟡🟡
      let scrollRotation = scrollProgress * totalAngle;

      // 스크롤 차이를 현재 각도에 더함 (이어서 회전) // 🟡
      let rotationDelta = scrollRotation - lastScrollRotation; //👻
      currentRotation += rotationDelta; //👻
      // lastScrollRotation = scrollRotation;

      // ✅ 스크롤에도 clamp 적용 (-60 ~ 60)
      currentRotation = Math.max(-60, Math.min(60, currentRotation));

      // currentRotation = scrollRotation; //👻
      lastScrollRotation = scrollRotation;

      // 72도 단위로 스냅
      let snappedRotation = Math.round(currentRotation / angle) * angle;

      // workList.style.transform = `translateZ(500px) rotateX(0deg) rotateY(${snappedRotation}deg)`; // 🟡🟡🟡
      updateRotation();
    }
  };

  // 드래그 이벤트   // 🟡
  // let startX = 0;
  // let dragStartRotation = 0;

  // workWrap.addEventListener("mousedown", (e) => {
  let onMouseDown = (e) => {
    isDragging = true;
    startX = e.clientX;
    dragStartRotation = currentRotation; // 현재 각도 저장
    workList.style.transition = "none";
    workWrap.style.cursor = "grabbing";
    e.preventDefault();
  };

  // window.addEventListener("mousemove", (e) => {
  let onMouseMove = (e) => {
    if (!isDragging) return;

    let deltaX = e.clientX - startX;
    let rotationDelta = deltaX * -0.3;

    // 드래그 시작 각도에서 이어서 회전
    currentRotation = dragStartRotation + rotationDelta;

    // 🔥 -60 ~ 60도로 제한
    currentRotation = Math.max(-60, Math.min(60, currentRotation)); // 🟡

    // workList.style.transform = `translateZ(500px) ?rotateX(0deg) rotateY(${currentRotation}deg)`; // 🟡🟡🟡
    updateRotation();
  };

  // window.addEventListener("mouseup", () => {
  let onMouseUp = () => {
    if (!isDragging) return;

    isDragging = false;
    workList.style.transition = "0.5s transform ease-out";
    workWrap.style.cursor = "grab";

    let snappedRotation = Math.round(currentRotation / angle) * angle;
    currentRotation = snappedRotation;

    // workList.style.transform = `translateZ(500px) rotateX(0deg) rotateY(${currentRotation}deg)`; // 🟡🟡🟡
    updateRotation();
  };

  // 클릭 이벤트 방지
  // workWrap.addEventListener("mousedown", () => {
  workWrap.addEventListener("mousemove", () => {
    if (!isDragging || !Tablet.matches) return;
    workWrap.style.pointerEvents = "auto";
  });
  document.addEventListener("mouseup", () => {
    if (!Tablet.matches) return;
    workWrap.style.pointerEvents = "none";
  });
  document.addEventListener("click", () => {
    if (!Tablet.matches) return;
    workWrap.style.pointerEvents = "none";
  });

  // 🔥 사이즈 변경 감지해서 정리
  Tablet.addEventListener("change", (e) => {
    if (!e.matches) {
      // tablet 벗어났을 때 원복
      workWrap.style.pointerEvents = "";
      isDragging = false; // 필요하면 상태도 같이 정리
    }
  });

  // 이벤트 등록
  window.addEventListener("scroll", onScroll);
  workWrap.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);

  //   return function cleanup() {
  //   window.removeEventListener("scroll", onScroll);
  //   window.removeEventListener("mousemove", onMouseMove);
  // };
  // 🔥 cleanup 함수 반환
  return function cleanup() {
    window.removeEventListener("scroll", onScroll);
    workWrap.removeEventListener("mousedown", onMouseDown);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };
}

function nowMobile() {
  console.log("mobile mode");
  // partial cylinder or flat mode

  // 카드 누르면 이동하기
  cards.forEach((i, index) => {
    i.addEventListener("click", () => {
      // 🔥 현재 상태를 먼저 정규화
      // currentRotation = ((currentRotation + 180) % 360) - 180;

      // 클릭한 카드가 정면(40도)에 오도록 회전
      // let targetAngle = 40 - index * angle;
      let targetAngle = -(index * angle); // 🔍원본

      // let diff = ((to - from + 180) % 360) - 180;
      // return from + diff;
      // 최단 경로 계산 (음수 처리 개선)
      let diff = targetAngle - currentRotation; // 🔍원본
      diff = ((diff + 180) % 360) - 180; // 🔍원본
      if (diff < -180) diff += 360; // 음수 모듈로 보정 // 🔍원본

      currentRotation += diff; // 🔍원본

      // 새로운 기본값으로 설정!
      // baseRotation = currentRotation;

      workList.style.transform = `translateZ(500px) rotateY(0deg) rotateX(${currentRotation}deg)`;
      // 🟡
    });
  });

  // let currentAngle = 40; // 초기 각도 (CSS의 초기값과 맞춤)
  // let cardCount = cards.length; // 카드 개수
  let angle = 360 / cardCount; // 카드당 각도 자동 계산 🟡

  // 카드 위치 자동 설정
  cards.forEach((i, index) => {
    let angleFirst = index * angle;
    i.style.transform = `rotateX(${angleFirst}deg) translateZ(-250px)`;
  });

  // let targetRotation = 0; // 목표 회전값
  // let currentCardIndex = 0; // 현재 카드 인덱스 (0~4)
  // // const totalCards = 5;
  // let isDragging = false; // 🟡
  // let currentRotation = 0; // 현재 회전 각도 (이게 유일한 기준점)   // 🟡
  // let hasDragged = false; // 실제로 드래그했는지 체크
  // // 🟡

  // 스크롤 이벤트
  // let lastScrollRotation = 0; // 마지막 스크롤 회전값 저장   // 🟡

  // window.addEventListener("scroll", () => {
  let onScroll = () => {
    //   if (isDragging) return;
    if (isResizing) return; // 🔴 핵심

    let rect = workSection.getBoundingClientRect();

    if (rect.top < window.innerHeight && rect.bottom > 0) {
      let sectionHeight = rect.height - window.innerHeight;
      let scrollProgress = Math.abs(rect.top) / sectionHeight;

      // 스크롤 진행도를 회전 각도로 변환
      // let scrollRotation = scrollProgress * 360; // 🟡🟡
      let scrollRotation = (1 - scrollProgress) * 360;

      // 스크롤 차이를 현재 각도에 더함 (이어서 회전) // 🟡
      let rotationDelta = scrollRotation - lastScrollRotation; //👻
      currentRotation += rotationDelta; //👻
      // lastScrollRotation = scrollRotation;

      // currentRotation = scrollRotation; //👻
      lastScrollRotation = scrollRotation;

      // 72도 단위로 스냅
      let snappedRotation = Math.round(currentRotation / angle) * angle;

      workList.style.transform = `translateZ(500px) rotateY(0deg) rotateX(${snappedRotation}deg)`;
    }
  };

  // 드래그 이벤트  // 🟡
  // let startX = 0;
  // let dragStartRotation = 0;

  // workWrap.addEventListener("mousedown", (e) => {
  let onMouseDown = (e) => {
    isDragging = true;
    // startX = e.clientX; // 🟡🟡
    startY = e.clientY;

    dragStartRotation = currentRotation; // 현재 각도 저장
    workList.style.transition = "none";
    workWrap.style.cursor = "grabbing";
    e.preventDefault();
  };

  // window.addEventListener("mousemove", (e) => {
  let onMouseMove = (e) => {
    if (!isDragging) return;

    // let deltaX = e.clientX - startX; // 🟡🟡
    let deltaY = e.clientY - startY;
    // let rotationDelta = deltaX * 0.3; // 🟡🟡
    let rotationDelta = deltaY * 0.3;

    // 드래그 시작 각도에서 이어서 회전
    currentRotation = dragStartRotation + rotationDelta;

    workList.style.transform = `translateZ(500px) rotateY(0deg) rotateX(${currentRotation}deg)`;
  };

  // window.addEventListener("mouseup", () => {
  let onMouseUp = () => {
    if (!isDragging) return;

    isDragging = false;
    workList.style.transition = "0.5s transform ease-out";
    workWrap.style.cursor = "grab";

    let snappedRotation = Math.round(currentRotation / angle) * angle;
    currentRotation = snappedRotation;

    workList.style.transform = `translateZ(500px) rotateY(0deg) rotateX(${currentRotation}deg)`;
  };

  // 이벤트 등록
  window.addEventListener("scroll", onScroll);
  workWrap.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);

  //   return function cleanup() {
  //   window.removeEventListener("scroll", onScroll);
  //   window.removeEventListener("mousemove", onMouseMove);
  // };
  // 🔥 cleanup 함수 반환
  return function cleanup() {
    window.removeEventListener("scroll", onScroll);
    workWrap.removeEventListener("mousedown", onMouseDown);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };
}
//
//
//
//

window.addEventListener("resize", () => {
  isResizing = true;

  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    isResizing = false;

    // 🔴 스크롤 위치를 work 섹션 기준으로 고정
    // const workSection = document.querySelector("#work");
    // if (workSection) {
    //   window.scrollTo({
    //     top: workSection.offsetTop,
    //     behavior: "auto",
    //   });
    // }

    // 🔴 회전 상태 리셋 (중요) // 🟡
    // currentRotation = 0;
    // lastScrollRotation = 0;
    syncScrollRotation();

    // 🔴 transform 초기화 // 🟡
    //   workList.style.transform = "translateZ(500px) rotateX(0deg) rotateY(0deg)";
  }, 200);
});

//
//
//

function syncScrollRotation() {
  let rect = workSection.getBoundingClientRect();
  let sectionHeight = rect.height - window.innerHeight;

  if (sectionHeight <= 0) return;

  let scrollProgress = Math.abs(rect.top) / sectionHeight;

  if (currentSize === "desktop") {
    currentRotation = scrollProgress * 360;
    workList.style.transform = `translateZ(500px) rotateX(0deg) rotateY(${currentRotation}deg)`;
  }

  // if (currentSize === "tablet") {
  //   currentRotation = (1 - scrollProgress) * 120 - 60; // 🟡🟡
  //   // currentRotation = scrollProgress * 360;
  //   workList.style.transform = `translateZ(500px) rotateX(0deg) rotateY(${currentRotation}deg)`;
  // }  // 260219 🔺
  if (currentSize === "tablet") {
    let totalAngle = 120;

    let scrollRotation = scrollProgress * totalAngle; // 0~120
    currentRotation = scrollRotation - 60; // -60~60으로 변환
    currentRotation = Math.max(-60, Math.min(60, currentRotation));
    lastScrollRotation = scrollRotation; // 0~120 기준으로 저장
  }

  if (currentSize === "mobile") {
    currentRotation = scrollProgress * 360;
    workList.style.transform = `translateZ(500px) rotateY(0deg) rotateX(${currentRotation}deg)`;
  }

  lastScrollRotation = currentRotation;

  // workList.style.transform = `translateZ(500px) rotateX(0deg) rotateY(${currentRotation}deg)`;
}

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// 일러스트 섹션
gsap.registerPlugin(ScrollTrigger);

// s4
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

    let endY = window.innerHeight * 2.7;
    // console.log(endY);
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
            // again = false;
            // designUl
            let design = document.querySelector("#design ul");
            let lis = document.querySelectorAll("#design li");
            // 🟡🔺 프리뷰 코드들을 위로 올려서, 거기서 가져왔던 변수 재사용하기, 같은거 너무 많이 쓴다

            let rect = design.getBoundingClientRect();
            if (
              // rect.bottom < 0 ||
              rect.top > window.innerHeight &&
              self.direction === -1
            ) {
              lis.forEach((li) => li.classList.remove("on"));
              again = true;
              console.log("again1");
            }
            if (
              again &&
              // rect.top > window.innerHeight / 2 &&
              self.direction === 1 &&
              self.progress >= 1
            ) {
              console.log("again2");
              lis.forEach((li) => li.classList.add("on"));

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
          // gsap.set("#design li:nth-child(2)", { clearProps: "all" });
        },
        // onStart: () => $("#design li").eq(0).removeClass("on"),
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
            // gsap.set("#design li:nth-child(2)", { clearProps: "all" });
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
            // gsap.set("#design li:nth-child(2)", { clearProps: "all" });
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
            // gsap.set("#design li:nth-child(2)", { clearProps: "all" });
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
            // gsap.set("#design li:nth-child(2)", { clearProps: "all" });
          },
          onReverseComplete: () => {
            document
              .querySelector("#design li:nth-child(6)")
              .classList.remove("on");
          },
        },
        "-=85%",
      )
      // .to($(".s4 li").eq(8), { y: 0, x: 0, scale: 1, ease: "none" }, "-=95%")
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
            // gsap.set("#design li:nth-child(2)", { clearProps: "all" });

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
      // .to($(".s4 li").eq(7), { y: 0, x: 0, scale: 1, ease: "none" }, "-=95%")
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

          // onLeaveBack: () => {
          //   console.log("벗어남 - 즉시 리셋");
          //   this.progress(0); // 즉시 처음으로 (순차적 역재생 없이)
          //   // tl.pause();
          //   // $("#design li").removeClass("on");
          // },
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
        stagger: 0.3, // 0.2초씩 간격
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

let designUl = document.querySelector("#design ul");
let designPreview = document.querySelector("#design .preview");
let designPreviewImg = document.querySelector("#design .preview img");

// 이벤트 위임 방식으로 변경 - 부모(ul)에 한 번만 이벤트 등록
designUl.addEventListener(
  "mouseenter",
  (e) => {
    // 이벤트가 li.on에서 발생했는지 확인
    let designLi = e.target.closest("li.on");
    if (!designLi) return;

    let designLiImg = designLi.querySelector("img");
    designPreviewImg.src = designLiImg.src;

    // 이미지 비율에 맞춰 크기 조절
    previewSize(designLiImg);

    designPreview.classList.add("on");

    // console.log("올라감");
  },
  true,
); // capture 단계에서 실행

designUl.addEventListener("mousemove", (e) => {
  let designLi = e.target.closest("li.on");
  if (!designLi) return;

  // 이미지가 마우스 오른쪽 아래에 위치하도록
  // designPreview.style.left = e.clientX + "px";
  // designPreview.style.top = e.clientY + "px";
  // previewPosition(e);

  //
  //
  // const offset = 20;
  let previewWidth = designPreview.offsetWidth;
  let screenWidth = window.innerWidth;

  // let left = e.clientX + offset;
  let left = e.clientX;

  // 오른쪽 공간 부족하면 왼쪽으로
  if (left + previewWidth > screenWidth) {
    // left = e.clientX - previewWidth - offset;
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
  // const img = new Image();
  // img.src = imgElement.src;
  // console.log("왜안됨????");

  // img.onload = function () {
  let ratio = img.naturalWidth / img.naturalHeight;
  // console.log("어디");

  // 가로가 긴 이미지 (ratio > 1)
  if (ratio > 1) {
    // console.log("가로");

    designPreview.style.width = "clamp(450px,50%,600px)";
    // designPreview.style.height = 'auto';
  }
  // 세로가 긴 이미지 (ratio < 1)
  else if (ratio < 1) {
    // console.log("세로");

    designPreview.style.width = "clamp(330px,40%,450px)";
    // designPreview.style.height = '500px';
  }
  // 정사각형에 가까운 이미지
  else {
    designPreview.style.width = "clamp(350px,40%,450px)";
    // designPreview.style.height = 'auto';
  }
}
// }

//
//
//

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// contact

let keywords = document.querySelectorAll("#contact .keywords p");

// 👻
let container = document.querySelector("#contact .keywords");
let containerWidth = container.offsetWidth;
let containerHeight = container.offsetHeight;

// 💋
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

// // 👻
// // 키워드 랜덤 위치
// let placed = [];
// let padding = 60; // 최소 간격
// let maxTry = 50; // 재시도 최대 횟수

// keywords.forEach((p) => {
//   let fontSize = Math.floor(Math.random() * 50) + 13;
//   p.style.fontSize = `${fontSize}px`;

//   // DOM에 반영되도록 강제 // 👻
//   let w = p.offsetWidth;
//   let h = p.offsetHeight;

//   let x, y, rect;
//   let isOverlapping = true;
//   let tries = 0;

//   while (isOverlapping && tries < maxTry) {
//     // x = Math.random() * (window.innerWidth - 200);
//     // y = Math.random() * (window.innerHeight - 100);
//     // x = Math.random() * (window.innerWidth - p.offsetWidth); // width 안 // 👻
//     // y = Math.random() * (window.innerHeight - p.offsetHeight); // height 안 // 👻

//     x = Math.random() * (containerWidth - w); // width 안
//     y = Math.random() * (containerWidth - h); // height 안

//     isOverlapping = false; // 👻

//     for (let item of placed) {
//       // 👻
//       if (
//         x < item.x + item.w + padding &&
//         x + w > item.x - padding &&
//         y < item.y + item.h + padding &&
//         y + h > item.y - padding
//       ) {
//         isOverlapping = true;
//         break;
//       }
//     }
//     tries++;
//   }

//   p.style.left = `${x}px`;
//   p.style.top = `${y}px`;

//   // 👻
//   // rect = p.getBoundingClientRect();
//   // isOverlapping = false;

//   // for (const placedRect of placed) {
//   //   if (
//   //     rect.left < placedRect.right + padding &&
//   //     rect.right > placedRect.left - padding &&
//   //     rect.top < placedRect.bottom + padding &&
//   //     rect.bottom > placedRect.top - padding
//   //   ) {
//   //     isOverlapping = true;
//   //     break;
//   //   }
//   // }
//   //   tries++;
//   // }
//   // 👻

//   // placed.push(rect);  // 👻
//   placed.push({ x, y, w, h });
// });
// // 👻

// 👻

// 반투명 사각형 랜덤 배치
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

// card 이동 거리
let contactCard = document.querySelector("#contact .card");
// let contactCardStart = window.innerWidth; // 화면 오른쪽 밖
let contactCardStart = window.innerWidth; // 화면 오른쪽 밖
let contactCardEnd = (window.innerWidth - contactCard.offsetWidth) / 2;

// 스크롤 따라 움직임
let contact = document.querySelector("#contact");
let contactWrap = contact.querySelector(".wrap");

// let contactTop = contact.offsetTop; // 섹션 시작 위치
// let contactHeight = contact.offsetHeight; // 섹션 높이

// let start, end;

let contactHeight = contact.offsetHeight;
let lastScrollY = window.scrollY;
let blockOffset = 0;

// window.addEventListener("scroll", () => {
//   let rect = contact.getBoundingClientRect();
//   let vh = window.innerHeight;

//   // contact가 화면에 아예 없으면 무시
//   if (rect.bottom <= 0 || rect.top >= vh) return;

//   // 진행도 계산
//   // let progress = -rect.top / (contactHeight - vh);
//   let progress =
//     (window.scrollY - contact.offsetTop) / (contactHeight - window.innerHeight);

//   // 0 ~ 1로 클램프
//   progress = Math.min(Math.max(progress, 0), 1);

//   // 🔹 blocks 이동
//   let currentY = window.scrollY; //???
//   let delta = currentY - lastScrollY;

//   lastScrollY = currentY;

//   // // 스크롤한 만큼 조금씩 이동
//   // blockOffset += delta * 0.2; // 감도 조절

//   // blockData.forEach((data) => {
//   //   // const moveX = -300 * progress;
//   //   // data.el.style.transform = `translateX(${moveX}px)`;
//   //   data.el.style.transform = `translateX(${-blockOffset}px)`;
//   // });

//   // 🔸 card 이동
//   const x = contactCardStart + (contactCardEnd - contactCardStart) * progress;

//   // contactCard.style.transform = `translateX(${x}px)`;

//   //   let cardX = contactCardStart + (contactCardEnd - contactCardStart) * progress;

//   //   contactCard.style.transform = `translate(${cardX}px, -50%)`;
// });
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
      // progress가 1에 가까워지면 카드 중앙 도착으로 간주
      // cardReady = self.progress >= 0.99;
      //  contactCard.style.pointerEvents = cardReady ? "auto" : "none";

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

// gsap.to("#contact .block", {
//   x: -30, // 이동 거리
//   ease: "none",
//   scrollTrigger: {
//     trigger: "#contact",
//     // trigger: "#contact .wrap",

//     start: "top bottom",
//     // end: "+=800", // contact 끝까지
//     // end: "bottom bottom", // contact 끝까지
//     // end: "80% bottom", // contact 끝까지
//     end: () => "+=" + window.innerHeight,
//     // end: () => "+=" + (contactWrap.offsetHeight - contactCard.offsetHeight),

//     // scrub: true, // 스크롤과 연동
//     scrub: 0.5, // 스크롤과 연동
//     // toggleActions: "play none none reverse",
//     // invalidateOnRefresh: true, // ✅ 추가
//     // markers: true,
//   },
// });

// gsap.fromTo(
//   contactCard,
//   { x: window.innerWidth }, // 화면 오른쪽 밖
//   {
//     x: 0, // 중앙
//     // ease: "power1.out",
//     scrollTrigger: {
//       trigger: "#contact",
//       // trigger: "#contact .wrap",

//       start: "top bottom", // contact 도착 시 시작
//       // end: "+=800", // contact 끝까지 중앙에 도착
//       // end: "bottom bottom", // contact 끝까지
//       // end: "80% bottom", // contact 끝까지
//       end: () => "+=" + window.innerHeight,
//       // end: () => "+=" + (contactWrap.offsetHeight - contactCard.offsetHeight),

//       // scrub: true, // 스크롤과 연동
//       scrub: 0.5, // 스크롤과 연동
//       // invalidateOnRefresh: true, // ✅ 추가
//       // toggleActions: "play none none reverse",
//       markers: true,

//       onUpdate: (self) => {
//         // progress가 1에 가까워지면 카드 중앙 도착으로 간주
//         cardReady = self.progress >= 0.99;
//       },
//     },
//     // onComplete: () => {
//     //   contactCard.addEventListener("mouseenter", () => {
//     //     contactCard.classList.add("ani");
//     //   });

//     // item.classList.add("done"); // 애니메이션 끝난 후 클래스 추가
//   },
//   // },
// );

// 마우스 이벤트
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
//
//
//
//
//
//
//
//
//
//
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

    // if (scrollMid >= sectionTop) {
    //   if (naviIndex !== i) {
    //     naviIndex = i;
    //     $(".fixNavi li").removeClass("on");
    //     $(".fixNavi li").eq(i).addClass("on");
    //   }
    //   // fixLi.removeClass("on");
    //   // fixLi.eq(i).addClass("on");
    // }

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

  // $("html, body").animate({ scrollTop: targetTop }, 600);

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
