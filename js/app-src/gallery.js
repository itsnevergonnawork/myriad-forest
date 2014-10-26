/** @jsx React.DOM */
define([
    'react',
    'app/image-service',
    'jquery.velocity'
], function(React, imageService, velocity) {
    var ReactTransitionGroup = React.addons.TransitionGroup;

    var GallerySlide = React.createClass({
        getInitialState: function() {
            return { imagePath: '' };
        },
        componentDidMount: function() {
            console.log('slide did mount');
            imageService.requestImage(this.props.galleryId, this.props.imgIdx, this.handleImage);
        },
        handleImage: function(path) {
            this.setState({ imagePath: path });
        },
        componentWillEnter: function(done) {
            done();
        },
        componentWillLeave: function(done) {
            velocity.animate(this.getDOMNode(), { opacity: 0 }, { duration: 400, complete: done });
        },
        render: function() {
            var overlay;

            if (!this.state.imagePath)
                overlay = <GalleryOverlay key="overlay" />;

            return (
                <ReactTransitionGroup component={React.DOM.div} className="gallery-slide">
                    <img src={this.state.imagePath} />
                    {overlay}
                </ReactTransitionGroup>
            );
        }
    });

    var GalleryOverlay = React.createClass({
        componentWillLeave: function(done) {
            velocity.animate(this.getDOMNode(), { opacity: 0 }, { duration: 400, complete: done });
        },
        componentDidLeave: function() {
            console.log('overlay did leave');
        },
        render: function() {
            return (
                <div className="gallery-overlay">
                    <span className="icon-countdown" />
                </div>
            );
        }
    });

    var Gallery = React.createClass({
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
                slide = <GallerySlide galleryId={this.props.galleryId} imgIdx={this.state.imgIdx} key={this.state.imgIdx} />

            return (
                <ReactTransitionGroup component={React.DOM.div} className="gallery-root" onClick={this.handleClick}>
                    {slide}
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
