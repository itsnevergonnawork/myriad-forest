/** @jsx React.DOM */
define([
    'react',
    'app/image-service',
    'jquery.velocity'
], function(React, imageService, velocity) {
    var ReactTransitionGroup = React.addons.TransitionGroup;

    var GallerySlide = React.createClass({displayName: 'GallerySlide',
        getInitialState: function() {
            return { imageLoaded: false };
        },
        componentDidMount: function() {
            console.log('slide did mount');
            this.setState({ imageLoaded: true });
        },
        componentWillEnter: function(done) {
            done();
        },
        componentWillLeave: function(done) {
            velocity.animate(this.getDOMNode(), { opacity: 0 }, { duration: 400, complete: done });
        },
        render: function() {
            var overlay;

            if (!this.state.imageLoaded)
                overlay = GalleryOverlay( {key:"overlay"} );

            return (
                ReactTransitionGroup( {component:React.DOM.div, className:"gallery-slide"}, 
                    React.DOM.img( {src:imageService.getImagePath(this.props.galleryId, this.props.imgIdx)} ),
                    overlay
                )
            );
        }
    });

    var GalleryOverlay = React.createClass({displayName: 'GalleryOverlay',
        componentWillLeave: function(done) {
            velocity.animate(this.getDOMNode(), { opacity: 0 }, { duration: 400, complete: done });
        },
        componentDidLeave: function() {
            console.log('overlay did leave');
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
        componentDidMount: function() {
            /*console.log('gallery did mount');
            this.setState({ imgIdx: 0 });*/
        },
        handleClick: function() {
            var index = this.state.imgIdx,
                next = imageService.getNextIndex(this.props.galleryId, index);

            console.log('next image: ' + next);
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
