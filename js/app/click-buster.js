define(function() {
    var ghostClickCoordinates = [];

    var preventGhostClick = function preventGhostClick(x, y) {
        ghostClickCoordinates.push(x, y);
        window.setTimeout(forgetGhostClick, 500);
    };

    var handleGhostClick = function handleGhostClick(event) {
        var x, y;

        for (var i = 0; i < ghostClickCoordinates.length; i += 2) {
            x = ghostClickCoordinates[i];
            y = ghostClickCoordinates[i + 1];
            if (Math.abs(event.clientX - x) < 10 && Math.abs(event.clientY - y) < 10) {
                event.stopPropagation();
                event.preventDefault();
            }
        }
    };

    var forgetGhostClick = function forgetGhostClick() {
        ghostClickCoordinates.splice(0, 2);
    };

    document.body.addEventListener('click', handleGhostClick, true);

    return {
        preventGhostClick: preventGhostClick
    };
});
