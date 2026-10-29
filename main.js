document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero");

  if (hero) {
    const slides = Array.from(hero.querySelectorAll(".hero-slide"));
    const indicators = Array.from(
      hero.querySelectorAll(".hero-indicators button"),
    );
    const previousButton = hero.querySelector(".hero-prev");
    const nextButton = hero.querySelector(".hero-next");
    const status = hero.querySelector(".hero-status");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let currentSlide = 0;
    let autoTimer;

    const showHeroSlide = (index) => {
      currentSlide = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === currentSlide;
        slide.classList.toggle("is-active", isActive);
        slide.setAttribute("aria-hidden", String(!isActive));
      });
      indicators.forEach((indicator, indicatorIndex) => {
        const isActive = indicatorIndex === currentSlide;
        indicator.classList.toggle("is-active", isActive);
        if (isActive) indicator.setAttribute("aria-current", "true");
        else indicator.removeAttribute("aria-current");
      });
      status.textContent = `${currentSlide + 1}번 슬라이드`;
    };

    const startHeroAutoplay = () => {
      clearInterval(autoTimer);
      if (reduceMotion.matches || document.hidden) return;
      autoTimer = setInterval(() => showHeroSlide(currentSlide + 1), 5000);
    };

    const selectHeroSlide = (index) => {
      showHeroSlide(index);
      startHeroAutoplay();
    };

    previousButton.addEventListener("click", () =>
      selectHeroSlide(currentSlide - 1),
    );
    nextButton.addEventListener("click", () =>
      selectHeroSlide(currentSlide + 1),
    );
    indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => selectHeroSlide(index));
    });
    reduceMotion.addEventListener("change", startHeroAutoplay);
    document.addEventListener("visibilitychange", startHeroAutoplay);

    showHeroSlide(0);
    startHeroAutoplay();
  }

  const brandStatement = document.querySelector(".brand-statement");

  if (brandStatement) {
    const reduceCon1Motion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    if (reduceCon1Motion.matches || !("IntersectionObserver" in window)) {
      brandStatement.classList.add("is-visible");
    } else {
      brandStatement.classList.add("has-con1-motion");
      const brandObserver = new IntersectionObserver(
        ([entry], observer) => {
          if (!entry.isIntersecting) return;
          brandStatement.classList.add("is-visible");
          observer.disconnect();
        },
        { threshold: 0.3 },
      );

      brandObserver.observe(brandStatement);
    }
  }

  const heritageSection = document.querySelector(".heritage");

  if (heritageSection) {
    const reduceCon2Motion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    if (reduceCon2Motion.matches || !("IntersectionObserver" in window)) {
      heritageSection.classList.add("is-visible");
    } else {
      heritageSection.classList.add("has-con2-motion");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => heritageSection.classList.add("is-ready"));
      });
      let intersectionRatio = 0;
      let hasUserScrolled = false;

      const revealHeritage = () => {
        if (!hasUserScrolled || intersectionRatio < 0.3) return;
        heritageSection.classList.add("is-visible");
        heritageObserver.disconnect();
        window.removeEventListener("scroll", handleHeritageScroll);
      };

      const handleHeritageScroll = () => {
        hasUserScrolled = true;
        revealHeritage();
      };

      const heritageObserver = new IntersectionObserver(
        ([entry]) => {
          intersectionRatio = entry.intersectionRatio;
          revealHeritage();
        },
        { threshold: [0, 0.3] },
      );

      window.addEventListener("scroll", handleHeritageScroll, {
        passive: true,
      });
      heritageObserver.observe(heritageSection);
    }
  }

  const collectionsSection = document.querySelector(".collections");
  const collectionGrid = collectionsSection?.querySelector(".collection-grid");

  if (collectionsSection && collectionGrid) {
    const reduceCon3Motion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    if (reduceCon3Motion.matches || !("IntersectionObserver" in window)) {
      collectionsSection.classList.add("is-visible");
    } else {
      collectionsSection.classList.add("has-con3-motion");
      requestAnimationFrame(() => {
        requestAnimationFrame(() =>
          collectionsSection.classList.add("is-ready"),
        );
      });
      let intersectionRatio = 0;
      let hasUserScrolled = false;

      const revealCollections = () => {
        if (!hasUserScrolled || intersectionRatio < 0.35) return;
        collectionsSection.classList.add("is-visible");
        collectionsObserver.disconnect();
        window.removeEventListener("scroll", handleCollectionsScroll);
      };

      const handleCollectionsScroll = () => {
        hasUserScrolled = true;
        revealCollections();
      };

      const collectionsObserver = new IntersectionObserver(
        ([entry]) => {
          intersectionRatio = entry.intersectionRatio;
          revealCollections();
        },
        { threshold: [0, 0.35] },
      );

      window.addEventListener("scroll", handleCollectionsScroll, {
        passive: true,
      });
      collectionsObserver.observe(collectionGrid);
    }
  }

  const carousel = document.querySelector(".product-carousel");

  /* Previous finite-carousel implementation retained here for reference only.
    const viewport = carousel.querySelector(".product-viewport");
    const track = carousel.querySelector(".product-track");
    const cards = Array.from(carousel.querySelectorAll(".product-card"));
    const previousButton = carousel.querySelector(".carousel-prev");
    const nextButton = carousel.querySelector(".carousel-next");
    const status = carousel.querySelector(".carousel-status");
    let currentIndex = 1;

    const getVisibleCount = () => {
      if (window.innerWidth <= 760) return 1;
      if (window.innerWidth <= 1100) return 2;
      return 3;
    };

    const updateCarousel = (announce = false) => {
      const visibleCount = getVisibleCount();
      const maxIndex = Math.max(0, cards.length - visibleCount);
      currentIndex = Math.min(currentIndex, maxIndex);
      const cardWidth = cards[0]?.getBoundingClientRect().width || 0;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 24;
      track.style.transform = `translate3d(-${currentIndex * (cardWidth + gap)}px, 0, 0)`;
      previousButton.disabled = currentIndex === 0;
      nextButton.disabled = currentIndex === maxIndex;
      previousButton.setAttribute(
        "aria-disabled",
        String(previousButton.disabled),
      );
      nextButton.setAttribute("aria-disabled", String(nextButton.disabled));

      cards.forEach((card, index) => {
        const isVisible =
          index >= currentIndex && index < currentIndex + visibleCount;
        card.setAttribute("aria-hidden", String(!isVisible));
      });

      if (announce) {
        status.textContent = `${currentIndex + 1}번째 제품부터 ${Math.min(currentIndex + visibleCount, cards.length)}번째 제품까지 표시 중`;
      }
    };

    previousButton.addEventListener("click", () => {
      currentIndex = Math.max(0, currentIndex - 1);
      updateCarousel(true);
    });

    nextButton.addEventListener("click", () => {
      currentIndex = Math.min(
        cards.length - getVisibleCount(),
        currentIndex + 1,
      );
      updateCarousel(true);
    });

    viewport.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft" && !previousButton.disabled)
        previousButton.click();
      if (event.key === "ArrowRight" && !nextButton.disabled)
        nextButton.click();
    });

    let resizeFrame;
    window.addEventListener("resize", () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => updateCarousel(false));
    });

    updateCarousel(false);
  */

  if (carousel) {
    const viewport = carousel.querySelector(".product-viewport");
    const track = carousel.querySelector(".product-track");
    const originalCards = Array.from(track.querySelectorAll(".product-card"));
    const previousButton = carousel.querySelector(".carousel-prev");
    const nextButton = carousel.querySelector(".carousel-next");
    const status = carousel.querySelector(".carousel-status");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const originalCount = originalCards.length;

    const cloneCard = (card) => {
      const clone = card.cloneNode(true);
      clone.dataset.carouselClone = "true";
      clone.setAttribute("aria-hidden", "true");
      clone.querySelectorAll("a, button, [tabindex]").forEach((element) => {
        element.setAttribute("tabindex", "-1");
      });
      return clone;
    };

    originalCards.forEach((card, index) => {
      card.dataset.productIndex = String(index);
    });

    const leadingClones = document.createDocumentFragment();
    const trailingClones = document.createDocumentFragment();
    originalCards.forEach((card) => {
      leadingClones.append(cloneCard(card));
      trailingClones.append(cloneCard(card));
    });
    track.prepend(leadingClones);
    track.append(trailingClones);

    const cards = Array.from(track.querySelectorAll(".product-card"));
    let currentIndex = originalCount + 1;
    let isTransitioning = false;
    let isHovered = false;
    let isFocusWithin = false;
    let isInViewport = false;
    let autoTimer = 0;
    let resizeFrame = 0;

    const getVisibleCount = () => {
      if (window.innerWidth <= 760) return 1;
      if (window.innerWidth <= 1100) return 2;
      return 3;
    };

    const getLogicalIndex = (index = currentIndex) =>
      (((index - originalCount) % originalCount) + originalCount) %
      originalCount;

    const getStep = () => {
      const cardWidth = cards[0]?.getBoundingClientRect().width || 0;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 24;
      return cardWidth + gap;
    };

    const updateCenterCard = () => {
      const cardWidth = cards[0]?.getBoundingClientRect().width || 0;
      const step = getStep();
      const viewportCenter = currentIndex * step + viewport.clientWidth / 2;
      let centerIndex = currentIndex;
      let shortestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card, index) => {
        const cardCenter = index * step + cardWidth / 2;
        const distance = Math.abs(cardCenter - viewportCenter);
        if (distance < shortestDistance) {
          shortestDistance = distance;
          centerIndex = index;
        }
      });

      const primeIndex =
        centerIndex >= originalCount * 2
          ? centerIndex - originalCount
          : centerIndex < originalCount
            ? centerIndex + originalCount
            : -1;

      cards.forEach((card, index) => {
        card.classList.toggle("is-center", index === centerIndex);
        card.classList.toggle("is-center-prime", index === primeIndex);
      });
    };

    const updateAccessibility = (announce = false) => {
      const visibleCount = getVisibleCount();
      cards.forEach((card, index) => {
        const isVisible =
          index >= currentIndex && index < currentIndex + visibleCount;
        const isClone = card.dataset.carouselClone === "true";
        card.setAttribute("aria-hidden", String(!isVisible || isClone));
      });

      if (announce) {
        const logicalIndex = getLogicalIndex();
        status.textContent = `${logicalIndex + 1}번째 제품부터 ${Math.min(logicalIndex + visibleCount, originalCount)}번째 제품까지 표시 중`;
      }
    };

    const render = (animate = true, announce = false) => {
      track.style.transition = animate && !reducedMotion.matches ? "" : "none";
      track.style.transform = `translate3d(-${currentIndex * getStep()}px, 0, 0)`;
      updateCenterCard();
      updateAccessibility(announce);
    };

    const normalizePosition = () => {
      if (currentIndex >= originalCount * 2) {
        currentIndex -= originalCount;
      } else if (currentIndex < originalCount) {
        currentIndex += originalCount;
      } else {
        return;
      }
      render(false, false);
      track.getBoundingClientRect();
      track.style.transition = "";
    };

    const canAutoPlay = () =>
      !reducedMotion.matches &&
      isInViewport &&
      !document.hidden &&
      !isHovered &&
      !isFocusWithin;

    const clearAutoPlay = () => {
      window.clearTimeout(autoTimer);
      autoTimer = 0;
    };

    const scheduleAutoPlay = () => {
      clearAutoPlay();
      if (!canAutoPlay()) return;
      autoTimer = window.setTimeout(() => {
        moveBy(1, false, false);
        scheduleAutoPlay();
      }, 2500);
    };

    const moveBy = (direction, announce = true, resetTimer = true) => {
      if (isTransitioning && !reducedMotion.matches) return;
      currentIndex += direction;
      isTransitioning = !reducedMotion.matches;
      render(true, announce);

      if (reducedMotion.matches) {
        normalizePosition();
        isTransitioning = false;
      }

      if (resetTimer) scheduleAutoPlay();
    };

    previousButton.disabled = false;
    nextButton.disabled = false;
    previousButton.setAttribute("aria-disabled", "false");
    nextButton.setAttribute("aria-disabled", "false");

    previousButton.addEventListener("click", () => moveBy(-1));
    nextButton.addEventListener("click", () => moveBy(1));

    track.addEventListener("transitionend", (event) => {
      if (event.target !== track || event.propertyName !== "transform") return;
      isTransitioning = false;
      normalizePosition();
    });

    viewport.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") previousButton.click();
      if (event.key === "ArrowRight") nextButton.click();
    });

    carousel.addEventListener("mouseenter", () => {
      isHovered = true;
      clearAutoPlay();
    });
    carousel.addEventListener("mouseleave", () => {
      isHovered = false;
      scheduleAutoPlay();
    });
    carousel.addEventListener("focusin", () => {
      isFocusWithin = true;
      clearAutoPlay();
    });
    carousel.addEventListener("focusout", () => {
      requestAnimationFrame(() => {
        isFocusWithin = carousel.contains(document.activeElement);
        scheduleAutoPlay();
      });
    });

    const carouselObserver = new IntersectionObserver(
      ([entry]) => {
        isInViewport = entry.isIntersecting && entry.intersectionRatio >= 0.25;
        scheduleAutoPlay();
      },
      { threshold: [0, 0.25] },
    );
    carouselObserver.observe(carousel);

    document.addEventListener("visibilitychange", scheduleAutoPlay);

    const handleMotionPreference = () => {
      isTransitioning = false;
      currentIndex = originalCount + getLogicalIndex();
      render(false, false);
      scheduleAutoPlay();
    };
    reducedMotion.addEventListener("change", handleMotionPreference);

    window.addEventListener("resize", () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        currentIndex = originalCount + getLogicalIndex();
        isTransitioning = false;
        render(false, false);
        scheduleAutoPlay();
      });
    });

    render(false, false);
  }

  const campaign = document.querySelector(".campaign-visual");
  const campaignVideo = campaign?.querySelector(".campaign-video");
  const campaignPlayButton = campaign?.querySelector(".campaign-play");
  const campaignVideoStatus = campaign?.querySelector(".campaign-video-status");

  if (campaign && campaignVideo && campaignPlayButton) {
    campaignVideo.muted = true;

    const showPausedState = () => {
      campaign.classList.remove("is-playing");
      campaignPlayButton.setAttribute("aria-label", "캠페인 영상 재생");
    };

    const playCampaignVideo = async () => {
      if (campaign.classList.contains("has-video-error")) return;

      try {
        await campaignVideo.play();
      } catch (error) {
        showPausedState();
        campaignVideoStatus.textContent =
          "영상을 재생할 수 없습니다. 잠시 후 다시 시도해 주세요.";
      }
    };

    campaignPlayButton.addEventListener("click", playCampaignVideo);

    campaignVideo.addEventListener("click", () => {
      if (campaignVideo.paused) {
        playCampaignVideo();
      } else {
        campaignVideo.pause();
      }
    });

    campaignVideo.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      if (campaignVideo.paused) {
        playCampaignVideo();
      } else {
        campaignVideo.pause();
      }
    });

    campaignVideo.addEventListener("play", () => {
      campaign.classList.add("is-playing");
      campaignPlayButton.setAttribute("aria-label", "캠페인 영상 일시정지");
      campaignVideoStatus.textContent = "";
    });

    campaignVideo.addEventListener("pause", showPausedState);

    campaignVideo.addEventListener("ended", () => {
      campaignVideo.currentTime = 0;
      showPausedState();
    });

    campaignVideo.addEventListener("error", () => {
      campaign.classList.add("has-video-error");
      showPausedState();
      campaignVideoStatus.textContent =
        "영상을 불러오지 못했습니다. 파일 경로와 형식을 확인해 주세요.";
    });

    const reducedCon5Motion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    if (reducedCon5Motion.matches || !("IntersectionObserver" in window)) {
      campaign.classList.add("is-visible");
    } else {
      campaign.classList.add("has-con5-reveal");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => campaign.classList.add("is-ready"));
      });

      const campaignRevealObserver = new IntersectionObserver(
        ([entry], observer) => {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.45) return;
          campaign.classList.add("is-visible");
          observer.unobserve(campaign);
        },
        { threshold: [0, 0.45] },
      );

      campaignRevealObserver.observe(campaign);
    }
  }

  const artSection = document.querySelector(".art-of-light");
  const artSlides = Array.from(
    artSection?.querySelectorAll(".art-slide") || [],
  );
  const artButtons = Array.from(
    artSection?.querySelectorAll(":scope .art-inner > .art-arrow") || [],
  );
  const artStatus = artSection?.querySelector(".art-status");

  if (artSection && artSlides.length && artButtons.length === 2) {
    const reducedArtMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let activeArtIndex = 0;
    let isArtTransitioning = false;
    let artTransitionTimer = 0;

    const showArtSlide = (nextIndex) => {
      if (isArtTransitioning || nextIndex === activeArtIndex) return;

      const outgoingSlide = artSlides[activeArtIndex];
      const incomingSlide = artSlides[nextIndex];
      window.clearTimeout(artTransitionTimer);

      incomingSlide.classList.remove("is-leaving");
      outgoingSlide.classList.remove("is-active");
      outgoingSlide.classList.add("is-leaving");
      outgoingSlide.setAttribute("aria-hidden", "true");
      incomingSlide.classList.add("is-active");
      incomingSlide.setAttribute("aria-hidden", "false");
      activeArtIndex = nextIndex;
      artStatus.textContent = `슬라이드 ${activeArtIndex + 1} / ${artSlides.length}`;

      if (reducedArtMotion.matches) {
        outgoingSlide.classList.remove("is-leaving");
        return;
      }

      isArtTransitioning = true;
      artTransitionTimer = window.setTimeout(() => {
        isArtTransitioning = false;
      }, 560);
    };

    artButtons[0].addEventListener("click", () => {
      showArtSlide((activeArtIndex - 1 + artSlides.length) % artSlides.length);
    });
    artButtons[1].addEventListener("click", () => {
      showArtSlide((activeArtIndex + 1) % artSlides.length);
    });
  }

  const spectrumSection = document.querySelector(".spectrum");
  const spectrumSticky = spectrumSection?.querySelector(".spectrum-sticky");
  const spectrumTrack = spectrumSection?.querySelector(".spectrum-image-track");

  if (spectrumSection && spectrumSticky && spectrumTrack) {
    const reducedSpectrumMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let spectrumFrame = 0;

    const updateSpectrumProgress = () => {
      spectrumFrame = 0;
      if (reducedSpectrumMotion.matches) {
        spectrumTrack.style.transform = "";
        return;
      }

      const sectionRect = spectrumSection.getBoundingClientRect();
      const scrollRange = Math.max(
        1,
        spectrumSection.offsetHeight - spectrumSticky.offsetHeight,
      );
      const progress = Math.min(1, Math.max(0, -sectionRect.top / scrollRange));
      const imageTravel = Math.max(
        0,
        spectrumTrack.scrollHeight - spectrumSticky.clientHeight,
      );
      spectrumTrack.style.transform = `translate3d(0, ${-progress * imageTravel}px, 0)`;
    };

    const requestSpectrumUpdate = () => {
      if (spectrumFrame) return;
      spectrumFrame = requestAnimationFrame(updateSpectrumProgress);
    };

    window.addEventListener("scroll", requestSpectrumUpdate, { passive: true });
    window.addEventListener("resize", requestSpectrumUpdate);
    reducedSpectrumMotion.addEventListener("change", requestSpectrumUpdate);
    updateSpectrumProgress();
  }

  const editSection = document.querySelector(".edit");
  const editMarquee = editSection?.querySelector(".edit-marquee");
  const editMarqueeTrack = editMarquee?.querySelector(".edit-marquee-track");
  const editMarqueeSet = editMarqueeTrack?.querySelector(".edit-strip");

  if (editSection && editMarquee && editMarqueeTrack && editMarqueeSet) {
    const reducedEditMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const editMarqueeClone = editMarqueeSet.cloneNode(true);
    editMarqueeClone.dataset.marqueeClone = "true";
    editMarqueeClone.setAttribute("aria-hidden", "true");
    editMarqueeClone.inert = true;
    editMarqueeClone.querySelectorAll("img").forEach((image) => {
      image.alt = "";
    });
    editMarqueeTrack.append(editMarqueeClone);

    let isEditHovered = false;
    let isEditFocused = false;
    let isEditTouched = false;
    let isEditVisible = false;
    let editResizeFrame = 0;

    const updateEditDistance = () => {
      editResizeFrame = 0;
      editMarqueeTrack.style.setProperty(
        "--edit-marquee-distance",
        `${editMarqueeSet.getBoundingClientRect().width}px`,
      );
    };

    const updateEditPlayback = () => {
      const shouldPause =
        reducedEditMotion.matches ||
        document.hidden ||
        !isEditVisible ||
        isEditHovered ||
        isEditFocused ||
        isEditTouched;
      editMarquee.classList.toggle("is-paused", shouldPause);
    };

    editMarquee.classList.add("is-paused");
    updateEditDistance();

    editMarquee.addEventListener("mouseenter", () => {
      isEditHovered = true;
      updateEditPlayback();
    });
    editMarquee.addEventListener("mouseleave", () => {
      isEditHovered = false;
      updateEditPlayback();
    });
    editMarquee.addEventListener("focusin", () => {
      isEditFocused = true;
      updateEditPlayback();
    });
    editMarquee.addEventListener("focusout", () => {
      requestAnimationFrame(() => {
        isEditFocused = editMarquee.contains(document.activeElement);
        updateEditPlayback();
      });
    });
    editMarquee.addEventListener(
      "touchstart",
      () => {
        isEditTouched = true;
        updateEditPlayback();
      },
      { passive: true },
    );
    ["touchend", "touchcancel"].forEach((eventName) => {
      editMarquee.addEventListener(
        eventName,
        () => {
          isEditTouched = false;
          updateEditPlayback();
        },
        { passive: true },
      );
    });

    const editObserver = new IntersectionObserver(
      ([entry]) => {
        isEditVisible = entry.isIntersecting && entry.intersectionRatio > 0.05;
        updateEditPlayback();
      },
      { threshold: [0, 0.05] },
    );
    editObserver.observe(editMarquee);

    document.addEventListener("visibilitychange", updateEditPlayback);
    reducedEditMotion.addEventListener("change", updateEditPlayback);
    window.addEventListener("resize", () => {
      cancelAnimationFrame(editResizeFrame);
      editResizeFrame = requestAnimationFrame(updateEditDistance);
    });

    editMarqueeSet.querySelectorAll("img").forEach((image) => {
      if (!image.complete) image.addEventListener("load", updateEditDistance);
    });
  }

  const topButton = document.querySelector(".top-button");
  const heroSection = document.querySelector(".hero");
  const reducedTopMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

  if (topButton && heroSection) {
    let topButtonFrame = 0;
    const updateTopButton = () => {
      topButtonFrame = 0;
      topButton.classList.toggle(
        "is-visible",
        heroSection.getBoundingClientRect().bottom <= 0,
      );
    };
    const requestTopButtonUpdate = () => {
      if (topButtonFrame) return;
      topButtonFrame = requestAnimationFrame(updateTopButton);
    };

    window.addEventListener("scroll", requestTopButtonUpdate, {
      passive: true,
    });
    window.addEventListener("resize", requestTopButtonUpdate);
    topButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: reducedTopMotion.matches ? "auto" : "smooth",
      });
    });
    updateTopButton();
  }

  const siteFooter = document.querySelector(".site-footer");
  const reducedFooterMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

  if (siteFooter) {
    if (reducedFooterMotion.matches || !("IntersectionObserver" in window)) {
      siteFooter.classList.add("is-ready", "is-visible");
    } else {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => siteFooter.classList.add("is-ready"));
      });

      const footerObserver = new IntersectionObserver(
        ([entry], observer) => {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.2) return;
          siteFooter.classList.add("is-visible");
          observer.unobserve(siteFooter);
        },
        { threshold: [0, 0.2] },
      );
      footerObserver.observe(siteFooter);
    }
  }

  const footerRoleTrigger = document.querySelector(".role-placeholder");
  const footerRoleMenu = document.querySelector(".role-menu");
  const footerRoleSelect = document.querySelector(".role-select");
  const communityEmail = document.querySelector(".email-placeholder");
  const communitySubmit = document.querySelector(".community-submit");
  const communityStatus = document.querySelector(".community-status");

  if (footerRoleTrigger && footerRoleMenu && footerRoleSelect) {
    const roleOptions = Array.from(
      footerRoleMenu.querySelectorAll('[role="option"]'),
    );
    const reducedRoleMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let roleMenuTimer = 0;

    const setRoleMenuOpen = (isOpen, focusOption = false) => {
      window.clearTimeout(roleMenuTimer);
      footerRoleTrigger.setAttribute("aria-expanded", String(isOpen));

      if (isOpen) {
        footerRoleMenu.hidden = false;
        requestAnimationFrame(() => footerRoleMenu.classList.add("is-open"));
        if (focusOption) {
          requestAnimationFrame(() => {
            const selectedOption = roleOptions.find(
              (option) => option.getAttribute("aria-selected") === "true",
            );
            (selectedOption || roleOptions[0])?.focus();
          });
        }
        return;
      }

      footerRoleMenu.classList.remove("is-open");
      if (reducedRoleMotion.matches) {
        footerRoleMenu.hidden = true;
      } else {
        roleMenuTimer = window.setTimeout(() => {
          footerRoleMenu.hidden = true;
        }, 200);
      }
    };

    footerRoleTrigger.addEventListener("click", (event) => {
      const shouldOpen =
        footerRoleTrigger.getAttribute("aria-expanded") !== "true";
      setRoleMenuOpen(shouldOpen, shouldOpen && event.detail === 0);
    });

    footerRoleTrigger.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      event.preventDefault();
      setRoleMenuOpen(true, true);
    });

    roleOptions.forEach((option, optionIndex) => {
      option.addEventListener("click", () => {
        footerRoleTrigger.querySelector("span").textContent =
          option.textContent;
        roleOptions.forEach((item) =>
          item.setAttribute("aria-selected", String(item === option)),
        );
        if (communityStatus) communityStatus.textContent = "";
        setRoleMenuOpen(false);
        footerRoleTrigger.focus();
      });

      option.addEventListener("keydown", (event) => {
        let nextIndex = optionIndex;
        if (event.key === "ArrowDown") nextIndex = optionIndex + 1;
        else if (event.key === "ArrowUp") nextIndex = optionIndex - 1;
        else if (event.key === "Home") nextIndex = 0;
        else if (event.key === "End") nextIndex = roleOptions.length - 1;
        else return;

        event.preventDefault();
        roleOptions[
          (nextIndex + roleOptions.length) % roleOptions.length
        ].focus();
      });
    });

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        footerRoleTrigger.getAttribute("aria-expanded") === "true"
      ) {
        setRoleMenuOpen(false);
        footerRoleTrigger.focus();
      }
    });

    document.addEventListener("pointerdown", (event) => {
      if (
        footerRoleTrigger.getAttribute("aria-expanded") === "true" &&
        !footerRoleSelect.contains(event.target)
      ) {
        setRoleMenuOpen(false);
      }
    });
  }

  if (communityEmail && communitySubmit && communityStatus) {
    communityEmail.addEventListener("input", () => {
      communityEmail.removeAttribute("aria-invalid");
      communityStatus.textContent = "";
    });

    communitySubmit.addEventListener("click", () => {
      const selectedRole = footerRoleTrigger?.querySelector("span")?.textContent;
      const validRoles = [
        "Designer",
        "Architect",
        "Builder",
        "Homeowner",
        "Other",
      ];

      if (!communityEmail.value.trim() || !communityEmail.checkValidity()) {
        communityEmail.setAttribute("aria-invalid", "true");
        communityStatus.textContent = "올바른 이메일 주소를 입력해 주세요.";
        communityEmail.focus();
        return;
      }

      if (!selectedRole || !validRoles.includes(selectedRole.trim())) {
        communityStatus.textContent = "사용자 유형을 선택해 주세요.";
        footerRoleTrigger?.focus();
        return;
      }

      communityStatus.textContent =
        "구독 전송 기능이 연결되어 있지 않아 입력 정보는 제출되지 않았습니다.";
      communitySubmit.blur();
    });
  }

  document.querySelectorAll("[data-placeholder]").forEach((button) => {
    button.addEventListener("click", () => {
      button.blur();
    });
  });

  document.querySelectorAll('a[aria-disabled="true"]').forEach((link) => {
    link.addEventListener("click", (event) => event.preventDefault());
  });
});
