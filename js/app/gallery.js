/** @jsx React.DOM */
define([
    'react',
    'app/image-service'
], function(React, imageService) {
    var Gallery = React.createClass({displayName: 'Gallery',
        getInitialState: function() {
            return { imgIdx: 0 };
        },
        render: function() {
            return (
                React.DOM.div( {className:"gallery-root"}, 
                    React.DOM.img( {src:imageService.getImagePath(this.props.galleryId, this.state.imgIdx)} )
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
