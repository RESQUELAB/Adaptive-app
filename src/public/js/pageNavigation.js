if (typeof loadPage !== 'function') {
    loadPage = function() {};
}
else {
    $('[href]').click((ev) => {
        let e = $(ev.delegateTarget);
        loadPage(e.attr('href'));
    })
}


