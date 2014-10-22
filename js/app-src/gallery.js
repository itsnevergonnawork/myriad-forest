/** @jsx React.DOM */
define([
    'react',
    'app/image-service'
], function(React, imageService) {
    var Gallery = React.createClass({
        getInitialState: function() {
            return { imgIdx: 0 };
        },
        render: function() {
            return (
                <div className="gallery-root">
                    <img src={imageService.getImagePath(this.props.galleryId, this.state.imgIdx)} />
                </div>
            );
        }
    });

    return {
        render: function(element, galleryId) {
            React.renderComponent(<Gallery galleryId={galleryId} />, element);
        }
    };
});
