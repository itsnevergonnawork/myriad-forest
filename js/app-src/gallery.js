/** @jsx React.DOM */
define([
    'react',
    'app/image-service',
    'velocity',
    'hammer',
    'jquery',
    'app/click-buster',
    'app/reactInit',
    'request-animation-frame'
], function(React, imageService, velocity, hammer, $, clickBuster) {
    var ReactTransitionGroup = React.addons.TransitionGroup;

    var GallerySlide = React.createClass({
        getInitialState: function() {
            return { imagePath: '' };
        },
        componentDidMount: function() {
            imageService.requestImage(this.props.galleryId, this.props.imgIdx, this.handleImage);
        },
        handleImage: function(path) {
            if (this.isMounted()) {
                this.setState({ imagePath: path });
            }
        },
        componentWillLeave: function(done) {
            var completeLeave = (function() {
                // see GalleryOverlay for an explanation
                // the containing gallery might be gone because we have
                // navigated to another page
                if (this.isMounted()) {
                    done();
                }
            }).bind(this);

            if ('immediate' == this.props.leaveStyle) {
                completeLeave();
            } else {
                velocity(this.getDOMNode(), { opacity: 0 }, { duration: 400, complete: completeLeave });
            }
        },
        disableDragNDrop: function(event) {
            event.preventDefault();
        },
        render: function() {
            var overlay,
                positionClass = this.props.position ? ' ' + this.props.position : '';

            if (!this.state.imagePath)
                overlay = <GalleryOverlay key="overlay" />;

            return (
                <ReactTransitionGroup component={React.DOM.div} className={"gallery-slide" + positionClass}>
                    <img src={this.state.imagePath} onMouseDown={this.disableDragNDrop} />
                    {overlay}
                </ReactTransitionGroup>
            );
        }
    });

    var GalleryOverlay = React.createClass({
        componentWillLeave: function(done) {
            var completeLeave = (function() {
                // the reason it might not be mounted despite not having called
                // done() yet is that the parent GallerySlide component may
                // have disappeared before the GalleryOverlay has finished
                // animating away.
                // possible sequence:
                // 1. a new slide (a) is mounted in the gallery and requests
                //    it's image
                // 2. the user navigates to yet another slide, so (a) starts
                //    leaving
                // 3. while (a) is leaving, it's image finishes downloading,
                //    gets rendered, and the overlay starts leaving.
                // 4. (a) completes the leaving animation and disappears,
                //    taking the overlay with it
                // 5. the overlay completes the animation, tries to call done()
                //    which causes it's componentDidLeave method to be called
                //    but the component does not exist anymore at this point,
                //    causing an error
                if (this.isMounted()) {
                    done();
                }
            }).bind(this);

            velocity(this.getDOMNode(), { opacity: 0 }, { duration: 400, complete: completeLeave });
        },
        componentDidLeave: function() {
        },
        render: function() {
            return (
                <div className="gallery-overlay">
                    <span className="icon-countdown" />
                </div>
            );
        }
    });

    /* TODO this probably only makes sense when there's just one gallery */
    var requestNodeTranslation = (function() {
        var ticking = false;

        return function requestNodeTranslation(node, offset) {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    node.style.transform = 'translate3d(' + offset + 'px, 0px, 0px)';
                    ticking = false;
                });
                ticking = true;
            }
        }
    })();

    var Gallery = React.createClass({
        getInitialState: function() {
            return {
                imgIdx: 0,
                showArrows: false
            };
        },
        updateWidth: function() {
            if (this.isMounted()) {
                this.setState({ width: this.getDOMNode().offsetWidth });
            }
        },
        componentDidMount: function() {
            var node = this.getDOMNode(),
                hammerMan = new hammer.Manager(node),
                lastDelta = 0,
                prevDelta = 0,
                dir = 0,
                updateDirData = function(delta) {
                    var relDelta;

                    if (delta != lastDelta) {
                        prevDelta = lastDelta;
                        lastDelta = delta;
                    }

                    relDelta = lastDelta - prevDelta;

                    dir = relDelta < 0 ? -1 : 1;
                },
                that = this;

            $(window).resize(this.updateWidth);
            this.updateWidth();

            hammerMan.add(new hammer.Pan({ direction: hammer.DIRECTION_HORIZONTAL, threshold: 10, pointers: 1 }));
            hammerMan.on('panstart', function(event) {
                velocity(node, 'stop');
                that.setState({ sliding: true });
            });
            hammerMan.on('panstart panmove', function(event) {
                requestNodeTranslation(node, event.deltaX);
                updateDirData(event.deltaX);
            });
            hammerMan.on("panend pancancel", function(event) {
                var trValue = '0px';

                if(event.isFinal) {
                    trValue = event.deltaX + 'px';
                    if (-1 == dir) {
                        if (event.deltaX >= 0) {
                            // still at the same slide
                            velocity(node, { translateX: ['0px', trValue] }, { duration: 300 });
                        } else {
                            // show next slide
                            velocity(node, { translateX: [-that.state.width + 'px', trValue] }, { duration: 300, complete: that.completeNext });
                        }
                    } else {
                        if (event.deltaX <= 0) {
                            // still at the same slide
                            velocity(node, { translateX: ['0px', trValue] }, { duration: 300 });
                        } else {
                            // show previous slide
                            velocity(node, { translateX: [that.state.width + 'px', trValue] }, { duration: 300, complete: that.completePrev });
                        }
                    }
                }
                lastDelta = 0;
                prevDelta = 0;

                if (undefined != event.srcEvent.clientX) {
                    clickBuster.preventGhostClick(
                        event.srcEvent.clientX,
                        event.srcEvent.clientY
                    );
                }
            });
        },
        completeNext: function() {
            var next = imageService.getNextIndex(this.props.galleryId, this.state.imgIdx);

            this.setState({
                leaving: 'next'
            });
            this.setState({
                imgIdx: next,
                sliding: false
            });
            this.setState({
                leaving: ''
            });
        },
        completePrev: function() {
            var prev = imageService.getPrevIndex(this.props.galleryId, this.state.imgIdx);

            this.setState({
                leaving: 'prev'
            });
            this.setState({
                imgIdx: prev,
                sliding: false
            });
            this.setState({
                leaving: ''
            });
        },
        handleClick: function(event) {
            var index = this.state.imgIdx,
                left = event.clientX < this.state.width / 2,
                next;

            // TODO stop animation on click
            if (left) {
                next = imageService.getPrevIndex(this.props.galleryId, index);
            } else {
                next = imageService.getNextIndex(this.props.galleryId, index);
            }
            this.setState({ imgIdx: next });
        },
        handleTouchStart: function(event) {
            velocity(this.getDOMNode(), 'stop');
            this.setState({ sliding: true });
            // prevent click event firing during touch interaction
            event.preventDefault();
        },
        handleTouchEnd: function() {
        },
        // TODO handling mousemove is somewhat cpu intensive...
        handleMouseMove: function(event) {
            var hover = (event.clientX < this.state.width / 2)
                        ? 'left'
                        : 'right';

            this.setState({
                showArrows: true,
                hover: hover
            });
        },
        render: function() {
            var style = {},
                slide,
                prevIdx,
                prevSlide,
                nextIdx,
                nextSlide,
                leaving = this.state.leaving,
                leavingCurrent = leaving ? 'immediate' : '',
                leavingPrev = 'next' == leaving ? 'immediate' : '',
                leavingNext = 'prev' == leaving ? 'immediate' : '',
                prevArrow,
                prevArrowStyle = {},
                nextArrow,
                nextArrowStyle = {};

            if (this.state.imgIdx >= 0) {
                slide = <GallerySlide galleryId={this.props.galleryId} imgIdx={this.state.imgIdx} leaveStyle={leavingCurrent} key={this.state.imgIdx} />
            }

            if (this.state.sliding) {
                prevIdx = imageService.getPrevIndex(this.props.galleryId, this.state.imgIdx);
                nextIdx = imageService.getNextIndex(this.props.galleryId, this.state.imgIdx);

                prevSlide = <GallerySlide galleryId={this.props.galleryId} imgIdx={prevIdx} position='prev' leaveStyle={leavingPrev} key={prevIdx} />;
                nextSlide = <GallerySlide galleryId={this.props.galleryId} imgIdx={nextIdx} position='next' leaveStyle={leavingNext} key={nextIdx} />;
            } else {
                style = {
                    transform: 'translateX(0px)'
                };
            }

            if (this.state.showArrows) {
                prevArrowStyle = {
                    opacity: ('left' == this.state.hover) ? 1 : 0
                },
                prevArrow = <div className="prev-image-arrow"
                                 style={prevArrowStyle}>
                            </div>;
                nextArrowStyle = {
                    opacity: ('right' == this.state.hover) ? 1 : 0
                };
                nextArrow = <div className="next-image-arrow"
                                 style={nextArrowStyle}>
                            </div>;
            }

            return (
                <ReactTransitionGroup component={React.DOM.div}
                        className="gallery-root"
                        style={style}
                        onClick={this.handleClick}
                        onTouchStart={this.handleTouchStart}
                        onTouchEnd={this.handleTouchEnd}
                        onMouseMove={this.handleMouseMove}>
                    {prevSlide}
                    {slide}
                    {nextSlide}
                    {prevArrow}
                    {nextArrow}
                </ReactTransitionGroup>
            );
        }
    });

    return {
        render: function(element, galleryId) {
            React.renderComponent(<Gallery galleryId={galleryId} />, element);
        }
    };
});
