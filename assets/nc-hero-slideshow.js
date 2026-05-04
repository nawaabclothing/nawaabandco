import { Component } from '@theme/component';

/**
 * @typedef {Object} NcHeroSlideshowRefs
 * @property {HTMLElement[]} slides - Individual slide wrappers
 * @property {HTMLButtonElement[]} [dots] - Dot indicator buttons (optional)
 */

/**
 * Auto-cycling hero slideshow.
 *
 * Expects child elements marked with ref="slides[]" (one per image) and
 * optionally ref="dots[]" for dot indicators. The active slide gets the
 * class `nc-hero__slide--active`; the active dot gets `nc-hero__dot--active`.
 *
 * data-speed attribute on the element sets the cycle interval in ms (default 4000).
 *
 * @extends {Component<NcHeroSlideshowRefs>}
 */
class NcHeroSlideshow extends Component {
  /** @type {number} */
  #currentIndex = 0;

  /** @type {ReturnType<typeof setInterval> | null} */
  #timer = null;

  connectedCallback() {
    super.connectedCallback();
    if ((this.refs.slides?.length ?? 0) > 1) {
      this.#start();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#stop();
  }

  #start() {
    const speed = parseInt(this.dataset.speed ?? '4000', 10);
    this.#timer = setInterval(() => this.#advance(), speed);
  }

  #stop() {
    if (this.#timer === null) return;
    clearInterval(this.#timer);
    this.#timer = null;
  }

  #advance() {
    this.#show((this.#currentIndex + 1) % this.refs.slides.length);
  }

  /**
   * @param {number} index
   */
  #show(index) {
    const { slides, dots } = this.refs;

    slides[this.#currentIndex].classList.remove('nc-hero__slide--active');
    slides[index].classList.add('nc-hero__slide--active');

    if (dots?.length) {
      dots[this.#currentIndex].classList.remove('nc-hero__dot--active');
      dots[index].classList.add('nc-hero__dot--active');
    }

    this.#currentIndex = index;
  }

  /**
   * Handles click events delegated from the dots container.
   * @param {Event} event
   */
  handleDotClick(event) {
    const btn = /** @type {HTMLElement} */ (event.target).closest('[data-index]');
    if (!btn) return;
    const index = parseInt(/** @type {HTMLElement} */ (btn).dataset.index ?? '0', 10);
    this.#stop();
    this.#show(index);
    this.#start();
  }
}

customElements.define('nc-hero-slideshow', NcHeroSlideshow);
