/** @jsx React.DOM */
define([
    'react',
    'app/image-service',
    'jquery.velocity'
], function(React, imageService, velocity) {
    var ReactTransitionGroup = React.addons.TransitionGroup;

    var GallerySlide = React.createClass({displayName: 'GallerySlide',
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

            velocity.animate(this.getDOMNode(), { opacity: 0 }, { duration: 400, complete: completeLeave });
        },
        render: function() {
            var overlay;

            if (!this.state.imagePath)
                overlay = GalleryOverlay( {key:"overlay"} );

            return (
                ReactTransitionGroup( {component:React.DOM.div, className:"gallery-slide"}, 
                    React.DOM.img( {src:this.state.imagePath} ),
                    overlay
                )
            );
        }
    });

    var GalleryOverlay = React.createClass({displayName: 'GalleryOverlay',
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

            velocity.animate(this.getDOMNode(), { opacity: 0 }, { duration: 400, complete: completeLeave });
        },
        componentDidLeave: function() {
        },
        render: function() {
            return (
                React.DOM.div( {className:"gallery-overlay"}, 
                    React.DOM.span( {className:"icon-countdown"} )
                )
            );
        }
    });

    var Gallery = React.createClass({displayName: 'Gallery',
        getInitialState: function() {
            return { imgIdx: 0 };
        },
        handleClick: function() {
            var index = this.state.imgIdx,
                next = imageService.getNextIndex(this.props.galleryId, index);

            this.setState({ imgIdx: next });
        },
        render: function() {
            var slide;

            if (this.state.imgIdx >= 0)
                slide = GallerySlide( {galleryId:this.props.galleryId, imgIdx:this.state.imgIdx, key:this.state.imgIdx} )

            return (
                ReactTransitionGroup( {component:React.DOM.div, className:"gallery-root", onClick:this.handleClick}, 
                    slide
                )
            );
        }
    });

    return {
        render: function(element, galleryId) {
            React.renderComponent(Gallery( {galleryId:galleryId} ), element);
        }
    };
});
