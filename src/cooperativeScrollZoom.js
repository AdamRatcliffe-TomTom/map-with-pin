const MASK_STYLE = {
  position: "absolute",
  top: 0,
  left: 0,
  display: "flex",
  "align-items": "center",
  "justify-content": "center",
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0)",
  color: "transparent",
  "font-family": "Proxima Nova, Arial, sans-serif",
  "font-size": "20px",
  transition: "0.5s",
  "pointer-events": "none",
  "z-index": 10000
};

const MASK_TIMEOUT = 2000;

function inIframe() {
  return window !== window.parent;
}

function pageIsScrollable() {
  return document.body.scrollHeight > window.innerHeight;
}

class CooperativeScrollZoom {
  constructor(map, iframeCheck = true) {
    if (iframeCheck && !inIframe() && !pageIsScrollable()) return;

    this._map = map;
    this._el = map.getContainer();
    this._mask = null;
    this._modifierKey = navigator.platform.includes("Mac")
      ? "metaKey"
      : "ctrlKey";
    this._scrollZoomEnabled = false;

    this.handleMouseWheel = this.handleMouseWheel.bind(this);
    this.showMask = this.showMask.bind(this);
    this.hideMask = this.hideMask.bind(this);
    this.handleRemove = this.handleRemove.bind(this);

    this.createMask();
    this.bind();

    this._map.once("remove", this.handleRemove);
  }

  createMask() {
    this._mask = document.createElement("div");
    this._mask.className = "cooperative-zoom-mask";
    this._mask.innerHTML = `Use ${
      this._modifierKey === "metaKey" ? "⌘" : "Ctrl"
    } + scroll to zoom the map`;

    const style = Object.keys(MASK_STYLE)
      .map((key) => `${key}: ${MASK_STYLE[key]}`)
      .join(";");
    this._mask.setAttribute("style", style);

    this._el.appendChild(this._mask);
  }

  showMask() {
    this._mask.style.background = "rgba(0,0,0,0.33)";
    this._mask.style.color = "white";

    if (this._maskTimeout) clearTimeout(this._maskTimeout);
    this._maskTimeout = setTimeout(() => this.hideMask(), MASK_TIMEOUT);
  }

  hideMask() {
    this._mask.style.background = "rgba(0,0,0,0)";
    this._mask.style.color = "transparent";
  }

  bind() {
    this._el.addEventListener("wheel", this.handleMouseWheel);
  }

  unbind() {
    this._el.removeEventListener("wheel", this.handleMouseWheel);
  }

  handleRemove() {
    this.unbind();
    this._map = null;
    this._el = null;
  }

  handleMouseWheel(event) {
    if (event[this._modifierKey] === true) {
      this._map.scrollZoom.enable();

      // Need to manually control the zoom when first enabling the scroll zoom handler as it does not
      // immediately respond to wheel events on being enabled
      if (!this._scrollZoomEnabled) {
        const method = event.deltaY < 1 ? "zoomIn" : "zoomOut";
        this._map[method]();
      }

      this.hideMask();

      this._scrollZoomEnabled = true;
    } else {
      this._map.scrollZoom.disable();
      this._map.once("move", this.hideMask);

      this.showMask();

      this._scrollZoomEnabled = false;
    }
  }
}

export default function cooperativeScrollZoom() {
  return new CooperativeScrollZoom(...arguments);
}
