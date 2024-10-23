(function ($) {
  "use strict";







  /*--------------------------------------------------------------
    FullHeight
  --------------------------------------------------------------*/
  function fullHeight() {
    $('.full-height').css("height", $(window).height());
  }

  function thmSwiperInit() {
    // swiper slider
    if ($(".thm-swiper__slider").length) {
      $(".thm-swiper__slider").each(function () {
        let elm = $(this);
        let options = elm.data('swiper-options');
        let thmSwiperSlider = new Swiper(elm, options);
      });
    }

  }



  function thmOwlInit() {
    // owl slider

    if ($(".thm-owl__carousel").length) {
      $(".thm-owl__carousel").each(function () {
        let elm = $(this);
        let options = elm.data('owl-options');
        let thmOwlCarousel = elm.owlCarousel(options);
      });
    }

    if ($(".thm-owl__carousel--custom-nav").length) {
      $(".thm-owl__carousel--custom-nav").each(function () {
        let elm = $(this);
        let owlNavPrev = elm.data('owl-nav-prev');
        let owlNavNext = elm.data('owl-nav-next');
        $(owlNavPrev).on("click", function (e) {
          elm.trigger('prev.owl.carousel');
          e.preventDefault();
        })

        $(owlNavNext).on("click", function (e) {
          elm.trigger('next.owl.carousel');
          e.preventDefault();
        })
      });
    }


  }
  // api code

  var eventFlowData = null;

  // Function to handle login and return the access token
  async function login(email, password) {
    var loginHeaders = new Headers();
    loginHeaders.append("Content-Type", "application/json");

    var loginData = JSON.stringify({
      "email": email,
      "password": password
    });

    var loginOptions = {
      method: 'POST',
      headers: loginHeaders,
      body: loginData
    };

    try {
      let response = await fetch("https://sit.spicetrade.io/api/auth/login", loginOptions);
      let result = await response.json(); // Parse the response as JSON

      if (result.data && result.data.accessToken) {
        console.log("Login successful, access token:", result.data.accessToken);
        return result.data.accessToken; // Return the access token
      } else {
        console.log('Login failed:', result.message);
        return null;
      }
    } catch (error) {
      console.log('Error logging in:', error);
      return null;
    }
  }

  // Function to fetch event data using the access token
  async function fetchEventData(accessToken, eventId) {
    var eventHeaders = new Headers();
    eventHeaders.append("Authorization", `Bearer ${accessToken}`);

    var eventOptions = {
      method: 'GET',
      headers: eventHeaders,
      redirect: 'follow'
    };

    try {
      let response = await fetch(`https://sit.spicetrade.io/api/event?id=${eventId}`, eventOptions);
      let eventResult = await response.json();
      console.log("Event data:", eventResult);
      eventFlowData = eventResult;
      return eventResult;
    } catch (error) {
      console.log('Error fetching event data:', error);
    }
  }

  // Main function to orchestrate login and event data fetching
  async function getEventData(email, password, eventId) {
    if (eventFlowData) {
      return eventFlowData;
    }
    let accessToken = await login(email, password);

    if (accessToken) {
      eventFlowData = await fetchEventData(accessToken, eventId);

    } else {
      console.log('Unable to fetch event data due to failed login');
    }
    return eventFlowData.data;
  }

  // Call the main function with login credentials and event ID
  // getEventData("shubham@spicetrade.com", "123456", 112);

  // console.log("event flow data", eventFlowData);

  // var eventflowData ={};

  // Function to handle login and return the access token
  // function login(email, password) {
  //   return $.ajax({
  //     url: "https://sit.spicetrade.io/api/auth/login",
  //     method: 'POST',
  //     contentType: 'application/json',
  //     data: JSON.stringify({
  //       "email": email,
  //       "password": password
  //     }),
  //   }).done(function(result) {
  //     if (result.data && result.data.accessToken) {
  //       console.log("Login successful, access token:", result.data.accessToken);
  //       return result.data.accessToken; // Return the access token
  //     } else {
  //       console.log('Login failed:', result.message);
  //       return null;
  //     }
  //   }).fail(function(jqXHR, textStatus, errorThrown) {
  //     console.log('Error logging in:', textStatus, errorThrown);
  //     return null;
  //   });
  // }

  // // Function to fetch event data using the access token
  // function fetchEventData(accessToken, eventId) {
  //   return $.ajax({
  //     url: `https://sit.spicetrade.io/api/event?id=${eventId}`,
  //     method: 'GET',
  //     headers: {
  //       'Authorization': `Bearer ${accessToken}`
  //     }
  //   }).done(function(eventResult) {
  //     console.log("Event data:", eventResult);
  //     eventflowData = eventResult;
  //     return eventResult;
  //   }).fail(function(jqXHR, textStatus, errorThrown) {
  //     console.log('Error fetching event data:', textStatus, errorThrown);
  //   });
  // }

  // // Main function to orchestrate login and event data fetching
  // function getEventData(email, password, eventId) {
  //   login(email, password).then(function(accessToken) {
  //     if (accessToken) {
  //       return fetchEventData(accessToken.data.accessToken, eventId);
  //     } else {
  //       console.log('Unable to fetch event data due to failed login');
  //     }
  //   });
  // }

  // Call the main function with login credentials and event ID
  // getEventData("shubham@spicetrade.com", "123456", 8).then(result => {
  //   console.log("eventFlowData", result);
  // });

  // update html according to api

  function formateDate(dateString) {

    const date = new Date(dateString);

    // Options to format the date as "7 July 2024"
    const options = { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' };
    const formattedDate = date.toLocaleDateString('en-GB', options);
    return formattedDate;
  }

  async function populateData() {
    const data = await getEventData("shubham@spicetrade.com", "123456", 112);
    console.log("data", data);


    // object ke ander data extract krne k leye 
    const { event, faq, banners, registerForms, agendas } = data;
    // let event = data.event;

    if ($(".main-slider__sub-title").length) {
      $('.main-slider__sub-title').text(`${event.kind} event`);
    }

    // debugger;
    if ($(".main-slider__text".length)) {
      $('.main-slider__text').html(`${event.description}`);
    }
    if ($(".buy-ticket__text".length)) {
      $('.buy-ticket__text').html(`${event.sectorOverview}`);
    }

    $(".main-slider__title").text(event.name);

    $(".event-start-end-time").text(`${formateDate(event.startDate)} - ${formateDate(event.endDate)}`);

    if ($(".event-address-p").length) {
      $(".event-address-p").text(event.address)
    }

    if ($(".main-slider__img").length) {
      let bannerImg = "";
      for (let banner of banners) {
        if (banner.category == "EVENT_HERO_BANNER_IMG") {
          bannerImg = banner.file;
          break;
        }
      }

      console.log("banner image", bannerImg);
      $('.main-slider___img').attr('src', bannerImg);
    }

    // debugger
    populateSpeakers(agendas);
    populateBanners(banners);
    populateFaq(faq);
    populateCohort(registerForms);
    populateForm(registerForms);
    populateSchedule(agendas);

  }

  populateData();

  function populateFaq(faq) {
    if ($(".accrodion-grp").length) {
      // var accrodionDiv = $('.accrodion').first();
      for (let i = 0; i < faq.length; i++) {
        const faqItem = faq[i];
        // if(!faqItem.isActive) {
        //   continue;
        // }
        let faqClassName = "";
        if (i % 2 == 0) {
          faqClassName = "faq-page__left"
        } else {
          faqClassName = "faq-page__right"
        }

        var accordionHTML = `
                          <div class="accrodion">
                                <div class="accrodion-title">
                                    <h4>${faqItem.question}</h4>
                                    <div class="faq-one-accrodion__count"></div>
                                </div>
                                <div class="accrodion-content">
                                    <div class="inner">
                                        <p>${faqItem.answer}</p>
                                    </div><!-- /.inner -->
                                </div>
                            </div>
`;
        let faqDiv = $(`.${faqClassName} .accrodion-grp`);
        faqDiv.append(accordionHTML);
      }

      // Accrodion
      if ($(".accrodion-grp").length) {
        var accrodionGrp = $(".accrodion-grp");
        accrodionGrp.each(function () {
          var accrodionName = $(this).data("grp-name");
          var Self = $(this);
          var accordion = Self.find(".accrodion");
          Self.addClass(accrodionName);
          Self.find(".accrodion .accrodion-content").hide();
          Self.find(".accrodion.active").find(".accrodion-content").show();
          accordion.each(function () {
            $(this)
              .find(".accrodion-title")
              .on("click", function () {
                if ($(this).parent().hasClass("active") === false) {
                  $(".accrodion-grp." + accrodionName)
                    .find(".accrodion")
                    .removeClass("active");
                  $(".accrodion-grp." + accrodionName)
                    .find(".accrodion")
                    .find(".accrodion-content")
                    .slideUp();
                  $(this).parent().addClass("active");
                  $(this).parent().find(".accrodion-content").slideDown();
                }
              });
          });
        });
      }
    }
  }


// ========================== speakers ============================================


  function populateSpeakers(agendas) {
    for (let i = 0; i < agendas.length; i++) {

      const speakers = agendas[i].speakers;
      let speakerListDiv = $(".speaker-list");
      for (let i = 0; i < speakers.length; i++) {
        const speaker = speakers[i];
        // speakers.forEach(speaker => {
        const speakerContent = `
        <div class="col-xl-4 col-lg-6 wow fadeInLeft" data-wow-delay="100ms">
                    <div class="team-one__single">
                        <div class="team-one__img-box">
                            <div class="team-one__img">
                                <img src="${speaker.photo}" alt="">
                                <div class="team-one__content">
                                    <h4 class="team-one__name">${speaker.firstName} - ${speaker.lastName}</a></h4>
                                    <p class="team-one__sub-title">${speaker.subtitle}
                                    </p>
                                </div>
                                <div class="team-one__content-hover">
                                    <h4 class="team-one__name-hover">${speaker.firstName} - ${speaker.lastName}</a>
                                    </h4>
                                    <p class="team-one__sub-title-hover">${speaker.subtitle}</p>
                                    <p class="team-one__text-hover">${speaker.about}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        `;

        speakerListDiv.append(speakerContent);
        // })
      }
    }
  }


// ======================================== day 1, day 2, day3 =========================

function populateSchedule(agendas) {
  for (let i = 0; i < agendas.length; i++) {
      const agenda = agendas[i];
      const dayTab = `${i + 1}-day`; // Mapping agenda index to day tab
      let day = `Day ${i + 1}`
      let scheduleContent1 = `
          <div class="schedule-one__tab-content-box">
              <div class="schedule-one__single">
                  <div class="schedule-one__left">
                      <h3 class="schedule-one__title">${agenda.title}</h3>
                      <p class="schedule-one__text">${agenda.description}</p>
                  </div>
                  <div class="schedule-one__img">
                      <img src="assets/images/default.jpg" alt="">
                  </div>
                  <div class="schedule-one__address-and-btn-box">
                      <ul class="list-unstyled schedule-one__address">
                          <li>
                              <div class="icon">
                                  <span class="icon-clock"></span>
                              </div>
                              <div class="text">
                                  <p>${new Date(agenda.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} to ${new Date(agenda.endDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}<br>${new Date(agenda.startDate).toLocaleDateString()}</p>
                              </div>
                          </li>
                          <li>
                              <div class="icon">
                                  <span class="icon-pin"></span>
                              </div>
                              <div class="text">
                                  <p>${agenda.location}</p>
                              </div>
                          </li>
                      </ul>
                      <div class="schedule-one__btn-box">
                          <a href="contact.html" class="schedule-one__btn thm-btn">Buy Ticket<span class="icon-arrow-right"></span></a>
                      </div>
                  </div>
              </div>
          </div>
      `;

    let tabContentUl = $(".tab-buttons");
    const scheduleLiContent = `
    <li data-tab =${dayTab} class="tab-btn ">
                            <h3>${day}</h3>
                            <p>${formateDate(agenda.startDate)}</p>
                        </li>


    
    `;

tabContentUl.append(scheduleLiContent);


let tabContentDiv = $(".tabs-content");
const scheduleDivContent = `
     <div class="tab " id=${dayTab}>
                            <div class="schedule-one__tab-content-box">
                                <div class="schedule-one__single">
                                    <div class="schedule-one__left">
                                        <h3 class="schedule-one__title">${agenda.title}
                                            </h3>
                                        <p class="schedule-one__text">${agenda.description}</p>
                                    </div>
                                    <div class="schedule-one__img">
                                        <img src="assets/images/image2/sch1.jpg" alt="">
                                    </div>
                                    <div class="schedule-one__address-and-btn-box">
                                        <ul class="list-unstyled schedule-one__address">
                                            <li>
                                                <div class="icon">
                                                    <span class="icon-clock"></span>
                                                </div>
                                                <div class="text">
                                             <p>${new Date(agenda.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} to ${new Date(agenda.endDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}<br>${new Date(agenda.startDate).toLocaleDateString()}</p>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="icon">
                                                    <span class="icon-pin"></span>
                                                </div>
                                                <div class="text">
                                                    <p>${agenda.location}</p>
                                                </div>
                                            </li>
                                        </ul>
                                        <div class="schedule-one__btn-box">
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
`

tabContentDiv.append(scheduleDivContent);

// button

      // Append the schedule content to the corresponding tab based on the day
      // const tabContentDiv = $(`#${dayTab}`);
      // tabContentDiv.append(scheduleContent);
  }
debugger
  if ($(".tabs-box").length) {
    $(".tabs-box .tab-buttons .tab-btn").on("click", function (e) {
      e.preventDefault();
      var target = $($(this).attr("data-tab"));
  debugger
      if ($(target).is(":visible")) {
        return false;
      } else {
        target
          .parents(".tabs-box")
          .find(".tab-buttons")
          .find(".tab-btn")
          .removeClass("active-btn");
        $(this).addClass("active-btn");
        target
          .parents(".tabs-box")
          .find(".tabs-content")
          .find(".tab")
          .fadeOut(0);
        target
          .parents(".tabs-box")
          .find(".tabs-content")
          .find(".tab")
          .removeClass("active-tab");
        $(target).fadeIn(300);
        $(target).addClass("active-tab");
      }
    });
  }
  
  
  
}

// Example usage with your agendas array
// populateSchedule(agendas);








// ===================== BANNERS =========================================

  function populateBanners(banners) {
    const masonaryLayoutDiv = $(".masonary-layout");
    banners.forEach(banner => {
      if (banner.category == "EVENT_GALLERY_IMG") {
        const masonaryContent = `
      <div class="col-xl-3 col-lg-6 col-md-6">
                    <div class="gallery-one__single">
                        <div class="gallery-one__img">
                            <img src="${banner.file}" alt="">
                            <div class="gallery-one__content">
                                <div class="gallery-one__sub-title-box">
                                    <div class="gallery-one__sub-title-shape"></div>
                                    <p class="gallery-one__sub-title">${banner.title}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
      `;

        masonaryLayoutDiv.append(masonaryContent);
      }
    });
    // images overlap ho rhi thi usko fix krne k leye------------------
    // projectMasonaryLayout();       
    // 
  }




  function populateCohort(registerForm) {
    if ($(".cohort-dropdown-content").length) {
      let cohortDiv = $(".cohort-dropdown-content");
      Object.keys(registerForm).forEach(cohort => {
        let cohortOption = `<a class="thm-btn" href="register.html?id=${cohort}" data-value="${cohort}">${cohort}</a>`;
        cohortDiv.append(cohortOption)
      });
    }
  }

  // $(".cohort-dropdown-content").ready(function() {
  //   $('.cohort-dropdown-content').on('change', function() {
  //     var selectedRole = $(this).val();

  //     if (selectedRole === 'attendee') {
  //       $('#attendee-section').removeClass('hidden');
  //       $('#exhibitor-section').addClass('hidden');
  //     } else if (selectedRole === 'exhibitor') {
  //       $('#exhibitor-section').removeClass('hidden');
  //       $('#attendee-section').addClass('hidden');
  //     } else {
  //       $('#attendee-section, #exhibitor-section').addClass('hidden');
  //     }
  //   });
  // });


  function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  function populateForm(registerForm) {
    const id = getQueryParameter('id'); // Assuming id is passed via query parameter
    const $form = $('#dynamic-form');
    $(".reg-header").append(id); // Set title or some element to show ID
    $form.empty(); // Clear previous fields

    if (id && registerForm[id]) {
        let sections = {}; // Object to store sections

        registerForm[id].forEach(field => {
            if (field.isActive == true) {
                let fieldHtml = '';

                // Create sections dynamically
                let sectionHeader = field.sectionHeader || "General";

                // If section doesn't exist, create it
                if (!sections[sectionHeader]) {
                    sections[sectionHeader] = $(`
                        <section>
                            <h2 class="reg-section-header">${sectionHeader}</h2>
                            <div class="reg-grid"></div>
                        </section>
                    `);
                    $form.append(sections[sectionHeader]);
                }

                // Label for the field
                fieldHtml += `<label for="${field.name}" class="reg-label">${field.label} ${field.isRequired ? "<span class='reg-required'>*</span>" : ''}</label>`;

                // Create input fields based on the type (kind)
                if (field.kind === "TEXT") {
                    fieldHtml += `<input type="text" id="${field.name}" name="${field.name}" placeholder="${field.placeholder || ''}" class="reg-input" ${field.isRequired ? "required" : ""}>`;
                } else if (field.kind === "EMAIL") {
                    fieldHtml += `<input type="email" id="${field.name}" name="${field.name}" placeholder="${field.placeholder || ''}" class="reg-input" ${field.isRequired ? "required" : ""}>`;
                } else if (field.kind === "RADIO") {
                    const defaultValue = typeof field.defaultValue == 'string' ? JSON.parse(field.defaultValue) : field.defaultValue;
                    defaultValue.forEach(option => {
                        fieldHtml += `
                            <div class="reg-radio-group">
                                <input type="radio" id="${option.value}" name="${field.name}" value="${option.value}" class="reg-radio" ${field.isRequired ? "required" : ""}>
                                <label for="${option.value}" class="reg-label-inline">${option.label}</label>
                            </div>
                        `;
                    });
                } else if (field.kind === "DATE") {
                    fieldHtml += `<input type="date" id="${field.name}" name="${field.name}" class="reg-input" ${field.isRequired ? "required" : ""}>`;
                } else {
                  fieldHtml += `<input type="${field.kind.toLowerCase}" id="${field.name}" name="${field.name}" class="reg-input" ${field.isRequired ? "required" : ""}>`;
                }

                // Append generated field to the section's grid
                sections[sectionHeader].find('.reg-grid').append(`<div class="reg-grid-item">${fieldHtml}</div>`);
            }
        });

        // Append submit button at the end of the form
        $form.append('<button type="submit" class="reg-button">Submit</button>');


      // Add a submit button
    }

    $('#dynamic-form').on('submit', function (e) {
      e.preventDefault(); // Prevent default form submission

      const formData = {};

      // Collect all input values dynamically
      $('#dynamic-form').find('input, select, textarea').each(function () {
        const $input = $(this);
        const name = $input.attr('name');
        const value = $input.val();

        // Handle radio buttons: only add the checked ones
        if ($input.attr('type') === 'radio') {
          if ($input.is(':checked')) {
            formData[name] = value;
          }
        } else {
          formData[name] = value;
        }
      });
      console.log('Collected form data:', formData);
      alert('Data saved successfully!');
    });
  }

  // Popular Causes Progress Bar
  if ($(".count-bar").length) {
    $(".count-bar").appear(
      function () {
        var el = $(this);
        var percent = el.data("percent");
        $(el).css("width", percent).addClass("counted");
      }, {
      accY: -50
    }
    );
  }

  //Progress Bar / Levels
  if ($(".progress-levels .progress-box .bar-fill").length) {
    $(".progress-box .bar-fill").each(
      function () {
        $(".progress-box .bar-fill").appear(function () {
          var progressWidth = $(this).attr("data-percent");
          $(this).css("width", progressWidth + "%");
        });
      }, {
      accY: 0
    }
    );
  }

  //Fact Counter + Text Count
  if ($(".count-box").length) {
    $(".count-box").appear(
      function () {
        var $t = $(this),
          n = $t.find(".count-text").attr("data-stop"),
          r = parseInt($t.find(".count-text").attr("data-speed"), 10);

        if (!$t.hasClass("counted")) {
          $t.addClass("counted");
          $({
            countNum: $t.find(".count-text").text()
          }).animate({
            countNum: n
          }, {
            duration: r,
            easing: "linear",
            step: function () {
              $t.find(".count-text").text(Math.floor(this.countNum));
            },
            complete: function () {
              $t.find(".count-text").text(this.countNum);
            }
          });
        }
      }, {
      accY: 0
    }
    );
  }




  if ($(".scroll-to-target").length) {
    $(".scroll-to-target").on("click", function () {
      var target = $(this).attr("data-target");
      // animate
      $("html, body").animate({
        scrollTop: $(target).offset().top
      },
        1000
      );

      return false;
    });
  }


  if ($(".contact-form-validated").length) {
    $(".contact-form-validated").each(function () {
      let self = $(this);
      self.validate({
        // initialize the plugin
        rules: {
          name: {
            required: true
          },
          email: {
            required: true,
            email: true
          },
          message: {
            required: true
          },
          subject: {
            required: true
          }
        },
        submitHandler: function (form) {
          // sending value with ajax request
          $.post(
            $(form).attr("action"),
            $(form).serialize(),
            function (response) {
              $(form).parent().find(".result").append(response);
              $(form).find('input[type="text"]').val("");
              $(form).find('input[type="email"]').val("");
              $(form).find("textarea").val("");
            }
          );
          return false;
        }
      });
    });
  }

  // mailchimp form
  if ($(".mc-form").length) {
    $(".mc-form").each(function () {
      var Self = $(this);
      var mcURL = Self.data("url");
      var mcResp = Self.parent().find(".mc-form__response");

      Self.ajaxChimp({
        url: mcURL,
        callback: function (resp) {
          // appending response
          mcResp.append(function () {
            return '<p class="mc-message">' + resp.msg + "</p>";
          });
          // making things based on response
          if (resp.result === "success") {
            // Do stuff
            Self.removeClass("errored").addClass("successed");
            mcResp.removeClass("errored").addClass("successed");
            Self.find("input").val("");

            mcResp.find("p").fadeOut(10000);
          }
          if (resp.result === "error") {
            Self.removeClass("successed").addClass("errored");
            mcResp.removeClass("successed").addClass("errored");
            Self.find("input").val("");

            mcResp.find("p").fadeOut(10000);
          }
        }
      });
    });
  }

  if ($(".video-popup").length) {
    $(".video-popup").magnificPopup({
      type: "iframe",
      mainClass: "mfp-fade",
      removalDelay: 160,
      preloader: true,

      fixedContentPos: false
    });
  }

  if ($(".img-popup").length) {
    var groups = {};
    $(".img-popup").each(function () {
      var id = parseInt($(this).attr("data-group"), 10);

      if (!groups[id]) {
        groups[id] = [];
      }

      groups[id].push(this);
    });

    $.each(groups, function () {
      $(this).magnificPopup({
        type: "image",
        closeOnContentClick: true,
        closeBtnInside: false,
        gallery: {
          enabled: true
        }
      });
    });
  }



  //=== CountDownTimer===
  if ($('.time-countdown-one').length) {
    $('.time-countdown-one').each(function () {
      var Self = $(this);
      var countDate = Self.data('countdown-time'); // getting date

      Self.countdown(countDate, function (event) {
        $(this).html('<li> <div class="box"> <span class="days">' + event.strftime('%D') + '</span> <span class="timeRef">Days</span> </div> </li> <li> <div class="box"> <span class="hours">' + event.strftime('%H') + '</span> <span class="timeRef clr-1">Hours</span> </div> </li> <li> <div class="box"> <span class="minutes">' + event.strftime('%M') + '</span> <span class="timeRef clr-2">Minutes</span> </div> </li> <li> <div class="box"> <span class="seconds">' + event.strftime('%S') + '</span> <span class="timeRef clr-3">Seconds</span> </div> </li>');
      });
    });
  };


  //=== CountDownTimer===
  if ($('.time-countdown-two').length) {
    $('.time-countdown-two').each(function () {
      var Self = $(this);
      var countDate = Self.data('countdown-time'); // getting date

      Self.countdown(countDate, function (event) {
        $(this).html('<li> <div class="box"> <span class="days">' + event.strftime('%D') + '</span> <span class="timeRef">Days</span> </div> </li> <li> <div class="box"> <span class="hours">' + event.strftime('%H') + '</span> <span class="timeRef clr-1">Hours</span> </div> </li> <li> <div class="box"> <span class="minutes">' + event.strftime('%M') + '</span> <span class="timeRef clr-2">Min</span> </div> </li> <li> <div class="box"> <span class="seconds">' + event.strftime('%S') + '</span> <span class="timeRef clr-3">Sec</span> </div> </li>');
      });
    });
  };



  //=== CountDownTimer===
  if ($('.coming-soon-countdown').length) {
    $('.coming-soon-countdown').each(function () {
      var Self = $(this);
      var countDate = Self.data('countdown-time'); // getting date

      Self.countdown(countDate, function (event) {
        $(this).html('<li> <div class="box"> <span class="days">' + event.strftime('%D') + '</span> <span class="timeRef">days</span> </div> </li> <li> <div class="box"> <span class="hours">' + event.strftime('%H') + '</span> <span class="timeRef clr-1">hrs</span> </div> </li> <li> <div class="box"> <span class="minutes">' + event.strftime('%M') + '</span> <span class="timeRef clr-2">mins</span> </div> </li> <li> <div class="box"> <span class="seconds">' + event.strftime('%S') + '</span> <span class="timeRef clr-3">secs</span> </div> </li>');
      });
    });
  };




  function dynamicCurrentMenuClass(selector) {
    let FileName = window.location.href.split("/").reverse()[0];

    selector.find("li").each(function () {
      let anchor = $(this).find("a");
      if ($(anchor).attr("href") == FileName) {
        $(this).addClass("current");
      }
    });
    // if any li has .current elmnt add class
    selector.children("li").each(function () {
      if ($(this).find(".current").length) {
        $(this).addClass("current");
      }
    });
    // if no file name return
    if ("" == FileName) {
      selector.find("li").eq(0).addClass("current");
    }
  }

  if ($(".main-menu__list").length) {
    // dynamic current class
    let mainNavUL = $(".main-menu__list");
    dynamicCurrentMenuClass(mainNavUL);
  }


  if ($(".main-menu__list").length && $(".mobile-nav__container").length) {
    let navContent = document.querySelector(".main-menu__list").outerHTML;
    let mobileNavContainer = document.querySelector(".mobile-nav__container");
    mobileNavContainer.innerHTML = navContent;
  }


  if ($(".sticky-header__content").length) {
    let navContent = document.querySelector(".main-menu").innerHTML;
    let mobileNavContainer = document.querySelector(".sticky-header__content");
    mobileNavContainer.innerHTML = navContent;
  }

  if ($(".mobile-nav__container .main-menu__list").length) {
    let dropdownAnchor = $(
      ".mobile-nav__container .main-menu__list .dropdown > a"
    );
    dropdownAnchor.each(function () {
      let self = $(this);
      let toggleBtn = document.createElement("BUTTON");
      toggleBtn.setAttribute("aria-label", "dropdown toggler");
      toggleBtn.innerHTML = "<i class='fa fa-angle-down'></i>";
      self.append(function () {
        return toggleBtn;
      });
      self.find("button").on("click", function (e) {
        e.preventDefault();
        let self = $(this);
        self.toggleClass("expanded");
        self.parent().toggleClass("expanded");
        self.parent().parent().children("ul").slideToggle();
      });
    });
  }


  if ($(".mobile-nav__toggler").length) {
    $(".mobile-nav__toggler").on("click", function (e) {
      e.preventDefault();
      $(".mobile-nav__wrapper").toggleClass("expanded");
      $("body").toggleClass("locked");
    });
  }

  if ($(".search-toggler").length) {
    $(".search-toggler").on("click", function (e) {
      e.preventDefault();
      $(".search-popup").toggleClass("active");
      $(".mobile-nav__wrapper").removeClass("expanded");
      $("body").toggleClass("locked");
    });
  }

  if ($(".odometer").length) {
    var odo = $(".odometer");
    odo.each(function () {
      $(this).appear(function () {
        var countNumber = $(this).attr("data-count");
        $(this).html(countNumber);
      });
    });
  }

  if ($(".dynamic-year").length) {
    let date = new Date();
    $(".dynamic-year").html(date.getFullYear());
  }

  if ($(".wow").length) {
    var wow = new WOW({
      boxClass: "wow", // animated element css class (default is wow)
      animateClass: "animated", // animation css class (default is animated)
      mobile: true, // trigger animations on mobile devices (default is true)
      live: true // act on asynchronously loaded content (default is true)
    });
    wow.init();
  }



  if ($(".thm-accordion").length) {
    let accordionWrapper = $(".thm-accordion");
    accordionWrapper.each(function () {
      let $this = $(this);
      let accordionID = $this.attr("id");
      let accordionTitle = $this.find(".thm-accordion__title");
      $this.addClass(accordionID);
      // default hide
      let mainAccordionContent = $this.find(".thm-accordion__content").hide();
      $this.find(".active-item .thm-accordion__content").show();
      // on title click
      accordionTitle.on("click", function (e) {
        e.preventDefault();
        let $this = $(this);
        let accordionItem = $(this).parent();
        if (false === accordionItem.hasClass("active-item")) {
          $("#" + accordionID)
            .find(".thm-accordion__item")
            .removeClass("active-item");
          accordionItem.addClass("active-item");
          mainAccordionContent.slideUp();
          accordionItem.find(".thm-accordion__content").slideDown();
        }
      });
    });
  }







  // ===Portfolio===
  function projectMasonaryLayout() {
    if ($(".masonary-layout").length) {
      $(".masonary-layout").isotope({
        layoutMode: "masonry"
      });
    }
    if ($(".post-filter").length) {
      $(".post-filter li")
        .children(".filter-text")
        .on("click", function () {
          var Self = $(this);
          var selector = Self.parent().attr("data-filter");
          $(".post-filter li").removeClass("active");
          Self.parent().addClass("active");
          $(".filter-layout").isotope({
            filter: selector,
            animationOptions: {
              duration: 500,
              easing: "linear",
              queue: false
            }
          });
          return false;
        });
    }

    if ($(".post-filter.has-dynamic-filters-counter").length) {
      // var allItem = $('.single-filter-item').length;
      var activeFilterItem = $(".post-filter.has-dynamic-filters-counter").find(
        "li"
      );
      activeFilterItem.each(function () {
        var filterElement = $(this).data("filter");
        var count = $(".filter-layout").find(filterElement).length;
        $(this)
          .children(".filter-text")
          .append('<span class="count">' + count + "</span>");
      });
    }
  }








  function SmoothMenuScroll() {
    var anchor = $(".scrollToLink");
    if (anchor.length) {
      anchor.children("a").bind("click", function (event) {
        if ($(window).scrollTop() > 10) {
          var headerH = "90";
        } else {
          var headerH = "90";
        }
        var target = $(this);
        $("html, body")
          .stop()
          .animate({
            scrollTop: $(target.attr("href")).offset().top - headerH + "px"
          },
            1200,
            "easeInOutExpo"
          );
        anchor.removeClass("current");
        anchor.removeClass("current-menu-ancestor");
        anchor.removeClass("current_page_item");
        anchor.removeClass("current-menu-parent");
        target.parent().addClass("current");
        event.preventDefault();
      });
    }
  }
  SmoothMenuScroll();

  function OnePageMenuScroll() {
    var windscroll = $(window).scrollTop();
    if (windscroll >= 117) {
      var menuAnchor = $(".one-page-scroll-menu .scrollToLink").children("a");
      menuAnchor.each(function () {
        var sections = $(this).attr("href");
        $(sections).each(function () {
          if ($(this).offset().top <= windscroll + 100) {
            var Sectionid = $(sections).attr("id");
            $(".one-page-scroll-menu").find("li").removeClass("current");
            $(".one-page-scroll-menu").find("li").removeClass("current-menu-ancestor");
            $(".one-page-scroll-menu").find("li").removeClass("current_page_item");
            $(".one-page-scroll-menu").find("li").removeClass("current-menu-parent");
            $(".one-page-scroll-menu")
              .find("a[href*=\\#" + Sectionid + "]")
              .parent()
              .addClass("current");
          }
        });
      });
    } else {
      $(".one-page-scroll-menu li.current").removeClass("current");
      $(".one-page-scroll-menu li:first").addClass("current");
    }
  }


  // window load event

  $(window).on("load", function () {
    if ($(".preloader").length) {
      $(".preloader").fadeOut();
    }
    thmSwiperInit();
    thmOwlInit();
    // projectMasonaryLayout();
    fullHeight();








    if ($(".post-filter").length) {
      var postFilterList = $(".post-filter li");
      // for first init
      $(".filter-layout").isotope({
        filter: ".filter-item",
        animationOptions: {
          duration: 500,
          easing: "linear",
          queue: false
        }
      });
      // on click filter links
      postFilterList.on("click", function () {
        var Self = $(this);
        var selector = Self.attr("data-filter");
        postFilterList.removeClass("active");
        Self.addClass("active");

        $(".filter-layout").isotope({
          filter: selector,
          animationOptions: {
            duration: 500,
            easing: "linear",
            queue: false
          }
        });
        return false;
      });
    }

    if ($(".post-filter.has-dynamic-filter-counter").length) {
      // var allItem = $('.single-filter-item').length;

      var activeFilterItem = $(".post-filter.has-dynamic-filter-counter").find(
        "li"
      );

      activeFilterItem.each(function () {
        var filterElement = $(this).data("filter");
        var count = $(".filter-layout").find(filterElement).length;
        $(this).append("<sup>[" + count + "]</sup>");
      });
    }



    if ($("#testimonial-three__thumb").length) {
      let testimonialsThumb = new Swiper("#testimonial-three__thumb", {
        slidesPerView: 3,
        spaceBetween: 20,
        speed: 1400,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        loop: true,
        autoplay: {
          delay: 5000
        }
      });

      let testimonialsCarousel = new Swiper("#testimonial-three__carousel", {
        observer: true,
        observeParents: true,
        speed: 1400,
        mousewheel: true,
        slidesPerView: 1,
        autoplay: {
          delay: 5000
        },
        thumbs: {
          swiper: testimonialsThumb
        },
        pagination: {
          el: "#testimonial-three__carousel-pagination",
          type: "bullets",
          clickable: true
        }
      });
    };





    if ($(".marquee_mode").length) {
      $('.marquee_mode').marquee({
        speed: 40,
        gap: 0,
        delayBeforeStart: 0,
        direction: 'left',
        duplicated: true,
        pauseOnHover: true,
        startVisible: true,
      });
    }




  });

  // window scroll event

  $(window).on("scroll", function () {
    if ($(".stricked-menu").length) {
      var headerScrollPos = 130;
      var stricky = $(".stricked-menu");
      if ($(window).scrollTop() > headerScrollPos) {
        stricky.addClass("stricky-fixed");
      } else if ($(this).scrollTop() <= headerScrollPos) {
        stricky.removeClass("stricky-fixed");
      }
    }
    if ($(".scroll-to-top").length) {
      var strickyScrollPos = 100;
      if ($(window).scrollTop() > strickyScrollPos) {
        $(".scroll-to-top").fadeIn(500);
      } else if ($(this).scrollTop() <= strickyScrollPos) {
        $(".scroll-to-top").fadeOut(500);
      }
    }

    OnePageMenuScroll();

  });






  $('select:not(.ignore)').niceSelect();
})(jQuery);