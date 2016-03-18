import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import componentWidthMixin from 'react-component-width-mixin'

var Source = React.createClass({
  propTypes: {
    src: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired
  },

  render() {
    return false
  }
})

// Borrowed from Imager.js
function getExactPixelRatio(context) {
  return (context || window || {})['devicePixelRatio'] || 1
}

// Borrowed from Imager.js.
function getClosestValue(baseValue, candidates) {
  var i = candidates.length
  var selectedWidth = candidates[i - 1]
  baseValue = parseFloat(baseValue)

  while (i--) {
    if (baseValue <= candidates[i]) {
      selectedWidth = candidates[i]
    }
  }

  return selectedWidth
}

var ResponsiveImage = React.createClass({

  propTypes: {
    className: PropTypes.string,
    imgClassName: PropTypes.node,
    intrinsicWrapperClassName: PropTypes.node,
    children: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.element
    ]),
    aspectRatio: PropTypes.number.isRequired,
    srcs: PropTypes.object,
    devicePixelRatios: PropTypes.array,
    onLoad: PropTypes.func,
    onSwap: PropTypes.func,
    onLoadAny: PropTypes.func
  },

  mixins: [componentWidthMixin],

  getDefaultProps() {
    return {
      onLoad() {},
      onSwap() {},
      onLoadAny() {},
      initialComponentWidth: 200,
      devicePixelRatios: [1, 1.5, 2]
    }
  },

  getInitialState() {
    return {
      src: null,
      srcWidth: 0,
      initialImgLoaded: false
    }
  },

  componentWillMount() {
    this._updateState()
  },

  componentWillReceiveProps() {
    this._updateState()
  },

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.srcWidth !== nextState.srcWidth) return true
    if (this.state.src !== nextState.src) return true
    return false
  },

  _updateState() {
    const srcs = this._getSrcs()
    const bestSrc = this._getBestSrc(srcs)
    let { src, srcWidth } = bestSrc

    if (srcWidth > this.state.srcWidth) {
      this.setState({
        src, srcWidth
      })
    }
  },

  _getSizeMultiplier() {
    const pixelRatio = getExactPixelRatio()
    return getClosestValue(pixelRatio, this.props.devicePixelRatios)
  },

  _getSrcs() {
    const props = this.props
    let srcs = {}

    if (props.srcs) srcs = props.srcs
    else if (props.children) {
      if (props.children.length) {
        props.children.forEach((child) => {
          let src = this._getSrc(child)
          if (src) srcs[src.width] = src.src
        })
      }
      else {
        let src = this._getSrc(props.children)
        if (src) srcs[src.width] = src.src
      }
    }
    return srcs
  },

  _getSrc(child) {
    if (!child.props) return
    const sourceProps = child.props
    if (!sourceProps.src || !sourceProps.width) return
    const { src, width } = sourceProps
    return { src, width }
  },

  _getBestSrc(srcs) {
    const imgWidth = this.state.componentWidth
    const sizeMultiplier = this._getSizeMultiplier()
    const widths = Object.keys(srcs).map((key) => {
      return parseInt(key, 10)
    }).sort((a, b) => {
      return (a > b) ? 1 : -1
    })

    const requiredWidth = imgWidth * sizeMultiplier
    const bestWidth = getClosestValue(requiredWidth, widths)

    return {
      src: srcs[bestWidth],
      srcWidth: bestWidth
    }
  },

  _handleImgLoaded() {
    if (!this.state.initialImgLoaded) {
      this.props.onLoad()
      this.setState({
        initialImgLoaded: true
      })
    }
    else {
      this.props.onSwap()
    }

    this.props.onLoadAny()
  },

  /**
   * Render the App component.
   * @return {object}
   */
  render() {
    let wrapperProps = {
      className: `${this.constructor.displayName} ${this.props.className}`
    }

    let intrinsicWrapperProps = {
      className: this.props.intrinsicWrapperClassName,
      style: {
        position: 'relative',
        width: '100%',
        paddingBottom: `${this.props.aspectRatio * 100}%`,
        overflow: 'hidden'
      }
    }

    let imgProps = {
      src: this.state.src,
      className: this.props.imgClassName,
      style: {
        position: 'absolute',
        display: 'block',
        width: '100%'
      },
      onLoad: this._handleImgLoaded
    }

    return (
      <div {...wrapperProps}>
        <div {...intrinsicWrapperProps}>
          <img {...imgProps}/>
        </div>
      </div>
    )
  }
})

export default ResponsiveImage
export { Source }
